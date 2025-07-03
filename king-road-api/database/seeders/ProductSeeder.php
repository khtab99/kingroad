<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $internalCategory = Category::where('slug', 'internal')->first();
        $externalCategory = Category::where('slug', 'external')->first();
        $airConditioningCategory = Category::where('slug', 'air-conditioning')->first();
        $accessoriesCategory = Category::where('slug', 'accessories')->first();

        $dashboardSubcategory = Category::where('slug', 'dashboard')->first();
        $bumpersSubcategory = Category::where('slug', 'bumpers')->first();
        $lightsSubcategory = Category::where('slug', 'lights')->first();
        $compressorSubcategory = Category::where('slug', 'compressor')->first();
        $filtersSubcategory = Category::where('slug', 'filters')->first();
        $floorMatsSubcategory = Category::where('slug', 'floor-mats')->first();
        $coversSubcategory = Category::where('slug', 'covers')->first();

        $products = [
            [
                'name_en' => 'Dashboard Shell 88-97 Gray New',
                'name_ar' => 'قشرة طبلون 88-97 لون رمادي جديد',
                'slug' => 'dashboard-shell-88-97-gray-new',
                'description_en' => 'High-quality dashboard shell for Nissan Patrol 1988-1997 models in gray color',
                'description_ar' => 'قشرة طبلون عالية الجودة لنيسان باترول موديل 1988-1997 باللون الرمادي',
                'sku' => 'DS-88-97-GRY',
                'price' => 980.00,
                'inventory' => 5,
                'category_id' => $internalCategory->id,
                'subcategory_id' => $dashboardSubcategory->id,
                'images' => ['/assets/images/product/1.jpg'],
                'featured_image' => '/assets/images/product/1.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Lighter Illumination Green Color',
                'name_ar' => 'اضاءة الولاعه باللون الاخضر',
                'slug' => 'lighter-illumination-green-color',
                'description_en' => 'Green colored lighter illumination for dashboard',
                'description_ar' => 'إضاءة الولاعة باللون الأخضر للطبلون',
                'sku' => 'LI-GRN-001',
                'price' => 40.00,
                'inventory' => 0,
                'category_id' => $internalCategory->id,
                'subcategory_id' => $dashboardSubcategory->id,
                'images' => ['/assets/images/product/2.jpg'],
                'featured_image' => '/assets/images/product/2.jpg',
                'is_active' => false,
            ],
            [
                'name_en' => 'Door Handle Set Spiral',
                'name_ar' => 'طقم مسكة الباب اللولبي',
                'slug' => 'door-handle-set-spiral',
                'description_en' => 'Complete spiral door handle set for interior doors',
                'description_ar' => 'طقم كامل لمسكة الباب اللولبي للأبواب الداخلية',
                'sku' => 'DH-SPIRAL-001',
                'price' => 320.00,
                'inventory' => 3,
                'category_id' => $internalCategory->id,
                'subcategory_id' => $dashboardSubcategory->id,
                'images' => ['/assets/images/product/3.jpg'],
                'featured_image' => '/assets/images/product/3.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Temperature Gauge 88-91',
                'name_ar' => 'عداد حراره 88-91',
                'slug' => 'temperature-gauge-88-91',
                'description_en' => 'Temperature gauge for Nissan Patrol 1988-1991 models',
                'description_ar' => 'عداد الحرارة لنيسان باترول موديل 1988-1991',
                'sku' => 'TG-88-91-001',
                'price' => 420.00,
                'inventory' => 2,
                'category_id' => $internalCategory->id,
                'subcategory_id' => $dashboardSubcategory->id,
                'images' => ['/assets/images/product/4.jpg'],
                'featured_image' => '/assets/images/product/4.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Front Bumper 88-97',
                'name_ar' => 'مصد أمامي 88-97',
                'slug' => 'front-bumper-88-97',
                'description_en' => 'Front bumper for Nissan Patrol 1988-1997 models',
                'description_ar' => 'مصد أمامي لنيسان باترول موديل 1988-1997',
                'sku' => 'FB-88-97-001',
                'price' => 1200.00,
                'inventory' => 4,
                'category_id' => $externalCategory->id,
                'subcategory_id' => $bumpersSubcategory->id,
                'images' => ['/assets/images/product/5.jpg'],
                'featured_image' => '/assets/images/product/5.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Right Tail Light',
                'name_ar' => 'فانوس خلفي يمين',
                'slug' => 'right-tail-light',
                'description_en' => 'Right side tail light assembly',
                'description_ar' => 'مجموعة الفانوس الخلفي الأيمن',
                'sku' => 'RTL-001',
                'price' => 250.00,
                'inventory' => 0,
                'category_id' => $externalCategory->id,
                'subcategory_id' => $lightsSubcategory->id,
                'images' => ['/assets/images/product/6.jpg'],
                'featured_image' => '/assets/images/product/6.jpg',
                'is_active' => false,
            ],
            [
                'name_en' => 'AC Compressor',
                'name_ar' => 'ضاغط مكيف',
                'slug' => 'ac-compressor',
                'description_en' => 'Air conditioning compressor unit',
                'description_ar' => 'وحدة ضاغط المكيف',
                'sku' => 'ACC-001',
                'price' => 850.00,
                'inventory' => 6,
                'category_id' => $airConditioningCategory->id,
                'subcategory_id' => $compressorSubcategory->id,
                'images' => ['/assets/images/product/7.jpg'],
                'featured_image' => '/assets/images/product/7.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Floor Mat Set',
                'name_ar' => 'سجادة أرضية',
                'slug' => 'floor-mat-set',
                'description_en' => 'Complete floor mat set for all seats',
                'description_ar' => 'طقم سجاد أرضية كامل لجميع المقاعد',
                'sku' => 'FMS-001',
                'price' => 180.00,
                'inventory' => 10,
                'category_id' => $accessoriesCategory->id,
                'subcategory_id' => $floorMatsSubcategory->id,
                'images' => ['/assets/images/product/8.jpg'],
                'featured_image' => '/assets/images/product/8.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'AC Filter',
                'name_ar' => 'فلتر مكيف',
                'slug' => 'ac-filter',
                'description_en' => 'Air conditioning filter for clean air circulation',
                'description_ar' => 'فلتر المكيف لدوران الهواء النظيف',
                'sku' => 'ACF-001',
                'price' => 65.00,
                'inventory' => 15,
                'category_id' => $airConditioningCategory->id,
                'subcategory_id' => $filtersSubcategory->id,
                'images' => ['/assets/images/product/11.jpg'],
                'featured_image' => '/assets/images/product/11.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Steering Wheel Cover',
                'name_ar' => 'غطاء مقود',
                'slug' => 'steering-wheel-cover',
                'description_en' => 'Premium steering wheel cover for comfort and grip',
                'description_ar' => 'غطاء مقود فاخر للراحة والقبضة',
                'sku' => 'SWC-001',
                'price' => 95.00,
                'inventory' => 8,
                'category_id' => $accessoriesCategory->id,
                'subcategory_id' => $coversSubcategory->id,
                'images' => ['/assets/images/product/12.jpg'],
                'featured_image' => '/assets/images/product/12.jpg',
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}