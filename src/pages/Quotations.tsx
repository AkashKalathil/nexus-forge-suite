import { useState } from "react";
import { Plus, Search, Calendar, DollarSign, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuotations } from "@/hooks/useQuotations";

// Mock data for quotations
const mockQuotations = [
  {
    id: "QUO-001",
    customerName: "ABC Manufacturing",
    projectTitle: "Custom Steel Fabrication",
    description: "Steel brackets and mounting hardware for industrial equipment",
    status: "sent",
    totalAmount: 15000,
    validUntil: "2024-02-15",
    createdAt: "2024-01-15",
    enquiryId: "ENQ-001",
    lineItems: [
      { description: "Steel brackets (20 units)", quantity: 20, unitPrice: 500, total: 10000 },
      { description: "Mounting hardware kit", quantity: 5, unitPrice: 1000, total: 5000 },
    ],
  },
  {
    id: "QUO-002",
    customerName: "TechCorp Solutions",
    projectTitle: "Precision Machining Services",
    description: "High-precision components for aerospace application",
    status: "approved",
    totalAmount: 28000,
    validUntil: "2024-02-20",
    createdAt: "2024-01-14",
    enquiryId: "ENQ-002",
    lineItems: [
      { description: "Precision machined parts", quantity: 100, unitPrice: 250, total: 25000 },
      { description: "Quality inspection", quantity: 1, unitPrice: 3000, total: 3000 },
    ],
  },
  {
    id: "QUO-003",
    customerName: "AutoParts Inc",
    projectTitle: "Bulk Production Order",
    description: "Large scale production of automotive brake components",
    status: "draft",
    totalAmount: 75000,
    validUntil: "2024-03-01",
    createdAt: "2024-01-16",
    enquiryId: "ENQ-003",
    lineItems: [
      { description: "Brake disc components", quantity: 1000, unitPrice: 60, total: 60000 },
      { description: "Assembly services", quantity: 1000, unitPrice: 15, total: 15000 },
    ],
  },
];

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-orange-100 text-orange-800",
};

export default function Quotations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: quotations = [], isLoading } = useQuotations();

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch = 
      quotation.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.project_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.quotation_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || quotation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">
            Create and manage price quotations for customer projects
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Quotation
        </Button>
      </div>

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
        {filteredQuotations.map((quotation) => (
          <Card key={quotation.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{quotation.quotation_id}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {quotation.project_title}
                  </CardDescription>
                </div>
                <Badge className={statusColors[quotation.status as keyof typeof statusColors]}>
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
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Line Items:</h4>
                <div className="space-y-1">
                  {quotation.quotation_items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.description} (x{item.quantity})
                      </span>
                      <span className="font-medium">${item.total_price?.toLocaleString()}</span>
                    </div>
                  ))}
                  {!quotation.quotation_items?.length && (
                    <span className="text-sm text-muted-foreground">No items added</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm">View Details</Button>
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline">Send to Customer</Button>
                <Button size="sm" variant="outline">Download PDF</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}