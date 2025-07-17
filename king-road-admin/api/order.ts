import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import {
  endpoints,
  kingRoadCreator,
  kingRoadCreatorForm,
  kingRoadFetcher,
  kingRoadSmasher,
  kingRoadUpdatePatch,
  kingRoadUpdatePut,
} from "@/util/axios";
import axios from "axios";
// utils

// types

// ----------------------------------------------------------------------

type Filters = Record<string, string | number | undefined>;

export function useGetOrderList(filters: any) {
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.append(key, value.toString());
      }
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

export function updateOrder(id: any, body: any) {
  const URL = endpoints.order.update + id;
  const response = kingRoadUpdatePut([URL, body]);
  return response;
}
export function updateOrderStatus(id: any, body: any) {
  const URL = `${endpoints.order.updateStatus}${id}/update-status`;
  const response = kingRoadCreator([URL, body]);
  return response;
}
export function addOrderTracking(id: any, body: any) {
  const URL = `${endpoints.order.updateStatus}${id}/add-tracking`;
  const response = kingRoadCreator([URL, body]);
  return response;
}

// Send notification
export const sendOrderNotification = async (
  id: number,
  data: { type: string; message: string }
) => {
  const response = await axios.post(
    `/v1/admin/orders/${id}/send-notification`,
    data
  );
  return response.data;
};

// Generate invoice
export const generateOrderInvoice = async (id: number) => {
  const response = await axios.get(`/v1/admin/orders/${id}/invoice`);
  return response.data;
};

// Export orders
export const exportOrders = async (data: {
  format: string;
  date_from?: string;
  date_to?: string;
  status?: string;
}) => {
  const response = await axios.get("/v1/admin/orders/export", { params: data });
  return response.data;
};
