import { useState } from "react";
import { Plus, Search, Truck, Calendar, MapPin, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useShipments } from "@/hooks/useShipments";

// Mock data for dispatch
const mockDispatch = [
  {
    id: "SHIP-001",
    jobCardId: "JOB-001",
    customerName: "ABC Manufacturing",
    customerAddress: "123 Industrial Way, Factory City, FC 12345",
    status: "preparing",
    priority: "high",
    scheduledDate: "2024-01-20",
    estimatedDelivery: "2024-01-22",
    trackingNumber: null,
    carrier: "Express Logistics",
    items: [
      { description: "Custom Steel Brackets", quantity: 20, weight: "150 kg" },
      { description: "Mounting Hardware Kit", quantity: 5, weight: "25 kg" },
    ],
    totalWeight: "175 kg",
    dimensions: "120x80x60 cm",
    specialInstructions: "Handle with care - precision components",
    contact: {
      name: "John Smith",
      phone: "+1 234 567 8900",
      email: "john@abcmfg.com",
    },
  },
  {
    id: "SHIP-002",
    jobCardId: "JOB-002",
    customerName: "TechCorp Solutions",
    customerAddress: "456 Tech Boulevard, Innovation City, IC 67890",
    status: "shipped",
    priority: "medium",
    scheduledDate: "2024-01-18",
    estimatedDelivery: "2024-01-20",
    actualDelivery: null,
    trackingNumber: "TRK123456789",
    carrier: "Industrial Freight Co",
    items: [
      { description: "Precision Machined Parts", quantity: 100, weight: "80 kg" },
      { description: "Quality Certificates", quantity: 1, weight: "0.5 kg" },
    ],
    totalWeight: "80.5 kg",
    dimensions: "60x40x30 cm",
    specialInstructions: "Aerospace grade - temperature controlled transport required",
    contact: {
      name: "Sarah Johnson",
      phone: "+1 234 567 8901",
      email: "sarah@techcorp.com",
    },
  },
  {
    id: "SHIP-003",
    jobCardId: "JOB-003",
    customerName: "AutoParts Inc",
    customerAddress: "789 Auto Drive, Motor City, MC 13579",
    status: "delivered",
    priority: "urgent",
    scheduledDate: "2024-01-15",
    estimatedDelivery: "2024-01-17",
    actualDelivery: "2024-01-16",
    trackingNumber: "TRK987654321",
    carrier: "FastTrack Delivery",
    items: [
      { description: "Automotive Brake Components", quantity: 1000, weight: "500 kg" },
      { description: "Installation Manual", quantity: 1, weight: "0.2 kg" },
    ],
    totalWeight: "500.2 kg",
    dimensions: "200x120x80 cm",
    specialInstructions: "Urgent delivery - customer production line waiting",
    contact: {
      name: "Mike Wilson",
      phone: "+1 234 567 8902",
      email: "mike@autoparts.com",
    },
  },
];

const statusColors = {
  preparing: "bg-yellow-100 text-yellow-800",
  ready: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  delayed: "bg-red-100 text-red-800",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

export default function Dispatch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  
  const { data: shipments = [], isLoading } = useShipments();

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch = 
      shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.jobCardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shipment.trackingNumber && shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || shipment.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispatch & Shipping</h1>
          <p className="text-muted-foreground">
            Manage order fulfillment and shipment tracking
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Shipment
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search shipments..."
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
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shipments List */}
      <div className="grid gap-4">
        {filteredShipments.map((shipment) => (
          <Card key={shipment.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {shipment.id}
                  </CardTitle>
                  <CardDescription className="text-base font-medium">
                    Job Card: {shipment.jobCardId} - {shipment.customerName}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={priorityColors[shipment.priority as keyof typeof priorityColors]}>
                    {shipment.priority}
                  </Badge>
                  <Badge className={statusColors[shipment.status as keyof typeof statusColors]}>
                    {shipment.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Customer Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{shipment.customerAddress}</span>
                      </div>
                      <div className="text-muted-foreground">
                        Contact: {shipment.contact.name} - {shipment.contact.phone}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Shipping Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Carrier: </span>
                        <span className="font-medium">{shipment.carrier}</span>
                      </div>
                      {shipment.trackingNumber && (
                        <div>
                          <span className="text-muted-foreground">Tracking: </span>
                          <span className="font-medium">{shipment.trackingNumber}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Weight: </span>
                        <span className="font-medium">{shipment.totalWeight}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Dimensions: </span>
                        <span className="font-medium">{shipment.dimensions}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Scheduled: </span>
                        <span className="font-medium">
                          {new Date(shipment.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Est. Delivery: </span>
                        <span className="font-medium">
                          {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                        </span>
                      </div>
                      {shipment.actualDelivery && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span className="text-muted-foreground">Delivered: </span>
                          <span className="font-medium text-green-600">
                            {new Date(shipment.actualDelivery).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Items</h4>
                    <div className="space-y-1">
                      {shipment.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.description} (x{item.quantity})
                          </span>
                          <span className="font-medium">{item.weight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {shipment.specialInstructions && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Special Instructions</h4>
                      <p className="text-sm text-muted-foreground">{shipment.specialInstructions}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm">View Details</Button>
                <Button size="sm" variant="outline">Track Shipment</Button>
                <Button size="sm" variant="outline">Print Label</Button>
                <Button size="sm" variant="outline">Update Status</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}