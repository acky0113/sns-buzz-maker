<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Generation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'theme',
        'template_type',
        'content',
        'empathy_score',
        'save_score',
        'action_score',
        'is_favorite',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return [
            'is_favorite' => 'boolean',
        ];
    }
}
