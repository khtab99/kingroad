import axios, { AxiosRequestConfig } from "axios";

import { getToken } from "./storage";

// ----------------------------------------------------------------------

const HOST_API = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    "Accept-Language": "en", // Default to 'en', can be changed to 'ar'
  },
});

// Request interceptor to set the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const kingRoadSmasher = async (
  args: string | [string, AxiosRequestConfig]
) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.delete(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const kingRoadCreatorForm = async (args: string | [string, any]) => {
  const [url, data] = Array.isArray(args) ? args : [args];

  const config: AxiosRequestConfig = {
    headers:
      data instanceof FormData
        ? {
            "Content-Type": "multipart/form-data",
          }
        : {
            "Content-Type": "application/json",
          },
  };

  const res = await axiosInstance.post(url, data, config);
  return res.data;
};

export const kingRoadCreator = async (args: any) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.post(url, config);
};

export const kingRoadUpdatePatch = async (args: any) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.patch(url, config);
};
export const kingRoadUpdatePut = async (args: any) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.put(url, config);
};

// ----------------------------------------------------------------------

export const kingRoadCreatorPut = async (args: any) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.put(url, config);
  return res.data;
};

// ----------------------------------------------------------------------

export const kingRoadFetcher = async (args: any) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance?.get(url, { ...config });
  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  product: {
    all: "/api/v1/products",
    details: "/api/v1/products/",
  },
  category: {
    all: "/api/v1/categories",
    details: "/api/v1/categories/",
    products: "/api/v1/categories/", // For category products: /api/v1/categories/{id}/products
  },

  cart: {
    list: "/api/v1/cart",
    add: "/api/v1/cart/add",
    update: "/api/v1/cart/update",
    remove: "/api/v1/cart/remove",
    clear: "/api/v1/cart/clear",
    count: "/api/v1/cart/count",
    total: "/api/v1/cart/total",
    transferGuest: "/api/v1/cart/transfer-guest",
  },
  address: {
    list: "/api/v1/addresses",
    create: "/api/v1/addresses",
    details: "/api/v1/addresses/",
    update: "/api/v1/addresses/",
    delete: "/api/v1/addresses/",
    default: "/api/v1/addresses/default",
    setDefault: "/api/v1/addresses/", // + {id}/set-default
  },
  order: {
    list: "/api/v1/orders",
    details: "/api/v1/orders/",
    create: "/api/v1/orders",
    cancel: "/api/v1/orders/", // + {id}/cancel
    update: "/api/v1/orders/",
    delete: "/api/v1/orders/",
  },
  auth: {
    login: "/api/v1/auth/login",
    register: "/api/v1/auth/register",
    logout: "/api/v1/user/logout",
    profile: "/api/v1/user/profile",
    refresh: "/api/v1/auth/refresh",
  },
};
