<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'customer_name' => $this->customer_name,
            'customer_phone' => $this->customer_phone,
            'customer_email' => $this->customer_email,
            'address_type' => $this->address_type,
            'formatted_address' => $this->formatted_address,
            'address_details' => [
                'type' => $this->address_type,
                'street' => $this->street,
                'house_number' => $this->house_number,
                'building_number' => $this->building_number,
                'floor' => $this->floor,
                'apartment_number' => $this->apartment_number,
                'office_number' => $this->office_number,
                'additional_description' => $this->additional_description,
                'city' => $this->city,
                'country' => $this->country,
            ],
            'subtotal' => $this->subtotal,
            'delivery_fee' => $this->delivery_fee,
            'discount' => $this->discount,
            'total' => $this->total,
            'status' => $this->status,
            'status_color' => $this->status_color,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'payment_status_color' => $this->payment_status_color,
            'payment_reference' => $this->payment_reference,
            'shipping_method' => $this->shipping_method,
            'tracking_number' => $this->tracking_number,
            'estimated_delivery' => $this->estimated_delivery,
            'customer_notes' => $this->customer_notes,
            'internal_notes' => $this->when($request->user('admin'), $this->internal_notes),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'customer' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}