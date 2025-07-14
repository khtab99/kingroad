# King Road Spare Parts Store - Complete Admin Management Guide

## Table of Contents
1. [Overview](#overview)
2. [Admin System Architecture](#admin-system-architecture)
3. [Setting Up Admin Panel](#setting-up-admin-panel)
4. [Database Management](#database-management)
5. [Product Management](#product-management)
6. [Order Management](#order-management)
7. [User Management](#user-management)
8. [Inventory Management](#inventory-management)
9. [Analytics & Reports](#analytics--reports)
10. [Security Implementation](#security-implementation)
11. [Deployment & Maintenance](#deployment--maintenance)
12. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides comprehensive instructions for creating and managing an admin system for the King Road spare parts e-commerce store. The admin panel will allow you to manage products, orders, customers, inventory, and analytics.

### Current Store Features
- Bilingual support (Arabic/English)
- Product catalog with categories
- Shopping cart functionality
- Checkout process with address validation
- User registration and login
- Responsive design

---

## Admin System Architecture

### Recommended Tech Stack
- **Frontend**: Next.js with TypeScript (current)
- **Backend**: Next.js API Routes or Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js or Auth0
- **File Storage**: AWS S3 or Cloudinary
- **Analytics**: Google Analytics + Custom Dashboard

### Admin Panel Structure
```
/admin
├── /dashboard          # Main overview
├── /products          # Product management
├── /orders            # Order management
├── /customers         # Customer management
├── /inventory         # Stock management
├── /analytics         # Reports & analytics
├── /settings          # System settings
└── /users             # Admin user management
```

---

## Setting Up Admin Panel

### Step 1: Create Admin Routes

Create the following file structure:

```typescript
// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Step 2: Admin Authentication

```typescript
// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('adminToken', token);
        router.push('/admin/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Admin Email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          />
          <Input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Admin Dashboard

```typescript
// app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue} AED</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add recent orders table here */}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Database Management

### Step 1: Database Schema

Create a comprehensive database schema using Prisma:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      AdminRole @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  phone     String?
  name      String
  password  String
  country   String   @default("United Arab Emirates")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
}

model Product {
  id          String   @id @default(cuid())
  nameEn      String
  nameAr      String
  price       Float
  image       String
  category    String
  subcategory String
  inventory   Int      @default(0)
  isAvailable Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orderItems  OrderItem[]
}

model Order {
  id              String      @id @default(cuid())
  userId          String?
  customerName    String
  customerPhone   String
  customerEmail   String?
  addressType     String
  street          String
  houseNumber     String?
  buildingNumber  String?
  floor           String?
  apartmentNumber String?
  officeNumber    String?
  additionalDesc  String?
  subtotal        Float
  deliveryFee     Float
  total           Float
  status          OrderStatus @default(PENDING)
  paymentMethod   String?
  paymentStatus   PaymentStatus @default(PENDING)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  user            User?       @relation(fields: [userId], references: [id])
  items           OrderItem[]
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Float
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
  MODERATOR
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

### Step 2: Database Setup Commands

```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with initial data
npx prisma db seed
```

### Step 3: Database Seeding

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create super admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.admin.create({
    data: {
      email: 'admin@kingroad.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  });

  // Seed products from existing JSON
  const products = [
    {
      nameEn: "Dashboard Shell 88-97 Gray New",
      nameAr: "قشرة طبلون 88-97 لون رمادي جديد",
      price: 980.0,
      image: "/assets/images/product/1.jpg",
      category: "internal",
      subcategory: "dashboard",
      inventory: 5,
    },
    // Add more products...
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## Product Management

### Step 1: Product List Page

```typescript
// app/admin/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductModal } from "@/components/admin/ProductModal";
import { Plus, Search } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
        });
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nameAr.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ProductTable
        products={filteredProducts}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={fetchProducts}
      />
    </div>
  );
}
```

### Step 2: Product API Routes

```typescript
// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const product = await prisma.product.create({ data });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
```

---

## Order Management

### Step 1: Order List Page

```typescript
// app/admin/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { OrderTable } from "@/components/admin/OrderTable";
import { OrderStatusFilter } from "@/components/admin/OrderStatusFilter";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const filteredOrders = statusFilter === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      
      <OrderStatusFilter
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <OrderTable
        orders={filteredOrders}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
```

### Step 2: Order API Routes

```typescript
// app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
```

---

## User Management

### Customer Management System

```typescript
// app/admin/customers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { CustomerTable } from "@/components/admin/CustomerTable";
import { CustomerStats } from "@/components/admin/CustomerStats";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newThisMonth: 0,
    activeCustomers: 0,
  });

  useEffect(() => {
    fetchCustomers();
    fetchCustomerStats();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const fetchCustomerStats = async () => {
    try {
      const response = await fetch('/api/admin/customers/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch customer stats:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>
      
      <CustomerStats stats={stats} />
      
      <CustomerTable customers={customers} />
    </div>
  );
}
```

---

## Inventory Management

### Stock Management System

```typescript
// app/admin/inventory/page.tsx
"use client";

import { useState, useEffect } from "react";
import { InventoryTable } from "@/components/admin/InventoryTable";
import { LowStockAlert } from "@/components/admin/LowStockAlert";
import { StockUpdateModal } from "@/components/admin/StockUpdateModal";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchInventory();
    fetchLowStockItems();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/admin/inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  const fetchLowStockItems = async () => {
    try {
      const response = await fetch('/api/admin/inventory/low-stock');
      const data = await response.json();
      setLowStockItems(data);
    } catch (error) {
      console.error('Failed to fetch low stock items:', error);
    }
  };

  const handleStockUpdate = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      
      {lowStockItems.length > 0 && (
        <LowStockAlert items={lowStockItems} />
      )}
      
      <InventoryTable
        inventory={inventory}
        onStockUpdate={handleStockUpdate}
      />

      <StockUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        product={selectedProduct}
        onUpdate={fetchInventory}
      />
    </div>
  );
}
```

---

## Analytics & Reports

### Analytics Dashboard

```typescript
// app/admin/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";
import { SalesChart } from "@/components/admin/SalesChart";
import { ProductPerformance } from "@/components/admin/ProductPerformance";
import { CustomerAnalytics } from "@/components/admin/CustomerAnalytics";

export default function AnalyticsPage() {
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [salesRes, productRes, customerRes] = await Promise.all([
        fetch('/api/admin/analytics/sales'),
        fetch('/api/admin/analytics/products'),
        fetch('/api/admin/analytics/customers'),
      ]);

      const [sales, products, customers] = await Promise.all([
        salesRes.json(),
        productRes.json(),
        customerRes.json(),
      ]);

      setSalesData(sales);
      setProductData(products);
      setCustomerData(customers);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics & Reports</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SalesChart data={salesData} />
        <ProductPerformance data={productData} />
      </div>
      
      <CustomerAnalytics data={customerData} />
    </div>
  );
}
```

---

## Security Implementation

### Step 1: Authentication Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
}

export const config = {
  matcher: '/admin/:path*',
};
```

### Step 2: Role-Based Access Control

```typescript
// utils/auth.ts
export const checkAdminRole = (userRole: string, requiredRole: string) => {
  const roleHierarchy = {
    'SUPER_ADMIN': 3,
    'ADMIN': 2,
    'MODERATOR': 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};
```

---

## Deployment & Maintenance

### Step 1: Environment Variables

```env
# .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/kingroad"
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET="your-s3-bucket"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Step 2: Production Deployment

```bash
# Build the application
npm run build

# Start production server
npm start

# Or deploy to Vercel
npx vercel --prod
```

### Step 3: Database Backup

```bash
# Create backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Schedule daily backups with cron
0 2 * * * /path/to/backup-script.sh
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check DATABASE_URL format
   - Verify database server is running
   - Check firewall settings

2. **Authentication Problems**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear browser localStorage

3. **File Upload Issues**
   - Check AWS credentials
   - Verify S3 bucket permissions
   - Check file size limits

4. **Performance Issues**
   - Add database indexes
   - Implement caching
   - Optimize queries

### Monitoring & Logs

```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data);
  },
};
```

---

## Quick Start Checklist

### Initial Setup
- [ ] Set up database (PostgreSQL)
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Seed initial admin user
- [ ] Test admin login

### Admin Panel Features
- [ ] Dashboard with statistics
- [ ] Product management (CRUD)
- [ ] Order management
- [ ] Customer management
- [ ] Inventory tracking
- [ ] Analytics dashboard

### Security
- [ ] Implement authentication
- [ ] Set up role-based access
- [ ] Configure HTTPS
- [ ] Set up backup system

### Production
- [ ] Deploy to production server
- [ ] Configure monitoring
- [ ] Set up automated backups
- [ ] Test all functionality

---

## Support & Maintenance

### Regular Tasks
1. **Daily**: Check order status, inventory levels
2. **Weekly**: Review analytics, customer feedback
3. **Monthly**: Database backup verification, security updates
4. **Quarterly**: Performance optimization, feature updates

### Contact Information
- **Technical Support**: admin@kingroad.com
- **Emergency Contact**: +971-XXX-XXXX

---

*This document should be kept updated as the system evolves. Last updated: [Current Date]*