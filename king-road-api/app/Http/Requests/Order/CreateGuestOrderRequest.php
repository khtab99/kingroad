<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CreateGuestOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Allow guest users
    }

    public function rules(): array
    {
        return [
            // Customer details
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email|max:255',
            
            // Address details
            'address_type' => 'required|in:house,apartment,office',
            'street' => 'required|string|max:255',
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
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Customer name is required',
            'customer_phone.required' => 'Phone number is required',
            'customer_email.email' => 'Please provide a valid email address',
            'address_type.required' => 'Address type is required',
            'address_type.in' => 'Address type must be house, apartment, or office',
            'street.required' => 'Street address is required',
        ];
    }

    protected function prepareForValidation()
    {
        // Set default values
        $this->merge([
            'city' => $this->city ?? 'Umm Al Quwain',
            'country' => $this->country ?? 'United Arab Emirates',
            'payment_method' => $this->payment_method ?? 'cash_on_delivery',
        ]);
    }
}