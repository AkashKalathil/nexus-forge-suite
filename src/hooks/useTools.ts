import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTools = () => {
  return useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tool: any) => {
      const { data, error } = await supabase
        .from("tools")
        .insert(tool)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      toast.success("Tool added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add tool");
      console.error(error);
    },
  });
};

export const useUpdateTool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from("tools")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      toast.success("Tool updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update tool");
      console.error(error);
    },
  });
};

export const useDeleteTool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tools")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      toast.success("Tool deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete tool");
      console.error(error);
    },
  });
};