<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'country' => $this->country,
            'language' => $this->language,
            'is_active' => $this->is_active,
            'marketing_opt_in' => $this->marketing_opt_in,
            'last_login_at' => $this->last_login_at,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'total_orders' => $this->whenLoaded('orders', fn() => $this->orders->count()),
            'total_spent' => $this->whenLoaded('orders', fn() => $this->orders->where('status', 'delivered')->sum('total')),
        ];
    }
}