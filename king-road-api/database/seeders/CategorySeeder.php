<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // First level categories (Grandparents)
        $category1 = Category::create([
            'name_en' => 'Category 1',
            'name_ar' => 'التصنيف 1',
            'slug' => 'category-1',
            'sort_order' => 1,
        ]);

        $category2 = Category::create([
            'name_en' => 'Category 2',
            'name_ar' => 'التصنيف 2',
            'slug' => 'category-2',
            'sort_order' => 2,
        ]);

        // Second level categories (Children of Category 1)
        $sub1_1 = Category::create([
            'name_en' => 'Subcategory 1.1',
            'name_ar' => 'الفئة الفرعية 1.1',
            'slug' => 'subcategory-1-1',
            'parent_id' => $category1->id,
            'sort_order' => 1,
        ]);

        $sub1_2 = Category::create([
            'name_en' => 'Subcategory 1.2',
            'name_ar' => 'الفئة الفرعية 1.2',
            'slug' => 'subcategory-1-2',
            'parent_id' => $category1->id,
            'sort_order' => 2,
        ]);

        $sub1_3 = Category::create([
            'name_en' => 'Subcategory 1.3',
            'name_ar' => 'الفئة الفرعية 1.3',
            'slug' => 'subcategory-1-3',
            'parent_id' => $category1->id,
            'sort_order' => 3,
        ]);

        // Second level categories (Children of Category 2)
        $sub2_1 = Category::create([
            'name_en' => 'Subcategory 2.1',
            'name_ar' => 'الفئة الفرعية 2.1',
            'slug' => 'subcategory-2-1',
            'parent_id' => $category2->id,
            'sort_order' => 1,
        ]);

        $sub2_2 = Category::create([
            'name_en' => 'Subcategory 2.2',
            'name_ar' => 'الفئة الفرعية 2.2',
            'slug' => 'subcategory-2-2',
            'parent_id' => $category2->id,
            'sort_order' => 2,
        ]);

        $sub2_3 = Category::create([
            'name_en' => 'Subcategory 2.3',
            'name_ar' => 'الفئة الفرعية 2.3',
            'slug' => 'subcategory-2-3',
            'parent_id' => $category2->id,
            'sort_order' => 3,
        ]);

        // Third level categories (Children of Subcategory 1.1)
        Category::create([
            'name_en' => 'Subcategory 1.1.1',
            'name_ar' => 'الفئة الفرعية 1.1.1',
            'slug' => 'subcategory-1-1-1',
            'parent_id' => $sub1_1->id,
            'sort_order' => 1,
        ]);

        Category::create([
            'name_en' => 'Subcategory 1.1.2',
            'name_ar' => 'الفئة الفرعية 1.1.2',
            'slug' => 'subcategory-1-1-2',
            'parent_id' => $sub1_1->id,
            'sort_order' => 2,
        ]);

        Category::create([
            'name_en' => 'Subcategory 1.1.3',
            'name_ar' => 'الفئة الفرعية 1.1.3',
            'slug' => 'subcategory-1-1-3',
            'parent_id' => $sub1_1->id,
            'sort_order' => 3,
        ]);

        // Third level categories (Children of Subcategory 1.2)
        Category::create([
            'name_en' => 'Subcategory 1.2.1',
            'name_ar' => 'الفئة الفرعية 1.2.1',
            'slug' => 'subcategory-1-2-1',
            'parent_id' => $sub1_2->id,
            'sort_order' => 1,
        ]);

        Category::create([
            'name_en' => 'Subcategory 1.2.2',
            'name_ar' => 'الفئة الفرعية 1.2.2',
            'slug' => 'subcategory-1-2-2',
            'parent_id' => $sub1_2->id,
            'sort_order' => 2,
        ]);

        Category::create([
            'name_en' => 'Subcategory 1.2.3',
            'name_ar' => 'الفئة الفرعية 1.2.3',
            'slug' => 'subcategory-1-2-3',
            'parent_id' => $sub1_2->id,
            'sort_order' => 3,
        ]);

        // Third level categories (Children of Subcategory 1.3)
        Category::create([
            'name_en' => 'Subcategory 1.3.1',
            'name_ar' => 'الفئة الفرعية 1.3.1',
            'slug' => 'subcategory-1-3-1',
            'parent_id' => $sub1_3->id,
            'sort_order' => 1,
        ]);

        Category::create([
            'name_en' => 'Subcategory 1.3.2',
            'name_ar' => 'الفئة الفرعية 1.3.2',
            'slug' => 'subcategory-1-3-2',
            'parent_id' => $sub1_3->id,
            'sort_order' => 2,
        ]);

        Category::create([
            'name_en' => 'Subcategory 1.3.3',
            'name_ar' => 'الفئة الفرعية 1.3.3',
            'slug' => 'subcategory-1-3-3',
            'parent_id' => $sub1_3->id,
            'sort_order' => 3,
        ]);

        // Third level categories (Children of Subcategory 2.1)
        Category::create([
            'name_en' => 'Subcategory 2.1.1',
            'name_ar' => 'الفئة الفرعية 2.1.1',
            'slug' => 'subcategory-2-1-1',
            'parent_id' => $sub2_1->id,
            'sort_order' => 1,
        ]);

        Category::create([
            'name_en' => 'Subcategory 2.1.2',
            'name_ar' => 'الفئة الفرعية 2.1.2',
            'slug' => 'subcategory-2-1-2',
            'parent_id' => $sub2_1->id,
            'sort_order' => 2,
        ]);

        Category::create([
            'name_en' => 'Subcategory 2.1.3',
            'name_ar' => 'الفئة الفرعية 2.1.3',
            'slug' => 'subcategory-2-1-3',
            'parent_id' => $sub2_1->id,
            'sort_order' => 3,
        ]);

        // Third level categories (Children of Subcategory 2.2)
        Category::create([
            'name_en' => 'Subcategory 2.2.1',
            'name_ar' => 'الفئة الفرعية 2.2.1',
            'slug' => 'subcategory-2-2-1',
            'parent_id' => $sub2_2->id,
            'sort_order' => 1,
        ]);

        Category::create([
            'name_en' => 'Subcategory 2.2.2',
            'name_ar' => 'الفئة الفرعية 2.2.2',
            'slug' => 'subcategory-2-2-2',
            'parent_id' => $sub2_2->id,
            'sort_order' => 2,
        ]);

        Category::create([
            'name_en' => 'Subcategory 2.2.3',
            'name_ar' => 'الفئة الفرعية 2.2.3',
            'slug' => 'subcategory-2-2-3',
            'parent_id' => $sub2_2->id,
            'sort_order' => 3,
        ]);

        // Third level categories (Children of Subcategory 2.3)
        Category::create([
            'name_en' => 'Subcategory 2.3.1',
            'name_ar' => 'الفئة الفرعية 2.3.1',
            'slug' => 'subcategory-2-3-1',
            'parent_id' => $sub2_3->id,
            'sort_order' => 1,
        ]);

        Category::create([
            'name_en' => 'Subcategory 2.3.2',
            'name_ar' => 'الفئة الفرعية 2.3.2',
            'slug' => 'subcategory-2-3-2',
            'parent_id' => $sub2_3->id,
            'sort_order' => 2,
        ]);

        Category::create([
            'name_en' => 'Subcategory 2.3.3',
            'name_ar' => 'الفئة الفرعية 2.3.3',
            'slug' => 'subcategory-2-3-3',
            'parent_id' => $sub2_3->id,
            'sort_order' => 3,
        ]);
    }
}