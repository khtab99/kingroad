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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { DollarSign, Truck, MapPin } from "lucide-react";

// DeliveryFee data interface
interface DeliveryFeeData {
  id: number;
  base_fee: any;
  additional_per_km: number | null;
  free_delivery_min_total: number | null;
  region: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DeliveryFeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: any;
  onSubmit: any;
  isEditing: boolean;
  currentDeliveryFee?: DeliveryFeeData | null;
}

export function DeliveryFeeDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isEditing,
  currentDeliveryFee,
}: DeliveryFeeDialogProps) {
  const handleDialogClose = (open: boolean) => {
    onOpenChange(open);
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "Free";
    return `$${amount?.toFixed(2)}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                {isEditing ? "Edit Delivery Fee" : "Create New Delivery Fee"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {isEditing
                  ? "Update the delivery fee structure and pricing below"
                  : "Configure delivery fees, regional pricing, and free delivery thresholds"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Pricing */}
              <div className="space-y-4">
                <div className="pb-2 border-b">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Basic Pricing
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="base_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Base Delivery Fee
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          {/* <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
                          <Input
                            {...field}
                            type="string"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="pl-10 focus-visible:ring-1"
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        The base delivery charge applied to all orders
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additional_per_km"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Additional Per KM
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          {/* <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00 (Optional)"
                            className="pl-10 focus-visible:ring-1"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : null
                              )
                            }
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Extra charge per kilometer beyond base distance
                        (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column - Regional & Free Delivery */}
              <div className="space-y-4">
                <div className="pb-2 border-b">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Regional Settings
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Region
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Downtown, Suburbs (Optional)"
                          className="focus-visible:ring-1"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Specific region or area. Leave empty for all regions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="free_delivery_min_total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Free Delivery Minimum
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          {/* <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00 (Optional)"
                            className="pl-10 focus-visible:ring-1"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : null
                              )
                            }
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Minimum order total for free delivery (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Status Section */}
            <div className="space-y-4">
              <div className="pb-2 border-b">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Delivery Fee Settings
                </h3>
              </div>

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">
                        Active Status
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        Enable this delivery fee structure for orders
                      </FormDescription>
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

              {/* Pricing Summary Card */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      form.watch("is_active") ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></div>
                  <span className="font-medium text-sm">
                    {form.watch("is_active")
                      ? "Active Delivery Fee"
                      : "Inactive Delivery Fee"}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>
                    <strong>Base Fee:</strong>{" "}
                    {formatCurrency(form.watch("base_fee"))}
                  </p>
                  <p>
                    <strong>Per KM:</strong>{" "}
                    {formatCurrency(form.watch("additional_per_km"))}
                  </p>
                  <p>
                    <strong>Free Delivery Above:</strong>{" "}
                    {formatCurrency(form.watch("free_delivery_min_total"))}
                  </p>
                  <p>
                    <strong>Region:</strong>{" "}
                    {form.watch("region") || "All Regions"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                  {form.watch("is_active")
                    ? "This delivery fee structure will be applied to matching orders."
                    : "This delivery fee structure will not be used for orders."}
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
                  <>
                    {isEditing ? "Update Delivery Fee" : "Create Delivery Fee"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
