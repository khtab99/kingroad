<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('delivery_fees', function (Blueprint $table) {
    $table->id();
    $table->decimal('base_fee', 8, 2)->default(0);
    $table->decimal('additional_per_km', 8, 2)->nullable();
    $table->decimal('free_delivery_min_total', 8, 2)->nullable();
    $table->string('region')->nullable(); // optional, for region-specific fees
    $table->boolean('is_active')->default(true);
    $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_fees');
    }
};
