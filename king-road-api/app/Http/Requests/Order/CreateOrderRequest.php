<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    // public function authorize(): bool
    // {
    //     return true;
    // }

    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email|max:255',
            'address_type' => 'required|in:house,apartment,office',
            'street' => 'required|string|max:255',
            'house_number' => 'nullable|string|max:50',
            'building_number' => 'nullable|string|max:50',
            'floor' => 'nullable|string|max:50',
            'apartment_number' => 'nullable|string|max:50',
            'office_number' => 'nullable|string|max:50',
            'additional_description' => 'nullable|string|max:500',
            'delivery_fee' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|string|max:50',
            'customer_notes' => 'nullable|string|max:500',
            'coupon_code' => 'nullable|string|exists:coupons,code',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
           'checkout_session_id' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'At least one item is required',
            'items.*.product_id.exists' => 'One or more products do not exist',
            'items.*.quantity.min' => 'Quantity must be at least 1',
        ];
    }
}