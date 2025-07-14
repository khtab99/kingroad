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

export function useGetOrderList(filters = {}) {
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") params.append(key, value);
    });

    return params.toString();
  }, [filters]);

  const fullUrl = useMemo(
    () => `${endpoints.order.list}?${queryParams}`,
    [queryParams]
  );

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    fullUrl,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const orderData = data?.data || [];

  return useMemo(
    () => ({
      orderList: orderData,
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
      orderEmpty: orderData.length === 0,
      totalPages: data?.data?.meta?.total || 0,
      revalidateOrder: () => mutate(),
    }),
    [orderData, isLoading, error, isValidating, data?.data?.meta?.total, mutate]
  );
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
