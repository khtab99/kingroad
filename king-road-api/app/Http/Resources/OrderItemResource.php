<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'product_sku' => $this->product_sku,
            'product_image' => $this->product_image,
            'quantity' => $this->quantity,
            'price' => $this->price,
            'total' => $this->total,
            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }
}