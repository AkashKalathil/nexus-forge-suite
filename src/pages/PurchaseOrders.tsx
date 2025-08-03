import { useState } from "react";
import { Plus, Search, Calendar, DollarSign, Truck, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for purchase orders
const mockPurchaseOrders = [
  {
    id: "PO-001",
    supplierName: "Steel Supply Co.",
    description: "Raw steel materials for February production",
    status: "pending",
    totalAmount: 12500,
    orderDate: "2024-01-15",
    expectedDelivery: "2024-01-25",
    items: [
      { name: "Steel plates 10mm", quantity: 50, unit: "sheets", unitPrice: 150, total: 7500 },
      { name: "Steel rods 20mm", quantity: 100, unit: "meters", unitPrice: 50, total: 5000 },
    ],
    contactPerson: "Mike Johnson",
    paymentTerms: "Net 30",
  },
  {
    id: "PO-002",
    supplierName: "Precision Tools Ltd",
    description: "Cutting tools and equipment maintenance",
    status: "approved",
    totalAmount: 8750,
    orderDate: "2024-01-14",
    expectedDelivery: "2024-01-22",
    items: [
      { name: "Carbide cutting tools", quantity: 25, unit: "pieces", unitPrice: 200, total: 5000 },
      { name: "Tool holders", quantity: 15, unit: "pieces", unitPrice: 250, total: 3750 },
    ],
    contactPerson: "Sarah Chen",
    paymentTerms: "Net 15",
  },
  {
    id: "PO-003",
    supplierName: "Industrial Fasteners Inc",
    description: "Bolts, nuts, and fastening hardware",
    status: "delivered",
    totalAmount: 3200,
    orderDate: "2024-01-10",
    expectedDelivery: "2024-01-18",
    actualDelivery: "2024-01-17",
    items: [
      { name: "Hex bolts M12", quantity: 500, unit: "pieces", unitPrice: 2.5, total: 1250 },
      { name: "Lock nuts M12", quantity: 500, unit: "pieces", unitPrice: 1.8, total: 900 },
      { name: "Washers M12", quantity: 1000, unit: "pieces", unitPrice: 1.05, total: 1050 },
    ],
    contactPerson: "Robert Kim",
    paymentTerms: "Net 30",
  },
];

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function PurchaseOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = mockPurchaseOrders.filter((order) => {
    const matchesSearch = 
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-muted-foreground">
            Manage purchase orders for materials and supplies
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search purchase orders..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {order.description}
                  </CardDescription>
                </div>
                <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{order.supplierName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Order Date: {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Expected: {new Date(order.expectedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                  {order.actualDelivery && (
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        Delivered: {new Date(order.actualDelivery).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-bold">${order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Contact: </span>
                    <span className="font-medium">{order.contactPerson}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Payment Terms: </span>
                    <span className="font-medium">{order.paymentTerms}</span>
                  </div>
                </div>
              </div>
              
              {/* Items Preview */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Items:</h4>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} ({item.quantity} {item.unit})
                      </span>
                      <span className="font-medium">${item.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm">View Details</Button>
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline">Track Shipment</Button>
                <Button size="sm" variant="outline">Download PDF</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}