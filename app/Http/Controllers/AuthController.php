<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // 新規登録
    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // パスワードを暗号化
            'is_premium' => false,
            'sns_platform' => $request->sns_platform,
            'sns_goal' => $request->sns_goal,
            'posting_genre' => $request->posting_genre,
        ]);

        return response()->json(['user' => $user]);
    }

    // ログイン
    public function login(Request $request)
    {
        // メールアドレスでユーザーを探す
        $user = User::where('email', $request->email)->first();

        // ユーザーが存在して、なおかつパスワードが一致するかをチェック（セッション不使用！）
        if ($user && Hash::check($request->password, $user->password)) {
            return response()->json(['user' => $user]);
        }

        return response()->json(['message' => 'メールアドレスまたはパスワードが間違っています'], 401);
    }

    // ログアウト（フロントエンドでデータを消すので、Laravel側はOKを返すだけで完了）
    public function logout()
    {
        return response()->json(['message' => 'ログアウトしました']);
    }

    public function updateProfile(Request $request)
    {
        $user = User::findOrFail($request->user_id);

        $user->update($request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'sns_platform' => 'nullable|string|max:100',
            'sns_goal' => 'nullable|string|max:100',
            'posting_genre' => 'nullable|string|max:100',
        ]));

        return response()->json(['user' => $user]);
    }
}
