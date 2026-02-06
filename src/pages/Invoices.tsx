import { useState } from "react";
import { Plus, Search, DollarSign, Calendar, FileText, Download, Send, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInvoices, useDeleteInvoice, useUpdateInvoice } from "@/hooks/useInvoices";
import { FormDialog } from "@/components/forms/FormDialog";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
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

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  
  const { data: invoices = [], isLoading, error } = useInvoices();
  const deleteInvoice = useDeleteInvoice();
  const updateInvoice = useUpdateInvoice();

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      (invoice.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = filteredInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const totalPaid = filteredInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const handleDelete = async (id: string) => {
    await deleteInvoice.mutateAsync(id);
  };

  const handleMarkAsPaid = async (invoice: any) => {
    await updateInvoice.mutateAsync({
      id: invoice.id,
      updates: { status: 'paid', paid_amount: invoice.total_amount }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">Manage customer invoices and payment tracking</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">Loading invoices...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">Manage customer invoices and payment tracking</p>
          </div>
        </div>
        <ErrorMessage title="Failed to load invoices" message={error.message || 'Please try refreshing the page'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Manage customer invoices and payment tracking
          </p>
        </div>
        <FormDialog
          trigger={
            <Button className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          }
          title="Create New Invoice"
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        >
          <InvoiceForm 
            onSuccess={() => setCreateDialogOpen(false)}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </FormDialog>
      </div>

      {/* Edit Dialog */}
      <FormDialog
        trigger={<span />}
        title="Edit Invoice"
        open={!!editingInvoice}
        onOpenChange={(open) => !open && setEditingInvoice(null)}
      >
        <InvoiceForm 
          invoice={editingInvoice}
          onSuccess={() => setEditingInvoice(null)}
          onCancel={() => setEditingInvoice(null)}
        />
      </FormDialog>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold">${totalOutstanding.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold">${totalPaid.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold">{filteredInvoices.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      <div className="grid gap-4">
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No invoices found. Create your first invoice to get started.</p>
            </CardContent>
          </Card>
        ) : (
          filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{invoice.invoice_number}</CardTitle>
                    <CardDescription className="text-base font-medium">
                      {invoice.customer?.name || 'Unknown Customer'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-2xl font-bold">${invoice.total_amount.toLocaleString()}</span>
                    <Badge className={statusColors[invoice.status as string] || statusColors.draft}>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Job Card: </span>
                      <span className="font-medium">{invoice.job_card?.job_number || 'N/A'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Quotation: </span>
                      <span className="font-medium">{invoice.quotation?.quotation_id || 'N/A'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Payment Terms: </span>
                      <span className="font-medium">{invoice.payment_terms || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Issued: </span>
                      <span className="font-medium">
                        {new Date(invoice.issue_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Due: </span>
                      <span className={`font-medium ${invoice.status === 'overdue' ? 'text-red-600' : ''}`}>
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="pt-2 space-y-1">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Subtotal: </span>
                        <span className="font-medium">${invoice.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Tax: </span>
                        <span className="font-medium">${invoice.tax_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => setEditingInvoice(invoice)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {invoice.status !== 'paid' && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkAsPaid(invoice)}>
                      Mark as Paid
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this invoice? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(invoice.id)} className="bg-destructive text-destructive-foreground">
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
