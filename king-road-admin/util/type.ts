export interface ProductFormData {
  name_en: string;
  name_ar: string;
  slug?: string;
  description_en: string;
  description_ar: string;
  sku: string;
  barcode?: string;
  price: string;
  sale_price?: string;
  cost_price?: string;
  inventory: string;
  low_stock_threshold: string;
  track_inventory: boolean;
  category_id: string;
  subcategory_id?: string;
  images: File[];
  weight?: string;
  dimensions: {
    length?: string;
    width?: string;
    height?: string;
  };
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
}

export interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  subcategories?: Category[];
}
