<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('children')
            ->active()
            ->parent()
            ->orderBy('sort_order')
            ->get();

        return CategoryResource::collection($categories);
    }

    public function show(Category $category)
    {
        $category->load(['children', 'parent']);
        
        return new CategoryResource($category);
    }

    public function products(Category $category, Request $request)
    {
        $products = $category->products()
            ->with(['category', 'subcategory'])
            ->active()
            ->paginate($request->get('per_page', 15));

        return ProductResource::collection($products);
    }
}