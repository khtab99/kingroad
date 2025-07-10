"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface VendorUser {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  businessName: string
  businessType: string
  joinedDate: string
  isVerified: boolean
  status: 'active' | 'pending' | 'suspended'
}

interface VendorAuthContextType {
  user: VendorUser | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  businessName: string
  businessType: string
}

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined)

export function VendorAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<VendorUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('kora-vendor-user')
    const savedToken = localStorage.getItem('kora-vendor-token')
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error loading vendor user from localStorage:', error)
        localStorage.removeItem('kora-vendor-user')
        localStorage.removeItem('kora-vendor-token')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful login
      const mockUser: VendorUser = {
        id: 1,
        name: 'Ahmed Al-Rashid',
        email: email,
        phone: '+971 50 123 4567',
        avatar: 'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=100',
        businessName: 'Khartoum Crafts',
        businessType: 'Traditional Crafts',
        joinedDate: '2022-03-15',
        isVerified: true,
        status: 'active'
      }
      
      const mockToken = 'mock-vendor-jwt-token-' + Date.now()
      
      setUser(mockUser)
      localStorage.setItem('kora-vendor-user', JSON.stringify(mockUser))
      localStorage.setItem('kora-vendor-token', mockToken)
      
      toast.success('Login successful!')
      return true
    } catch (error) {
      toast.error('Login failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock successful registration
      const mockUser: VendorUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        businessName: userData.businessName,
        businessType: userData.businessType,
        joinedDate: new Date().toISOString().split('T')[0],
        isVerified: false,
        status: 'pending'
      }
      
      const mockToken = 'mock-vendor-jwt-token-' + Date.now()
      
      setUser(mockUser)
      localStorage.setItem('kora-vendor-user', JSON.stringify(mockUser))
      localStorage.setItem('kora-vendor-token', mockToken)
      
      toast.success('Registration successful! Your account is pending verification.')
      return true
    } catch (error) {
      toast.error('Registration failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('kora-vendor-user')
    localStorage.removeItem('kora-vendor-token')
    toast.success('Logged out successfully')
  }

  const isAuthenticated = !!user

  return (
    <VendorAuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      isAuthenticated
    }}>
      {children}
    </VendorAuthContext.Provider>
  )
}

export function useVendorAuth() {
  const context = useContext(VendorAuthContext)
  if (context === undefined) {
    throw new Error('useVendorAuth must be used within a VendorAuthProvider')
  }
  return context
}