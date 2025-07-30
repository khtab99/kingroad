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

export function useGetSliderList({ page, per_page, search }: any = {}) {
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};

    if (page) params.page = page;
    if (per_page) params.per_page = per_page;
    if (search) params.search = search;

    return params;
  }, [page, per_page, search]);

  const fullUrl = useMemo(
    () => `${endpoints.slider.list}?${new URLSearchParams(queryParams)}`,
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

  const revalidateSlider = () => {
    mutate(fullUrl);
  };

  // Memoize the return value for performance
  const memoizedValue = useMemo(() => {
    const sliderData = data?.data || [];
    return {
      sliderList: sliderData,
      sliderLoading: isLoading,
      sliderError: error,
      sliderValidating: isValidating,
      sliderEmpty: sliderData.length === 0,
      totalPages: data?.data?.meta?.total || 0,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return {
    ...memoizedValue,
    revalidateSlider,
  };
}

export function createNewSlider(body: any) {
  const URL = endpoints.slider.create;
  const response = kingRoadCreatorForm([URL, body]);
  return response;
}
export function updateSlider(body: any, id: any) {
  const URL = endpoints.slider.update + id;
  const response = kingRoadUpdatePut([URL, body]);

  return response;
}

export function deleteSlider(id: any) {
  const URL = endpoints.slider.delete + id;
  const response = kingRoadSmasher(URL);
  return response;
}
