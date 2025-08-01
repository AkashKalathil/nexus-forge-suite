import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface JobCard {
  id: string;
  job_number: string;
  customer_id?: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  assigned_to?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_at: string;
  updated_at: string;
  // Include customer data
  customers?: {
    name: string;
  };
}

export function useJobCards() {
  return useQuery({
    queryKey: ['job_cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_cards')
        .select(`
          *,
          customers (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as JobCard[];
    },
  });
}

export function useCreateJobCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobCard: Omit<JobCard, 'id' | 'created_at' | 'updated_at' | 'customers'>) => {
      const { data, error } = await supabase
        .from('job_cards')
        .insert([jobCard])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_cards'] });
    },
  });
}