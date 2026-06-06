<?php

namespace App\Http\Controllers;

use App\Models\ContactInquiry;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $user = User::find($validated['user_id']);

        if (! $user?->is_admin) {
            return response()->json([
                'message' => '管理者のみ閲覧できます。',
            ], 403);
        }

        return response()->json([
            'inquiries' => ContactInquiry::latest()->limit(100)->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'category' => 'required|string|max:100',
            'message' => 'required|string|max:5000',
        ]);

        ContactInquiry::create($validated);

        Mail::raw($this->buildContactMailBody($validated), function ($message) use ($validated) {
            $message
                ->to(config('mail.contact_to'))
                ->replyTo($validated['email'], $validated['name'])
                ->subject('【SNS Buzz Maker】お問い合わせが届きました');
        });

        return response()->json([
            'message' => 'お問い合わせを受け付けました。通常1〜3営業日以内にご返信します。',
        ]);
    }

    private function buildContactMailBody(array $inquiry): string
    {
        return implode("\n", [
            'SNS Buzz Makerに新しいお問い合わせが届きました。',
            '',
            '--- お問い合わせ内容 ---',
            'お名前: ' . $inquiry['name'],
            'メールアドレス: ' . $inquiry['email'],
            'お問い合わせ種別: ' . $inquiry['category'],
            '',
            '本文:',
            $inquiry['message'],
            '',
            '------------------------',
            '管理画面: ' . url('/admin-inquiries'),
        ]);
    }
}
