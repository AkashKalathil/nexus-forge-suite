import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEnquiries = () => {
  return useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateEnquiry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (enquiry: any) => {
      const { data, error } = await supabase
        .from("enquiries")
        .insert(enquiry)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Enquiry created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create enquiry");
      console.error(error);
    },
  });
};