"use client";

import { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { VendorHeader } from "@/components/layout/vendor-header";
import { VendorSidebar } from "@/components/layout/vendor-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Package,
  DollarSign,
  Tag,
  Truck,
  ImagePlus,
  Trash2,
  Plus,
  Loader2,
  Globe,
  BarChart,
  Archive,
} from "lucide-react";
import { Category, ProductFormData } from "@/util/type";
import { useGetSubCategories, useGetSuperCategory } from "@/api/category";
import {
  createNewProduct,
  updateProduct,
  useGetProductById,
} from "@/api/product";
import { AdminLayout } from "@/components/layout/admin-layout";

// Types

interface FormErrors {
  [key: string]: string[];
}

export default function ProductEdit() {
  const { id } = useParams();

  const { t, language } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<any>([]);

  const [subSubcategories, setSubSubcategories] = useState<any>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const { productDetails: product } = useGetProductById(id);

  const [parentId, setParentId] = useState<any>();

  const { subCategoryList } = useGetSubCategories(parentId);

  const initialValues = {
    name_en: product?.name_en || "",
    name_ar: product?.name_ar || "",
    slug: product?.slug || "",
    description_en: product?.description_en || "",
    description_ar: product?.description_ar || "",
    sku: product?.sku || "",
    barcode: product?.barcode || "",
    price: product?.price || "",
    sale_price: product?.sale_price || "",
    cost_price: product?.cost_price || "",
    inventory: product?.inventory || 0,
    low_stock_threshold: product?.low_stock_threshold || "",
    track_inventory: product?.track_inventory || false,
    category_id: product?.category?.id ?? "",
    subcategory_id: product?.subcategory?.id || "",
    sub_subcategory_id: product?.subsubcategory?.id || "",
    images: product?.images?.map((image: any) => image.url) || [],
    weight: product?.weight || "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    is_active: product?.is_active || false,
    is_featured: product?.is_featured || false,
    tags: product?.tags || [],
    meta_title: product?.meta_title || "",
    meta_description: product?.meta_description || "",
  };

  const [formData, setFormData] = useState<ProductFormData>(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [product]);

  // Fetch categories on component mount

  const { superCategoryList } = useGetSuperCategory();

  useEffect(() => {
    setCategories(
      superCategoryList.filter((cat: any) => cat.parent_id === null)
    );
  }, [superCategoryList]);

  // Generate slug from English name
  useEffect(() => {
    if (formData.name_en) {
      const slug = formData.name_en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      updateFormData("slug", slug);
    }
  }, [formData.name_en]);

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category_id) {
      const selectedCategory = categories.find(
        (cat) => cat.id.toString() === formData.category_id
      );

      setSubcategories(selectedCategory?.children || []);
      updateFormData("subcategory_id", "");
    }
  }, [formData.category_id, categories]);

  // Update sub-subcategories when subcategory changes
  useEffect(() => {
    if (formData.subcategory_id) {
      const selectedSubcategory = subCategoryList.find(
        (cat: any) => cat.id.toString() === formData.subcategory_id
      );
      // console.log(selectedSubcategory);

      setSubSubcategories(selectedSubcategory?.children || []);
      setParentId(formData.subcategory_id);
      updateFormData("sub_subcategory_id", "");
    }
  }, [formData.subcategory_id, subcategories]);

  const updateFormData = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: [] }));
    }
  };

  const updateDimensions = (
    dimension: keyof ProductFormData["dimensions"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [dimension]: value },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (formData.images.length + files.length > 8) {
      toast.error("You can only upload up to 8 images");
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
      ].includes(file.type);
      const isValidSize = file.size <= 2048 * 1024; // 2MB

      if (!isValidType) {
        toast.error(`${file.name} is not a valid image type`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 2MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      updateFormData("images", [...formData.images, ...validFiles]);

      // Generate previews
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    updateFormData("images", newImages);

    const newPreviews = [...imagePreview];
    newPreviews.splice(index, 1);
    setImagePreview(newPreviews);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      const tag = input.value.trim();

      if (tag && !formData.tags.includes(tag)) {
        updateFormData("tags", [...formData.tags, tag]);
        input.value = "";
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.name_en) newErrors.name_en = ["English name is required"];
    if (!formData.name_ar) newErrors.name_ar = ["Arabic name is required"];
    if (!formData.sku) newErrors.sku = ["SKU is required"];
    if (!formData.price) newErrors.price = ["Price is required"];
    if (!formData.inventory) newErrors.inventory = ["Inventory is required"];
    if (!formData.category_id) newErrors.category_id = ["Category is required"];

    // Price validation
    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = ["Price must be 0 or greater"];
    }
    if (
      formData.sale_price &&
      parseFloat(formData.sale_price) >= parseFloat(formData.price)
    ) {
      newErrors.sale_price = ["Sale price must be less than regular price"];
    }

    // Inventory validation
    if (formData.inventory && formData.inventory < 0) {
      newErrors.inventory = ["Inventory must be 0 or greater"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images") {
          // Handle file uploads
          (value as File[]).forEach((file, index) => {
            formDataToSend.append(`images[${index}]`, file);
          });
        } else if (key === "dimensions") {
          // Handle dimensions object
          Object.entries(value).forEach(([dimKey, dimValue]) => {
            if (dimValue) {
              formDataToSend.append(
                `dimensions[${dimKey}]`,
                JSON.stringify(dimValue)
              );
            }
          });
        } else if (key === "tags") {
          // Handle tags array
          (value as string[]).forEach((tag, index) => {
            formDataToSend.append(`tags[${index}]`, tag);
          });
        } else if (typeof value === "boolean") {
          formDataToSend.append(key, value ? "1" : "0");
        } else if (value !== null && value !== undefined && value !== "") {
          formDataToSend.append(key, value.toString());
        }
      });

      const response: any = await updateProduct(formDataToSend, id);

      console.log(response);

      if (response) {
        toast.success("Product updated successfully!");
        router.push("/products");
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors[field]?.[0];
  };

  return (
    <AdminLayout>
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">
              Update product information and settings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Product
                </>
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Multilingual Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_en" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Product Name (English) *
                  </Label>
                  <Input
                    id="name_en"
                    placeholder="Add product name"
                    value={formData.name_en}
                    onChange={(e) => updateFormData("name_en", e.target.value)}
                    className={
                      getFieldError("name_en") ? "border-destructive" : ""
                    }
                  />
                  {getFieldError("name_en") && (
                    <p className="text-destructive text-sm mt-1">
                      {getFieldError("name_en")}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="name_ar" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Product Name (Arabic) *
                  </Label>
                  <Input
                    id="name_ar"
                    placeholder="آدخل اسم المنتج"
                    value={formData.name_ar}
                    onChange={(e) => updateFormData("name_ar", e.target.value)}
                    className={
                      getFieldError("name_ar") ? "border-destructive" : ""
                    }
                    dir="rtl"
                  />
                  {getFieldError("name_ar") && (
                    <p className="text-destructive text-sm mt-1">
                      {getFieldError("name_ar")}
                    </p>
                  )}
                </div>
              </div>

              {/* SKU and Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU (Stock Keeping Unit) *</Label>
                  <Input
                    id="sku"
                    placeholder="e.g. TST-001"
                    value={formData.sku}
                    onChange={(e) => updateFormData("sku", e.target.value)}
                    className={getFieldError("sku") ? "border-destructive" : ""}
                  />
                  {getFieldError("sku") && (
                    <p className="text-destructive text-sm mt-1">
                      {getFieldError("sku")}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    placeholder="Auto-generated from English name"
                    value={formData.slug}
                    onChange={(e) => updateFormData("slug", e.target.value)}
                    className={
                      getFieldError("slug") ? "border-destructive" : ""
                    }
                  />
                  {getFieldError("slug") && (
                    <p className="text-destructive text-sm mt-1">
                      {getFieldError("slug")}
                    </p>
                  )}
                </div>
              </div>

              {/* Barcode */}
              <div>
                <Label htmlFor="barcode">Barcode (Optional)</Label>
                <Input
                  id="barcode"
                  placeholder="e.g. 1234567890123"
                  value={formData.barcode}
                  onChange={(e) => updateFormData("barcode", e.target.value)}
                />
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description_en">Description (English)</Label>
                  <Textarea
                    id="description_en"
                    placeholder="Describe your product in English..."
                    value={formData.description_en}
                    onChange={(e) =>
                      updateFormData("description_en", e.target.value)
                    }
                    rows={5}
                  />
                </div>

                <div>
                  <Label htmlFor="description_ar">Description (Arabic)</Label>
                  <Textarea
                    id="description_ar"
                    placeholder="وصف المنتج باللغة العربية..."
                    value={formData.description_ar}
                    onChange={(e) =>
                      updateFormData("description_ar", e.target.value)
                    }
                    rows={5}
                    dir="rtl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category_id">Category *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) =>
                      updateFormData("category_id", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        getFieldError("category_id") ? "border-destructive" : ""
                      }
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {language === "ar"
                            ? category.name_ar
                            : category.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError("category_id") && (
                    <p className="text-destructive text-sm mt-1">
                      {getFieldError("category_id")}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subcategory_id">Subcategory (Optional)</Label>
                  <Select
                    value={subcategories.id}
                    onValueChange={(value) =>
                      updateFormData("subcategory_id", value)
                    }
                    disabled={!formData.category_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((subcategory: any) => (
                        <SelectItem
                          key={subcategory.id}
                          value={subcategory.id.toString()}
                        >
                          {language === "ar"
                            ? subcategory.name_ar
                            : subcategory.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sub_subcategory_id">
                    Sub-Subcategory (Optional)
                  </Label>
                  <Select
                    value={subSubcategories.id}
                    onValueChange={(value) =>
                      updateFormData("sub_subcategory_id", value)
                    }
                    disabled={!formData.subcategory_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory of your subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategoryList.map((subcategory: any) => (
                        <SelectItem
                          key={subcategory.id}
                          value={subcategory.id.toString()}
                        >
                          {language === "ar"
                            ? subcategory.name_ar
                            : subcategory.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price (AED) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      onWheel={(e) => e.currentTarget.blur()}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => updateFormData("price", e.target.value)}
                      className={`pl-10 ${
                        getFieldError("price") ? "border-destructive" : ""
                      }`}
                    />
                  </div>
                  {getFieldError("price") && (
                    <p className="text-destructive text-sm mt-1">
                      {getFieldError("price")}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="sale_price">Sale Price (AED)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="sale_price"
                      type="number"
                      onWheel={(e) => e.currentTarget.blur()}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.sale_price}
                      onChange={(e) =>
                        updateFormData("sale_price", e.target.value)
                      }
                      className={`pl-10 ${
                        getFieldError("sale_price") ? "border-destructive" : ""
                      }`}
                    />
                  </div>
                  {getFieldError("sale_price") && (
                    <p className="text-destructive text-sm mt-1">
                      {getFieldError("sale_price")}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Discounted price (must be less than regular price)
                  </p>
                </div>

                <div>
                  <Label htmlFor="cost_price">Cost Price (AED)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cost_price"
                      type="number"
                      onWheel={(e) => e.currentTarget.blur()}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.cost_price}
                      onChange={(e) =>
                        updateFormData("cost_price", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your cost to help calculate profit
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Inventory Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inventory">Stock Quantity *</Label>
                  <Input
                    id="inventory"
                    type="number"
                    onWheel={(e) => e.currentTarget.blur()}
                    min="0"
                    placeholder="0"
                    value={formData.inventory}
                    onChange={(e) =>
                      updateFormData("inventory", e.target.value)
                    }
                    className={
                      getFieldError("inventory") ? "border-destructive" : ""
                    }
                  />
                  {getFieldError("inventory") && (
                    <p className="text-destructive text-sm mt-1">
                      {getFieldError("inventory")}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="low_stock_threshold">
                    Low Stock Threshold
                  </Label>
                  <Input
                    id="low_stock_threshold"
                    type="number"
                    onWheel={(e) => e.currentTarget.blur()}
                    min="0"
                    placeholder="5"
                    value={formData.low_stock_threshold}
                    onChange={(e) =>
                      updateFormData("low_stock_threshold", e.target.value)
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get notified when stock falls below this level
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="track_inventory"
                  checked={formData.track_inventory}
                  onCheckedChange={(checked) =>
                    updateFormData("track_inventory", checked)
                  }
                />
                <Label htmlFor="track_inventory" className="cursor-pointer">
                  Track inventory levels for this product
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5" />
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreview.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border"
                  >
                    <img
                      src={preview}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 w-8 h-8 p-0"
                      onClick={() => handleRemoveImage(index)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {imagePreview.length < 8 && (
                  <Label
                    htmlFor="image-upload"
                    className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
                  >
                    <Plus className="h-6 w-6" />
                    <span className="text-sm">Add Image</span>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/gif"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </Label>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Upload up to 8 images (JPEG, PNG, JPG, GIF - max 2MB each).
                First image will be the main product image.
              </p>
            </CardContent>
          </Card>

          {/* Product Status */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Product Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    updateFormData("is_active", checked)
                  }
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Product is active and available for purchase
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    updateFormData("is_featured", checked)
                  }
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Feature this product on your storefront
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating Product...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </AdminLayout>
  );
}
