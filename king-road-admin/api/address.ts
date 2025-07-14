import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import {
  endpoints,
  kingRoadCreator,
  kingRoadFetcher,
  kingRoadUpdatePut,
  kingRoadSmasher,
} from "@/util/axios";

// Types
export interface Address {
  id: string;
  user_id: string;
  type: "house" | "apartment" | "office";
  street: string;
  house_number?: string;
  building_number?: string;
  floor?: string;
  apartment_number?: string;
  office_number?: string;
  additional_description?: string;
  city: string;
  country: string;
  is_default: boolean;
  formatted_address: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressData {
  type: "house" | "apartment" | "office";
  street: string;
  house_number?: string;
  building_number?: string;
  floor?: string;
  apartment_number?: string;
  office_number?: string;
  additional_description?: string;
  city?: string;
  country?: string;
  is_default?: boolean;
}

export interface AddressResponse {
  data: Address[];
}

// Hook for fetching user addresses
export function useGetAddresses() {
  const { data, error, isLoading, isValidating } = useSWR(
    endpoints.address.list,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  const revalidateAddresses = () => {
    mutate(endpoints.address.list);
    mutate(endpoints.address.default);
  };

  const memoizedValue = useMemo(() => {
    const addressData = data?.data || [];
    return {
      addresses: addressData,
      addressesLoading: isLoading,
      addressesError: error,
      addressesValidating: isValidating,
      addressesEmpty: addressData.length === 0,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return {
    ...memoizedValue,
    revalidateAddresses,
  };
}

// Hook for fetching default address
export function useGetDefaultAddress() {
  const { data, error, isLoading } = useSWR(
    endpoints.address.default,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
      errorRetryCount: 2,
    }
  );

  const memoizedValue = useMemo(() => {
    return {
      defaultAddress: data?.data || null,
      defaultAddressLoading: isLoading,
      defaultAddressError: error,
    };
  }, [data?.data, error, isLoading]);

  return memoizedValue;
}

// Hook for fetching single address
export function useGetAddressById(id: string | null) {
  const URL = id ? `${endpoints.address.details}${id}` : null;

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

  const revalidateAddress = () => {
    if (URL) mutate(URL);
  };

  const memoizedValue = useMemo(
    () => ({
      address: data?.data || null,
      addressLoading: isLoading,
      addressError: error,
      addressValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return { ...memoizedValue, revalidateAddress };
}

// Create new address
export async function createAddress(data: CreateAddressData) {
  try {
    const response = await kingRoadCreator([endpoints.address.create, data]);

    // Revalidate address data
    mutate(endpoints.address.list);
    mutate(endpoints.address.default);

    return response;
  } catch (error: any) {
    console.error("Create address failed:", error);
    throw error?.response?.data || error?.message || error;
  }
}

// Update address
export async function updateAddress(id: string, data: any) {
  try {
    const response = await kingRoadUpdatePut([
      `${endpoints.address.update}${id}`,
      data,
    ]);

    // Revalidate address data
    mutate(endpoints.address.list);
    mutate(endpoints.address.default);
    mutate(`${endpoints.address.details}${id}`);

    return response;
  } catch (error) {
    throw error;
  }
}

// Delete address
export async function deleteAddress(id: string) {
  try {
    const response = await kingRoadSmasher(`${endpoints.address.delete}${id}`);

    // Revalidate address data
    mutate(endpoints.address.list);
    mutate(endpoints.address.default);

    return response;
  } catch (error) {
    throw error;
  }
}

// Set address as default
export async function setDefaultAddress(id: string) {
  try {
    const response = await kingRoadCreator([
      `${endpoints.address.setDefault}${id}/set-default`,
      {},
    ]);

    // Revalidate address data
    mutate(endpoints.address.list);
    mutate(endpoints.address.default);

    return response;
  } catch (error: any) {
    console.error("Set default address failed:", error);
    throw error?.response?.data || error?.message || error;
  }
}

// Hook for address actions
export function useAddressActions() {
  const createNewAddress = async (data: CreateAddressData) => {
    return createAddress(data);
  };

  const updateExistingAddress = async (
    id: string,
    data: Partial<CreateAddressData>
  ) => {
    return updateAddress(id, data);
  };

  const deleteExistingAddress = async (id: string) => {
    return deleteAddress(id);
  };

  const setAsDefault = async (id: string) => {
    return setDefaultAddress(id);
  };

  return {
    createNewAddress,
    updateExistingAddress,
    deleteExistingAddress,
    setAsDefault,
  };
}
