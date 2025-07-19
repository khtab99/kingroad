import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import {
  endpoints,
  kingRoadCreatorForm,
  kingRoadFetcher,
  kingRoadSmasher,
  kingRoadUpdatePatch,
  kingRoadUpdatePut,
} from "@/util/axios";
import { Product, ProductFilters } from "@/util/type";

// Types

export interface ProductResponse {
  data: Product[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

// Hook for fetching all products with filters
export function useGetAllProducts(filters: ProductFilters = {}) {
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};

    if (filters.page) params.page = filters.page;
    if (filters.per_page) params.per_page = filters.per_page;
    if (filters.search) params.search = filters.search;
    if (filters.category_id && filters.category_id !== "all") {
      params["filter[category_id]"] = filters.category_id;
    }
    if (filters.subcategory_id && filters.subcategory_id !== "all") {
      params["filter[subcategory_id]"] = filters.subcategory_id;
    }
    if (filters.sub_subcategory_id) {
      params["filter[sub_subcategory_id]"] = filters.sub_subcategory_id;
    }
    if (filters.price_range) {
      params["filter[price_range]"] = filters.price_range;
    }
    if (filters.is_featured !== undefined) {
      params["filter[is_featured]"] = filters.is_featured ? "1" : "0";
    }
    if (filters.is_on_sale !== undefined) {
      params["filter[is_on_sale]"] = filters.is_on_sale ? "1" : "0";
    }
    if (filters.in_stock !== undefined) {
      params["filter[in_stock]"] = filters.in_stock ? "1" : "0";
    }
    if (filters.sort) {
      params.sort = filters.sort;
    }

    return params;
  }, [filters]);

  const fullUrl = useMemo(
    () => `${endpoints.product.all}?${new URLSearchParams(queryParams)}`,
    [queryParams]
  );

  const { data, error, isLoading, isValidating } = useSWR(
    fullUrl,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // Cache for 30 seconds
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  const revalidateProducts = () => {
    mutate(fullUrl);
  };

  const memoizedValue = useMemo(() => {
    const productData = data?.data || [];
    const metaData = data?.meta || {};

    return {
      productList: productData,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
      productEmpty: productData.length === 0,
      // Pagination data
      totalProducts: metaData.total || 0,
      currentPage: metaData.current_page || 1,
      lastPage: metaData.last_page || 1,
      perPage: metaData.per_page || 15,
      from: metaData.from || 0,
      to: metaData.to || 0,
      // Links
      links: data?.links || {},
    };
  }, [data?.data, data?.meta, data?.links, error, isLoading, isValidating]);

  return {
    ...memoizedValue,
    revalidateProducts,
  };
}

// Hook for fetching products by category
export function useGetProductsByCategory(
  categoryId: string,
  filters: Omit<ProductFilters, "category_id"> = {}
) {
  const productFilters = useMemo(
    () => ({
      ...filters,
      category_id: categoryId,
    }),
    [categoryId, filters]
  );

  return useGetAllProducts(productFilters);
}

// Hook for fetching single product by ID
export function useGetProductById(id: any) {
  const URL = id ? `${endpoints.product.details}${id}` : null;

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

  const revalidateProduct = () => {
    if (URL) mutate(URL);
  };

  const memoizedValue = useMemo(
    () => ({
      productDetails: data?.data,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return { ...memoizedValue, revalidateProduct };
}

// Hook for fetching featured products
export function useGetFeaturedProducts(limit: number = 8) {
  const filters = useMemo(
    () => ({
      is_featured: true,
      per_page: limit,
      sort: "-created_at",
    }),
    [limit]
  );

  const { productList, productLoading, productError, revalidateProducts } =
    useGetAllProducts(filters);

  return {
    featuredProducts: productList,
    featuredProductsLoading: productLoading,
    featuredProductsError: productError,
    revalidateFeaturedProducts: revalidateProducts,
  };
}

// Hook for fetching products on sale
export function useGetSaleProducts(limit: number = 8) {
  const filters = useMemo(
    () => ({
      is_on_sale: true,
      per_page: limit,
      sort: "-discount_percentage",
    }),
    [limit]
  );

  const { productList, productLoading, productError, revalidateProducts } =
    useGetAllProducts(filters);

  return {
    saleProducts: productList,
    saleProductsLoading: productLoading,
    saleProductsError: productError,
    revalidateSaleProducts: revalidateProducts,
  };
}

// Hook for searching products
export function useSearchProducts(
  searchTerm: string,
  filters: Omit<ProductFilters, "search"> = {}
) {
  const searchFilters = useMemo(
    () => ({
      ...filters,
      search: searchTerm,
    }),
    [searchTerm, filters]
  );

  // Only fetch if search term is provided
  const shouldFetch = searchTerm.trim().length > 0;

  const {
    productList,
    productLoading,
    productError,
    revalidateProducts,
    ...rest
  } = useGetAllProducts(shouldFetch ? searchFilters : {});

  return {
    searchResults: shouldFetch ? productList : [],
    searchLoading: shouldFetch ? productLoading : false,
    searchError: shouldFetch ? productError : null,
    revalidateSearch: revalidateProducts,
    ...rest,
  };
}

// Hook for incrementing product views
export function useIncrementProductViews() {
  const incrementViews = async (productId: string) => {
    try {
      await kingRoadFetcher(
        `${endpoints.product.details}${productId}/increment-views`
      );

      // Revalidate the product data
      mutate(`${endpoints.product.details}${productId}`);
    } catch (error) {
      console.error("Failed to increment product views:", error);
    }
  };

  return { incrementViews };
}

export function createNewProduct(body: any) {
  const URL = endpoints.product.create;
  const response = kingRoadCreatorForm([URL, body]);
  return response;
}
export function updateProduct(body: any, id: any) {
  const URL = endpoints.product.update + id;
  const response = kingRoadUpdatePut([URL, body]);
  return response;
}

export function deleteProduct(id: any) {
  const URL = endpoints.product.delete + id;
  const response = kingRoadSmasher(URL);
  return response;
}
