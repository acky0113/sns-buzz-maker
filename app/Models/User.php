<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// 👇 1箇所目：Stripe連携用の部品を読み込む
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    // 👇 2箇所目：クラスの中でBillableを使えるように追加
    use HasFactory, Notifiable, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_premium',
        'is_admin',
        'sns_platform',
        'sns_goal',
        'posting_genre',
        'premium_started_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_premium' => 'boolean',
            'is_admin' => 'boolean',
            'premium_started_at' => 'datetime',
        ];
    }

    public function generations()
    {
        // ユーザーが持っている生成履歴のリレーション
        return $this->hasMany(Generation::class);
    }
}
