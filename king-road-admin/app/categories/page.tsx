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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import {
  deleteCategory,
  useGetSubCategories,
  useGetSuperCategory,
} from "@/api/category";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { log } from "console";

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  parent_id: number | null;
  is_active: boolean;
  sort_order: number;
  parent?: {
    name_en: string;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { token } = useAdminAuth();

  const [selectedCategory, setSelectedCategory] = useState<any>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    parent_id: "",
    sort_order: 0,
    is_active: true,
  });

  const {
    superCategoryList,
    superCategoryLoading,
    superCategoryError,
    revalidateSuperCategory,
  } = useGetSuperCategory();

  useEffect(() => {
    setCategories(superCategoryList);
  }, [superCategoryList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCategory
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/categories/${editingCategory.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/categories`;

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          parent_id: formData.parent_id || null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        revalidateSuperCategory();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_en: category.name_en,
      name_ar: category.name_ar,
      description_en: "",
      description_ar: "",
      parent_id: category.parent_id?.toString() || "",
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete: any = async (id: number) => {
    try {
      const respose = await deleteCategory(id);
      if (respose) {
        toast.success("Category deleted successfully");
        revalidateSuperCategory();
      } else {
        toast.error("Failed to delete Category");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name_en: "",
      name_ar: "",
      description_en: "",
      description_ar: "",
      parent_id: "",
      sort_order: 0,
      is_active: true,
    });
    setEditingCategory(null);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name_ar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const parentCategories = categories.filter((cat) => !cat.parent_id);

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
              <p className="text-muted-foreground">
                Manage product categories and subcategories
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? "Edit Category" : "Add New Category"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCategory
                        ? "Update category information"
                        : "Create a new category for your products"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name_en" className="text-right">
                        Name (EN)
                      </Label>
                      <Input
                        id="name_en"
                        value={formData.name_en}
                        onChange={(e) =>
                          setFormData({ ...formData, name_en: e.target.value })
                        }
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name_ar" className="text-right">
                        Name (AR)
                      </Label>
                      <Input
                        id="name_ar"
                        value={formData.name_ar}
                        onChange={(e) =>
                          setFormData({ ...formData, name_ar: e.target.value })
                        }
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="parent_id" className="text-right">
                        Parent
                      </Label>
                      <Select
                        value={formData.parent_id}
                        onValueChange={(value) =>
                          setFormData({ ...formData, parent_id: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">
                            No Parent (Main Category)
                          </SelectItem>
                          {parentCategories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sort_order" className="text-right">
                        Sort Order
                      </Label>
                      <Input
                        id="sort_order"
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sort_order: parseInt(e.target.value),
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editingCategory ? "Update" : "Create"} Category
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="mt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
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

                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Sort Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {superCategoryLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category: any) => {
                      return (
                        <TableRow key={category.id}>
                          <TableCell>{category.id}</TableCell>
                          <TableCell>
                            <Avatar className="h-16 w-16 shadow-sm">
                              <AvatarImage
                                src={`http://localhost:8000${category?.image}`}
                                alt={category.name_en}
                              />
                              <AvatarFallback>
                                {category.name_en
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {category.name_en}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {category.name_ar}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{category.slug}</TableCell>
                          <TableCell>
                            {category.parent
                              ? category.parent.name_en
                              : "Main Category"}
                          </TableCell>
                          <TableCell>{category.sort_order}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                category.is_active
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }
                            >
                              {category.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedCategory(category.id);
                                  setDeleteDialogOpen(true);
                                }}
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
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you sure?"
        description={`This action cannot be undone. This will permanently delete the product  and remove it from your store.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => handleDelete(selectedCategory)}
      />
    </>
  );
}
