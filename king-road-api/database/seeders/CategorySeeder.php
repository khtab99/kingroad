<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Create root categories
        $categories = [
            [
                'name_en' => 'Car Spare Parts',
                'name_ar' => 'قطع غيار السيارات',
                'slug' => 'car-spare-parts',
                'description_en' => 'Original and compatible car spare parts',
                'description_ar' => 'قطع غيار السيارات الأصلية والتوافقية',
                'image' => '/assets/images/category/category-1.jpg',
                'sort_order' => 1,
                'is_active' => true,
                'meta_data' => [
                    'title' => 'Car Spare Parts',
                    'description' => 'Shop original and compatible car spare parts',
                ],
            ],
            [
                'name_en' => 'Car Accessories',
                'name_ar' => 'ملحقات السيارات',
                'slug' => 'car-accessories',
                'description_en' => 'High-quality car accessories and modifications',
                'description_ar' => 'ملحقات السيارات عالية الجودة والتعديلات',
                'image' => '/assets/images/category/category-2.jpg',
                'sort_order' => 2,
                'is_active' => true,
                'meta_data' => [
                    'title' => 'Car Accessories',
                    'description' => 'Shop high-quality car accessories',
                ],
            ],
        ];

        foreach ($categories as $category) {
            $parent = Category::create($category);

            // Create subcategories for Car Spare Parts
            if ($parent->slug === 'car-spare-parts') {
                $subcategories = [
                    [
                        'name_en' => 'Engine Parts',
                        'name_ar' => 'قطع المحرك',
                        'slug' => 'engine-parts',
                        'description_en' => 'Engine components and parts',
                        'description_ar' => 'قطع و مكونات المحرك',
                        'image' => '/assets/images/category/category-1.jpg',
                        'sort_order' => 1,
                        'parent_id' => $parent->id,
                        'is_active' => true,
                        'meta_data' => [
                            'title' => 'Engine Parts',
                            'description' => 'Shop engine components and parts',
                        ],
                    ],
                    [
                        'name_en' => 'Brake System',
                        'name_ar' => 'نظام الفرامل',
                        'slug' => 'brake-system',
                        'description_en' => 'Brake components and parts',
                        'description_ar' => 'قطع و مكونات الفرامل',
                'image' => '/assets/images/category/category-1.jpg',
                        'sort_order' => 2,
                        'parent_id' => $parent->id,
                        'is_active' => true,
                        'meta_data' => [
                            'title' => 'Brake System',
                            'description' => 'Shop brake system components',
                        ],
                    ],
                    [
                        'name_en' => 'Suspension System',
                        'name_ar' => 'نظام التعليق',
                        'slug' => 'suspension-system',
                        'description_en' => 'Suspension components and parts',
                        'description_ar' => 'قطع و مكونات التعليق',
                                'image' => '/assets/images/category/category-1.jpg',
                        'sort_order' => 3,
                        'parent_id' => $parent->id,
                        'is_active' => true,
                        'meta_data' => [
                            'title' => 'Suspension System',
                            'description' => 'Shop suspension system components',
                        ],
                    ],
                ];

                foreach ($subcategories as $subcategory) {
                    $subcat = Category::create($subcategory);

                    // Create sub-subcategories for Engine Parts
                    if ($subcat->slug === 'engine-parts') {
                        $sub_subcategories = [
                            [
                                'name_en' => 'Filters',
                                'name_ar' => 'فلاتر',
                                'slug' => 'filters',
                                'description_en' => 'Oil, air, and fuel filters',
                                'description_ar' => 'فلاتر الزيت والهواء والوقود',
                                     'image' => '/assets/images/category/category-1.jpg',
                                'sort_order' => 1,
                                'parent_id' => $subcat->id,
                                'is_active' => true,
                                'meta_data' => [
                                    'title' => 'Filters',
                                    'description' => 'Shop engine filters',
                                ],
                            ],
                            [
                                'name_en' => 'Spark Plugs',
                                'name_ar' => 'بوجيهات',
                                'slug' => 'spark-plugs',
                                'description_en' => 'High-performance spark plugs',
                                'description_ar' => 'بوجيهات عالية الأداء',
                                        'image' => '/assets/images/category/category-1.jpg',
                                'sort_order' => 2,
                                'parent_id' => $subcat->id,
                                'is_active' => true,
                                'meta_data' => [
                                    'title' => 'Spark Plugs',
                                    'description' => 'Shop spark plugs',
                                ],
                            ],
                        ];

                        foreach ($sub_subcategories as $sub_subcategory) {
                            Category::create($sub_subcategory);
                        }
                    }
                }
            }

            // Create subcategories for Car Accessories
            if ($parent->slug === 'car-accessories') {
                $subcategories = [
                    [
                        'name_en' => 'Interior Accessories',
                        'name_ar' => 'ملحقات داخلية',
                        'slug' => 'interior-accessories',
                        'description_en' => 'Interior car accessories',
                        'description_ar' => 'ملحقات داخل السيارة',
                         'image' => '/assets/images/category/category-1.jpg',
                        'sort_order' => 1,
                        'parent_id' => $parent->id,
                        'is_active' => true,
                        'meta_data' => [
                            'title' => 'Interior Accessories',
                            'description' => 'Shop interior car accessories',
                        ],
                    ],
                    [
                        'name_en' => 'Exterior Accessories',
                        'name_ar' => 'ملحقات خارجية',
                        'slug' => 'exterior-accessories',
                        'description_en' => 'Exterior car accessories',
                        'description_ar' => 'ملحقات خارج السيارة',
                               'image' => '/assets/images/category/category-1.jpg',
                        'sort_order' => 2,
                        'parent_id' => $parent->id,
                        'is_active' => true,
                        'meta_data' => [
                            'title' => 'Exterior Accessories',
                            'description' => 'Shop exterior car accessories',
                        ],
                    ],
                    [
                        'name_en' => 'Performance Parts',
                        'name_ar' => 'قطع الأداء',
                        'slug' => 'performance-parts',
                        'description_en' => 'Performance enhancing parts',
                        'description_ar' => 'قطع تحسين الأداء',
                   'image' => '/assets/images/category/category-1.jpg',
                        'sort_order' => 3,
                        'parent_id' => $parent->id,
                        'is_active' => true,
                        'meta_data' => [
                            'title' => 'Performance Parts',
                            'description' => 'Shop performance enhancing parts',
                        ],
                    ],
                ];

                foreach ($subcategories as $subcategory) {
                    $subcat = Category::create($subcategory);

                    // Create sub-subcategories for Interior Accessories
                    if ($subcat->slug === 'interior-accessories') {
                        $sub_subcategories = [
                            [
                                'name_en' => 'Seat Covers',
                                'name_ar' => 'غطاء المقاعد',
                                'slug' => 'seat-covers',
                                'description_en' => 'Protective seat covers',
                                'description_ar' => 'غطاء حماية المقاعد',
                                'image' => '/assets/images/categories/seat-covers.jpg',
                                'sort_order' => 1,
                                'parent_id' => $subcat->id,
                                'is_active' => true,
                                'meta_data' => [
                                    'title' => 'Seat Covers',
                                    'description' => 'Shop seat covers',
                                ],
                            ],
                            [
                                'name_en' => 'Floor Mats',
                                'name_ar' => 'سجاد السيارة',
                                'slug' => 'floor-mats',
                                'description_en' => 'Protective floor mats',
                                'description_ar' => 'سجاد حماية السيارة',
                                        'image' => '/assets/images/category/category-1.jpg',
                                'sort_order' => 2,
                                'parent_id' => $subcat->id,
                                'is_active' => true,
                                'meta_data' => [
                                    'title' => 'Floor Mats',
                                    'description' => 'Shop floor mats',
                                ],
                            ],
                        ];

                        foreach ($sub_subcategories as $sub_subcategory) {
                            Category::create($sub_subcategory);
                        }
                    }
                }
            }
        }
    }
}
