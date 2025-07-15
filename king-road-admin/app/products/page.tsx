"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import { useGetAllProducts } from "@/api/product";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Product {
  id: number;
  name_en: string;
  name_ar: string;
  sku: string;
  price: number;
  inventory: number;
  is_active: boolean;
  category: {
    name_en: string;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  console.log(products);

  const [searchTerm, setSearchTerm] = useState("");

  const { productList, productLoading, productError, revalidateProducts } =
    useGetAllProducts();

  useEffect(() => {
    if (productList) {
      setProducts(productList);
    }
  }, [productList]);

  const filteredProducts = products.filter(
    (product) =>
      product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActivityColor = (status: boolean) => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case false:
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getInventoryColor = (status: number) => {
    switch (status) {
      case 0:
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case 1:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case 2:
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Products</h2>
            <p className="text-muted-foreground">
              Manage your product inventory
            </p>
          </div>
          <Link href="/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        <Card>
          {/* <CardHeader>
            <CardTitle>Product List</CardTitle>
            <CardDescription>
              A list of all products in your store
            </CardDescription>
          </CardHeader> */}
          <CardContent className="mt-10">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product: any) => {
                    const cleanImageUrl = product?.featured_image?.includes(
                      "assets/images/product/"
                    )
                      ? product.featured_image.replace(
                          "http://localhost:8000",
                          ""
                        )
                      : product?.featured_image ||
                        "/assets/images/product/1.jpg";
                    return (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>
                          <Avatar className="h-16 w-16 shadow-sm">
                            <AvatarImage
                              src={cleanImageUrl}
                              alt={product.name_en}
                            />
                            <AvatarFallback>
                              {product.name_en
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        {/* go to details page on click the name */}
                        <TableCell>
                          <Link
                            href={`/products/${product.id}`}
                            className="font-medium hover:underline text-primary"
                          >
                            {product.name_en}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {product.name_ar}
                          </p>
                        </TableCell>
                        <TableCell>{product.sku}</TableCell>

                        <TableCell>{product.category?.name_en}</TableCell>
                        <TableCell>AED {product.price}</TableCell>
                        <TableCell>
                          <div
                            className={`${getInventoryColor(
                              product.inventory
                            )} text-xs font-medium w-10 px-2 py-1 rounded-full border border-border/90 shadow-sm text-center`}
                          >
                            {product.inventory || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`${getActivityColor(
                              product.is_active
                            )} text-xs font-medium px-2 py-1 rounded-full border border-border/90 shadow-sm text-center`}
                          >
                            {product.is_active ? "Active" : "Inactive"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Link href={`/products/${product.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
