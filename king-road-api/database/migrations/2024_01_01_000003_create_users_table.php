<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('phone')->nullable();
            $table->string('country')->default('United Arab Emirates');
            $table->string('language')->default('en');
            $table->string('password');
            $table->boolean('is_active')->default(true);
            $table->boolean('marketing_opt_in')->default(false);
            $table->timestamp('last_login_at')->nullable();
            $table->json('preferences')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->index(['email', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};