<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Address - either use existing address or provide new address data
            'address_id' => 'nullable|exists:addresses,id',
            
            // New address data (required if address_id not provided)
            'customer_phone' => 'required|string|max:20',
            'address_type' => 'required_without:address_id|in:house,apartment,office',
            'street' => 'required_without:address_id|string|max:255',
            'house_number' => 'nullable|string|max:50',
            'building_number' => 'nullable|string|max:50',
            'floor' => 'nullable|string|max:50',
            'apartment_number' => 'nullable|string|max:50',
            'office_number' => 'nullable|string|max:50',
            'additional_description' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            
            // Order details
            'delivery_fee' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|string|max:50',
            'customer_notes' => 'nullable|string|max:500',
            
            // Save address option
            'save_address' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_phone.required' => 'Phone number is required',
            'address_type.required_without' => 'Address type is required when not using saved address',
            'street.required_without' => 'Street address is required when not using saved address',
            'address_id.exists' => 'Selected address does not exist',
        ];
    }
}