import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import { endpoints, kingRoadFetcher } from "@/util/axios";
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

    // Pagination
    if (filters.page) params.page = filters.page;
    if (filters.per_page) params.per_page = filters.per_page;

    // Search
    if (filters.search) params.search = filters.search;

    // 3-Level Category Hierarchy Filters
    if (filters.category_id) {
      params["filter[category_id]"] = filters.category_id;
    }
    if (filters.subcategory_id) {
      params["filter[subcategory_id]"] = filters.subcategory_id;
    }
    if (filters.subSubcategory_id) {
      params["filter[subSubcategory_id]"] = filters.subSubcategory_id;
    }

    // Price filters
    if (filters.price_range) {
      params["filter[price_range]"] = filters.price_range;
    }
    if (filters.min_price !== undefined) {
      params["filter[min_price]"] = filters.min_price;
    }
    if (filters.max_price !== undefined) {
      params["filter[max_price]"] = filters.max_price;
    }

    // Boolean filters
    if (filters.is_featured !== undefined) {
      params["filter[is_featured]"] = filters.is_featured ? "1" : "0";
    }
    if (filters.is_on_sale !== undefined) {
      params["filter[is_on_sale]"] = filters.is_on_sale ? "1" : "0";
    }
    if (filters.in_stock !== undefined) {
      params["filter[in_stock]"] = filters.in_stock ? "1" : "0";
    }

    // Additional filters
    if (filters.brand_id) {
      params["filter[brand_id]"] = filters.brand_id;
    }
    if (filters.rating_min) {
      params["filter[rating_min]"] = filters.rating_min;
    }
    if (filters.tags && filters.tags.length > 0) {
      params["filter[tags]"] = filters.tags.join(",");
    }

    // Sorting
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

// Enhanced hook for fetching products by category with 3-level support
export function useGetProductsByCategory(
  categoryId: string,
  additionalFilters: Partial<ProductFilters> = {}
) {
  const productFilters = useMemo(() => {
    // Determine which level this categoryId represents
    // This is a flexible approach - you can also pass level info explicitly
    const filters: ProductFilters = { ...additionalFilters };

    // If categoryId is "all", don't add any category filter

    // You can enhance this logic based on your category structure
    // For now, we'll use the most specific filter provided
    if (additionalFilters.subSubcategory_id) {
      filters.subSubcategory_id = additionalFilters.subSubcategory_id;
    } else if (additionalFilters.subcategory_id) {
      filters.subcategory_id = additionalFilters.subcategory_id;
    } else {
      filters.category_id = categoryId;
    }

    return filters;
  }, [categoryId, additionalFilters]);

  return useGetAllProducts(productFilters);
}

// New specialized hooks for each category level
export function useGetProductsBySuperCategory(
  superCategoryId: string,
  additionalFilters: Partial<ProductFilters> = {}
) {
  const filters = useMemo(
    () => ({
      ...additionalFilters,
      category_id: superCategoryId,
    }),
    [superCategoryId, additionalFilters]
  );

  return useGetAllProducts(filters);
}

export function useGetProductsBySubcategory(
  subcategoryId: string,
  additionalFilters: Partial<ProductFilters> = {}
) {
  const filters = useMemo(
    () => ({
      ...additionalFilters,
      subcategory_id: subcategoryId,
    }),
    [subcategoryId, additionalFilters]
  );

  return useGetAllProducts(filters);
}

export function useGetProductsBySubSubcategory(
  subSubcategoryId: string,
  additionalFilters: Partial<ProductFilters> = {}
) {
  const filters = useMemo(
    () => ({
      ...additionalFilters,
      subSubcategory_id: subSubcategoryId,
    }),
    [subSubcategoryId, additionalFilters]
  );

  return useGetAllProducts(filters);
}

// Flexible hook that can handle any combination of category levels
export function useGetProductsByHierarchy({
  superCategoryId,
  categoryId,
  subCategoryId,
  additionalFilters = {},
}: {
  superCategoryId?: string;
  categoryId?: string;
  subCategoryId?: string;
  additionalFilters?: Partial<ProductFilters>;
}) {
  const filters = useMemo(() => {
    const hierarchyFilters: ProductFilters = { ...additionalFilters };

    // Apply the most specific category level available
    if (subCategoryId && subCategoryId !== "all") {
      hierarchyFilters.subSubcategory_id = subCategoryId;
    } else if (categoryId && categoryId !== "all") {
      hierarchyFilters.subcategory_id = categoryId;
    } else if (superCategoryId && superCategoryId !== "all") {
      hierarchyFilters.category_id = superCategoryId;
    }

    return hierarchyFilters;
  }, [superCategoryId, categoryId, subCategoryId, additionalFilters]);

  return useGetAllProducts(filters);
}

// Hook for fetching single product by ID
export function useGetProductById(id: string | null) {
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
      product: data?.data as Product | null,
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
