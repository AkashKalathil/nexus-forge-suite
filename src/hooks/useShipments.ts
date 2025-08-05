import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useShipments = () => {
  return useQuery({
    queryKey: ["shipments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipments")
        .select(`
          *,
          customer:customers(*),
          job_card:job_cards(*),
          shipment_items(*)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateShipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (shipment: any) => {
      const { data, error } = await supabase
        .from("shipments")
        .insert(shipment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      toast.success("Shipment created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create shipment");
      console.error(error);
    },
  });
};

export const useUpdateShipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from("shipments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      toast.success("Shipment updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update shipment");
      console.error(error);
    },
  });
};

export const useDeleteShipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("shipments")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      toast.success("Shipment deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete shipment");
      console.error(error);
    },
  });
};