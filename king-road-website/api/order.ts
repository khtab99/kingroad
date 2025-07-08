import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import {
  endpoints,
  kingRoadCreator,
  kingRoadFetcher,
  kingRoadSmasher,
  kingRoadUpdatePatch,
} from "@/util/axios";
// utils

// types
export interface CreateOrderData {
  // Address - either use existing address or provide new address data
  address_id?: string;
  
  // New address data (required if address_id not provided)
  customer_phone: string;
  address_type?: 'house' | 'apartment' | 'office';
  street?: string;
  house_number?: string;
  building_number?: string;
  floor?: string;
  apartment_number?: string;
  office_number?: string;
  additional_description?: string;
  city?: string;
  country?: string;
  
  // Order details
  delivery_fee?: number;
  payment_method?: string;
  customer_notes?: string;
  
  // Save address option
  save_address?: boolean;
}

// ----------------------------------------------------------------------

export function useGetOrderList({ page, per_page, search }: any = {}) {
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};

    if (page) params.page = page;
    if (per_page) params.per_page = per_page;
    if (search) params.search = search;

    return params;
  }, [page, per_page, search]);

  const fullUrl = useMemo(
    () => `${endpoints.order.list}?${new URLSearchParams(queryParams)}`,
    [queryParams]
  );

  const { data, error, isLoading, isValidating } = useSWR(
    fullUrl,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const revalidateOrder = () => {
    mutate(fullUrl);
  };

  // Memoize the return value for performance
  const memoizedValue = useMemo(() => {
    const orderData = data?.data?.data || [];
    return {
      orderList: orderData,
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
      orderEmpty: orderData.length === 0,
      totalPages: data?.data?.meta?.total || 0,
    };
  }, [
    data?.data?.data,
    data?.data?.meta?.total,
    error,
    isLoading,
    isValidating,
  ]);

  return {
    ...memoizedValue,
    revalidateOrder,
  };
}

export function useGetOrderById(id: any) {
  const URL = endpoints.order.details + id;
  const { data, isLoading, error, isValidating } = useSWR(URL, kingRoadFetcher);

  const revalidateOrder = () => {
    mutate(URL);
  };

  const memoizedValue = useMemo(
    () => ({
      order: data?.data as any,
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return { ...memoizedValue, revalidateOrder };
}

export function createNewOrder(body: any) {
  const URL = endpoints.order.create;
  const response = kingRoadCreator([URL, body]);
  return response;
}

export function updateOrderStatus(id: any, body: any) {
  const URL = endpoints.order.update + id;
  const response = kingRoadUpdatePatch([URL, body]);
  return response;
}

export function deleteOrderStatus(id: any) {
  const URL = endpoints.order.delete + id;
  const response = kingRoadSmasher(URL);
  return response;
}
