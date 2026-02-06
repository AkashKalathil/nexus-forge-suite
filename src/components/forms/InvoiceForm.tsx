import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { invoiceSchema, type InvoiceFormData } from '@/lib/validationSchemas';
import { useCreateInvoice, useUpdateInvoice } from '@/hooks/useInvoices';
import { useCustomers } from '@/hooks/useCustomers';
import { useJobCards } from '@/hooks/useJobCards';
import { useQuotations } from '@/hooks/useQuotations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface InvoiceFormProps {
  invoice?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function InvoiceForm({ invoice, onSuccess, onCancel }: InvoiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();
  const { data: customers = [] } = useCustomers();
  const { data: jobCards = [] } = useJobCards();
  const { data: quotations = [] } = useQuotations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoice_number: invoice?.invoice_number || `INV-${Date.now().toString().slice(-6)}`,
      customer_id: invoice?.customer_id || '',
      job_card_id: invoice?.job_card_id || '',
      quotation_id: invoice?.quotation_id || '',
      status: invoice?.status || 'draft',
      due_date: invoice?.due_date || '',
      subtotal: invoice?.subtotal || 0,
      tax_amount: invoice?.tax_amount || 0,
      total_amount: invoice?.total_amount || 0,
      paid_amount: invoice?.paid_amount || 0,
      payment_terms: invoice?.payment_terms || 'Net 30',
      notes: invoice?.notes || '',
    },
  });

  const subtotal = watch('subtotal');
  const taxAmount = watch('tax_amount');

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        customer_id: data.customer_id || null,
        job_card_id: data.job_card_id || null,
        quotation_id: data.quotation_id || null,
        total_amount: (data.subtotal || 0) + (data.tax_amount || 0),
      };

      if (invoice) {
        await updateInvoice.mutateAsync({ id: invoice.id, updates: submitData });
      } else {
        await createInvoice.mutateAsync(submitData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoice_number">Invoice Number *</Label>
          <Input id="invoice_number" {...register('invoice_number')} />
          {errors.invoice_number && <p className="text-sm text-destructive">{errors.invoice_number.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select defaultValue={invoice?.status || 'draft'} onValueChange={(value) => setValue('status', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer_id">Customer</Label>
          <Select defaultValue={invoice?.customer_id || ''} onValueChange={(value) => setValue('customer_id', value)}>
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
          <Label htmlFor="due_date">Due Date *</Label>
          <Input id="due_date" type="date" {...register('due_date')} />
          {errors.due_date && <p className="text-sm text-destructive">{errors.due_date.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="job_card_id">Related Job Card</Label>
          <Select defaultValue={invoice?.job_card_id || ''} onValueChange={(value) => setValue('job_card_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select job card" />
            </SelectTrigger>
            <SelectContent>
              {jobCards.map((jc) => (
                <SelectItem key={jc.id} value={jc.id}>{jc.job_number} - {jc.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quotation_id">Related Quotation</Label>
          <Select defaultValue={invoice?.quotation_id || ''} onValueChange={(value) => setValue('quotation_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select quotation" />
            </SelectTrigger>
            <SelectContent>
              {quotations.map((q) => (
                <SelectItem key={q.id} value={q.id}>{q.quotation_id} - {q.project_title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="paid_amount">Paid Amount</Label>
          <Input id="paid_amount" type="number" step="0.01" {...register('paid_amount', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_terms">Payment Terms</Label>
        <Input id="payment_terms" {...register('payment_terms')} placeholder="e.g., Net 30" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register('notes')} />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
          {invoice ? 'Update' : 'Create'} Invoice
        </Button>
      </div>
    </form>
  );
}
