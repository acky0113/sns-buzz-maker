<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\GenerationController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/profile', [AuthController::class, 'updateProfile']);
Route::get('/contact-inquiries', [ContactController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/generate', [GenerationController::class, 'generate']);
use App\Http\Controllers\PaymentController;
Route::post('/checkout', [PaymentController::class, 'checkout']);
// さっき追加した行の下に、これを追加！
Route::post('/payment-success', [PaymentController::class, 'success']);
// 履歴を取得するためのルート
Route::get('/generations', [GenerationController::class, 'index']);
Route::post('/generations/{id}/favorite', [GenerationController::class, 'favorite']);
// 履歴を削除するためのルート
Route::delete('/generations/{id}', [GenerationController::class, 'destroy']);
