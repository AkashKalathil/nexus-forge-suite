import { z } from 'zod';

// Customer validation schema
export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  contact_person: z.string().optional(),
  industry: z.string().optional(),
  status: z.enum(['active', 'inactive', 'prospect'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }).default('active'),
});

// Job Card validation schema
export const jobCardSchema = z.object({
  job_number: z.string().min(1, 'Job number is required'),
  customer_id: z.string().uuid('Please select a customer').optional().or(z.literal('')),
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    errorMap: () => ({ message: 'Please select a valid priority' })
  }).default('medium'),
  status: z.enum(['pending', 'in_progress', 'review', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }).default('pending'),
  assigned_to: z.string().optional(),
  due_date: z.string().optional(),
  estimated_hours: z.number().min(0, 'Hours must be positive').optional(),
  actual_hours: z.number().min(0, 'Hours must be positive').optional(),
});

// Enquiry validation schema
export const enquirySchema = z.object({
  enquiry_id: z.string().min(1, 'Enquiry ID is required'),
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  customer_phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
  status: z.enum(['new', 'open', 'under_review', 'converted', 'closed'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }).default('new'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    errorMap: () => ({ message: 'Please select a valid priority' })
  }).default('medium'),
  estimated_value: z.number().min(0, 'Value must be positive').optional(),
  follow_up_date: z.string().optional(),
});

// Tool validation schema
export const toolSchema = z.object({
  tool_id: z.string().min(1, 'Tool ID is required'),
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['available', 'in_use', 'maintenance', 'out_of_order', 'retired'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }).default('available'),
  condition: z.enum(['excellent', 'good', 'fair', 'needs_repair'], {
    errorMap: () => ({ message: 'Please select a valid condition' })
  }).default('good'),
  purchase_date: z.string().optional(),
  purchase_cost: z.number().min(0, 'Cost must be positive').optional(),
  last_maintenance: z.string().optional(),
  next_maintenance: z.string().optional(),
  maintenance_interval_days: z.number().min(1, 'Interval must be at least 1 day').optional(),
  notes: z.string().optional(),
});

// Quotation validation schema
export const quotationSchema = z.object({
  quotation_id: z.string().min(1, 'Quotation ID is required'),
  customer_id: z.string().uuid('Please select a customer').optional().or(z.literal('')),
  enquiry_id: z.string().uuid('Please select an enquiry').optional().or(z.literal('')),
  project_title: z.string().min(1, 'Project title is required'),
  description: z.string().optional(),
  status: z.enum(['draft', 'sent', 'approved', 'rejected', 'expired'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }).default('draft'),
  valid_until: z.string().optional(),
  subtotal: z.number().min(0, 'Subtotal must be positive').default(0),
  tax_amount: z.number().min(0, 'Tax must be positive').default(0),
  total_amount: z.number().min(0, 'Total must be positive').default(0),
  terms_conditions: z.string().optional(),
});

// Invoice validation schema
export const invoiceSchema = z.object({
  invoice_number: z.string().min(1, 'Invoice number is required'),
  customer_id: z.string().uuid('Please select a customer').optional().or(z.literal('')),
  job_card_id: z.string().uuid('Please select a job card').optional().or(z.literal('')),
  quotation_id: z.string().uuid('Please select a quotation').optional().or(z.literal('')),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }).default('draft'),
  due_date: z.string().min(1, 'Due date is required'),
  subtotal: z.number().min(0, 'Subtotal must be positive').default(0),
  tax_amount: z.number().min(0, 'Tax must be positive').default(0),
  total_amount: z.number().min(0, 'Total must be positive').default(0),
  paid_amount: z.number().min(0, 'Paid amount must be positive').default(0),
  payment_terms: z.string().optional(),
  notes: z.string().optional(),
});

// Quality Inspection validation schema
export const qualityInspectionSchema = z.object({
  job_card_id: z.string().uuid('Please select a job card').optional().or(z.literal('')),
  inspection_type: z.string().min(1, 'Inspection type is required'),
  inspector_name: z.string().min(1, 'Inspector name is required'),
  status: z.enum(['pending', 'in_progress', 'passed', 'failed', 'conditional'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }).default('pending'),
  defects_found: z.number().min(0, 'Defects must be positive').default(0),
  notes: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
export type JobCardFormData = z.infer<typeof jobCardSchema>;
export type EnquiryFormData = z.infer<typeof enquirySchema>;
export type ToolFormData = z.infer<typeof toolSchema>;
export type QuotationFormData = z.infer<typeof quotationSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type QualityInspectionFormData = z.infer<typeof qualityInspectionSchema>;