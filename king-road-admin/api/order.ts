import axios from '@/util/axios';

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

// Get all orders with filters
export const getOrders = async (filters: OrderFilters = {}) => {
  const response = await axios.get('/v1/admin/orders', { params: filters });
  return response.data;
};

// Get order by ID
export const useGetOrderById = async (id: number): Promise<Order> => {
  const response = await axios.get(`/v1/admin/orders/${id}`);
  return response.data.data;
};

// Update order
export const updateOrder = async (id: number, data: UpdateOrderData) => {
  const response = await axios.put(`/v1/admin/orders/${id}`, data);
  return response.data;
};

// Update order status
export const updateOrderStatus = async (id: number, data: UpdateOrderStatusData) => {
  const response = await axios.post(`/v1/admin/orders/${id}/update-status`, data);
  return response.data;
};

// Add order tracking
export const addOrderTracking = async (id: number, data: AddOrderTrackingData) => {
  const response = await axios.post(`/v1/admin/orders/${id}/add-tracking`, data);
  return response.data;
};

// Send notification
export const sendOrderNotification = async (id: number, data: { type: string; message: string }) => {
  const response = await axios.post(`/v1/admin/orders/${id}/send-notification`, data);
  return response.data;
};

// Generate invoice
export const generateOrderInvoice = async (id: number) => {
  const response = await axios.get(`/v1/admin/orders/${id}/invoice`);
  return response.data;
};

// Export orders
export const exportOrders = async (data: { format: string; date_from?: string; date_to?: string; status?: string }) => {
  const response = await axios.get('/v1/admin/orders/export', { params: data });
  return response.data;
};