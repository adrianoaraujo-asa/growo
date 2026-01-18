import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database, Json } from "@/integrations/supabase/types";

type Document = Database["public"]["Tables"]["documents"]["Row"];
type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
type DocumentUpdate = Database["public"]["Tables"]["documents"]["Update"];
type DocumentFolder = Database["public"]["Tables"]["document_folders"]["Row"];
type DocumentFolderInsert = Database["public"]["Tables"]["document_folders"]["Insert"];
type DocumentWorkspace = Database["public"]["Tables"]["document_workspaces"]["Row"];

export interface DocumentWithDetails extends Document {
  folder?: DocumentFolder | null;
  workspace?: DocumentWorkspace | null;
}

export function useDocumentWorkspaces(organizationId: string) {
  return useQuery({
    queryKey: ["document-workspaces", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_workspaces")
        .select("*")
        .eq("organization_id", organizationId)
        .is("deleted_at", null)
        .order("is_default", { ascending: false })
        .order("name", { ascending: true });

      if (error) throw error;
      return data as DocumentWorkspace[];
    },
    enabled: !!organizationId,
  });
}

export function useDocumentFolders(workspaceId: string, parentId?: string | null) {
  return useQuery({
    queryKey: ["document-folders", workspaceId, parentId],
    queryFn: async () => {
      let query = supabase
        .from("document_folders")
        .select("*")
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      if (parentId === null || parentId === undefined) {
        query = query.is("parent_id", null);
      } else {
        query = query.eq("parent_id", parentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as DocumentFolder[];
    },
    enabled: !!workspaceId,
  });
}

export function useDocuments(workspaceId: string, folderId?: string | null) {
  const queryClient = useQueryClient();

  const queryKey = ["documents", workspaceId, folderId];

  const { data: documents = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from("documents")
        .select(`
          *,
          folder:document_folders(*),
          workspace:document_workspaces(*)
        `)
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .order("is_favorite", { ascending: false })
        .order("updated_at", { ascending: false });

      if (folderId === null || folderId === undefined) {
        query = query.is("folder_id", null);
      } else {
        query = query.eq("folder_id", folderId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as DocumentWithDetails[];
    },
    enabled: !!workspaceId,
  });

  const createDocument = useMutation({
    mutationFn: async (doc: Omit<DocumentInsert, "workspace_id"> & { workspace_id?: string }) => {
      const { data, error } = await supabase
        .from("documents")
        .insert({
          ...doc,
          workspace_id: doc.workspace_id || workspaceId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Documento criado com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error creating document:", error);
      toast.error("Erro ao criar documento");
    },
  });

  const updateDocument = useMutation({
    mutationFn: async ({ id, ...updates }: DocumentUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("documents")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Documento atualizado!");
    },
    onError: (error: Error) => {
      console.error("Error updating document:", error);
      toast.error("Erro ao atualizar documento");
    },
  });

  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("documents")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Documento excluído!");
    },
    onError: (error: Error) => {
      console.error("Error deleting document:", error);
      toast.error("Erro ao excluir documento");
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
      const { error } = await supabase
        .from("documents")
        .update({ is_favorite: !isFavorite })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success(variables.isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
    },
    onError: (error: Error) => {
      console.error("Error toggling favorite:", error);
      toast.error("Erro ao atualizar favoritos");
    },
  });

  return {
    documents,
    isLoading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    toggleFavorite,
  };
}

export function useDocument(documentId: string) {
  const queryClient = useQueryClient();

  const { data: document, isLoading, error } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select(`
          *,
          folder:document_folders(*),
          workspace:document_workspaces(*)
        `)
        .eq("id", documentId)
        .single();

      if (error) throw error;
      return data as DocumentWithDetails;
    },
    enabled: !!documentId,
  });

  const updateDocument = useMutation({
    mutationFn: async (updates: DocumentUpdate) => {
      const { data, error } = await supabase
        .from("documents")
        .update(updates)
        .eq("id", documentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: Error) => {
      console.error("Error updating document:", error);
      toast.error("Erro ao atualizar documento");
    },
  });

  return {
    document,
    isLoading,
    error,
    updateDocument,
  };
}

export function useDocumentVersions(documentId: string) {
  return useQuery({
    queryKey: ["document-versions", documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_versions")
        .select("*")
        .eq("document_id", documentId)
        .order("version_number", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!documentId,
  });
}

export function useCreateFolder(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folder: Omit<DocumentFolderInsert, "workspace_id">) => {
      const { data, error } = await supabase
        .from("document_folders")
        .insert({
          ...folder,
          workspace_id: workspaceId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-folders"] });
      toast.success("Pasta criada com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error creating folder:", error);
      toast.error("Erro ao criar pasta");
    },
  });
}
