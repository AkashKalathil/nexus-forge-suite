import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  // Include job card data
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
    mutationFn: async (inspection: Omit<QualityInspection, 'id' | 'created_at' | 'updated_at' | 'job_cards'>) => {
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
    },
  });
}