import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import {
  endpoints,
  kingRoadCreatorForm,
  kingRoadFetcher,
  kingRoadSmasher,
  kingRoadUpdatePatch,
} from "@/util/axios";
// utils

// types

// ----------------------------------------------------------------------

export function useGetOrderList({ page, per_page, search, phone }: any = {}) {
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};

    if (page) params.page = page;
    if (per_page) params.per_page = per_page;
    if (search) params.search = search;
    if (phone) params.phone = phone;

    return params;
  }, [page, per_page, search, phone]);

  const fullUrl = useMemo(
    () => `${endpoints.order.list}?${new URLSearchParams(queryParams)}`,
    [queryParams]
  );

  const { data, error, isLoading, isValidating } = useSWR(
    fullUrl,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 7000,
    }
  );

  const revalidateOrder = () => {
    mutate(fullUrl);
  };

  // Memoize the return value for performance
  const memoizedValue = useMemo(() => {
    const orderData = data?.data || [];
    return {
      orderList: orderData,
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
      orderEmpty: orderData.length === 0,
      totalPages: data?.data?.meta?.total || 0,
    };
  }, [data?.data, error, isLoading, isValidating]);

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
  const response = kingRoadCreatorForm([URL, body]);
  return response;
}
export function lookupOrder(body: any) {
  const URL = endpoints.order.lookup;
  const response = kingRoadCreatorForm([URL, body]);
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
