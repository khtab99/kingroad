"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import {
  createNewCategory,
  deleteCategory,
  updateCategory,
  useGetSuperCategory,
} from "@/api/category";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CategoryDialog } from "@/components/categories/CategoryDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define validation schema based on your Laravel validation
const categorySchema = z.object({
  name_en: z.string().min(1, "English name is required").max(255),
  name_ar: z.string().min(1, "Arabic name is required").max(255),
  slug: z.string().max(255).nullable(),
  description_en: z.string().nullable(),
  description_ar: z.string().nullable(),
  parent_id: z.number().nullable().nullable(),
  sort_order: z.number().min(0).nullable(),
  is_active: z.boolean().default(true),
  image: z.any().nullable(), // For file uploads
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  description_en?: string | null;
  description_ar?: string | null;
  parent_id: number | null;
  is_active: boolean;
  sort_order: number;
  image?: string | null;
  parent?: {
    name_en: string;
  };
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const { token } = useAdminAuth();
  const {
    superCategoryList,
    superCategoryLoading,
    superCategoryError,
    revalidateSuperCategory,
  } = useGetSuperCategory();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name_en: "",
      name_ar: "",
      slug: "",
      description_en: "",
      description_ar: "",
      parent_id: null,
      sort_order: 0,
      is_active: true,
      image: null,
    },
  });

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    form.reset({
      ...category,
      parent_id: category.parent_id || null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteCategory(id);
      if (res) {
        toast.success("Category deleted successfully");
        revalidateSuperCategory();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      let res;
      if (currentCategory) {
        res = await updateCategory(data, currentCategory.id);
      } else {
        res = await createNewCategory(data);
      }

      console.log(res);

      if (res) {
        toast.success(
          `Category ${currentCategory ? "updated" : "created"} successfully`
        );
        revalidateSuperCategory();
        setIsDialogOpen(false);
        form.reset();
      } else {
        toast.error(
          `Failed to ${currentCategory ? "update" : "create"} category`
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const filteredCategories = superCategoryList.filter(
    (category: any) =>
      category.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name_ar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
            <p className="text-muted-foreground">
              Manage product categories and subcategories
            </p>
          </div>
          <Button
            onClick={() => {
              setCurrentCategory(null);
              form.reset();
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
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
                    <TableCell colSpan={8} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category: Category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell>
                        <Avatar className="h-16 w-16 shadow-sm">
                          <AvatarImage
                            src={`http://localhost:8000${category.image || ""}`}
                            alt={category.name_en}
                          />
                          <AvatarFallback>
                            {category.name_en
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{category.name_en}</div>
                        <div className="text-sm text-muted-foreground">
                          {category.name_ar}
                        </div>
                      </TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>
                        {category.parent?.name_en || "Main Category"}
                      </TableCell>
                      <TableCell>{category.sort_order}</TableCell>
                      <TableCell>
                        <Badge
                          variant={category.is_active ? "default" : "outline"}
                          className={`${
                            category.is_active
                              ? "bg-green-500"
                              : "border-red-500"
                          }`}
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={onSubmit}
        isEditing={!!currentCategory}
        parentCategories={superCategoryList}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you sure?"
        description={`This will permanently delete the category.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (selectedCategory !== null) handleDelete(selectedCategory);
        }}
      />
    </AdminLayout>
  );
}
