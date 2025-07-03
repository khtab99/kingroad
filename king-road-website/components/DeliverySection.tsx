'use client';

import { useStore } from '@/store/useStore';
import translations from '@/data/translations.json';

export function DeliverySection() {
  const { language } = useStore();
  const t = translations[language];
  
  return (
    <section className="bg-white py-6 md:py-8 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
          {t.delivery.title}
        </h2>
        
        <div className="mt-2 text-sm text-gray-500">
          {language === 'ar' ? 'وقت التوصيل: 2 يوم' : 'Delivery time: 2 days'}
        </div>
      </div>
    </section>
  );
}