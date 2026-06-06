<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('sns_platform')->nullable()->after('is_premium');
            $table->string('sns_goal')->nullable()->after('sns_platform');
            $table->string('posting_genre')->nullable()->after('sns_goal');
            $table->timestamp('premium_started_at')->nullable()->after('posting_genre');
        });

        Schema::table('generations', function (Blueprint $table) {
            $table->string('template_type')->default('standard')->after('theme');
            $table->unsignedTinyInteger('empathy_score')->nullable()->after('content');
            $table->unsignedTinyInteger('save_score')->nullable()->after('empathy_score');
            $table->unsignedTinyInteger('action_score')->nullable()->after('save_score');
            $table->boolean('is_favorite')->default(false)->after('action_score');
        });
    }

    public function down(): void
    {
        Schema::table('generations', function (Blueprint $table) {
            $table->dropColumn([
                'template_type',
                'empathy_score',
                'save_score',
                'action_score',
                'is_favorite',
            ]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'sns_platform',
                'sns_goal',
                'posting_genre',
                'premium_started_at',
            ]);
        });
    }
};
