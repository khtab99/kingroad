<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->enum('type', ['house', 'apartment', 'office']);
            $table->string('street');
            $table->string('house_number')->nullable();
            $table->string('building_number')->nullable();
            $table->string('floor')->nullable();
            $table->string('apartment_number')->nullable();
            $table->string('office_number')->nullable();
            $table->text('additional_description')->nullable();
            $table->string('city')->default('Umm Al Quwain');
            $table->string('country')->default('United Arab Emirates');
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'is_default']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};