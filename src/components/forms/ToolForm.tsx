import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toolSchema, type ToolFormData } from '@/lib/validationSchemas';
import { useCreateTool, useUpdateTool } from '@/hooks/useTools';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ToolFormProps {
  tool?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ToolForm({ tool, onSuccess, onCancel }: ToolFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTool = useCreateTool();
  const updateTool = useUpdateTool();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      tool_id: tool?.tool_id || `TOOL-${Date.now().toString().slice(-6)}`,
      name: tool?.name || '',
      type: tool?.type || '',
      manufacturer: tool?.manufacturer || '',
      model: tool?.model || '',
      serial_number: tool?.serial_number || '',
      location: tool?.location || '',
      status: tool?.status || 'available',
      condition: tool?.condition || 'good',
      purchase_date: tool?.purchase_date || '',
      purchase_cost: tool?.purchase_cost || undefined,
      last_maintenance: tool?.last_maintenance || '',
      next_maintenance: tool?.next_maintenance || '',
      maintenance_interval_days: tool?.maintenance_interval_days || 365,
      notes: tool?.notes || '',
    },
  });

  const onSubmit = async (data: ToolFormData) => {
    setIsSubmitting(true);
    try {
      if (tool) {
        await updateTool.mutateAsync({ id: tool.id, updates: data });
      } else {
        await createTool.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save tool:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tool_id">Tool ID *</Label>
          <Input id="tool_id" {...register('tool_id')} />
          {errors.tool_id && <p className="text-sm text-destructive">{errors.tool_id.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Input id="type" {...register('type')} placeholder="e.g., CNC Machine, Welding Equipment" />
          {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input id="manufacturer" {...register('manufacturer')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" {...register('model')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serial_number">Serial Number</Label>
          <Input id="serial_number" {...register('serial_number')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" {...register('location')} placeholder="e.g., Production Floor A" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select defaultValue={tool?.status || 'available'} onValueChange={(value) => setValue('status', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in_use">In Use</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="out_of_order">Out of Order</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select defaultValue={tool?.condition || 'good'} onValueChange={(value) => setValue('condition', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="needs_repair">Needs Repair</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchase_date">Purchase Date</Label>
          <Input id="purchase_date" type="date" {...register('purchase_date')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchase_cost">Purchase Cost</Label>
          <Input id="purchase_cost" type="number" step="0.01" {...register('purchase_cost', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="last_maintenance">Last Maintenance</Label>
          <Input id="last_maintenance" type="date" {...register('last_maintenance')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="next_maintenance">Next Maintenance</Label>
          <Input id="next_maintenance" type="date" {...register('next_maintenance')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maintenance_interval_days">Interval (days)</Label>
          <Input id="maintenance_interval_days" type="number" {...register('maintenance_interval_days', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register('notes')} />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
          {tool ? 'Update' : 'Add'} Tool
        </Button>
      </div>
    </form>
  );
}
