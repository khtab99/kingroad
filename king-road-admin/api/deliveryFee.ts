import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import {
  endpoints,
  kingRoadCreatorForm,
  kingRoadFetcher,
  kingRoadSmasher,
  kingRoadUpdatePut,
} from "@/util/axios";
// utils

// types

// ----------------------------------------------------------------------

export function useGetDeliveryFeesList({ page, per_page, search }: any = {}) {
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};

    if (page) params.page = page;
    if (per_page) params.per_page = per_page;
    if (search) params.search = search;

    return params;
  }, [page, per_page, search]);

  const fullUrl = useMemo(
    () => `${endpoints.deliveryFees.list}?${new URLSearchParams(queryParams)}`,
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

  const revalidateDeliveryFees = () => {
    mutate(fullUrl);
  };

  // Memoize the return value for performance
  const memoizedValue = useMemo(() => {
    const deliveryFeesData = data?.data || [];
    return {
      deliveryFeesList: deliveryFeesData,
      deliveryFeesLoading: isLoading,
      deliveryFeesError: error,
      deliveryFeesValidating: isValidating,
      deliveryFeesEmpty: deliveryFeesData.length === 0,
      totalPages: data?.data?.meta?.total || 0,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return {
    ...memoizedValue,
    revalidateDeliveryFees,
  };
}

export function createNewDeliveryFees(body: any) {
  const URL = endpoints.deliveryFees.create;
  const response = kingRoadCreatorForm([URL, body]);
  return response;
}
export function updateDeliveryFees(body: any, id: any) {
  const URL = endpoints.deliveryFees.update + id;
  const response = kingRoadUpdatePut([URL, body]);

  return response;
}

export function deleteDeliveryFees(id: any) {
  const URL = endpoints.deliveryFees.delete + id;
  const response = kingRoadSmasher(URL);
  return response;
}
