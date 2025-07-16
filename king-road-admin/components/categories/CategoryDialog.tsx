"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/util/type";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ReturnType<typeof useForm<CategoryFormValues>>;
  onSubmit: (data: CategoryFormValues) => void;
  isEditing: boolean;
  parentCategories: Category[];
}

type CategoryFormValues = {
  name_en: string;
  name_ar: string;
  slug?: string;
  description_en?: string;
  description_ar?: string;
  parent_id?: number | null;
  sort_order?: number;
  is_active: boolean;
  image?: File | null | string;
};

export function CategoryDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isEditing,
  parentCategories,
}: CategoryDialogProps) {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: File | null) => void
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      fieldChange(file);

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        form.setValue("image", imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {isEditing ? "Edit Category" : "Create New Category"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {isEditing
                  ? "Update your category details below"
                  : "Fill in the details to create a new category"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-6 py-4">
              {/* Column 1 */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>English Name*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter English name"
                          className="focus-visible:ring-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>English Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter English description"
                          className="focus-visible:ring-1 "
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Auto-generated if empty"
                          className="focus-visible:ring-1"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parent_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Category</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(
                            value === "null" ? null : Number(value)
                          )
                        }
                        value={field.value?.toString() ?? "null"}
                      >
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-1">
                            <SelectValue placeholder="Select parent category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="null">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arabic Name*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter Arabic name"
                          className="focus-visible:ring-1"
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arabic Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter Arabic description"
                          className="focus-visible:ring-1 "
                          dir="rtl"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sort_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          className="focus-visible:ring-1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? 0 : Number(e.target.value)
                            )
                          }
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Image</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            className="focus-visible:ring-1 cursor-pointer"
                            onChange={(e) =>
                              handleFileChange(e, field.onChange)
                            }
                          />
                          {field.value && typeof field.value === "string" && (
                            <div className="relative h-16 w-16">
                              <img
                                src={field.value}
                                alt="Preview"
                                className="h-full w-full rounded-md object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value
                        ? "Category is visible"
                        : "Category is hidden"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full sm:w-auto" size="lg">
                {isEditing ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
