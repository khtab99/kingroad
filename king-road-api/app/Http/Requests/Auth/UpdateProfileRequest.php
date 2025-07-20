<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore(auth()->id()),
            ],
            'phone' => 'sometimes|string|max:20',
            'country' => 'sometimes|string|max:255',
            'language' => 'sometimes|in:en,ar',
            'password' => 'sometimes|string|min:8|confirmed',
            'marketing_opt_in' => 'sometimes|boolean',
        ];
    }
}