import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCustomers, useDeleteCustomer, type Customer } from "@/hooks/useCustomers";
import { Plus, Search, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { FormDialog } from "@/components/forms/FormDialog";
import { CustomerForm } from "@/components/forms/CustomerForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { data: customers, isLoading, error } = useCustomers();
  const deleteCustomer = useDeleteCustomer();
  
  const filteredCustomers = customers?.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success border-success';
      case 'inactive': return 'text-destructive border-destructive';
      default: return 'text-secondary border-secondary';
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCustomer.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground">Manage your customer database</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">Loading customers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground">Manage your customer database</p>
          </div>
        </div>
        <ErrorMessage 
          title="Failed to load customers"
          message={error.message || 'Please try refreshing the page'}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage customer information and relationships</p>
        </div>
        <FormDialog
          trigger={
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          }
          title="Add New Customer"
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        >
          <CustomerForm 
            onSuccess={() => setCreateDialogOpen(false)}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </FormDialog>
      </div>

      {/* Edit Dialog */}
      <FormDialog
        trigger={<span />}
        title="Edit Customer"
        open={!!editingCustomer}
        onOpenChange={(open) => !open && setEditingCustomer(null)}
      >
        <CustomerForm 
          customer={editingCustomer}
          onSuccess={() => setEditingCustomer(null)}
          onCancel={() => setEditingCustomer(null)}
        />
      </FormDialog>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No customers found. Add your first customer to get started.</p>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <Badge 
                    variant="outline"
                    className={getStatusColor(customer.status)}
                  >
                    {customer.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {customer.email && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.industry && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Industry:</p>
                    <p className="font-medium">{customer.industry}</p>
                  </div>
                )}
                {customer.contact_person && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Contact Person:</p>
                    <p className="font-medium">{customer.contact_person}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingCustomer(customer)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this customer? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(customer.id)} className="bg-destructive text-destructive-foreground">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
