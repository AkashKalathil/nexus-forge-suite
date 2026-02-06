import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { qualityInspectionSchema, type QualityInspectionFormData } from '@/lib/validationSchemas';
import { useCreateQualityInspection, useUpdateQualityInspection } from '@/hooks/useQualityInspections';
import { useJobCards } from '@/hooks/useJobCards';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface QualityInspectionFormProps {
  inspection?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function QualityInspectionForm({ inspection, onSuccess, onCancel }: QualityInspectionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createInspection = useCreateQualityInspection();
  const updateInspection = useUpdateQualityInspection();
  const { data: jobCards = [] } = useJobCards();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QualityInspectionFormData>({
    resolver: zodResolver(qualityInspectionSchema),
    defaultValues: {
      job_card_id: inspection?.job_card_id || '',
      inspection_type: inspection?.inspection_type || '',
      inspector_name: inspection?.inspector_name || '',
      status: inspection?.status || 'pending',
      defects_found: inspection?.defects_found || 0,
      notes: inspection?.notes || '',
    },
  });

  const onSubmit = async (data: QualityInspectionFormData) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        job_card_id: data.job_card_id || null,
      };

      if (inspection) {
        await updateInspection.mutateAsync({ id: inspection.id, updates: submitData });
      } else {
        await createInspection.mutateAsync(submitData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save inspection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="job_card_id">Job Card</Label>
        <Select defaultValue={inspection?.job_card_id || ''} onValueChange={(value) => setValue('job_card_id', value)}>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inspection_type">Inspection Type *</Label>
          <Select defaultValue={inspection?.inspection_type || ''} onValueChange={(value) => setValue('inspection_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="incoming">Incoming Material</SelectItem>
              <SelectItem value="in_process">In-Process</SelectItem>
              <SelectItem value="final">Final Inspection</SelectItem>
              <SelectItem value="sampling">Random Sampling</SelectItem>
              <SelectItem value="audit">Quality Audit</SelectItem>
            </SelectContent>
          </Select>
          {errors.inspection_type && <p className="text-sm text-destructive">{errors.inspection_type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select defaultValue={inspection?.status || 'pending'} onValueChange={(value) => setValue('status', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="passed">Passed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="conditional">Conditional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inspector_name">Inspector Name *</Label>
          <Input id="inspector_name" {...register('inspector_name')} />
          {errors.inspector_name && <p className="text-sm text-destructive">{errors.inspector_name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="defects_found">Defects Found</Label>
          <Input id="defects_found" type="number" {...register('defects_found', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register('notes')} placeholder="Enter inspection notes, observations, or findings..." />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
          {inspection ? 'Update' : 'Create'} Inspection
        </Button>
      </div>
    </form>
  );
}
