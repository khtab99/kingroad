import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import {
  endpoints,
  kingRoadCreator,
  kingRoadCreatorForm,
  kingRoadFetcher,
} from "@/util/axios";
import {
  setToken,
  deleteToken,
  setUserData,
  deleteUserData,
} from "@/util/storage";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  language?: string;
  is_active: boolean;
  marketing_opt_in?: boolean;
  last_login_at?: string;
  email_verified_at?: string;
  created_at: string;
  total_orders?: number;
  total_spent?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  password_confirmation: string;
  marketing_opt_in?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
  guest_cart_transferred?: boolean;
}

// Hook for getting current user
export function useAuth() {
  const { data, error, isLoading, isValidating } = useSWR(
    endpoints.auth.profile,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
      errorRetryCount: 1,
      shouldRetryOnError: false,
    }
  );

  const revalidateAuth = () => {
    mutate(endpoints.auth.profile);
  };

  const memoizedValue = useMemo(() => {
    const user = data?.data || null;
    return {
      user,
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      isAuthenticated: !!user && !error,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return {
    ...memoizedValue,
    revalidateAuth,
  };
}

// Login function
export async function login(credentials: any) {
  const response = await kingRoadCreatorForm([
    endpoints.auth.login,
    credentials,
  ]);

  return response;
}

// Register function
export async function register(data: any) {
  const response = await kingRoadCreatorForm([endpoints.auth.register, data]);

  return response;
}

// Logout function
export async function logout(): Promise<void> {
  try {
    await kingRoadCreator([endpoints.auth.logout, {}]);
  } catch (error) {
    console.error("Logout API call failed:", error);
  } finally {
    // Always clear local storage regardless of API call success
    deleteToken();
    deleteUserData();

    // Clear all cached data
    mutate(() => true, undefined, { revalidate: false });
  }
}

// Refresh token function
export async function refreshToken(): Promise<string> {
  try {
    const response = await kingRoadCreator([endpoints.auth.refresh, {}]);

    if (response?.data?.token) {
      setToken(response.data.token);
      return response.data.token;
    }

    throw new Error("Failed to refresh token");
  } catch (error: any) {
    console.error("Token refresh failed:", error);
    // If refresh fails, logout user
    await logout();
    throw error;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  return !!(token && user);
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
}
