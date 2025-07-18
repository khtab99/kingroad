import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import {
  endpoints,
  kingRoadCreatorForm,
  kingRoadFetcher,
  kingRoadSmasher,
  kingRoadUpdatePut,
} from "@/util/axios";

// Hook for fetching all categories (super categories)
export function useGetCustomers({ page, per_page, search }: any = {}) {
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};

    if (page) params.page = page;
    if (per_page) params.per_page = per_page;
    if (search) params.search = search;

    return params;
  }, [page, per_page, search]);

  const fullUrl = useMemo(
    () => `${endpoints.customer.all}?${new URLSearchParams(queryParams)}`,
    [queryParams]
  );

  const { data, error, isLoading, isValidating } = useSWR(
    fullUrl,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  const revalidateCustomers = () => {
    mutate(fullUrl);
  };

  // Memoize the return value for performance
  const memoizedValue = useMemo(() => {
    const CustomersData = data?.data || [];
    return {
      customersList: CustomersData,
      customersLoading: isLoading,
      customersError: error,
      customersValidating: isValidating,
      customersEmpty: CustomersData.length === 0,
      totalPages: data?.meta?.total || 0,
      currentPage: data?.meta?.current_page || 1,
      lastPage: data?.meta?.last_page || 1,
    };
  }, [data?.data, data?.meta, error, isLoading, isValidating]);

  return {
    ...memoizedValue,
    revalidateCustomers,
  };
}

// Hook for fetching subcategories by parent Customers

// Hook for fetching single Customers by ID
export function useGetCustomersById(id: string | null) {
  const URL = id ? `${endpoints.customer.details}${id}` : null;

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

  const revalidateCustomers = () => {
    if (URL) mutate(URL);
  };

  const memoizedValue = useMemo(
    () => ({
      CustomersList: data?.data?.children || [],
      CustomersLoading: isLoading,
      CustomersError: error,
      CustomersValidating: isValidating,
    }),
    [data?.data?.children, error, isLoading, isValidating]
  );

  return { ...memoizedValue, revalidateCustomers };
}

export function createNewCustomers(body: any) {
  const URL = endpoints.customer.create;
  const response = kingRoadCreatorForm([URL, body]);
  return response;
}
export function updateCustomers(body: any, id: any) {
  const URL = endpoints.customer.update + id;
  const response = kingRoadUpdatePut([URL, body]);

  return response;
}

export function deleteCustomers(id: any) {
  const URL = endpoints.customer.delete + id;
  const response = kingRoadSmasher(URL);
  return response;
}
