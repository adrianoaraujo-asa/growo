import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Address = Database["public"]["Tables"]["addresses"]["Row"];
type AddressInsert = Database["public"]["Tables"]["addresses"]["Insert"];
type AddressUpdate = Database["public"]["Tables"]["addresses"]["Update"];

interface UseAddressesOptions {
  addressableType: "organization" | "user" | "customer" | "professional";
  addressableId: string;
}

export function useAddresses({ addressableType, addressableId }: UseAddressesOptions) {
  const queryClient = useQueryClient();

  const queryKey = ["addresses", addressableType, addressableId];

  const { data: addresses = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("addressable_type", addressableType)
        .eq("addressable_id", addressableId)
        .is("deleted_at", null)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Address[];
    },
    enabled: !!addressableId,
  });

  const createAddress = useMutation({
    mutationFn: async (address: Omit<AddressInsert, "addressable_type" | "addressable_id">) => {
      const { data, error } = await supabase
        .from("addresses")
        .insert({
          ...address,
          addressable_type: addressableType,
          addressable_id: addressableId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Endereço adicionado com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error creating address:", error);
      toast.error("Erro ao adicionar endereço");
    },
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, ...updates }: AddressUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("addresses")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Endereço atualizado com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error updating address:", error);
      toast.error("Erro ao atualizar endereço");
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("addresses")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Endereço removido com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error deleting address:", error);
      toast.error("Erro ao remover endereço");
    },
  });

  const setPrimaryAddress = useMutation({
    mutationFn: async (id: string) => {
      // First, unset all primary addresses
      await supabase
        .from("addresses")
        .update({ is_primary: false })
        .eq("addressable_type", addressableType)
        .eq("addressable_id", addressableId);

      // Then set the new primary
      const { error } = await supabase
        .from("addresses")
        .update({ is_primary: true })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Endereço principal atualizado!");
    },
    onError: (error: Error) => {
      console.error("Error setting primary address:", error);
      toast.error("Erro ao definir endereço principal");
    },
  });

  return {
    addresses,
    isLoading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    setPrimaryAddress,
  };
}
