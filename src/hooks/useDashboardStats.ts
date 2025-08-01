import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  activeJobCards: number;
  activeCustomers: number;
  pendingInspections: number;
  completedJobCards: number;
  inProgressJobCards: number;
  urgentJobCards: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      // Get job card statistics
      const { data: jobCards, error: jobCardsError } = await supabase
        .from('job_cards')
        .select('status, priority');

      if (jobCardsError) throw jobCardsError;

      // Get customer count
      const { count: customerCount, error: customerError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (customerError) throw customerError;

      // Get quality inspection statistics
      const { data: inspections, error: inspectionsError } = await supabase
        .from('quality_inspections')
        .select('status');

      if (inspectionsError) throw inspectionsError;

      const stats: DashboardStats = {
        activeJobCards: jobCards?.filter(jc => jc.status !== 'completed' && jc.status !== 'cancelled').length || 0,
        activeCustomers: customerCount || 0,
        pendingInspections: inspections?.filter(i => i.status === 'pending').length || 0,
        completedJobCards: jobCards?.filter(jc => jc.status === 'completed').length || 0,
        inProgressJobCards: jobCards?.filter(jc => jc.status === 'in_progress').length || 0,
        urgentJobCards: jobCards?.filter(jc => jc.priority === 'urgent').length || 0,
      };

      return stats;
    },
  });
}