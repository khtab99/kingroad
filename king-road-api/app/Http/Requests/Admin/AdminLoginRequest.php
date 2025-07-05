<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;

class AdminLoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($validator->passes()) {
                $credentials = $this->only('email', 'password');
                
                // Check if admin exists and is active
                $admin = \App\Models\Admin::where('email', $credentials['email'])
                    ->where('is_active', true)
                    ->first();
                
                if (!$admin) {
                    $validator->errors()->add('email', 'Invalid credentials');
                }
            }
        });
    }
}