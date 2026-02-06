import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQualityInspections, useDeleteQualityInspection } from "@/hooks/useQualityInspections";
import { Shield, CheckCircle, XCircle, AlertTriangle, Plus, Search, Edit, Trash2 } from "lucide-react";
import { FormDialog } from "@/components/forms/FormDialog";
import { QualityInspectionForm } from "@/components/forms/QualityInspectionForm";
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
  pending: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  passed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  conditional: "bg-yellow-100 text-yellow-800",
};

export function QualityControl() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState<any>(null);

  const { data: inspections = [], isLoading, error } = useQualityInspections();
  const deleteInspection = useDeleteQualityInspection();

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch = 
      inspection.inspector_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.inspection_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inspection.job_cards?.job_number || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || inspection.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const passedCount = inspections.filter(i => i.status === 'passed').length;
  const failedCount = inspections.filter(i => i.status === 'failed').length;
  const pendingCount = inspections.filter(i => i.status === 'pending' || i.status === 'in_progress').length;

  const handleDelete = async (id: string) => {
    await deleteInspection.mutateAsync(id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'conditional': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Quality Control</h1>
            <p className="text-muted-foreground">Inspect products and manage quality standards</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">Loading inspections...</p>
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
            <h1 className="text-3xl font-bold">Quality Control</h1>
            <p className="text-muted-foreground">Inspect products and manage quality standards</p>
          </div>
        </div>
        <ErrorMessage title="Failed to load inspections" message={error.message || 'Please try refreshing the page'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quality Control</h1>
          <p className="text-muted-foreground">Inspect products and manage quality standards</p>
        </div>
        <FormDialog
          trigger={
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Button>
          }
          title="Create New Inspection"
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        >
          <QualityInspectionForm 
            onSuccess={() => setCreateDialogOpen(false)}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </FormDialog>
      </div>

      {/* Edit Dialog */}
      <FormDialog
        trigger={<span />}
        title="Edit Inspection"
        open={!!editingInspection}
        onOpenChange={(open) => !open && setEditingInspection(null)}
      >
        <QualityInspectionForm 
          inspection={editingInspection}
          onSuccess={() => setEditingInspection(null)}
          onCancel={() => setEditingInspection(null)}
        />
      </FormDialog>

      {/* QC Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Passed Inspections
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{passedCount}</div>
            <p className="text-xs text-muted-foreground">Total passed</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Inspections
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting inspection</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed Inspections
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <p className="text-xs text-muted-foreground">Require rework</p>
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
                placeholder="Search inspections..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="conditional">Conditional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inspections List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInspections.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No inspections found. Create your first inspection to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInspections.map((inspection) => (
                <div key={inspection.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{inspection.inspection_type}</h3>
                      <p className="text-sm text-muted-foreground">
                        Job Card: {inspection.job_cards?.job_number || 'N/A'} | Inspector: {inspection.inspector_name}
                      </p>
                    </div>
                    <Badge className={statusColors[inspection.status as string] || statusColors.pending}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(inspection.status)}
                        <span>{inspection.status}</span>
                      </span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Defects Found</p>
                      <p className="font-medium">{inspection.defects_found}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Inspection Date</p>
                      <p className="font-medium">
                        {inspection.inspection_date 
                          ? new Date(inspection.inspection_date).toLocaleDateString() 
                          : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(inspection.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {inspection.notes && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">Notes:</p>
                      <p className="font-medium">{inspection.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingInspection(inspection)}>
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
                          <AlertDialogTitle>Delete Inspection</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this inspection? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(inspection.id)} className="bg-destructive text-destructive-foreground">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
