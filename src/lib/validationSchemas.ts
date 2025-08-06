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
  customer_id: z.string().uuid('Please select a customer').optional(),
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
  status: z.enum(['new', 'contacted', 'quoted', 'won', 'lost'], {
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
  status: z.enum(['available', 'in_use', 'maintenance', 'retired'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }).default('available'),
  condition: z.enum(['excellent', 'good', 'fair', 'poor'], {
    errorMap: () => ({ message: 'Please select a valid condition' })
  }).default('good'),
  purchase_date: z.string().optional(),
  purchase_cost: z.number().min(0, 'Cost must be positive').optional(),
  last_maintenance: z.string().optional(),
  next_maintenance: z.string().optional(),
  maintenance_interval_days: z.number().min(1, 'Interval must be at least 1 day').optional(),
  notes: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
export type JobCardFormData = z.infer<typeof jobCardSchema>;
export type EnquiryFormData = z.infer<typeof enquirySchema>;
export type ToolFormData = z.infer<typeof toolSchema>;