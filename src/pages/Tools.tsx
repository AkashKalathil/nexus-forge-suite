import { useState } from "react";
import { Plus, Search, Wrench, Calendar, AlertCircle, CheckCircle, Clock, Edit, Trash2 } from "lucide-react";
import { MetallurgistTool } from "@/components/tools/MetallurgistTool";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTools, useDeleteTool } from "@/hooks/useTools";
import { FormDialog } from "@/components/forms/FormDialog";
import { ToolForm } from "@/components/forms/ToolForm";
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
  available: "bg-green-100 text-green-800",
  in_use: "bg-blue-100 text-blue-800",
  maintenance: "bg-yellow-100 text-yellow-800",
  out_of_order: "bg-red-100 text-red-800",
  retired: "bg-gray-100 text-gray-800",
};

const conditionColors: Record<string, string> = {
  excellent: "bg-green-100 text-green-800",
  good: "bg-blue-100 text-blue-800",
  fair: "bg-yellow-100 text-yellow-800",
  needs_repair: "bg-red-100 text-red-800",
};

const statusIcons: Record<string, JSX.Element> = {
  available: <CheckCircle className="h-4 w-4 text-green-600" />,
  in_use: <Clock className="h-4 w-4 text-blue-600" />,
  maintenance: <Clock className="h-4 w-4 text-yellow-600" />,
  out_of_order: <AlertCircle className="h-4 w-4 text-red-600" />,
  retired: <Clock className="h-4 w-4 text-gray-400" />,
};

export default function Tools() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<any>(null);
  
  const { data: tools = [], isLoading, error } = useTools();
  const deleteTool = useDeleteTool();

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tool_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.model || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || tool.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    await deleteTool.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tools & Equipment</h1>
            <p className="text-muted-foreground">Manage production tools, equipment, and maintenance schedules</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">Loading tools...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Tools & Equipment</h1>
            <p className="text-muted-foreground">Manage production tools, equipment, and maintenance schedules</p>
          </div>
        </div>
        <ErrorMessage title="Failed to load tools" message={error.message || 'Please try refreshing the page'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tools & Equipment</h1>
          <p className="text-muted-foreground">
            Manage production tools, equipment, and maintenance schedules
          </p>
        </div>
        <FormDialog
          trigger={
            <Button className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Tool
            </Button>
          }
          title="Add New Tool"
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        >
          <ToolForm 
            onSuccess={() => setCreateDialogOpen(false)}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </FormDialog>
      </div>

      {/* Edit Dialog */}
      <FormDialog
        trigger={<span />}
        title="Edit Tool"
        open={!!editingTool}
        onOpenChange={(open) => !open && setEditingTool(null)}
      >
        <ToolForm 
          tool={editingTool}
          onSuccess={() => setEditingTool(null)}
          onCancel={() => setEditingTool(null)}
        />
      </FormDialog>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tools..."
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in_use">In Use</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="out_of_order">Out of Order</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tools Grid */}
      <div className="grid gap-4">
        {filteredTools.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No tools found. Add your first tool to get started.</p>
            </CardContent>
          </Card>
        ) : (
          filteredTools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {tool.model || 'No model'} - {tool.type}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={statusColors[tool.status as string] || statusColors.available}>
                      {statusIcons[tool.status as string]}
                      <span className="ml-1">{tool.status?.replace('_', ' ')}</span>
                    </Badge>
                    <Badge className={conditionColors[tool.condition as string] || conditionColors.good}>
                      {tool.condition?.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">ID: </span>
                        <span className="font-medium">{tool.tool_id}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Serial: </span>
                        <span className="font-medium">{tool.serial_number || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location: </span>
                        <span className="font-medium">{tool.location || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Manufacturer: </span>
                        <span className="font-medium">{tool.manufacturer || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Maintenance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Last: </span>
                        <span className="font-medium">
                          {tool.last_maintenance ? new Date(tool.last_maintenance).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Next: </span>
                        <span className="font-medium">
                          {tool.next_maintenance ? new Date(tool.next_maintenance).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Interval: </span>
                        <span className="font-medium">{tool.maintenance_interval_days || 365} days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Purchase Info</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Purchase Date: </span>
                        <span className="font-medium">
                          {tool.purchase_date ? new Date(tool.purchase_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cost: </span>
                        <span className="font-medium">{tool.purchase_cost ? `$${tool.purchase_cost.toLocaleString()}` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => setEditingTool(tool)}>
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
                        <AlertDialogTitle>Delete Tool</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this tool? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(tool.id)} className="bg-destructive text-destructive-foreground">
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

      {/* AI Metallurgist */}
      <MetallurgistTool />
    </div>
  );
}
