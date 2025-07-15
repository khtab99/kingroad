import { endpoints, kingRoadFetcher } from "@/util/axios";
import { useMemo } from "react";
import useSWR, { mutate } from "swr";

export function useGetStatistics() {
  const URL = `${endpoints.statistics.all}`;

  const { data, isLoading, error, isValidating } = useSWR(
    URL,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  const revalidateStatistics = () => {
    if (URL) mutate(URL);
  };

  const memoizedValue = useMemo(
    () => ({
      statistics: data?.stats,
      statisticsLoading: isLoading,
      statisticsError: error,
      statisticsValidating: isValidating,
    }),
    [data?.stats, error, isLoading, isValidating]
  );

  return { ...memoizedValue, revalidateStatistics };
}
export function useGetRecentOrders() {
  const URL = `${endpoints.statistics.recentOrders}`;

  const { data, isLoading, error, isValidating } = useSWR(
    URL,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  const revalidateRecentOrders = () => {
    if (URL) mutate(URL);
  };

  const memoizedValue = useMemo(
    () => ({
      recentOrders: data?.data,
      recentOrdersLoading: isLoading,
      recentOrdersError: error,
      recentOrdersValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return { ...memoizedValue, revalidateRecentOrders };
}
export function useGetTopProducts() {
  const URL = `${endpoints.statistics.topProducts}`;

  const { data, isLoading, error, isValidating } = useSWR(
    URL,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  const revalidateTopProducts = () => {
    if (URL) mutate(URL);
  };

  const memoizedValue = useMemo(
    () => ({
      topProducts: data?.data || [],
      topProductsLoading: isLoading,
      topProductsError: error,
      topProductsValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return { ...memoizedValue, revalidateTopProducts };
}
