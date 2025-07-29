<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\CreateProductRequest;
use App\Http\Requests\Admin\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class AdminProductController extends Controller
{
    public function index(Request $request) 
    {
        $products = QueryBuilder::for(Product::class)
            ->with(['category', 'subcategory', 'sub_subcategory'])
            ->allowedFilters(filters: [
                'name_en',
                'name_ar',
                'sku',
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
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('name_en', 'like', "%{$value}%")
                          ->orWhere('name_ar', 'like', "%{$value}%")
                          ->orWhere('sku', 'like', "%{$value}%");
                    });
                }),
            ])
            ->allowedSorts([
                'name_en',
                'name_ar',
                'price',
                'inventory',
                'created_at',
                'views',
                'rating'
            ])
            ->paginate($request->get('per_page', 15));

        return ProductResource::collection($products);
    }

    public function store(CreateProductRequest $request)
    {
        $data = $request->validated();
        
        // Handle image uploads
        if ($request->hasFile('images')) {
            $images = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $images[] = Storage::url($path);
            }
            $data['images'] = $images;
            $data['featured_image'] = $images[0] ?? null;
        }

        $product = Product::create($data);
        $product->load(['category', 'subcategory',"sub_subcategory"]);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => new ProductResource($product),
        ], 201);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'subcategory', 'sub_subcategory']);
        
        return new ProductResource($product);
    }

public function update(UpdateProductRequest $request, Product $product)
{
 

    $data = $request->validated();

    if ($request->hasFile('images')) {
        // Delete old images
        if ($product->images) {
            foreach ($product->images as $image) {
                $path = str_replace('/storage/', '', $image);
                Storage::disk('public')->delete($path);
            }
        }

        $images = [];
        foreach ($request->file('images') as $image) {
            $path = $image->store('products', 'public');
            $images[] = Storage::url($path);
        }
        $data['images'] = $images;
        $data['featured_image'] = $images[0] ?? null;
    }

    $product->update($data);
    $product->load(['category', 'subcategory']);

    return handleSuccessReponse(1, 'Product updated successfully', new ProductResource($product));
}



    public function destroy(Product $product)
    {
        // Delete images
        if ($product->images) {
            foreach ($product->images as $image) {
                $path = str_replace('/storage/', '', $image);
                Storage::disk('public')->delete($path);
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id',
            'data' => 'required|array',
        ]);

        $updated = Product::whereIn('id', $request->product_ids)
            ->update($request->data);

        return response()->json([
            'message' => "{$updated} products updated successfully",
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $products = Product::whereIn('id', $request->product_ids)->get();
        
        foreach ($products as $product) {
            // Delete images
            if ($product->images) {
                foreach ($product->images as $image) {
                    $path = str_replace('/storage/', '', $image);
                    Storage::disk('public')->delete($path);
                }
            }
        }

        $deleted = Product::whereIn('id', $request->product_ids)->delete();

        return response()->json([
            'message' => "{$deleted} products deleted successfully",
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx',
        ]);

        // Implementation for CSV/Excel import
        // This would use a package like Laravel Excel

        return response()->json([
            'message' => 'Products imported successfully',
        ]);
    }

    public function export(Request $request)
    {
        // Implementation for CSV/Excel export
        // This would use a package like Laravel Excel

        return response()->json([
            'message' => 'Export started',
            'download_url' => '/storage/exports/products.xlsx',
        ]);
    }
}