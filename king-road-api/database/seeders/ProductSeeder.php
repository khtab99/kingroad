<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Get all categories
        $categories = Category::all();
        $engineParts = $categories->where('slug', 'engine-parts')->first();
        $brakeSystem = $categories->where('slug', 'brake-system')->first();
        $suspensionSystem = $categories->where('slug', 'suspension-system')->first();
        $interiorAccessories = $categories->where('slug', 'interior-accessories')->first();
        $exteriorAccessories = $categories->where('slug', 'exterior-accessories')->first();
        $performanceParts = $categories->where('slug', 'performance-parts')->first();

        // Check if all required categories exist
        if (!$engineParts || !$brakeSystem || !$suspensionSystem || !$interiorAccessories || !$exteriorAccessories || !$performanceParts) {
            $this->command->error('Required categories not found. Please seed categories first.');
            return;
        }

        // Engine Parts Products
        $engineProducts = [
            // Filters
            [
                'name_en' => 'Oil Filter - Toyota Corolla',
                'name_ar' => 'فلتر زيت - تويوتا كورولا',
                'slug' => 'oil-filter-toyota-corolla',
                'description_en' => 'High-quality oil filter compatible with Toyota Corolla models 2010-2020.',
                'description_ar' => 'فلتر زيت عالي الجودة متوافق مع تويوتا كورولا من 2010 إلى 2020.',
                'sku' => 'SP-TY-OIL-001',
                'price' => 45.00,
                'sale_price' => 40.00,
                'cost_price' => 30.00,
                'inventory' => 100,
                'low_stock_threshold' => 20,
                'track_inventory' => true,
                'category_id' => $engineParts->parent_id,
                'subcategory_id' => $engineParts->id,
                'sub_subcategory_id' => $categories->where('slug', 'filters')->first()?->id,
                 'images' => ['/assets/images/product/1.jpg'],
                'featured_image' => '/assets/images/product/1.jpg',

                'weight' => 0.5,
                'dimensions' => ['width' => 15, 'height' => 15, 'depth' => 5],
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'Toyota Corolla Oil Filter',
                'meta_description' => 'High-quality oil filter for Toyota Corolla models 2010-2020',
            ],
            [
                'name_en' => 'Air Filter - Honda Civic',
                'name_ar' => 'فلتر هواء - هوندا سيفيك',
                'slug' => 'air-filter-honda-civic',
                'description_en' => 'OEM air filter suitable for Honda Civic 2012-2021.',
                'description_ar' => 'فلتر هواء أصلي مناسب لهوندا سيفيك من 2012 إلى 2021.',
                'sku' => 'SP-HO-AIR-002',
                'price' => 60.00,
                'sale_price' => 55.00,
                'cost_price' => 40.00,
                'inventory' => 80,
                'low_stock_threshold' => 15,
                'track_inventory' => true,
                'category_id' => $engineParts->parent_id,
                'subcategory_id' => $engineParts->id,
                'sub_subcategory_id' => $categories->where('slug', 'filters')->first()?->id,
                'images' => ['/assets/images/product/2.jpg'],
                'featured_image' => '/assets/images/product/2.jpg',

                'weight' => 0.3,
                'dimensions' => ['width' => 20, 'height' => 20, 'depth' => 10],
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'Honda Civic Air Filter',
                'meta_description' => 'OEM air filter for Honda Civic models 2012-2021',
            ],
            // Spark Plugs
            [
                'name_en' => 'NGK BKR6E Spark Plug',
                'name_ar' => 'بوجيه NGK BKR6E',
                'slug' => 'ngk-bkr6e-spark-plug',
                'description_en' => 'Genuine NGK spark plug model BKR6E for various vehicles.',
                'description_ar' => 'بوجيه NGK أصلي موديل BKR6E لمجموعة واسعة من السيارات.',
                'sku' => 'SP-NGK-SPK-003',
                'price' => 25.00,
                'sale_price' => 23.00,
                'cost_price' => 18.00,
                'inventory' => 200,
                'low_stock_threshold' => 50,
                'track_inventory' => true,
                'category_id' => $engineParts->parent_id,
                'subcategory_id' => $engineParts->id,
                'sub_subcategory_id' => $categories->where('slug', 'spark-plugs')->first()?->id,
                'images' => ['/assets/images/product/3.jpg'],
                'featured_image' => '/assets/images/product/3.jpg',

                'weight' => 0.1,
                'dimensions' => ['width' => 5, 'height' => 10, 'depth' => 5],
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'NGK BKR6E Spark Plug',
                'meta_description' => 'Genuine NGK spark plug model BKR6E',
            ],
        ];

        // Brake System Products
        $brakeProducts = [
            [
                'name_en' => 'Brembo Brake Pads - BMW',
                'name_ar' => 'دواسات فرامل بريمبو - بي إم دبليو',
                'slug' => 'brembo-brake-pads-bmw',
                'description_en' => 'High-performance Brembo brake pads for BMW models.',
                'description_ar' => 'دواسات فرامل بريمبو عالية الأداء لموديلات بي إم دبليو.',
                'sku' => 'SP-BRE-BP-001',
                'price' => 120.00,
                'sale_price' => 110.00,
                'cost_price' => 80.00,
                'inventory' => 50,
                'low_stock_threshold' => 10,
                'track_inventory' => true,
                'category_id' => $brakeSystem->parent_id,
                'subcategory_id' => $brakeSystem->id,
                'sub_subcategory_id' => $categories->where('slug', 'brake-pads')->first()?->id,
                'images' => ['/assets/images/product/4.jpg'],
                'featured_image' => '/assets/images/product/4.jpg',

                'weight' => 2.0,
                'dimensions' => ['width' => 20, 'height' => 10, 'depth' => 5],
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'Brembo Brake Pads BMW',
                'meta_description' => 'High-performance Brembo brake pads for BMW models',
            ],
            [
                'name_en' => 'Mercedes Brake Discs',
                'name_ar' => 'أقراص فرامل مرسيدس',
                'slug' => 'mercedes-brake-discs',
                'description_en' => 'Original Mercedes brake discs for various models.',
                'description_ar' => 'أقراص فرامل مرسيدس أصلية لمجموعة واسعة من الموديلات.',
                'sku' => 'SP-MER-BD-002',
                'price' => 180.00,
                'sale_price' => 170.00,
                'cost_price' => 130.00,
                'inventory' => 30,
                'low_stock_threshold' => 5,
                'track_inventory' => true,
                'category_id' => $brakeSystem->parent_id,
                'subcategory_id' => $brakeSystem->id,
                'sub_subcategory_id' => $categories->where('slug', 'brake-discs')->first()?->id,
                'images' => ['/assets/images/product/5.jpg'],
                'featured_image' => '/assets/images/product/5.jpg',

                'weight' => 3.5,
                'dimensions' => ['width' => 30, 'height' => 30, 'depth' => 2],
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'Mercedes Brake Discs',
                'meta_description' => 'Original Mercedes brake discs',
            ],
        ];

        // Suspension System Products
        $suspensionProducts = [
            [
                'name_en' => 'Bilstein Shock Absorbers',
                'name_ar' => 'مكابح صدمات بيلشتاين',
                'slug' => 'bilstein-shock-absorbers',
                'description_en' => 'High-performance Bilstein shock absorbers.',
                'description_ar' => 'مكابح صدمات بيلشتاين عالية الأداء.',
                'sku' => 'SP-BIL-SA-001',
                'price' => 250.00,
                'sale_price' => 230.00,
                'cost_price' => 180.00,
                'inventory' => 20,
                'low_stock_threshold' => 5,
                'track_inventory' => true,
                'category_id' => $suspensionSystem->parent_id,
                'subcategory_id' => $suspensionSystem->id,
                'sub_subcategory_id' => $categories->where('slug', 'shock-absorbers')->first()?->id,
                'images' => ['/assets/images/product/6.jpg'],
                'featured_image' => '/assets/images/product/6.jpg',

                'weight' => 4.0,
                'dimensions' => ['width' => 10, 'height' => 50, 'depth' => 10],
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'Bilstein Shock Absorbers',
                'meta_description' => 'High-performance Bilstein shock absorbers',
            ],
            [
                'name_en' => 'Suspension Springs',
                'name_ar' => 'ربيع التعليق',
                'slug' => 'suspension-springs',
                'description_en' => 'High-quality suspension springs for various vehicles.',
                'description_ar' => 'ربيع تعليق عالي الجودة لمجموعة واسعة من السيارات.',
                'sku' => 'SP-SUS-SP-002',
                'price' => 150.00,
                'sale_price' => 140.00,
                'cost_price' => 100.00,
                'inventory' => 40,
                'low_stock_threshold' => 10,
                'track_inventory' => true,
                'category_id' => $suspensionSystem->parent_id,
                'subcategory_id' => $suspensionSystem->id,
                'sub_subcategory_id' => $categories->where('slug', 'springs')->first()?->id,
                'images' => ['/assets/images/product/7.jpg'],
                'featured_image' => '/assets/images/product/7.jpg',

                'weight' => 3.0,
                'dimensions' => ['width' => 20, 'height' => 30, 'depth' => 10],
                'is_active' => true,
                'is_featured' => true,
                'meta_title' => 'Suspension Springs',
                'meta_description' => 'High-quality suspension springs',
            ],
        ];

        // Interior Accessories Products
        $interiorProducts = [
            [
                'name_en' => 'Leather Seat Covers',
                'name_ar' => 'غطاء مقاعد جلد',
                'slug' => 'leather-seat-covers',
                'description_en' => 'Premium leather seat covers for car seats.',
                'description_ar' => 'غطاء مقاعد جلد فاخر للسيارات.',
                'sku' => 'SP-INT-SC-001',
                'price' => 150.00,
                'sale_price' => 135.00,
                'cost_price' => 100.00,
                'inventory' => 30,
                'low_stock_threshold' => 10,
                'track_inventory' => true,
                'category_id' => $interiorAccessories->parent_id,
                'subcategory_id' => $interiorAccessories->id,
                'sub_subcategory_id' => $categories->where('slug', 'seat-covers')->first()?->id,
                'images' => ['/assets/images/product/8.jpg'],
                'featured_image' => '/assets/images/product/8.jpg',

                'weight' => 2.5,
                'dimensions' => ['width' => 50, 'height' => 50, 'depth' => 5],
                'is_active' => true,
                'is_featured' => true,
                'meta_title' => 'Leather Seat Covers',
                'meta_description' => 'Premium leather seat covers for car seats',
            ],
            [
                'name_en' => 'Luxury Floor Mats',
                'name_ar' => 'سجاد فاخر',
                'slug' => 'luxury-floor-mats',
                'description_en' => 'Luxury car floor mats with custom designs.',
                'description_ar' => 'سجاد سيارات فاخر مع تصاميم مخصصة.',
                'sku' => 'SP-INT-FM-002',
                'price' => 80.00,
                'sale_price' => 75.00,
                'cost_price' => 50.00,
                'inventory' => 50,
                'low_stock_threshold' => 15,
                'track_inventory' => true,
                'category_id' => $interiorAccessories->parent_id,
                'subcategory_id' => $interiorAccessories->id,
                'sub_subcategory_id' => $categories->where('slug', 'floor-mats')->first()?->id,
                'images' => ['/assets/images/product/9.jpg'],
                'featured_image' => '/assets/images/product/9.jpg',

                'weight' => 1.5,
                'dimensions' => ['width' => 60, 'height' => 40, 'depth' => 2],
                'is_active' => true,
                'is_featured' => true,
                'meta_title' => 'Luxury Floor Mats',
                'meta_description' => 'Luxury car floor mats with custom designs',
            ],
        ];

        // Exterior Accessories Products
        $exteriorProducts = [
            [
                'name_en' => 'Carbon Fiber Body Kit',
                'name_ar' => 'مكملات هيكل كربون',
                'slug' => 'carbon-fiber-body-kit',
                'description_en' => 'Premium carbon fiber body kit for sport cars.',
                'description_ar' => 'مكملات هيكل كربون فاخر للسيارات الرياضية.',
                'sku' => 'SP-EXT-BK-001',
                'price' => 1200.00,
                'sale_price' => 1100.00,
                'cost_price' => 800.00,
                'inventory' => 10,
                'low_stock_threshold' => 2,
                'track_inventory' => true,
                'category_id' => $exteriorAccessories->parent_id,
                'subcategory_id' => $exteriorAccessories->id,
                'sub_subcategory_id' => $categories->where('slug', 'body-kits')->first()?->id,
                'images' => ['/assets/images/product/10.jpg'],
                'featured_image' => '/assets/images/product/10.jpg',

                'weight' => 15.0,
                'dimensions' => ['width' => 100, 'height' => 50, 'depth' => 20],
                'is_active' => true,
                'is_featured' => true,
                'meta_title' => 'Carbon Fiber Body Kit',
                'meta_description' => 'Premium carbon fiber body kit for sport cars',
            ],
            [
                'name_en' => 'Sport Spoiler',
                'name_ar' => 'مقابض رياضية',
                'slug' => 'sport-spoiler',
                'description_en' => 'High-performance sport spoiler for enhanced aerodynamics.',
                'description_ar' => 'مقابض رياضية عالية الأداء لتحسين الديناميكية.',
                'sku' => 'SP-EXT-SL-002',
                'price' => 350.00,
                'sale_price' => 320.00,
                'cost_price' => 250.00,
                'inventory' => 20,
                'low_stock_threshold' => 5,
                'track_inventory' => true,
                'category_id' => $exteriorAccessories->parent_id,
                'subcategory_id' => $exteriorAccessories->id,
                'sub_subcategory_id' => $categories->where('slug', 'spoilers')->first()?->id,
                'images' => ['/assets/images/product/11.jpg'],
                'featured_image' => '/assets/images/product/11.jpg',

                'weight' => 5.0,
                'dimensions' => ['width' => 80, 'height' => 20, 'depth' => 10],
                'is_active' => true,
                'is_featured' => true,
                'meta_title' => 'Sport Spoiler',
                'meta_description' => 'High-performance sport spoiler for enhanced aerodynamics',
            ],
        ];

        // Performance Parts Products
        $performanceProducts = [
            [
                'name_en' => 'Exhaust System',
                'name_ar' => 'نظام العادم',
                'slug' => 'exhaust-system',
                'description_en' => 'High-performance exhaust system for enhanced engine performance.',
                'description_ar' => 'نظام عادم عالي الأداء لتحسين أداء المحرك.',
                'sku' => 'SP-PER-EX-001',
                'price' => 800.00,
                'sale_price' => 750.00,
                'cost_price' => 600.00,
                'inventory' => 15,
                'low_stock_threshold' => 3,
                'track_inventory' => true,
                'category_id' => $performanceParts->parent_id,
                'subcategory_id' => $performanceParts->id,
                'sub_subcategory_id' => $categories->where('slug', 'exhaust-systems')->first()?->id,
                'images' => ['/assets/images/product/12.jpg'],
                'featured_image' => '/assets/images/product/12.jpg',

                'weight' => 20.0,
                'dimensions' => ['width' => 50, 'height' => 30, 'depth' => 20],
                'is_active' => true,
                'is_featured' => true,
                'meta_title' => 'Performance Exhaust System',
                'meta_description' => 'High-performance exhaust system for enhanced engine performance',
            ],
            [
                'name_en' => 'Engine Performance Kit',
                'name_ar' => 'حزمة تحسين المحرك',
                'slug' => 'engine-performance-kit',
                'description_en' => 'Complete engine performance upgrade kit.',
                'description_ar' => 'حزمة تحسين المحرك الكاملة.',
                'sku' => 'SP-PER-EP-002',
                'price' => 1500.00,
                'sale_price' => 1400.00,
                'cost_price' => 1000.00,
                'inventory' => 10,
                'low_stock_threshold' => 2,
                'track_inventory' => true,
                'category_id' => $performanceParts->parent_id,
                'subcategory_id' => $performanceParts->id,
                'sub_subcategory_id' => $categories->where('slug', 'engine-upgrades')->first()?->id,
                'images' => ['/assets/images/product/13.jpg'],
                'featured_image' => '/assets/images/product/13.jpg',

                'weight' => 30.0,
                'dimensions' => ['width' => 60, 'height' => 40, 'depth' => 30],
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'Engine Performance Kit',
                'meta_description' => 'Complete engine performance upgrade kit',
            ],
        ];

        // Create all products
        $allProducts = array_merge(
            $engineProducts,
            $brakeProducts,
            $suspensionProducts,
            $interiorProducts,
            $exteriorProducts,
            $performanceProducts
        );

        foreach ($allProducts as $product) {
            Product::create($product);
        }

        $this->command->info(count($allProducts) . ' products seeded successfully.');
    }
}
