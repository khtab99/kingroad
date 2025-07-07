<?php

namespace App\Http\Resources;

use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductResourceCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => ProductResource::collection($this->collection),
            'meta' => [
                'current_page' => $this->currentPage(),
                'per_page' => $this->perPage(),
                'total' => $this->total(),
                'last_page' => $this->lastPage(),
            ],
            'links' => [
                'first' => $this->url(1),
                'last' => $this->url($this->lastPage()),
                'prev' => $this->previousPageUrl(),
                'next' => $this->nextPageUrl(),
            ],
        ];
    }
}

