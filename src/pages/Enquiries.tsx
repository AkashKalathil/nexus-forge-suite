import { useState } from "react";
import { Plus, Search, Filter, Calendar, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEnquiries } from "@/hooks/useEnquiries";

// Mock data for enquiries
const mockEnquiries = [
  {
    id: "ENQ-001",
    customerName: "ABC Manufacturing",
    contactPerson: "John Smith",
    email: "john@abcmfg.com",
    phone: "+1 234 567 8900",
    subject: "Custom Steel Fabrication",
    description: "Need custom steel brackets for industrial equipment",
    status: "open",
    priority: "high",
    createdAt: "2024-01-15",
    estimatedValue: 15000,
  },
  {
    id: "ENQ-002",
    customerName: "TechCorp Solutions",
    contactPerson: "Sarah Johnson",
    email: "sarah@techcorp.com",
    phone: "+1 234 567 8901",
    subject: "Precision Machining Services",
    description: "Require precision machined components for aerospace project",
    status: "under_review",
    priority: "medium",
    createdAt: "2024-01-14",
    estimatedValue: 25000,
  },
  {
    id: "ENQ-003",
    customerName: "AutoParts Inc",
    contactPerson: "Mike Wilson",
    email: "mike@autoparts.com",
    phone: "+1 234 567 8902",
    subject: "Bulk Production Order",
    description: "Large scale production of automotive components",
    status: "converted",
    priority: "urgent",
    createdAt: "2024-01-13",
    estimatedValue: 50000,
  },
];

const statusColors = {
  open: "bg-blue-100 text-blue-800",
  under_review: "bg-yellow-100 text-yellow-800",
  converted: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

export default function Enquiries() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  
  const { data: enquiries = [], isLoading } = useEnquiries();

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch = 
      enquiry.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.enquiry_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || enquiry.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enquiries</h1>
          <p className="text-muted-foreground">
            Manage customer enquiries and potential business opportunities
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Enquiry
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search enquiries..."
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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

      {/* Enquiries List */}
      <div className="grid gap-4">
        {filteredEnquiries.map((enquiry) => (
          <Card key={enquiry.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{enquiry.enquiry_id}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {enquiry.subject}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={priorityColors[enquiry.priority as keyof typeof priorityColors]}>
                    {enquiry.priority}
                  </Badge>
                  <Badge className={statusColors[enquiry.status as keyof typeof statusColors]}>
                    {enquiry.status?.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{enquiry.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{enquiry.customer_email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{enquiry.customer_phone || 'Not provided'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {enquiry.description || 'No description provided'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Created: {new Date(enquiry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Estimated Value: </span>
                    <span className="font-medium">${enquiry.estimated_value?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm">View Details</Button>
                <Button size="sm" variant="outline">Convert to Quote</Button>
                <Button size="sm" variant="outline">Contact Customer</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}