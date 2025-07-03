<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General Settings
            ['key' => 'site_name', 'value' => 'King Road Spare Parts', 'type' => 'string', 'group' => 'general'],
            ['key' => 'site_description', 'value' => 'Premium car spare parts in UAE', 'type' => 'string', 'group' => 'general'],
            ['key' => 'contact_email', 'value' => 'info@kingroad.com', 'type' => 'string', 'group' => 'general'],
            ['key' => 'contact_phone', 'value' => '+971-XXX-XXXX', 'type' => 'string', 'group' => 'general'],
            ['key' => 'default_currency', 'value' => 'AED', 'type' => 'string', 'group' => 'general'],
            ['key' => 'default_language', 'value' => 'en', 'type' => 'string', 'group' => 'general'],

            // E-commerce Settings
            ['key' => 'default_delivery_fee', 'value' => '0', 'type' => 'integer', 'group' => 'ecommerce'],
            ['key' => 'free_delivery_threshold', 'value' => '500', 'type' => 'integer', 'group' => 'ecommerce'],
            ['key' => 'tax_rate', 'value' => '5', 'type' => 'integer', 'group' => 'ecommerce'],
            ['key' => 'low_stock_threshold', 'value' => '5', 'type' => 'integer', 'group' => 'ecommerce'],

            // Notification Settings
            ['key' => 'email_notifications', 'value' => '1', 'type' => 'boolean', 'group' => 'notifications'],
            ['key' => 'sms_notifications', 'value' => '0', 'type' => 'boolean', 'group' => 'notifications'],
            ['key' => 'order_confirmation_email', 'value' => '1', 'type' => 'boolean', 'group' => 'notifications'],
            ['key' => 'low_stock_alerts', 'value' => '1', 'type' => 'boolean', 'group' => 'notifications'],

            // Payment Settings
            ['key' => 'payment_methods', 'value' => '["cash_on_delivery", "bank_transfer"]', 'type' => 'json', 'group' => 'payment'],
            ['key' => 'stripe_enabled', 'value' => '0', 'type' => 'boolean', 'group' => 'payment'],
            ['key' => 'paypal_enabled', 'value' => '0', 'type' => 'boolean', 'group' => 'payment'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}