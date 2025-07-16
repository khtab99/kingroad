export interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  name: string;
  slug: string;
  description_en?: string;
  description_ar?: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  sale_price?: number;
  current_price: number;
  cost_price?: number;
  inventory: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  category?: Category;
  subcategory?: Category;
  images?: string[];
  featured_image?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  is_active: boolean;
  is_featured: boolean;
  is_on_sale: boolean;
  is_in_stock: boolean;
  is_low_stock: boolean;
  discount_percentage: number;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  views: number;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  total_sold?: number;
}

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  name: string;
  slug: string;
}

export interface ProductFilters {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  subcategory_id?: string;
  price_range?: string; // "min,max"
  is_featured?: boolean;
  is_on_sale?: boolean;
  in_stock?: boolean;
  sort?: string; // "price", "-price", "name", "-name", "created_at", "-created_at"
}
