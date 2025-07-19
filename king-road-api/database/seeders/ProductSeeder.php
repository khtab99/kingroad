<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Get all categories in the hierarchy
        $category1 = Category::where('slug', 'category-1')->first();
        $category2 = Category::where('slug', 'category-2')->first();

        // First level subcategories
        $sub1_1 = Category::where('slug', 'subcategory-1-1')->first();
        $sub1_2 = Category::where('slug', 'subcategory-1-2')->first();
        $sub1_3 = Category::where('slug', 'subcategory-1-3')->first();

        $sub2_1 = Category::where('slug', 'subcategory-2-1')->first();
        $sub2_2 = Category::where('slug', 'subcategory-2-2')->first();
        $sub2_3 = Category::where('slug', 'subcategory-2-3')->first();

        // Third level subcategories
        $sub1_1_1 = Category::where('slug', 'subcategory-1-1-1')->first();
        $sub1_1_2 = Category::where('slug', 'subcategory-1-1-2')->first();
        $sub1_1_3 = Category::where('slug', 'subcategory-1-1-3')->first();

        $products = [
            // Products for Category 1
            [
                'name_en' => 'Product 1.1.1',
                'name_ar' => 'المنتج 1.1.1',
                'slug' => 'product-1-1-1',
                'description_en' => 'A product in the first subcategory of Category 1',
                'description_ar' => 'منتج في الفئة الفرعية الأولى من التصنيف 1',
                'sku' => 'P1-1-1-001',
                'price' => 199.99,
                'inventory' => 10,
                'category_id' => $category1->id,
                'subcategory_id' => $sub1_1->id,
                'images' => ['/assets/images/product/1.jpg'],
                'featured_image' => '/assets/images/product/1.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Product 1.1.2',
                'name_ar' => 'المنتج 1.1.2',
                'slug' => 'product-1-1-2',
                'description_en' => 'Another product in the first subcategory of Category 1',
                'description_ar' => 'منتج آخر في الفئة الفرعية الأولى من التصنيف 1',
                'sku' => 'P1-1-2-001',
                'price' => 249.99,
                'inventory' => 5,
                'category_id' => $category1->id,
                'subcategory_id' => $sub1_1->id,
                'images' => ['/assets/images/product/2.jpg'],
                'featured_image' => '/assets/images/product/2.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Product 1.2.1',
                'name_ar' => 'المنتج 1.2.1',
                'slug' => 'product-1-2-1',
                'description_en' => 'A product in the second subcategory of Category 1',
                'description_ar' => 'منتج في الفئة الفرعية الثانية من التصنيف 1',
                'sku' => 'P1-2-1-001',
                'price' => 149.99,
                'inventory' => 15,
                'category_id' => $category1->id,
                'subcategory_id' => $sub1_2->id,
                'images' => ['/assets/images/product/3.jpg'],
                'featured_image' => '/assets/images/product/3.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Product 1.3.1',
                'name_ar' => 'المنتج 1.3.1',
                'slug' => 'product-1-3-1',
                'description_en' => 'A product in the third subcategory of Category 1',
                'description_ar' => 'منتج في الفئة الفرعية الثالثة من التصنيف 1',
                'sku' => 'P1-3-1-001',
                'price' => 179.99,
                'inventory' => 8,
                'category_id' => $category1->id,
                'subcategory_id' => $sub1_3->id,
                'images' => ['/assets/images/product/4.jpg'],
                'featured_image' => '/assets/images/product/4.jpg',
                'is_active' => true,
            ],
            // Products for Category 2
            [
                'name_en' => 'Product 2.1.1',
                'name_ar' => 'المنتج 2.1.1',
                'slug' => 'product-2-1-1',
                'description_en' => 'A product in the first subcategory of Category 2',
                'description_ar' => 'منتج في الفئة الفرعية الأولى من التصنيف 2',
                'sku' => 'P2-1-1-001',
                'price' => 299.99,
                'inventory' => 12,
                'category_id' => $category2->id,
                'subcategory_id' => $sub2_1->id,
                'images' => ['/assets/images/product/5.jpg'],
                'featured_image' => '/assets/images/product/5.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Product 2.2.1',
                'name_ar' => 'المنتج 2.2.1',
                'slug' => 'product-2-2-1',
                'description_en' => 'A product in the second subcategory of Category 2',
                'description_ar' => 'منتج في الفئة الفرعية الثانية من التصنيف 2',
                'sku' => 'P2-2-1-001',
                'price' => 199.99,
                'inventory' => 7,
                'category_id' => $category2->id,
                'subcategory_id' => $sub2_2->id,
                'images' => ['/assets/images/product/6.jpg'],
                'featured_image' => '/assets/images/product/6.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Product 2.3.1',
                'name_ar' => 'المنتج 2.3.1',
                'slug' => 'product-2-3-1',
                'description_en' => 'A product in the third subcategory of Category 2',
                'description_ar' => 'منتج في الفئة الفرعية الثالثة من التصنيف 2',
                'sku' => 'P2-3-1-001',
                'price' => 249.99,
                'inventory' => 9,
                'category_id' => $category2->id,
                'subcategory_id' => $sub2_3->id,
                'images' => ['/assets/images/product/7.jpg'],
                'featured_image' => '/assets/images/product/7.jpg',
                'is_active' => true,
            ],
            // Products in third level subcategories
            [
                'name_en' => 'Product 1.1.1.1',
                'name_ar' => 'المنتج 1.1.1.1',
                'slug' => 'product-1-1-1-1',
                'description_en' => 'A product in the first third-level subcategory',
                'description_ar' => 'منتج في الفئة الفرعية الثالثة الأولى',
                'sku' => 'P1-1-1-1-001',
                'price' => 129.99,
                'inventory' => 18,
                'category_id' => $category1->id,
                'subcategory_id' => $sub1_1_1->id,
                'images' => ['/assets/images/product/8.jpg'],
                'featured_image' => '/assets/images/product/8.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Product 1.1.1.2',
                'name_ar' => 'المنتج 1.1.1.2',
                'slug' => 'product-1-1-1-2',
                'description_en' => 'A product in the second third-level subcategory',
                'description_ar' => 'منتج في الفئة الفرعية الثالثة الثانية',
                'sku' => 'P1-1-1-2-001',
                'price' => 149.99,
                'inventory' => 14,
                'category_id' => $category1->id,
                'subcategory_id' => $sub1_1_2->id,
                'images' => ['/assets/images/product/9.jpg'],
                'featured_image' => '/assets/images/product/9.jpg',
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}