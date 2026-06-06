<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/{path}', function () {
    return view('welcome');
})->where('path', 'contact|pricing|cancel-policy|guide|samples|mypage|admin-inquiries|thanks|ai-sns-post-generator|x-post-generator|instagram-caption-generator|terms|privacy|legal');
