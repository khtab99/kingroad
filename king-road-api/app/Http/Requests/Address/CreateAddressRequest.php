<?php

namespace App\Http\Requests\Address;

use Illuminate\Foundation\Http\FormRequest;

class CreateAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'type' => 'required|in:house,apartment,office',
            'street' => 'required|string|max:255',
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
            'type.required' => 'Address type is required',
            'type.in' => 'Address type must be house, apartment, or office',
            'street.required' => 'Street address is required',
            'street.max' => 'Street address cannot exceed 255 characters',
        ];
    }

    protected function prepareForValidation()
    {
        // Set default values
        $this->merge([
            'city' => $this->city ?? 'Umm Al Quwain',
            'country' => $this->country ?? 'United Arab Emirates',
            'is_default' => $this->is_default ?? false,
        ]);
    }
}