import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import { endpoints, kingRoadFetcher } from "@/util/axios";
// utils

// types

// ----------------------------------------------------------------------

export function useGetDeliveryFeeList({ page, per_page, search }: any = {}) {
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};

    if (page) params.page = page;
    if (per_page) params.per_page = per_page;
    if (search) params.search = search;

    return params;
  }, [page, per_page, search]);

  const fullUrl = useMemo(
    () => `${endpoints.deliveryFee.list}?${new URLSearchParams(queryParams)}`,
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

  const revalidatedeliveryFee = () => {
    mutate(fullUrl);
  };

  // Memoize the return value for performance
  const memoizedValue = useMemo(() => {
    const deliveryFeeData = data?.data || [];
    return {
      deliveryFeeList: deliveryFeeData,
      deliveryFeeLoading: isLoading,
      deliveryFeeError: error,
      deliveryFeeValidating: isValidating,
      deliveryFeeEmpty: deliveryFeeData.length === 0,
      totalPages: data?.data?.meta?.total || 0,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return {
    ...memoizedValue,
    revalidatedeliveryFee,
  };
}
