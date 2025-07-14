"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { VendorHeader } from "@/components/layout/vendor-header";
import { VendorSidebar } from "@/components/layout/vendor-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Copy,
  Package,
  AlertTriangle,
  TrendingUp,
  Star,
  DollarSign,
} from "lucide-react";

export default function ProductsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Mock products data
  const products = [
    {
      id: 1,
      name: "Traditional Sudanese Thob",
      sku: "TST-001",
      category: "Traditional Clothing",
      price: 299,
      stock: 12,
      status: "active",
      sales: 23,
      rating: 4.9,
      reviews: 45,
      image:
        "https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Handwoven Basket Set",
      sku: "HBS-002",
      category: "Traditional Crafts",
      price: 129,
      stock: 8,
      status: "active",
      sales: 18,
      rating: 4.8,
      reviews: 32,
      image:
        "https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      name: "Sudanese Spice Collection",
      sku: "SSC-003",
      category: "Food & Previlege",
      price: 89,
      stock: 25,
      status: "active",
      sales: 15,
      rating: 4.7,
      reviews: 28,
      image:
        "https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2024-01-08",
    },
    {
      id: 4,
      name: "Gold Plated Bracelet",
      sku: "GPB-004",
      category: "Jewelry",
      price: 199,
      stock: 0,
      status: "out_of_stock",
      sales: 12,
      rating: 4.6,
      reviews: 19,
      image:
        "https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2024-01-05",
    },
    {
      id: 5,
      name: "Traditional Coffee Set",
      sku: "TCS-005",
      category: "Home & Kitchen",
      price: 159,
      stock: 5,
      status: "low_stock",
      sales: 9,
      rating: 4.8,
      reviews: 15,
      image:
        "https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2024-01-03",
    },
    {
      id: 6,
      name: "Embroidered Prayer Cap",
      sku: "EPC-006",
      category: "Traditional Clothing",
      price: 45,
      stock: 20,
      status: "draft",
      sales: 0,
      rating: 0,
      reviews: 0,
      image:
        "https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2024-01-01",
    },
  ];

  const categories = [
    "Traditional Crafts",
    "Food & Previlege",
    "Traditional Clothing",
    "Jewelry",
    "Home & Kitchen",
    "Art & Decor",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "out_of_stock":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "draft":
        return "Draft";
      case "out_of_stock":
        return "Out of Stock";
      case "low_stock":
        return "Low Stock";
      default:
        return status;
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    draft: products.filter((p) => p.status === "draft").length,
    outOfStock: products.filter((p) => p.status === "out_of_stock").length,
    lowStock: products.filter((p) => p.status === "low_stock").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <VendorHeader />

      <div className="flex">
        <VendorSidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground">
                Manage your product catalog and inventory
              </p>
            </div>
            <Button asChild>
              <Link href="/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Products
                    </p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.active}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Draft
                    </p>
                    <p className="text-2xl font-bold text-gray-600">
                      {stats.draft}
                    </p>
                  </div>
                  <Edit className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Low Stock
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.lowStock}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Out of Stock
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.outOfStock}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Products ({filteredProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <div className="text-lg opacity-40">🏺</div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {product.name}
                        </h3>
                        <Badge className={getStatusColor(product.status)}>
                          {getStatusText(product.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>SKU: {product.sku}</span>
                        <span>•</span>
                        <span>{product.category}</span>
                        <span>•</span>
                        <span>Stock: {product.stock}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-primary">
                          {product.price} AED
                        </div>
                        <div className="text-muted-foreground">Price</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{product.sales}</div>
                        <div className="text-muted-foreground">Sales</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">
                            {product.rating || "N/A"}
                          </span>
                        </div>
                        <div className="text-muted-foreground">Rating</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ||
                    statusFilter !== "all" ||
                    categoryFilter !== "all"
                      ? "Try adjusting your filters to see more products."
                      : "Get started by adding your first product."}
                  </p>
                  <Button asChild>
                    <Link href="/products/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
