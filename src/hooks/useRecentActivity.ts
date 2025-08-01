import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityItem {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  description?: string;
  user_name?: string;
  metadata?: any;
  created_at: string;
}

export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: ['recent_activity', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as ActivityItem[];
    },
  });
}