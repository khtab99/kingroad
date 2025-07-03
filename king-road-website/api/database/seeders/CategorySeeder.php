<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Main categories
        $external = Category::create([
            'name_en' => 'External',
            'name_ar' => 'خارجيه',
            'slug' => 'external',
            'description_en' => 'External car parts and accessories',
            'description_ar' => 'قطع غيار خارجية وملحقات السيارة',
            'sort_order' => 1,
        ]);

        $internal = Category::create([
            'name_en' => 'Internal',
            'name_ar' => 'داخليه',
            'slug' => 'internal',
            'description_en' => 'Internal car parts and accessories',
            'description_ar' => 'قطع غيار داخلية وملحقات السيارة',
            'sort_order' => 2,
        ]);

        $airConditioning = Category::create([
            'name_en' => 'Air Conditioning',
            'name_ar' => 'جوض المكيفه',
            'slug' => 'air-conditioning',
            'description_en' => 'Air conditioning parts and components',
            'description_ar' => 'قطع غيار ومكونات المكيف',
            'sort_order' => 3,
        ]);

        $accessories = Category::create([
            'name_en' => 'Accessories',
            'name_ar' => 'ملحقات',
            'slug' => 'accessories',
            'description_en' => 'Car accessories and add-ons',
            'description_ar' => 'ملحقات وإضافات السيارة',
            'sort_order' => 4,
        ]);

        // Subcategories for External
        Category::create([
            'name_en' => 'Bumpers',
            'name_ar' => 'مصدات',
            'slug' => 'bumpers',
            'parent_id' => $external->id,
            'sort_order' => 1,
        ]);

        Category::create([
            'name_en' => 'Lights',
            'name_ar' => 'أضواء',
            'slug' => 'lights',
            'parent_id' => $external->id,
            'sort_order' => 2,
        ]);

        Category::create([
            'name_en' => 'Mirrors',
            'name_ar' => 'مرايا',
            'slug' => 'mirrors',
            'parent_id' => $external->id,
            'sort_order' => 3,
        ]);

        // Subcategories for Internal
        Category::create([
            'name_en' => 'Dashboard',
            'name_ar' => 'لوحة القيادة',
            'slug' => 'dashboard',
            'parent_id' => $internal->id,
            'sort_order' => 1,
        ]);

        Category::create([
            'name_en' => 'Seats',
            'name_ar' => 'مقاعد',
            'slug' => 'seats',
            'parent_id' => $internal->id,
            'sort_order' => 2,
        ]);

        Category::create([
            'name_en' => 'Door Panels',
            'name_ar' => 'ألواح الأبواب',
            'slug' => 'door-panels',
            'parent_id' => $internal->id,
            'sort_order' => 3,
        ]);

        // Subcategories for Air Conditioning
        Category::create([
            'name_en' => 'Compressor',
            'name_ar' => 'ضاغط',
            'slug' => 'compressor',
            'parent_id' => $airConditioning->id,
            'sort_order' => 1,
        ]);

        Category::create([
            'name_en' => 'Filters',
            'name_ar' => 'فلاتر',
            'slug' => 'filters',
            'parent_id' => $airConditioning->id,
            'sort_order' => 2,
        ]);

        // Subcategories for Accessories
        Category::create([
            'name_en' => 'Floor Mats',
            'name_ar' => 'سجاد أرضية',
            'slug' => 'floor-mats',
            'parent_id' => $accessories->id,
            'sort_order' => 1,
        ]);

        Category::create([
            'name_en' => 'Covers',
            'name_ar' => 'أغطية',
            'slug' => 'covers',
            'parent_id' => $accessories->id,
            'sort_order' => 2,
        ]);
    }
}