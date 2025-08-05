import { useState } from "react";
import { Plus, Search, Wrench, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTools } from "@/hooks/useTools";

// Mock data for tools
const mockTools = [
  {
    id: "TOOL-001",
    name: "CNC Milling Machine #1",
    type: "CNC Machine",
    model: "Haas VF-2",
    serialNumber: "VF2-12345",
    status: "operational",
    location: "Production Floor A",
    assignedTo: "John Smith",
    condition: "excellent",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
    maintenanceHours: 0,
    totalHours: 1250,
    purchaseDate: "2022-03-15",
    warranty: "Active until 2025-03-15",
  },
  {
    id: "TOOL-002",
    name: "Welding Station #3",
    type: "Welding Equipment",
    model: "Lincoln Electric PowerMIG 350MP",
    serialNumber: "WLD-67890",
    status: "maintenance",
    location: "Welding Bay",
    assignedTo: "Sarah Johnson",
    condition: "good",
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-01-18",
    maintenanceHours: 15,
    totalHours: 2100,
    purchaseDate: "2021-08-20",
    warranty: "Expired",
  },
  {
    id: "TOOL-003",
    name: "Hydraulic Press",
    type: "Press",
    model: "Enerpac PE-Series",
    serialNumber: "HYD-11111",
    status: "out_of_order",
    location: "Press Section",
    assignedTo: "Mike Wilson",
    condition: "needs_repair",
    lastMaintenance: "2023-12-20",
    nextMaintenance: "2024-01-25",
    maintenanceHours: 8,
    totalHours: 1875,
    purchaseDate: "2020-11-10",
    warranty: "Expired",
  },
  {
    id: "TOOL-004",
    name: "Drill Press #2",
    type: "Drilling Equipment",
    model: "Delta 18-900L",
    serialNumber: "DRL-22222",
    status: "operational",
    location: "Assembly Area",
    assignedTo: "Lisa Chen",
    condition: "good",
    lastMaintenance: "2024-01-08",
    nextMaintenance: "2024-03-08",
    maintenanceHours: 0,
    totalHours: 890,
    purchaseDate: "2023-05-12",
    warranty: "Active until 2026-05-12",
  },
];

const statusColors = {
  operational: "bg-green-100 text-green-800",
  maintenance: "bg-yellow-100 text-yellow-800",
  out_of_order: "bg-red-100 text-red-800",
  idle: "bg-gray-100 text-gray-800",
};

const conditionColors = {
  excellent: "bg-green-100 text-green-800",
  good: "bg-blue-100 text-blue-800",
  fair: "bg-yellow-100 text-yellow-800",
  needs_repair: "bg-red-100 text-red-800",
};

const statusIcons = {
  operational: <CheckCircle className="h-4 w-4 text-green-600" />,
  maintenance: <Clock className="h-4 w-4 text-yellow-600" />,
  out_of_order: <AlertCircle className="h-4 w-4 text-red-600" />,
  idle: <Clock className="h-4 w-4 text-gray-400" />,
};

export default function Tools() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const { data: tools = [], isLoading } = useTools();

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tool_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.model || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || tool.status === statusFilter;
    const matchesType = typeFilter === "all" || tool.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const uniqueTypes = Array.from(new Set(mockTools.map(tool => tool.type)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tools & Equipment</h1>
          <p className="text-muted-foreground">
            Manage production tools, equipment, and maintenance schedules
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Tool
        </Button>
      </div>

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
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="out_of_order">Out of Order</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tools Grid */}
      <div className="grid gap-4">
        {filteredTools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    {tool.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {tool.model} - {tool.type}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={statusColors[tool.status as keyof typeof statusColors]}>
                    {statusIcons[tool.status as keyof typeof statusIcons]}
                    {tool.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={conditionColors[tool.condition as keyof typeof conditionColors]}>
                    {tool.condition.replace('_', ' ')}
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
                      <span className="text-muted-foreground">Maintenance Interval: </span>
                      <span className="font-medium">{tool.maintenance_interval_days || 365} days</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Purchase Cost: </span>
                      <span className="font-medium">{tool.purchase_cost ? `$${tool.purchase_cost}` : 'N/A'}</span>
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
                    {tool.notes && (
                      <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-md">
                        <span className="text-sm text-blue-800 dark:text-blue-200">Notes: {tool.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm">View Details</Button>
                <Button size="sm" variant="outline">Schedule Maintenance</Button>
                <Button size="sm" variant="outline">Log Usage</Button>
                <Button size="sm" variant="outline">Update Status</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}