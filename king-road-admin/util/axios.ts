import axios, { AxiosRequestConfig } from "axios";

import { getToken } from "./storage";
import { create } from "node:domain";

// ----------------------------------------------------------------------

const HOST_API = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    "Accept-Language": "en", // Default to 'en', can be changed to 'ar'
    "Content-Type": "application/json",
    Accept: "application/json",
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

  return res.data;
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
    all: "/api/v1/admin/products",
    details: "/api/v1/admin/products/",
    create: "/api/v1/admin/products",
    update: "/api/v1/admin/products/",
    delete: "/api/v1/admin/products/",
  },
  category: {
    all: "/api/v1/admin/categories",
    details: "/api/v1/admin/categories/",
    products: "/api/v1/admin/categories/", // For category products: /api/v1/admin/categories/{id}/products
    create: "/api/v1/admin/categories",
    update: "/api/v1/admin/categories/",
    delete: "/api/v1/admin/categories/",
  },

  address: {
    list: "/api/v1/admin/addresses",
    create: "/api/v1/admin/addresses",
    details: "/api/v1/admin/addresses/",
    update: "/api/v1/admin/addresses/",
    delete: "/api/v1/admin/addresses/",
    default: "/api/v1/admin/addresses/default",
    setDefault: "/api/v1/admin/addresses/", // + {id}/set-default
  },
  order: {
    list: "/api/v1/admin/orders",
    details: "/api/v1/admin/orders/",
    update: "/api/v1/admin/orders/",
    updateStatus: "/api/v1/admin/orders/",
  },
  auth: {
    login: "/api/v1/admin/auth/login",
    register: "/api/v1/admin/auth/register",
    logout: "/api/v1/admin/user/logout",
    profile: "/api/v1/admin/user/profile",
    refresh: "/api/v1/admin/auth/refresh",
  },
  statistics: {
    all: "api/v1/admin/dashboard/stats",
    recentOrders: "api/v1/admin/dashboard/recent-orders",
    topProducts: "api/v1/admin/dashboard/top-products",
  },
  cart: {
    list: "/api/v1/admin/carts",
    count: "/api/v1/admin/carts/count",
    total: "/api/v1/admin/carts/total",
    add: "/api/v1/admin/carts",
    remove: "/api/v1/admin/carts",
    update: "/api/v1/admin/carts",
    clear: "/api/v1/admin/carts",
    transferGuest: "/api/v1/admin/carts/transfer-guest",
  },
  customer: {
    all: "/api/v1/admin/customers",
    details: "/api/v1/admin/customers/",
    create: "/api/v1/admin/customers",
    update: "/api/v1/admin/customers/",
    delete: "/api/v1/admin/customers/",
  },
  slider: {
    list: "/api/v1/admin/sliders",
    details: "/api/v1/admin/sliders/",
    create: "/api/v1/admin/sliders",
    update: "/api/v1/admin/sliders/",
    delete: "/api/v1/admin/sliders/",
  },
  deliveryFees: {
    list: "/api/v1/admin/delivery_fees",
    details: "/api/v1/admin/delivery_fees/",
    create: "/api/v1/admin/delivery_fees",
    update: "/api/v1/admin/delivery_fees/",
    delete: "/api/v1/admin/delivery_fees/",
  },
};
