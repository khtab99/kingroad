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
  sub_subcategory_id?: string;
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

export interface Category {
  id: any;
  name_en: string;
  name_ar: string;
  name: string;
  slug: string;
  subcategories?: Category[];
  children?: Category[];
}

export interface ProductFilters {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  subcategory_id?: string;
  sub_subcategory_id?: string;
  price_range?: string; // "min,max"
  is_featured?: boolean;
  is_on_sale?: boolean;
  in_stock?: boolean;
  sort?: string; // "price", "-price", "name", "-name", "created_at", "-created_at"
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  product_image: string;
  quantity: number;
  price: string;
  total: string;
  product: {
    id: number;
    name_en: string;
    name_ar: string;
    name: string;
    slug: string;
    description_en: string;
    description_ar: string;
    description: string;
    sku: string;
    barcode: string | null;
    price: string;
    sale_price: string | null;
    current_price: string;
    cost_price: string | null;
    inventory: number;
    low_stock_threshold: number;
    track_inventory: boolean;
    images: string[];
    featured_image: string;
    weight: number | null;
    dimensions: any;
    is_active: boolean;
    is_featured: boolean;
    is_on_sale: boolean;
    is_in_stock: boolean;
    is_low_stock: boolean;
    discount_percentage: number;
    tags: string[] | null;
    meta_title: string | null;
    meta_description: string | null;
    views: number;
    rating: string;
    reviews_count: number;
    created_at: string;
    updated_at: string;
  };
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  is_guest_order: boolean;
  address_type: string;
  formatted_address: string;
  address_details: {
    type: string;
    street: string;
    house_number: string | null;
    building_number: string | null;
    floor: string | null;
    apartment_number: string | null;
    office_number: string | null;
    additional_description: string | null;
    city: string;
    country: string;
  };
  subtotal: string;
  delivery_fee: string;
  discount: string;
  total: string;
  status: string;
  status_color: string;
  payment_method: string;
  payment_status: string;
  payment_status_color: string;
  payment_reference: string | null;
  shipping_method: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  customer_notes: string | null;
  internal_notes: string | null;
  items: OrderItem[];
  customer: any;
  created_at: string;
  updated_at: string;
}

export interface OrderFilters {
  status?: string[];
  payment_status?: string[];
  date_from?: string;
  date_to?: string;
  search?: string;
  per_page?: number;
  page?: number;
}

export interface UpdateOrderData {
  status?: string;
  payment_status?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  internal_notes?: string;
}

export interface UpdateOrderStatusData {
  status: string;
  notes?: string;
}

export interface AddOrderTrackingData {
  tracking_number: string;
  shipping_method?: string;
  estimated_delivery?: string;
}
