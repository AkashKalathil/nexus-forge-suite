import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { quotationSchema, type QuotationFormData } from '@/lib/validationSchemas';
import { useCreateQuotation, useUpdateQuotation } from '@/hooks/useQuotations';
import { useCustomers } from '@/hooks/useCustomers';
import { useEnquiries } from '@/hooks/useEnquiries';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface QuotationFormProps {
  quotation?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function QuotationForm({ quotation, onSuccess, onCancel }: QuotationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createQuotation = useCreateQuotation();
  const updateQuotation = useUpdateQuotation();
  const { data: customers = [] } = useCustomers();
  const { data: enquiries = [] } = useEnquiries();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      quotation_id: quotation?.quotation_id || `QUO-${Date.now().toString().slice(-6)}`,
      customer_id: quotation?.customer_id || '',
      enquiry_id: quotation?.enquiry_id || '',
      project_title: quotation?.project_title || '',
      description: quotation?.description || '',
      status: quotation?.status || 'draft',
      valid_until: quotation?.valid_until || '',
      subtotal: quotation?.subtotal || 0,
      tax_amount: quotation?.tax_amount || 0,
      total_amount: quotation?.total_amount || 0,
      terms_conditions: quotation?.terms_conditions || '',
    },
  });

  const subtotal = watch('subtotal');
  const taxAmount = watch('tax_amount');

  const onSubmit = async (data: QuotationFormData) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        customer_id: data.customer_id || null,
        enquiry_id: data.enquiry_id || null,
        total_amount: (data.subtotal || 0) + (data.tax_amount || 0),
      };

      if (quotation) {
        await updateQuotation.mutateAsync({ id: quotation.id, updates: submitData });
      } else {
        await createQuotation.mutateAsync(submitData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save quotation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quotation_id">Quotation ID *</Label>
          <Input id="quotation_id" {...register('quotation_id')} />
          {errors.quotation_id && <p className="text-sm text-destructive">{errors.quotation_id.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select defaultValue={quotation?.status || 'draft'} onValueChange={(value) => setValue('status', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_title">Project Title *</Label>
        <Input id="project_title" {...register('project_title')} />
        {errors.project_title && <p className="text-sm text-destructive">{errors.project_title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer_id">Customer</Label>
          <Select defaultValue={quotation?.customer_id || ''} onValueChange={(value) => setValue('customer_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="enquiry_id">Related Enquiry</Label>
          <Select defaultValue={quotation?.enquiry_id || ''} onValueChange={(value) => setValue('enquiry_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select enquiry" />
            </SelectTrigger>
            <SelectContent>
              {enquiries.map((enquiry) => (
                <SelectItem key={enquiry.id} value={enquiry.id}>{enquiry.enquiry_id} - {enquiry.subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subtotal">Subtotal</Label>
          <Input id="subtotal" type="number" step="0.01" {...register('subtotal', { valueAsNumber: true })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax_amount">Tax Amount</Label>
          <Input id="tax_amount" type="number" step="0.01" {...register('tax_amount', { valueAsNumber: true })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="total">Total</Label>
          <Input id="total" type="number" value={(subtotal || 0) + (taxAmount || 0)} disabled />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="valid_until">Valid Until</Label>
        <Input id="valid_until" type="date" {...register('valid_until')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="terms_conditions">Terms & Conditions</Label>
        <Textarea id="terms_conditions" {...register('terms_conditions')} />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
          {quotation ? 'Update' : 'Create'} Quotation
        </Button>
      </div>
    </form>
  );
}
