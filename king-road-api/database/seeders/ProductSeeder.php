<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::where('slug', 'car-spare-parts')->first();
        $subcategory = Category::where('slug', 'engine-parts')->first();
        $subSubcategory = Category::where('slug', 'filters')->first();

        if (!$category || !$subcategory) {
            $this->command->error('Required categories not found. Please seed categories first.');
            return;
        }

        $products = [
            [
                'name_en' => 'Oil Filter - Toyota Corolla',
                'name_ar' => 'فلتر زيت - تويوتا كورولا',
                'slug' => 'oil-filter-toyota-corolla',
                'description_en' => 'High-quality oil filter compatible with Toyota Corolla models 2010-2020.',
                'description_ar' => 'فلتر زيت عالي الجودة متوافق مع تويوتا كورولا من 2010 إلى 2020.',
                'sku' => 'SP-TY-OIL-001',
                'price' => 45.00,
                'inventory' => 100,
                'category_id' => $category->id,
                'subcategory_id' => $subcategory->id,
                'sub_subcategory_id' => $subSubcategory?->id,
                'images' => ['/assets/images/product/oil-filter.jpg'],
                'featured_image' => '/assets/images/product/oil-filter.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Air Filter - Honda Civic',
                'name_ar' => 'فلتر هواء - هوندا سيفيك',
                'slug' => 'air-filter-honda-civic',
                'description_en' => 'OEM air filter suitable for Honda Civic 2012-2021.',
                'description_ar' => 'فلتر هواء أصلي مناسب لهوندا سيفيك من 2012 إلى 2021.',
                'sku' => 'SP-HO-AIR-002',
                'price' => 60.00,
                'inventory' => 80,
                'category_id' => $category->id,
                'subcategory_id' => $subcategory->id,
                'sub_subcategory_id' => $subSubcategory?->id,
                'images' => ['/assets/images/product/air-filter.jpg'],
                'featured_image' => '/assets/images/product/air-filter.jpg',
                'is_active' => true,
            ],
            [
                'name_en' => 'Spark Plug - NGK BKR6E',
                'name_ar' => 'بوجيه - NGK BKR6E',
                'slug' => 'spark-plug-ngk-bkr6e',
                'description_en' => 'Genuine NGK spark plug model BKR6E for various vehicles.',
                'description_ar' => 'بوجيه NGK أصلي موديل BKR6E لمجموعة واسعة من السيارات.',
                'sku' => 'SP-NGK-SPK-003',
                'price' => 25.00,
                'inventory' => 200,
                'category_id' => $category->id,
                'subcategory_id' => $subcategory->id,
                'sub_subcategory_id' => $subSubcategory?->id,
                'images' => ['/assets/images/product/spark-plug.jpg'],
                'featured_image' => '/assets/images/product/spark-plug.jpg',
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        $this->command->info(count($products) . ' car spare part products seeded.');
    }
}
