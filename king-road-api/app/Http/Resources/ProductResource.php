<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name_en' => $this->name_en,
            'name_ar' => $this->name_ar,
            'name' => $this->name, // Localized name
            'slug' => $this->slug,
            'description_en' => $this->description_en,
            'description_ar' => $this->description_ar,
            'description' => $this->description, // Localized description
            'sku' => $this->sku,
            'barcode' => $this->barcode,
            'price' => $this->price,
            'sale_price' => $this->sale_price,
            'current_price' => $this->current_price,
            'cost_price' => $this->when($request->user('admin'), $this->cost_price),
            'inventory' => $this->inventory,
            'low_stock_threshold' => $this->low_stock_threshold,
            'track_inventory' => $this->track_inventory,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'subcategory' => new CategoryResource($this->whenLoaded('subcategory')),
            'sub_subcategory' => new CategoryResource($this->whenLoaded('sub_subcategory')),
            'images' => $this->images,
      'featured_image' => $this->featured_image ? url($this->featured_image) : null,
            'weight' => $this->weight,
            'dimensions' => $this->dimensions,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'is_on_sale' => $this->is_on_sale,
            'is_in_stock' => $this->is_in_stock,
            'is_low_stock' => $this->is_low_stock,
            'discount_percentage' => $this->discount_percentage,
            'tags' => $this->tags,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'views' => $this->views,
            'rating' => $this->rating,
            'reviews_count' => $this->reviews_count,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'reviews' => ReviewResource::collection($this->whenLoaded('approvedReviews')),
            'total_sold' => $this->when(isset($this->total_sold), $this->total_sold),
        ];
    }
}