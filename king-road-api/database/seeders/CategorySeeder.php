<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name_en' => 'Car Spare Parts',
                'name_ar' => 'قطع غيار السيارات',
                'children' => [
                    [
                        'name_en' => 'Engine Parts',
                        'name_ar' => 'أجزاء المحرك',
                        'children' => [
                            [
                                'name_en' => 'Filters',
                                'name_ar' => 'الفلاتر',
                            ],
                            [
                                'name_en' => 'Spark Plugs',
                                'name_ar' => 'شمعات الإشعال',
                            ],
                        ],
                    ],
                    [
                        'name_en' => 'Brake System',
                        'name_ar' => 'نظام الفرامل',
                        'children' => [
                            [
                                'name_en' => 'Brake Pads',
                                'name_ar' => 'دواسات الفرامل',
                            ],
                            [
                                'name_en' => 'Brake Discs',
                                'name_ar' => 'أقراص الفرامل',
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $this->seedCategories($categories);

        $this->command->info('Car spare part categories seeded.');
    }

    private function seedCategories(array $categories, $parentId = null)
    {
        foreach ($categories as $categoryData) {
            $slug = Str::slug($categoryData['name_en']);

            $category = Category::create([
                'name_en' => $categoryData['name_en'],
                'name_ar' => $categoryData['name_ar'],
                'slug' => $slug,
                'parent_id' => $parentId,
            ]);

            if (!empty($categoryData['children'])) {
                $this->seedCategories($categoryData['children'], $category->id);
            }
        }
    }
}
