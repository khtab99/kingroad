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
import { useState } from "react";
import { ImageIcon, X } from "lucide-react";

// Slider data interface
interface SliderData {
  id: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

interface SliderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: any;
  onSubmit: any;
  isEditing: boolean;
  currentSlider?: SliderData | null;
}

type SliderFormValues = {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  status: "active" | "inactive";
  image?: File | null | string;
};

export function SliderDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isEditing,
  currentSlider,
}: SliderDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    currentSlider?.image || null
  );

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: File | null) => void
  ) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.includes("image")) {
        setImagePreview(null);
        fieldChange(null);
        return;
      }

      // Set the actual File object for form submission
      fieldChange(file);

      // Create preview URL for display
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        setImagePreview(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    } else {
      // Clear everything if no file selected
      fieldChange(null);
      setImagePreview(null);
    }
  };

  const removeImage = (fieldChange: (value: null) => void) => {
    fieldChange(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setImagePreview(currentSlider?.image || null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                {isEditing ? "Edit Hero Slider" : "Create New Hero Slider"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {isEditing
                  ? "Update your hero slider content and image below"
                  : "Fill in the details to create a new hero slider for your homepage"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - English Content */}
              <div className="space-y-4">
                <div className="pb-2 border-b">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    English Content
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="title_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        English Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter compelling English title"
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
                      <FormLabel className="text-sm font-medium">
                        English Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter detailed English description"
                          className="focus-visible:ring-1 min-h-[120px] resize-none"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column - Arabic Content */}
              <div className="space-y-4">
                <div className="pb-2 border-b">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Arabic Content
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Arabic Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="أدخل العنوان العربي"
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
                      <FormLabel className="text-sm font-medium">
                        Arabic Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="أدخل الوصف العربي التفصيلي"
                          className="focus-visible:ring-1 min-h-[120px] resize-none"
                          dir="rtl"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="pb-2 border-b">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Slider Image
                </h3>
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Hero Image*
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* File Input */}
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            className="focus-visible:ring-1 cursor-pointer file:cursor-pointer"
                            onChange={(e) =>
                              handleFileChange(e, field.onChange)
                            }
                          />
                          {imagePreview && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeImage(field.onChange)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                              Remove
                            </Button>
                          )}
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                          <div className="relative">
                            <div className="relative h-48 w-full rounded-lg border-2 border-dashed border-gray-200 overflow-hidden">
                              <img
                                src={imagePreview}
                                alt="Slider preview"
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="text-white/80 text-lg font-medium text-center px-4">
                                  Preview
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              {field.value instanceof File
                                ? `Selected: ${field.value.name} (${(
                                    field.value.size /
                                    1024 /
                                    1024
                                  ).toFixed(2)} MB)`
                                : "Current image"}
                            </p>
                          </div>
                        )}

                        {/* Upload Guidelines */}
                        {!imagePreview && (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">
                              Upload a high-quality image for your hero slider
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Recommended: 1920x1080px, JPG/PNG, max 5MB
                            </p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status Section */}
            <div className="space-y-4">
              <div className="pb-2 border-b">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Slider Settings
                </h3>
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus-visible:ring-1">
                          <SelectValue placeholder="Select slider status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            Active - Visible on homepage
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                            Inactive - Hidden from homepage
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Info Card */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      form.watch("status") === "active"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <span className="font-medium text-sm">
                    {form.watch("status") === "active"
                      ? "Active Slider"
                      : "Inactive Slider"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {form.watch("status") === "active"
                    ? "This slider will be visible in the homepage carousel and will auto-play with other active sliders."
                    : "This slider will not be displayed on the homepage. You can activate it later."}
                </p>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                size="lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    {isEditing ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  <>{isEditing ? "Update Slider" : "Create Slider"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
