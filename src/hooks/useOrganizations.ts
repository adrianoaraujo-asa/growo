import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
type OrganizationInsert = Database["public"]["Tables"]["organizations"]["Insert"];
type OrganizationUpdate = Database["public"]["Tables"]["organizations"]["Update"];

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function useOrganizations() {
  const queryClient = useQueryClient();

  const {
    data: organizations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Organization[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<OrganizationInsert>) => {
      const slug = generateSlug(data.name || "org");
      const { data: result, error } = await supabase
        .from("organizations")
        .insert({
          ...data,
          slug,
        } as OrganizationInsert)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organização criada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating organization:", error);
      toast.error("Erro ao criar organização");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: OrganizationUpdate & { id: string }) => {
      const { data: result, error } = await supabase
        .from("organizations")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organização atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating organization:", error);
      toast.error("Erro ao atualizar organização");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Soft delete
      const { error } = await supabase
        .from("organizations")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organização excluída com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting organization:", error);
      toast.error("Erro ao excluir organização");
    },
  });

  return {
    organizations,
    isLoading,
    error,
    createOrganization: createMutation.mutateAsync,
    updateOrganization: updateMutation.mutateAsync,
    deleteOrganization: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
