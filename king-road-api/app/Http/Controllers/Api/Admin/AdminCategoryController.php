<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class AdminCategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = QueryBuilder::for(Category::class)
            ->with(['parent', 'children'])
            ->allowedFilters([
                'name_en',
                'name_ar',
                'is_active',
                AllowedFilter::exact('parent_id'),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('name_en', 'like', "%{$value}%")
                          ->orWhere('name_ar', 'like', "%{$value}%");
                    });
                }),
            ])
            ->allowedSorts([
                'name_en',
                'name_ar',
                'sort_order',
                'created_at'
            ])
            ->orderBy('sort_order')
            ->paginate($request->get('per_page', 15));

        return CategoryResource::collection($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only([
            'name_en',
            'name_ar',
            'description_en',
            'description_ar',
            'parent_id',
            'sort_order',
            'is_active'
        ]);

        // Generate slug if not provided
        if (!$request->has('slug') || empty($request->slug)) {
            $data['slug'] = Str::slug($request->name_en);
        } else {
            $data['slug'] = $request->slug;
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $data['image'] = Storage::url($path);
        }

        $category = Category::create($data);
        $category->load(['parent', 'children']);

        return handleSuccessReponse(1, 'Category created successfully', new CategoryResource($category));
    }

    public function show(Category $category)
    {
        $category->load(['parent', 'children', 'products']);
        
        return handleSuccessReponse(1, 'Category retrieved successfully', new CategoryResource($category));
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name_en' => 'sometimes|string|max:255',
            'name_ar' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:categories,slug,' . $category->id,
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only([
            'name_en',
            'name_ar',
            'slug',
            'description_en',
            'description_ar',
            'parent_id',
            'sort_order',
            'is_active'
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($category->image) {
                $oldPath = str_replace('/storage/', '', $category->image);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->store('categories', 'public');
            $data['image'] = Storage::url($path);
        }

        $category->update($data);
        $category->load(['parent', 'children']);

        return handleSuccessReponse(1, 'Category updated successfully', new CategoryResource($category));
    }

    public function destroy(Category $category)
    {
        // Check if category has products
        if ($category->products()->count() > 0) {
            return handleErrorResponse(0, 'Cannot delete category with existing products');
        }

        // Check if category has subcategories
        if ($category->children()->count() > 0) {
            return handleErrorResponse(0, 'Cannot delete category with existing subcategories');
        }

        // Delete image
        if ($category->image) {
            $path = str_replace('/storage/', '', $category->image);
            Storage::disk('public')->delete($path);
        }

        $category->delete();

        return handleSuccessReponse(1, 'Category deleted successfully');
    }

    public function reorder(Request $request, Category $category)
    {
        $request->validate([
            'sort_order' => 'required|integer|min:0',
        ]);

        $category->update(['sort_order' => $request->sort_order]);

        return handleSuccessReponse(1, 'Category order updated successfully', new CategoryResource($category));
    }
}