import { useState } from "react";
import { Plus, Search, Calendar, DollarSign, User, FileText, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuotations, useDeleteQuotation } from "@/hooks/useQuotations";
import { FormDialog } from "@/components/forms/FormDialog";
import { QuotationForm } from "@/components/forms/QuotationForm";
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
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-orange-100 text-orange-800",
};

export default function Quotations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<any>(null);
  
  const { data: quotations = [], isLoading, error } = useQuotations();
  const deleteQuotation = useDeleteQuotation();

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch = 
      quotation.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.project_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.quotation_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || quotation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    await deleteQuotation.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
            <p className="text-muted-foreground">Create and manage price quotations for customer projects</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">Loading quotations...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
            <p className="text-muted-foreground">Create and manage price quotations for customer projects</p>
          </div>
        </div>
        <ErrorMessage title="Failed to load quotations" message={error.message || 'Please try refreshing the page'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">
            Create and manage price quotations for customer projects
          </p>
        </div>
        <FormDialog
          trigger={
            <Button className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              New Quotation
            </Button>
          }
          title="Create New Quotation"
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        >
          <QuotationForm 
            onSuccess={() => setCreateDialogOpen(false)}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </FormDialog>
      </div>

      {/* Edit Dialog */}
      <FormDialog
        trigger={<span />}
        title="Edit Quotation"
        open={!!editingQuotation}
        onOpenChange={(open) => !open && setEditingQuotation(null)}
      >
        <QuotationForm 
          quotation={editingQuotation}
          onSuccess={() => setEditingQuotation(null)}
          onCancel={() => setEditingQuotation(null)}
        />
      </FormDialog>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search quotations..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotations List */}
      <div className="grid gap-4">
        {filteredQuotations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No quotations found. Create your first quotation to get started.</p>
            </CardContent>
          </Card>
        ) : (
          filteredQuotations.map((quotation) => (
            <Card key={quotation.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{quotation.quotation_id}</CardTitle>
                    <CardDescription className="text-base font-medium">
                      {quotation.project_title}
                    </CardDescription>
                  </div>
                  <Badge className={statusColors[quotation.status as string] || statusColors.draft}>
                    {quotation.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{quotation.customer?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Based on {quotation.enquiry?.enquiry_id || 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {quotation.description || 'No description provided'}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold">${quotation.total_amount?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Valid until: {quotation.valid_until ? new Date(quotation.valid_until).toLocaleDateString() : 'Not set'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Created: {new Date(quotation.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Line Items Preview */}
                {quotation.quotation_items && quotation.quotation_items.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Line Items:</h4>
                    <div className="space-y-1">
                      {quotation.quotation_items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.description} (x{item.quantity})
                          </span>
                          <span className="font-medium">${item.total_price?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => setEditingQuotation(quotation)}>
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
                        <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this quotation? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(quotation.id)} className="bg-destructive text-destructive-foreground">
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
