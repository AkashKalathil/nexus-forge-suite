// Mock data for ERP system demonstration

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
  paymentTerms: number; // days
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Enquiry {
  id: string;
  customerId: string;
  customerName: string;
  productName: string;
  quantity: number;
  drawingUrl?: string;
  requirements: string;
  status: 'New' | 'Under Review' | 'Quoted' | 'Won' | 'Lost';
  createdAt: string;
  updatedAt: string;
}

export interface Quotation {
  id: string;
  enquiryId: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  validityDays: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Expired';
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  quotationId: string;
  poNumber: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  paymentTerms: number;
  deliveryDate: string;
  status: 'Received' | 'Confirmed' | 'In Production' | 'Completed';
  createdAt: string;
}

export interface JobCard {
  id: string;
  jobNumber: string;
  poId: string;
  productName: string;
  quantity: number;
  rmBatchId: string;
  rmApproved: boolean;
  status: 'Pending RM' | 'In Progress' | 'QC' | 'Completed' | 'Rework';
  currentStage: 'Cutting' | 'Forging' | 'HT' | 'PF' | 'QC' | 'Dispatch';
  createdAt: string;
  completedAt?: string;
}

export interface WipEntry {
  id: string;
  jobCardId: string;
  stage: 'Cutting' | 'Forging' | 'HT' | 'PF' | 'QC' | 'Dispatch';
  operatorId: string;
  operatorName: string;
  toolId?: string;
  qtyIn: number;
  qtyOut: number;
  timeIn: string;
  timeOut?: string;
  remarks?: string;
  status: 'In Progress' | 'Completed' | 'Hold';
}

export interface QcInspection {
  id: string;
  jobCardId: string;
  inspectorId: string;
  inspectorName: string;
  productName: string;
  batchSize: number;
  sampleSize: number;
  ctqChecks: Array<{
    parameter: string;
    specification: string;
    measured: number;
    result: 'Pass' | 'Fail';
  }>;
  overallResult: 'Pass' | 'Fail' | 'Conditional';
  deviations: number;
  remarks?: string;
  inspectedAt: string;
}

export interface Tool {
  id: string;
  toolNumber: string;
  name: string;
  type: string;
  condition: 'Good' | 'Fair' | 'Poor' | 'Maintenance Required';
  edgeLife: number; // percentage
  usageHours: number;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Retired';
}

export interface DispatchOrder {
  id: string;
  jobCardId: string;
  poId: string;
  customerName: string;
  productName: string;
  quantity: number;
  tcUploaded: boolean;
  eWayBillUploaded: boolean;
  packingListUploaded: boolean;
  gatePassUploaded: boolean;
  dispatchDate?: string;
  status: 'Pending Docs' | 'Ready' | 'Dispatched';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  poId: string;
  customerId: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  paidAmount: number;
  createdAt: string;
}

// Mock data instances
export const customers: Customer[] = [
  {
    id: '1',
    name: 'ABC Manufacturing Ltd',
    email: 'contact@abcmfg.com',
    phone: '+91-9876543210',
    address: 'Plot 123, Industrial Area, Mumbai',
    status: 'Active',
    paymentTerms: 30,
    riskLevel: 'Low'
  },
  {
    id: '2',
    name: 'XYZ Industries Pvt Ltd',
    email: 'orders@xyzind.com',
    phone: '+91-9876543211',
    address: 'Sector 45, Gurgaon, Haryana',
    status: 'Active',
    paymentTerms: 45,
    riskLevel: 'Medium'
  }
];

export const enquiries: Enquiry[] = [
  {
    id: 'ENQ001',
    customerId: '1',
    customerName: 'ABC Manufacturing Ltd',
    productName: 'Forged Steel Component',
    quantity: 500,
    requirements: 'Material: EN24, Heat treated to HRC 35-40',
    status: 'Under Review',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: 'ENQ002',
    customerId: '2',
    customerName: 'XYZ Industries Pvt Ltd',
    productName: 'Precision Machined Shaft',
    quantity: 200,
    requirements: 'Material: SS304, Precision tolerance ±0.02mm',
    status: 'Quoted',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-19T11:45:00Z'
  }
];

