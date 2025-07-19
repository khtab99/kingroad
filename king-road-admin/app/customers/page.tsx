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
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  Globe,
  Shield,
  Eye,
} from "lucide-react";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import {
  createNewCustomers,
  deleteCustomers,
  updateCustomers,
  useGetCustomers,
} from "@/api/customer";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CustomerDialog } from "@/components/customer/CustomerDialog";

// Define Customer interface
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  is_active: boolean;
  marketing_opt_in: boolean;
  last_login_at: string | null;
  email_verified_at: string | null;
  created_at: string;
}

// Define validation schema for customers
const customerSchema = z.object({
  name: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  country: z.string().nullable(),
  language: z.enum(["en", "ar"]).nullable(),
  is_active: z.boolean().nullable(),
  marketing_opt_in: z.boolean().nullable(),
  // password: z.string().nullable(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const {
    customersList,
    customersLoading,
    customersError,
    revalidateCustomers,
  } = useGetCustomers();

  const form = useForm<any>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      language: "en",
      is_active: true,
      marketing_opt_in: false,
      // password: "",
    },
  });

  const handleEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    form.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      country: customer.country,
      language: customer.language as "en" | "ar",
      is_active: customer.is_active,
      marketing_opt_in: customer.marketing_opt_in,
      // password: "", // Don't populate password for security
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteCustomers(id);
      if (res) {
        toast.success("Customer deleted successfully");
        revalidateCustomers();
      } else {
        toast.error("Failed to delete customer");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const onSubmit = async (data: CustomerFormData) => {
    console.log(data);

    try {
      let res;
      if (currentCustomer) {
        res = await updateCustomers(data, currentCustomer.id);
      } else {
        res = await createNewCustomers(data);
      }

      if (res) {
        toast.success(
          `Customer ${currentCustomer ? "updated" : "created"} successfully`
        );
        revalidateCustomers();
        setIsDialogOpen(false);
        form.reset();
        setCurrentCustomer(null);
      } else {
        toast.error(
          `Failed to ${currentCustomer ? "update" : "create"} customer`
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const filteredCustomers =
    customersList?.filter(
      (customer: Customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.country.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const getStatusBadge = (customer: Customer) => {
    if (!customer.is_active) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    if (!customer.email_verified_at) {
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-700">
          Unverified
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="bg-green-500">
        Active
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString("en-US", {
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
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            <p className="text-muted-foreground">
              Manage your store&apos;s customers and their accounts
            </p>
          </div>
          {/* <Button
            onClick={() => {
              setCurrentCustomer(null);
              form.reset();
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button> */}
        </div>

        <Card>
          <CardContent className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, phone, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  Table View
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                >
                  Card View
                </Button>
              </div>
            </div>

            {viewMode === "table" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Avatar</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customersLoading ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer: Customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          {customer.id}
                        </TableCell>
                        <TableCell>
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {customer.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{customer.name}</div>
                          {customer.marketing_opt_in && (
                            <div className="text-xs text-green-600">
                              Marketing subscriber
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                          {!customer.email_verified_at && (
                            <div className="text-xs text-yellow-600">
                              Unverified
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{customer.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{customer.country}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {customer.language.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(customer)}</TableCell>
                        <TableCell className="text-sm">
                          {formatDateTime(customer.last_login_at)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(customer.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(customer)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCustomer(customer.id);
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customersLoading ? (
                  <div className="col-span-full text-center py-8">
                    Loading...
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    No customers found
                  </div>
                ) : (
                  filteredCustomers.map((customer: Customer) => (
                    <Card
                      key={customer.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {customer.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{customer.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                ID: {customer.id}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(customer)}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span>{customer.country}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              Last Login:{" "}
                              {formatDateTime(customer.last_login_at)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {customer.language.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(customer)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCustomer(customer.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Joined {formatDate(customer.created_at)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={onSubmit}
        isEditing={!!currentCustomer}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you sure?"
        description="This will permanently delete the customer and all associated data."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (selectedCustomer !== null) handleDelete(selectedCustomer);
        }}
      />
    </AdminLayout>
  );
}
