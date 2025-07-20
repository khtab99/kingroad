<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = QueryBuilder::for(Product::class)
            ->with(['category', 'subcategory', 'sub_subcategory'])
            ->allowedFilters([
                'name_en',
                'name_ar',
                'category_id',
                'subcategory_id',
                'sub_subcategory_id',
                'is_active',
                'is_featured',
                AllowedFilter::exact('category_id'),
                AllowedFilter::exact('subcategory_id'),
                AllowedFilter::exact('sub_subcategory_id'),
                AllowedFilter::scope('in_stock'),
                AllowedFilter::scope('low_stock'),
                AllowedFilter::scope('out_of_stock'),
                AllowedFilter::callback('price_range', function ($query, $value) {
                    $range = explode(',', $value);
                    if (count($range) === 2) {
                        $query->whereBetween('price', [$range[0], $range[1]]);
                    }
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('name_en', 'like', "%{$value}%")
                          ->orWhere('name_ar', 'like', "%{$value}%")
                          ->orWhere('description_en', 'like', "%{$value}%")
                          ->orWhere('description_ar', 'like', "%{$value}%");
                    });
                }),
            ])
            ->allowedSorts([
                'name_en',
                'name_ar',
                'price',
                'created_at',
                'views',
                'rating',
                'inventory'
            ])
            ->active()
            ->paginate($request->get('per_page', 15));

        return ProductResource::collection($products);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'subcategory', 'approvedReviews.user']);
        
        return new ProductResource($product);
    }

    public function incrementViews(Product $product)
    {
        $product->incrementViews();

        return response()->json([
            'message' => 'Views incremented',
            'views' => $product->views,
        ]);
    }
}