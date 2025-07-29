<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SliderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            "title_en" => $this->title_en,
            "title_ar" => $this->title_ar,
            "description_en" => $this->description_en,
            "description_ar" => $this->description_ar,
      'image' => $this->image ? url($this->image) : null,
            "status" => $this->status,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,

        ];
    }
}