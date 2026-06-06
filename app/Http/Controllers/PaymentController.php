<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class PaymentController extends Controller
{
    public function checkout(Request $request)
    {
        $user = User::find($request->user_id);

        $checkout = $user->checkout($request->price_id, [
            'mode' => 'subscription',
            'success_url' => 'http://127.0.0.1:8000/thanks?success=true',
            'cancel_url' => 'http://127.0.0.1:8000/?canceled=true',
        ]);

        return response()->json(['url' => $checkout->url]);
    }

    // 👇ここから追加！「決済成功時に呼ばれてPremiumにする係」
    public function success(Request $request)
    {
        $user = User::find($request->user_id);
        if ($user) {
            $user->is_premium = true;
            $user->premium_started_at = now();
            $user->save();
        }
        return response()->json(['user' => $user]);
    }
}
