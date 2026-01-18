import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];
type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"];

export interface ContactWithMeta extends Contact {
  contactable_type: string;
  contactable_id: string;
}

interface UseContactsOptions {
  contactableType: "organization" | "user" | "customer" | "professional";
  contactableId: string;
}

export function useContacts({ contactableType, contactableId }: UseContactsOptions) {
  const queryClient = useQueryClient();

  const queryKey = ["contacts", contactableType, contactableId];

  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("contactable_type", contactableType)
        .eq("contactable_id", contactableId)
        .is("deleted_at", null)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Contact[];
    },
    enabled: !!contactableId,
  });

  const createContact = useMutation({
    mutationFn: async (contact: Omit<ContactInsert, "contactable_type" | "contactable_id">) => {
      const { data, error } = await supabase
        .from("contacts")
        .insert({
          ...contact,
          contactable_type: contactableType,
          contactable_id: contactableId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Contato adicionado com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error creating contact:", error);
      toast.error("Erro ao adicionar contato");
    },
  });

  const updateContact = useMutation({
    mutationFn: async ({ id, ...updates }: ContactUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("contacts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Contato atualizado com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error updating contact:", error);
      toast.error("Erro ao atualizar contato");
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contacts")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Contato removido com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error deleting contact:", error);
      toast.error("Erro ao remover contato");
    },
  });

  const setPrimaryContact = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: "email" | "phone" | "whatsapp" | "telegram" | "linkedin" | "other" }) => {
      // First, unset all primary contacts of the same type
      await supabase
        .from("contacts")
        .update({ is_primary: false })
        .eq("contactable_type", contactableType)
        .eq("contactable_id", contactableId)
        .eq("type", type);

      // Then set the new primary
      const { error } = await supabase
        .from("contacts")
        .update({ is_primary: true })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Contato principal atualizado!");
    },
    onError: (error: Error) => {
      console.error("Error setting primary contact:", error);
      toast.error("Erro ao definir contato principal");
    },
  });

  return {
    contacts,
    isLoading,
    error,
    createContact,
    updateContact,
    deleteContact,
    setPrimaryContact,
  };
}