export const quotations: Quotation[] = [
  {
    id: 'QUO001',
    enquiryId: 'ENQ002',
    quotationNumber: 'QUO-2024-001',
    customerId: '2',
    customerName: 'XYZ Industries Pvt Ltd',
    items: [
      {
        productName: 'Precision Machined Shaft',
        quantity: 200,
        unitPrice: 1250,
        totalPrice: 250000
      }
    ],
    totalAmount: 250000,
    validityDays: 30,
    status: 'Sent',
    createdAt: '2024-01-19T11:45:00Z'
  }
];

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO001',
    quotationId: 'QUO001',
    poNumber: 'PO-XYZ-2024-001',
    customerId: '2',
    customerName: 'XYZ Industries Pvt Ltd',
    totalAmount: 250000,
    paymentTerms: 45,
    deliveryDate: '2024-02-15',
    status: 'In Production',
    createdAt: '2024-01-22T14:30:00Z'
  }
];

export const jobCards: JobCard[] = [
  {
    id: 'JC001',
    jobNumber: 'JC-2024-001',
    poId: 'PO001',
    productName: 'Precision Machined Shaft',
    quantity: 200,
    rmBatchId: 'RM-SS304-001',
    rmApproved: true,
    status: 'In Progress',
    currentStage: 'Forging',
    createdAt: '2024-01-25T09:00:00Z'
  }
];

export const wipEntries: WipEntry[] = [
  {
    id: 'WIP001',
    jobCardId: 'JC001',
    stage: 'Cutting',
    operatorId: 'OP001',
    operatorName: 'Rajesh Kumar',
    toolId: 'T001',
    qtyIn: 200,
    qtyOut: 200,
    timeIn: '2024-01-25T09:00:00Z',
    timeOut: '2024-01-25T17:00:00Z',
    status: 'Completed'
  },
  {
    id: 'WIP002',
    jobCardId: 'JC001',
    stage: 'Forging',
    operatorId: 'OP002',
    operatorName: 'Suresh Patel',
    toolId: 'T002',
    qtyIn: 200,
    qtyOut: 195,
    timeIn: '2024-01-26T08:30:00Z',
    status: 'In Progress'
  }
];

export const qcInspections: QcInspection[] = [
  {
    id: 'QC001',
    jobCardId: 'JC001',
    inspectorId: 'QC001',
    inspectorName: 'Priya Sharma',
    productName: 'Precision Machined Shaft',
    batchSize: 195,
    sampleSize: 20,
    ctqChecks: [
      {
        parameter: 'Diameter',
        specification: '25.00 ± 0.02mm',
        measured: 25.01,
        result: 'Pass'
      },
      {
        parameter: 'Surface Roughness',
        specification: 'Ra 1.6 μm max',
        measured: 1.4,
        result: 'Pass'
      }
    ],
    overallResult: 'Pass',
    deviations: 0,
    inspectedAt: '2024-01-26T16:00:00Z'
  }
];

export const tools: Tool[] = [
  {
    id: 'T001',
    toolNumber: 'T-CUT-001',
    name: 'Carbide Cutting Tool',
    type: 'Cutting',
    condition: 'Good',
    edgeLife: 75,
    usageHours: 125,
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-02-10',
    status: 'Available'
  },
  {
    id: 'T002',
    toolNumber: 'T-FOR-001',
    name: 'Forging Die Set',
    type: 'Forging',
    condition: 'Fair',
    edgeLife: 45,
    usageHours: 275,
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-01-25',
    status: 'In Use'
  }
];

export const dispatchOrders: DispatchOrder[] = [
  {
    id: 'DISP001',
    jobCardId: 'JC001',
    poId: 'PO001',
    customerName: 'XYZ Industries Pvt Ltd',
    productName: 'Precision Machined Shaft',
    quantity: 195,
    tcUploaded: true,
    eWayBillUploaded: false,
    packingListUploaded: true,
    gatePassUploaded: false,
    status: 'Pending Docs'
  }
];

export const invoices: Invoice[] = [
  {
    id: 'INV001',
    invoiceNumber: 'INV-2024-001',
    poId: 'PO001',
    customerId: '2',
    customerName: 'XYZ Industries Pvt Ltd',
    amount: 243750, // 195 * 1250
    dueDate: '2024-03-15',
    status: 'Sent',
    paidAmount: 0,
    createdAt: '2024-01-28T10:00:00Z'
  }
];