import { useState } from "react";
import { Plus, Search, DollarSign, Calendar, FileText, Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for invoices
const mockInvoices = [
  {
    id: "INV-001",
    jobCardId: "JOB-001",
    quotationId: "QUO-001",
    customerName: "ABC Manufacturing",
    status: "sent",
    amount: 15000,
    taxAmount: 1950,
    totalAmount: 16950,
    issueDate: "2024-01-18",
    dueDate: "2024-02-17",
    paidDate: null,
    paymentTerms: "Net 30",
    currency: "USD",
    lineItems: [
      { description: "Custom Steel Brackets (20 units)", quantity: 20, unitPrice: 500, total: 10000 },
      { description: "Mounting Hardware Kit (5 units)", quantity: 5, unitPrice: 1000, total: 5000 },
    ],
    customerDetails: {
      address: "123 Industrial Way, Factory City, FC 12345",
      contact: "John Smith",
      email: "john@abcmfg.com",
    },
  },
  {
    id: "INV-002",
    jobCardId: "JOB-002",
    quotationId: "QUO-002",
    customerName: "TechCorp Solutions",
    status: "paid",
    amount: 28000,
    taxAmount: 3640,
    totalAmount: 31640,
    issueDate: "2024-01-16",
    dueDate: "2024-02-15",
    paidDate: "2024-01-20",
    paymentTerms: "Net 30",
    currency: "USD",
    lineItems: [
      { description: "Precision Machined Parts (100 units)", quantity: 100, unitPrice: 250, total: 25000 },
      { description: "Quality Inspection", quantity: 1, unitPrice: 3000, total: 3000 },
    ],
    customerDetails: {
      address: "456 Tech Boulevard, Innovation City, IC 67890",
      contact: "Sarah Johnson",
      email: "sarah@techcorp.com",
    },
  },
  {
    id: "INV-003",
    jobCardId: "JOB-003",
    quotationId: "QUO-003",
    customerName: "AutoParts Inc",
    status: "overdue",
    amount: 75000,
    taxAmount: 9750,
    totalAmount: 84750,
    issueDate: "2023-12-15",
    dueDate: "2024-01-14",
    paidDate: null,
    paymentTerms: "Net 30",
    currency: "USD",
    lineItems: [
      { description: "Brake Disc Components (1000 units)", quantity: 1000, unitPrice: 60, total: 60000 },
      { description: "Assembly Services (1000 units)", quantity: 1000, unitPrice: 15, total: 15000 },
    ],
    customerDetails: {
      address: "789 Auto Drive, Motor City, MC 13579",
      contact: "Mike Wilson",
      email: "mike@autoparts.com",
    },
  },
  {
    id: "INV-004",
    jobCardId: "JOB-004",
    quotationId: "QUO-004",
    customerName: "Marine Solutions Ltd",
    status: "draft",
    amount: 42000,
    taxAmount: 5460,
    totalAmount: 47460,
    issueDate: "2024-01-19",
    dueDate: "2024-02-18",
    paidDate: null,
    paymentTerms: "Net 30",
    currency: "USD",
    lineItems: [
      { description: "Marine Grade Steel Fabrication", quantity: 1, unitPrice: 35000, total: 35000 },
      { description: "Corrosion Protection Coating", quantity: 1, unitPrice: 7000, total: 7000 },
    ],
    customerDetails: {
      address: "321 Harbor View, Coastal City, CC 24680",
      contact: "Captain Anderson",
      email: "anderson@marinesolutions.com",
    },
  },
];

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch = 
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.jobCardId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = filteredInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalPaid = filteredInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Manage customer invoices and payment tracking
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

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
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{invoice.id}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {invoice.customerName}
                  </CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-2xl font-bold">${invoice.totalAmount.toLocaleString()}</span>
                  <Badge className={statusColors[invoice.status as keyof typeof statusColors]}>
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
                    <span className="font-medium">{invoice.jobCardId}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Quotation: </span>
                    <span className="font-medium">{invoice.quotationId}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Contact: </span>
                    <span className="font-medium">{invoice.customerDetails.contact}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Payment Terms: </span>
                    <span className="font-medium">{invoice.paymentTerms}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Issued: </span>
                    <span className="font-medium">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Due: </span>
                    <span className={`font-medium ${invoice.status === 'overdue' ? 'text-red-600' : ''}`}>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {invoice.paidDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">Paid: </span>
                      <span className="font-medium text-green-600">
                        {new Date(invoice.paidDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="pt-2 space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Subtotal: </span>
                      <span className="font-medium">${invoice.amount.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Tax: </span>
                      <span className="font-medium">${invoice.taxAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Line Items Preview */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Line Items:</h4>
                <div className="space-y-1">
                  {invoice.lineItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.description}
                      </span>
                      <span className="font-medium">${item.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm">View Details</Button>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button size="sm" variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  Send to Customer
                </Button>
                <Button size="sm" variant="outline">Mark as Paid</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}