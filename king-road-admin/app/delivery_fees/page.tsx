"use client";

import { useEffect, useState } from "react";
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
import { Search, Edit, Trash2, Plus, DollarSign } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetDeliveryFeesList,
  createNewDeliveryFees,
  updateDeliveryFees,
  deleteDeliveryFees,
} from "@/api/deliveryFee";
import { DeliveryFeeDialog } from "@/components/deliveryFee/deliveryFeeDialog";

// Define delivery fee data interface based on your API response
interface DeliveryFeeData {
  id: number;
  base_fee: number;
  additional_per_km: number | null;
  free_delivery_min_total: number | null;
  region: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Define validation schema for delivery fee
const deliveryFeeSchema = z.object({
  base_fee: z.number().min(0, "Base fee must be 0 or greater"),
  additional_per_km: z
    .number()
    .min(0, "Additional per km must be 0 or greater")
    .nullable(),
  free_delivery_min_total: z
    .number()
    .min(0, "Free delivery minimum must be 0 or greater")
    .nullable(),
  region: z.string().nullable(),
  is_active: z.boolean().default(true),
});

type DeliveryFeeFormData = z.infer<typeof deliveryFeeSchema>;

export default function DeliveryFeePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeliveryFee, setSelectedDeliveryFee] = useState<number | null>(
    null
  );
  const [currentDeliveryFee, setCurrentDeliveryFee] =
    useState<DeliveryFeeData | null>(null);

  const {
    deliveryFeesList,
    deliveryFeesLoading,

    deliveryFeesError,
    revalidateDeliveryFees,
  } = useGetDeliveryFeesList();

  const form = useForm<DeliveryFeeFormData>({
    resolver: zodResolver(deliveryFeeSchema),
    defaultValues: {
      base_fee: 0,
      additional_per_km: null,
      free_delivery_min_total: null,
      region: null,
      is_active: true,
    },
  });

  // Filter delivery fees based on search term
  const filteredDeliveryFees = deliveryFeesList?.filter(
    (deliveryFee: DeliveryFeeData) =>
      deliveryFee.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryFee.base_fee.toString().includes(searchTerm)
  );

  const handleEdit = (deliveryFee: DeliveryFeeData) => {
    setCurrentDeliveryFee(deliveryFee);
    form.reset({
      base_fee: deliveryFee.base_fee ?? 0,
      additional_per_km: deliveryFee.additional_per_km,
      free_delivery_min_total: deliveryFee.free_delivery_min_total,
      region: deliveryFee.region,
      is_active: deliveryFee.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteDeliveryFees(id);
      if (res) {
        toast.success("Delivery fee deleted successfully");
        revalidateDeliveryFees();
      } else {
        toast.error("Failed to delete delivery fee");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDeliveryFee(null);
    }
  };

  const onSubmit = async (data: DeliveryFeeFormData) => {
    try {
      console.log(data);

      let res;
      if (currentDeliveryFee) {
        res = await updateDeliveryFees(data, currentDeliveryFee.id);
      } else {
        res = await createNewDeliveryFees(data);
      }

      console.log(res);

      if (res) {
        toast.success(
          `Delivery fee ${
            currentDeliveryFee ? "updated" : "created"
          } successfully`
        );
        revalidateDeliveryFees();
        setIsDialogOpen(false);
        setCurrentDeliveryFee(null);
        form.reset();
      } else {
        toast.error(
          `Failed to ${currentDeliveryFee ? "update" : "create"} delivery fee`
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleAddNew = () => {
    setCurrentDeliveryFee(null);
    form.reset({
      base_fee: 0,
      additional_per_km: null,
      free_delivery_min_total: null,
      region: null,
      is_active: true,
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

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "N/A";
    return `${amount.toFixed(2)} AED`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Delivery Fees</h2>
            <p className="text-muted-foreground">
              Manage delivery fee structure and regional pricing
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Delivery Fee
          </Button>
        </div>

        <Card>
          <CardContent className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search delivery fees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredDeliveryFees?.length || 0} of{" "}
                {deliveryFeesList?.length || 0} delivery fees
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[120px]">Base Fee</TableHead>
                    <TableHead className="w-[150px]">Per KM</TableHead>
                    <TableHead className="w-[180px]">
                      Free Delivery Min
                    </TableHead>
                    <TableHead className="w-[120px]">Region</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[150px]">Created</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryFeesLoading && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="ml-2">Loading delivery fees...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {deliveryFeesError && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-red-500"
                      >
                        Error loading delivery fees: {deliveryFeesError}
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredDeliveryFees?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        {searchTerm
                          ? "No delivery fees match your search"
                          : "No delivery fees found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDeliveryFees?.map(
                      (deliveryFee: DeliveryFeeData) => (
                        <TableRow
                          key={deliveryFee.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            {deliveryFee.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                              <span className="font-medium">
                                {formatCurrency(deliveryFee.base_fee)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {formatCurrency(deliveryFee.additional_per_km)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {formatCurrency(
                                deliveryFee.free_delivery_min_total
                              )}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {deliveryFee.region || "All Regions"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                deliveryFee.is_active ? "default" : "secondary"
                              }
                              className={`${
                                deliveryFee.is_active
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-gray-500 hover:bg-gray-600 text-gray-100"
                              }`}
                            >
                              {deliveryFee.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(deliveryFee.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(deliveryFee)}
                                title="Edit delivery fee"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedDeliveryFee(deliveryFee.id);
                                  setDeleteDialogOpen(true);
                                }}
                                title="Delete delivery fee"
                                className="hover:bg-red-50 hover:border-red-200"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeliveryFeeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={onSubmit}
        isEditing={!!currentDeliveryFee}
        currentDeliveryFee={currentDeliveryFee}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Delivery Fee"
        description="Are you sure you want to delete this delivery fee? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (selectedDeliveryFee !== null) {
            handleDelete(selectedDeliveryFee);
          }
        }}
      />
    </AdminLayout>
  );
}
