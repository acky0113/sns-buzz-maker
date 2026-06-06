<?php

namespace App\Http\Controllers;

use App\Models\Generation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class GenerationController extends Controller
{
    public function index(Request $request)
    {
        $generations = Generation::where('user_id', $request->query('user_id'))
                                 ->orderBy('created_at', 'desc')
                                 ->get();

        return response()->json($generations);
    }

    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'theme' => 'required|string|max:255',
            'template_type' => 'nullable|string|max:50',
            'action' => 'nullable|string|max:50',
            'original_content' => 'nullable|string|max:5000',
        ]);

        $userId = $validated['user_id'];
        $theme = $validated['theme'];
        $templateType = $validated['template_type'] ?? 'standard';
        $action = $validated['action'] ?? 'generate';
        $originalContent = $validated['original_content'] ?? '';

        $user = User::find($userId);

        if (! $user) {
            return response()->json([
                'message' => '指定されたユーザーが存在しません。',
            ], 404);
        }

        $premiumOnlyTemplates = ['viral', 'sales', 'line', 'safe'];
        $premiumOnlyActions = ['improve', 'shorten', 'sales', 'line'];

        if (! $user->is_premium && (in_array($templateType, $premiumOnlyTemplates, true) || in_array($action, $premiumOnlyActions, true))) {
            return response()->json([
                'message' => 'このテンプレートと改善機能はPremium限定です。アップグレードするとすぐに使えます。',
            ], 403);
        }

        if (! $user->is_premium) {
            $todayCount = Generation::where('user_id', $userId)
                ->whereDate('created_at', now()->toDateString())
                ->count();

            if ($todayCount >= 3) {
                // 👇 ここを「課金したくなるメッセージ」に変更しました！
                return response()->json([
                    'message' => '本日の無料生成枠（3回）を使い切りました。プレミアムにアップグレードして無制限に作成しましょう！🚀',
                ], 429);
            }
        }

        try {
            $apiKey = env('GEMINI_API_KEY');
            $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $apiKey;
            $prompt = $this->buildPrompt($theme, $templateType, $action, $originalContent, $user);

            $response = Http::acceptJson()->post($endpoint, [
                'contents' => [[
                    'parts' => [[
                        'text' => $prompt,
                    ]],
                ]],
            ]);

            if (! $response->successful()) {
                return response()->json([
                    'message' => 'AI生成APIへのリクエストに失敗しました。',
                    'details' => $response->body(),
                ], 500);
            }

            $data = $response->json();
            $content = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (! $content) {
                return response()->json([
                    'message' => 'AI生成APIの応答からテキストを取得できませんでした。',
                    'details' => $data,
                ], 500);
            }

            $scores = $this->scoresFor($templateType, $action);

            Generation::create([
                'user_id' => $userId,
                'theme' => $theme,
                'template_type' => $templateType,
                'content' => $content,
                'empathy_score' => $scores['empathy'],
                'save_score' => $scores['save'],
                'action_score' => $scores['action'],
            ]);

            return response()->json([
                'content' => $content,
                'scores' => $scores,
            ]);
        } catch (\Throwable $exception) {
            return response()->json([
                'message' => 'AI生成処理中にエラーが発生しました。',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    // 👇 ここから追加！「履歴を削除する係」
    public function destroy($id)
    {
        $generation = Generation::find($id);

        if (! $generation) {
            return response()->json(['message' => '指定された履歴が見つかりません。'], 404);
        }

        $generation->delete();

        return response()->json(['message' => '履歴を削除しました。']);
    }

    public function favorite($id)
    {
        $generation = Generation::find($id);

        if (! $generation) {
            return response()->json(['message' => '指定された履歴が見つかりません。'], 404);
        }

        $generation->is_favorite = ! $generation->is_favorite;
        $generation->save();

        return response()->json(['generation' => $generation]);
    }

    private function buildPrompt(string $theme, string $templateType, string $action, string $originalContent, User $user): string
    {
        $context = collect([
            $user->sns_platform ? "利用SNS: {$user->sns_platform}" : null,
            $user->sns_goal ? "目的: {$user->sns_goal}" : null,
            $user->posting_genre ? "投稿ジャンル: {$user->posting_genre}" : null,
        ])->filter()->implode("\n");

        $templatePrompts = [
            'standard' => '共感されやすく、自然に読めるSNS投稿を作成してください。',
            'viral' => '冒頭でスクロールを止め、共感と意外性で拡散されやすいSNS投稿を作成してください。',
            'sales' => '商品やサービスの申込みにつながるように、悩み、価値、行動導線が自然につながる投稿を作成してください。',
            'line' => 'LINE登録や問い合わせへ自然に誘導する投稿を作成してください。売り込み感は抑えてください。',
            'safe' => '誤解や炎上を避けながら、伝えたい主張がはっきり伝わるSNS投稿を作成してください。',
        ];

        $actionPrompts = [
            'generate' => '',
            'improve' => "以下の元投稿を、より反応が取れる内容に改善してください。\n\n元投稿:\n{$originalContent}",
            'shorten' => "以下の元投稿を、Xに投稿しやすい短文へ整えてください。\n\n元投稿:\n{$originalContent}",
            'sales' => "以下の元投稿を、販売導線が強い文章へ変換してください。\n\n元投稿:\n{$originalContent}",
            'line' => "以下の元投稿を、LINE登録や問い合わせに自然につながる文章へ変換してください。\n\n元投稿:\n{$originalContent}",
        ];

        return trim(implode("\n\n", [
            'あなたはSNS運用のプロです。',
            $context,
            $templatePrompts[$templateType] ?? $templatePrompts['standard'],
            $actionPrompts[$action] ?? '',
            '親しみやすい日本語で、投稿本文とハッシュタグを作成してください。',
            'テーマ: ' . $theme,
        ]));
    }

    private function scoresFor(string $templateType, string $action): array
    {
        $base = [
            'standard' => ['empathy' => 78, 'save' => 72, 'action' => 62],
            'viral' => ['empathy' => 90, 'save' => 82, 'action' => 70],
            'sales' => ['empathy' => 80, 'save' => 76, 'action' => 88],
            'line' => ['empathy' => 82, 'save' => 74, 'action' => 86],
            'safe' => ['empathy' => 84, 'save' => 78, 'action' => 68],
        ][$templateType] ?? ['empathy' => 78, 'save' => 72, 'action' => 62];

        if ($action !== 'generate') {
            return [
                'empathy' => min(96, $base['empathy'] + 6),
                'save' => min(96, $base['save'] + 6),
                'action' => min(96, $base['action'] + 8),
            ];
        }

        return $base;
    }
}
