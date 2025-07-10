"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { VendorHeader } from "@/components/layout/vendor-header";
import { VendorSidebar } from "@/components/layout/vendor-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Tag,
  Truck,
  ImagePlus,
  Star,
  Eye,
  BarChart3,
  ShoppingCart,
  Calendar,
  Clock,
  Copy,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Mock product data - in a real app, fetch based on params.id
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock product data
        const mockProduct = {
          id: parseInt(params.id as string),
          name: "Traditional Sudanese Thob",
          sku: "TST-001",
          category: "Traditional Clothing",
          description:
            "This authentic Sudanese thob is handcrafted by skilled artisans using traditional techniques passed down through generations. Made from premium cotton fabric, it features intricate embroidery and cultural patterns that celebrate Sudanese heritage.",
          price: 299,
          compareAtPrice: 399,
          costPrice: 150,
          quantity: 12,
          weight: 0.5,
          tags: ["traditional", "clothing", "handmade", "cotton"],
          isFeatured: true,
          isActive: true,
          status: "active",
          images: [
            "https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=300",
            "https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=300",
            "https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=300",
          ],
          createdAt: "2024-01-15",
          updatedAt: "2024-01-20",
          sales: {
            total: 23,
            revenue: 6877,
            lastSale: "2024-01-25",
            views: 456,
          },
          rating: 4.9,
          reviews: 45,
        };

        setProduct(mockProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Product deleted successfully");
      router.push("/products");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleDuplicate = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("Product duplicated successfully");
      // In a real app, this would redirect to the new product
      router.push("/products");
    } catch (error) {
      toast.error("Failed to duplicate product");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <VendorHeader />
        <div className="flex">
          <VendorSidebar />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Loading Product...</h1>
                <p className="text-muted-foreground">
                  Please wait while we fetch the product details
                </p>
              </div>
            </div>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-4 w-full bg-muted rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <VendorHeader />
        <div className="flex">
          <VendorSidebar />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Product Not Found</h1>
                <p className="text-muted-foreground">
                  The product you're looking for doesn't exist or has been
                  removed
                </p>
              </div>
              <Button onClick={() => router.push("/products")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <VendorHeader />

      <div className="flex">
        <VendorSidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Badge
                  className={
                    product.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                  }
                >
                  {product.isActive ? "Active" : "Draft"}
                </Badge>
                {product.isFeatured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                SKU: {product.sku} • Added on {product.createdAt}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" asChild>
                <a
                  href={`http://localhost:3000/products/${product.id}`}
                  target="_blank"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View in Store
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={`/products/${product.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </a>
              </Button>
              <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the product "{product.name}" and remove it from your
                      store.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Product Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Name</h3>
                      <p>{product.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Category</h3>
                      <p>{product.category}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      {product.description}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Price</h3>
                      <p className="text-primary font-bold">
                        {product.price} AED
                      </p>
                      {product.compareAtPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          {product.compareAtPrice} AED
                        </p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Cost</h3>
                      <p>{product.costPrice} AED</p>
                      <p className="text-sm text-muted-foreground">
                        Profit: {(product.price - product.costPrice).toFixed(2)}{" "}
                        AED
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Inventory</h3>
                      <p>{product.quantity} in stock</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImagePlus className="h-5 w-5" />
                    Product Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.images.map((image: string, index: number) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden border bg-muted"
                      >
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <div className="text-4xl opacity-20">🏺</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Performance Stats */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Total Sales
                      </p>
                      <p className="text-2xl font-bold">
                        {product.sales.total}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold">
                        {product.sales.revenue} AED
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Views</p>
                      <p className="text-2xl font-bold">
                        {product.sales.views}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Conversion
                      </p>
                      <p className="text-2xl font-bold">
                        {(
                          (product.sales.total / product.sales.views) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <div>
                      <span className="font-bold">{product.rating}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        ({product.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Last sale: {product.sales.lastSale}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a href={`/products/${product.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Product
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleDuplicate}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Product
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a href="/products/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a
                      href={`http://localhost:3000/products/${product.id}`}
                      target="_blank"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View in Store
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{product.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>{product.updatedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU</span>
                    <span>{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight</span>
                    <span>{product.weight} kg</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
