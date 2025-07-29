<?php

namespace Database\Seeders;

use App\Models\Slider;
use Illuminate\Database\Seeder;


class SliderSeeder extends Seeder
{
    public function run(): void
    {
        Slider::create([
               'title_en' => 'Car Spare Parts',
                'title_ar' => 'قطع غيار السيارات',
                'description_en' => 'Premium original spare parts for Nissan Patrol in Umm Al Quwain. High quality and competitive prices.',
                'description_ar' => 'أفضل قطع الغيار الأصلية لسيارات نيسان باترول في أم القيوين. جودة عالية وأسعار منافسة.',
                'image' => '/assets/images/hero/1.jpg',
                'status' => 'active',
        ]);

        Slider::create([
                'title_en' => 'Trusted Service',
                'title_ar' => 'خدمة موثوقة',
                'description_en' => '20 years of experience providing the best original spare parts with quality guarantee and fast delivery.',
                'description_ar' => '20 عاماً من الخبرة في توفير أفضل قطع الغيار الأصلية مع ضمان الجودة والتوصيل السريع.',
                'image' => '/assets/images/hero/2.jpg',
                'status' => 'active',
        ]);
        Slider::create([
                'title_en' => 'Fast Delivery',
                'title_ar' => 'توصيل سريع',
                'description_en' => 'Get the spare parts you need as quickly as possible with free delivery service in Umm Al Quwain.',
                'description_ar' => 'احصل على قطع الغيار التي تحتاجها في أسرع وقت ممكن مع خدمة التوصيل المجاني داخل أم القيوين.',
                'image' => '/assets/images/hero/3.jpg',
                'status' => 'active',
        ]);
    }
}

