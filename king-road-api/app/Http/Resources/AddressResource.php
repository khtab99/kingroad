<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'type' => $this->type,
            'street' => $this->street,
            'house_number' => $this->house_number,
            'building_number' => $this->building_number,
            'floor' => $this->floor,
            'apartment_number' => $this->apartment_number,
            'office_number' => $this->office_number,
            'additional_description' => $this->additional_description,
            'city' => $this->city,
            'country' => $this->country,
            'is_default' => $this->is_default,
            'formatted_address' => $this->formatted_address,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}