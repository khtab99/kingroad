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

  // 3-Level Category Hierarchy
  category_id?: string; // Super Category (Level 1)
  subcategory_id?: string; // Category (Level 2)
  subSubcategory_id?: string; // Sub Category (Level 3)

  // Other filters
  price_range?: string;
  is_featured?: boolean;
  is_on_sale?: boolean;
  in_stock?: boolean;
  sort?: string;

  // Additional filters for more flexibility
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  rating_min?: number;
  tags?: string[];
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  status: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  formatted_address: string;
  customer_notes?: string;
  created_at: string;
  tracking_number?: string;
  estimated_delivery?: string;
  items: Array<{
    id: number;
    product_name: string;
    product_sku: string;
    product_image?: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}
