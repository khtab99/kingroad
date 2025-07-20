<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Add indexes for guest order lookups
            $table->index(['order_number', 'customer_phone'], 'guest_order_lookup');
            $table->index(['customer_email', 'user_id'], 'email_user_lookup');
            $table->index(['customer_phone', 'user_id'], 'phone_user_lookup');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('guest_order_lookup');
            $table->dropIndex('email_user_lookup');
            $table->dropIndex('phone_user_lookup');
        });
    }
};