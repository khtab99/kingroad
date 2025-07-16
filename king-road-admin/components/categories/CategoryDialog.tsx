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
import { Label } from "@/components/ui/label";
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
  form: ReturnType<typeof useForm>;
  onSubmit: (data: any) => void;
  isEditing: boolean;
  parentCategories: Category[];
}

export function CategoryDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isEditing,
  parentCategories,
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update category information"
                  : "Create a new category for your products"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Name (EN)</FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="col-span-3 col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name_ar"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Name (AR)</FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="col-span-3 col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Slug</FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} placeholder="auto-generated if empty" />
                    </FormControl>
                    <FormMessage className="col-span-3 col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Parent</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "null" ? null : Number(value))
                      }
                      value={field.value?.toString() ?? "null"}
                    >
                      <FormControl className="col-span-3">
                        <SelectTrigger>
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
                    <FormMessage className="col-span-3 col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Sort Order</FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage className="col-span-3 col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">
                      Description (EN)
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} placeholder="Description in English" />
                    </FormControl>
                    <FormMessage className="col-span-3 col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description_ar"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">
                      Description (AR)
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} placeholder="Description in Arabic" />
                    </FormControl>
                    <FormMessage className="col-span-3 col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Status</FormLabel>
                    <FormControl className="col-span-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="is_active">
                          {field.value ? "Active" : "Inactive"}
                        </Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Image</FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          field.onChange(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage className="col-span-3 col-start-2" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Update" : "Create"} Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
