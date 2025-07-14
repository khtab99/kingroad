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
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name_en}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.name_ar}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.category?.name_en}</TableCell>
                      <TableCell>AED {product.price}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.inventory > 0 ? "default" : "destructive"
                          }
                        >
                          {product.inventory}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.is_active ? "default" : "secondary"}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Link href={`/products/${product.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
