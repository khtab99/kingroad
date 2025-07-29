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
import { Search, Edit, Trash2, Plus, Eye } from "lucide-react";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetSliderList,
  createNewSlider,
  updateSlider,
  deleteSlider,
} from "@/api/slider";
import { SliderDialog } from "@/components/sliders/SliderDialog";

// Define slider data interface based on your API response
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

// Define validation schema for slider
const sliderSchema = z.object({
  title_en: z.string().min(1, "English title is required").max(255),
  title_ar: z.string().min(1, "Arabic title is required").max(255),
  description_en: z.string().min(1, "English description is required"),
  description_ar: z.string().min(1, "Arabic description is required"),
  status: z.enum(["active", "inactive"]).default("active"),
  image: z.any().nullable(), // For file uploads
});

type SliderFormData = z.infer<typeof sliderSchema>;

export default function SlidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSlider, setSelectedSlider] = useState<number | null>(null);
  const [currentSlider, setCurrentSlider] = useState<SliderData | null>(null);

  const { token } = useAdminAuth();
  const {
    sliderList,
    sliderLoading,
    sliderEmpty,
    sliderError,
    revalidateSlider,
  } = useGetSliderList();

  const form = useForm<SliderFormData>({
    resolver: zodResolver(sliderSchema),
    defaultValues: {
      title_en: "",
      title_ar: "",
      description_en: "",
      description_ar: "",
      status: "active",
      image: null,
    },
  });

  // Filter sliders based on search term
  const filteredSliders = sliderList.filter(
    (slider: SliderData) =>
      slider.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slider.title_ar.includes(searchTerm) ||
      slider.description_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slider.description_ar.includes(searchTerm)
  );

  const handleEdit = (slider: SliderData) => {
    setCurrentSlider(slider);
    form.reset({
      title_en: slider.title_en,
      title_ar: slider.title_ar,
      description_en: slider.description_en,
      description_ar: slider.description_ar,
      status: slider.status,
      image: null, // Reset image field for editing
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteSlider(id);
      if (res) {
        toast.success("Slider deleted successfully");
        revalidateSlider();
      } else {
        toast.error("Failed to delete slider");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedSlider(null);
    }
  };

  const onSubmit = async (data: SliderFormData) => {
    try {
      let res;
      if (currentSlider) {
        res = await updateSlider(data, currentSlider.id);
      } else {
        res = await createNewSlider(data);
      }

      console.log(res);

      if (res) {
        toast.success(
          `Slider ${currentSlider ? "updated" : "created"} successfully`
        );
        revalidateSlider();
        setIsDialogOpen(false);
        setCurrentSlider(null);
        form.reset();
      } else {
        toast.error(`Failed to ${currentSlider ? "update" : "create"} slider`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleAddNew = () => {
    setCurrentSlider(null);
    form.reset({
      title_en: "",
      title_ar: "",
      description_en: "",
      description_ar: "",
      status: "active",
      image: null,
    });
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Hero Sliders</h2>
            <p className="text-muted-foreground">
              Manage homepage hero slider content and images
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Slider
          </Button>
        </div>

        <Card>
          <CardContent className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sliders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredSliders.length} of {sliderList.length} sliders
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[120px]">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-[300px]">Description</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[150px]">Created</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sliderLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="ml-2">Loading sliders...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : sliderError ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-red-500"
                      >
                        Error loading sliders: {sliderError}
                      </TableCell>
                    </TableRow>
                  ) : filteredSliders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {searchTerm
                          ? "No sliders match your search"
                          : "No sliders found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSliders.map((slider: SliderData) => (
                      <TableRow key={slider.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {slider.id}
                        </TableCell>
                        <TableCell>
                          <Avatar className="h-16 w-16 rounded-lg shadow-sm">
                            <AvatarImage
                              src={slider.image}
                              alt={slider.title_en}
                              className="object-cover"
                            />
                            <AvatarFallback className="rounded-lg">
                              {slider.title_en
                                .split(" ")
                                .map((word: string) => word[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-sm">
                              {slider.title_en}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {slider.title_ar}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 max-w-xs">
                            <div
                              className="text-sm truncate"
                              title={slider.description_en}
                            >
                              {slider.description_en}
                            </div>
                            <div
                              className="text-sm text-muted-foreground truncate"
                              title={slider.description_ar}
                            >
                              {slider.description_ar}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              slider.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={`${
                              slider.status === "active"
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-500 hover:bg-gray-600"
                            }`}
                          >
                            {slider.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(slider.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(slider)}
                              title="Edit slider"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSlider(slider.id);
                                setDeleteDialogOpen(true);
                              }}
                              title="Delete slider"
                              className="hover:bg-red-50 hover:border-red-200"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <SliderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={onSubmit}
        isEditing={!!currentSlider}
        currentSlider={currentSlider}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Slider"
        description="Are you sure you want to delete this slider? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (selectedSlider !== null) {
            handleDelete(selectedSlider);
          }
        }}
      />
    </AdminLayout>
  );
}
