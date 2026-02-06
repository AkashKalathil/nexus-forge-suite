import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface QualityInspection {
  id: string;
  job_card_id?: string;
  inspection_type: string;
  inspector_name: string;
  status: string;
  notes?: string;
  defects_found: number;
  inspection_date?: string;
  created_at: string;
  updated_at: string;
  job_cards?: {
    job_number: string;
    title: string;
  };
}

export function useQualityInspections() {
  return useQuery({
    queryKey: ['quality_inspections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quality_inspections')
        .select(`
          *,
          job_cards (
            job_number,
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as QualityInspection[];
    },
  });
}

export function useCreateQualityInspection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (inspection: any) => {
      const { data, error } = await supabase
        .from('quality_inspections')
        .insert([inspection])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quality_inspections'] });
      toast.success('Quality inspection created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create quality inspection');
      console.error(error);
    },
  });
}

export function useUpdateQualityInspection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('quality_inspections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quality_inspections'] });
      toast.success('Quality inspection updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update quality inspection');
      console.error(error);
    },
  });
}

export function useDeleteQualityInspection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('quality_inspections')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quality_inspections'] });
      toast.success('Quality inspection deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete quality inspection');
      console.error(error);
    },
  });
}