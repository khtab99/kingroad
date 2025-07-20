<?php

namespace App\Http\Requests\Address;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'type' => 'sometimes|in:house,apartment,office',
            'street' => 'sometimes|string|max:255',
            'house_number' => 'nullable|string|max:50',
            'building_number' => 'nullable|string|max:50',
            'floor' => 'nullable|string|max:50',
            'apartment_number' => 'nullable|string|max:50',
            'office_number' => 'nullable|string|max:50',
            'additional_description' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'is_default' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'type.in' => 'Address type must be house, apartment, or office',
            'street.max' => 'Street address cannot exceed 255 characters',
        ];
    }
}