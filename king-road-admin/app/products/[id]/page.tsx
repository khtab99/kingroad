"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { AdminLayout } from "@/components/layout/admin-layout";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Copy,
  Edit,
  Eye,
  Trash2,
  ImagePlus,
  Package,
  BarChart3,
  Clock,
  Star,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { deleteProduct, useGetProductById } from "@/api/product";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { productDetails, productLoading, productError } = useGetProductById(
    params.id as string
  );

  const product = productDetails;

  const handleDelete: any = async (id: number) => {
    try {
      const respose = await deleteProduct(id);
      if (respose) {
        toast.success("Product deleted successfully");
        router.push("/products");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDuplicate = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Product duplicated successfully");
      router.push("/products");
    } catch (error) {
      toast.error("Failed to duplicate product");
    }
  };

  if (productLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen p-8 flex items-center justify-center text-muted-foreground">
          Loading product details...
        </div>
      </AdminLayout>
    );
  }

  if (productError || !product) {
    return (
      <AdminLayout>
        <main className="p-8">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-4 text-muted-foreground">
            The product doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/products")}>
            Back to Products
          </Button>
        </main>
      </AdminLayout>
    );
  }

  return (
    <>
      <AdminLayout>
        <main className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                {product.name}
                {product.is_active && <Badge variant="default">Active</Badge>}
              </h1>
              <p className="text-muted-foreground">SKU: {product.sku}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" /> Duplicate
              </Button>
              <Button variant="outline" asChild>
                <a href={`/products/${product.id}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" /> View in Store
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={`/products/${product.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </a>
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" /> Product Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{product.description}</p>
                  <Separator />
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <strong>Price:</strong> {product.current_price} AED
                    </div>
                    <div>
                      <strong>Inventory:</strong> {product.inventory} in stock
                    </div>
                    <div>
                      <strong>Category:</strong> {product.category?.name}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImagePlus className="w-5 h-5" /> Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.images?.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Product image ${i + 1}`}
                        className="rounded border shadow-sm object-cover w-full aspect-square"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" /> Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Views:</strong> {product.views}
                  </p>
                  <p>
                    <strong>Rating:</strong> {product.rating} / 5
                  </p>
                  <p>
                    <strong>Reviews:</strong> {product.reviews_count}
                  </p>
                  <p>
                    <strong>Created:</strong> {product.created_at}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`/products/${product.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDuplicate}
                  >
                    <Copy className="h-4 w-4 mr-2" /> Duplicate
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/products/new">
                      <Plus className="h-4 w-4 mr-2" /> New Product
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </AdminLayout>
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you sure?"
        description={`This action cannot be undone. This will permanently delete the product "${product.name}" and remove it from your store.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => handleDelete(product.id)}
      />
    </>
  );
}
