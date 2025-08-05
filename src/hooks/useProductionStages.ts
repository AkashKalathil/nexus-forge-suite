import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProductionStages = () => {
  return useQuery({
    queryKey: ["production-stages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("production_stages")
        .select("*")
        .order("sequence_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useProductionCapacity = () => {
  return useQuery({
    queryKey: ["production-capacity"],
    queryFn: async () => {
      // Get all production stages
      const { data: stages, error: stagesError } = await supabase
        .from("production_stages")
        .select("*")
        .order("sequence_order", { ascending: true });

      if (stagesError) throw stagesError;

      // Get job card stages to calculate capacity
      const { data: jobCardStages, error: jobStagesError } = await supabase
        .from("job_card_stages")
        .select(`
          *,
          stage:production_stages(name)
        `)
        .eq("status", "in_progress");

      if (jobStagesError) throw jobStagesError;

      // Calculate capacity for each stage
      const capacityData = stages?.map(stage => {
        const activeJobs = jobCardStages?.filter(
          jcs => jcs.stage_id === stage.id
        ).length || 0;
        
        // Assume max capacity of 10 jobs per stage for calculation
        const maxCapacity = 10;
        const capacityPercentage = Math.min((activeJobs / maxCapacity) * 100, 100);
        
        return {
          name: stage.name,
          capacity: Math.round(capacityPercentage),
          activeJobs,
          maxCapacity
        };
      }) || [];

      return capacityData;
    },
  });
};