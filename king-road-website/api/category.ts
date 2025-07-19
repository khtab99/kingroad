import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import { endpoints, kingRoadFetcher } from "@/util/axios";

// Types
export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  name: string;
  slug: string;
  description_en?: string;
  description_ar?: string;
  description?: string;
  image?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  meta_data?: any;
  parent?: Category;
  children?: Category[];
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryResponse {
  data: Category[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

// Hook for fetching all categories (super categories)
export function useGetSuperCategory({ page, per_page, search }: any = {}) {
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};

    if (page) params.page = page;
    if (per_page) params.per_page = per_page;
    if (search) params.search = search;

    return params;
  }, [page, per_page, search]);

  const fullUrl = useMemo(
    () => `${endpoints.category.all}?${new URLSearchParams(queryParams)}`,
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

  const revalidateSuperCategory = () => {
    mutate(fullUrl);
  };

  // Memoize the return value for performance
  const memoizedValue = useMemo(() => {
    const superCategoryData = data?.data || [];
    return {
      superCategoryList: superCategoryData,
      superCategoryLoading: isLoading,
      superCategoryError: error,
      superCategoryValidating: isValidating,
      superCategoryEmpty: superCategoryData.length === 0,
      totalPages: data?.meta?.total || 0,
      currentPage: data?.meta?.current_page || 1,
      lastPage: data?.meta?.last_page || 1,
    };
  }, [data?.data, data?.meta, error, isLoading, isValidating]);

  return {
    ...memoizedValue,
    revalidateSuperCategory,
  };
}

// Hook for fetching subcategories by parent category
export function useGetSubCategories(parentId: string | null) {
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (parentId) params.parent_id = parentId;
    return params;
  }, [parentId]);

  const fullUrl = useMemo(
    () =>
      parentId
        ? `${endpoints.category.all}?${new URLSearchParams(queryParams)}`
        : null,
    [queryParams, parentId]
  );

  const { data, error, isLoading, isValidating } = useSWR(
    fullUrl,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  const revalidateSubCategories = () => {
    if (fullUrl) mutate(fullUrl);
  };

  const memoizedValue = useMemo(() => {
    const subCategoryData = data?.data || [];
    return {
      subCategoryList: subCategoryData,
      subCategoryLoading: isLoading,
      subCategoryError: error,
      subCategoryValidating: isValidating,
      subCategoryEmpty: subCategoryData.length === 0,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return {
    ...memoizedValue,
    revalidateSubCategories,
  };
}

// Hook for fetching single category by ID
export function useGetCategoryById(id: any) {
  const URL = id ? `${endpoints.category.details}${id}` : null;

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

  const revalidateCategory = () => {
    if (URL) mutate(URL);
  };

  const memoizedValue = useMemo(
    () => ({
      categoryList: data?.data || [],
      categoryLoading: isLoading,
      categoryError: error,
      categoryValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return { ...memoizedValue, revalidateCategory };
}

// Hook for fetching category tree (hierarchical structure)
export function useGetCategoryTree() {
  const { data, error, isLoading, isValidating } = useSWR(
    `${endpoints.category.all}?include_children=true`,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  const revalidateCategoryTree = () => {
    mutate(`${endpoints.category.all}?include_children=true`);
  };

  const memoizedValue = useMemo(() => {
    const categoryTree = data?.data || [];
    return {
      categoryTree,
      categoryTreeLoading: isLoading,
      categoryError: error,
      categoryTreeValidating: isValidating,
      categoryTreeEmpty: categoryTree.length === 0,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return {
    ...memoizedValue,
    revalidateCategoryTree,
  };
}
