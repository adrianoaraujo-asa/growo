import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/providers/AuthProvider";
import type { Json } from "@/integrations/supabase/types";

export interface Page {
  id: string;
  title: string;
  content: Json | null;
  content_text: string | null;
  icon: string | null;
  cover_image_url: string | null;
  is_favorite: boolean | null;
  is_archived: boolean | null;
  is_template: boolean | null;
  parent_document_id: string | null;
  folder_id: string | null;
  workspace_id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  word_count: number | null;
  reading_time_minutes: number | null;
}

export interface PageTreeItem extends Page {
  children: PageTreeItem[];
  depth: number;
}

export function usePages(workspaceId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  const pagesQuery = useQuery({
    queryKey: ["pages", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as Page[];
    },
    enabled: !!workspaceId,
  });

  const createPage = useMutation({
    mutationFn: async (input: {
      title?: string;
      parentId?: string | null;
      folderId?: string | null;
      icon?: string;
      isTemplate?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: input.title || "Sem título",
          workspace_id: workspaceId,
          parent_document_id: input.parentId || null,
          folder_id: input.folderId || null,
          icon: input.icon || "📄",
          is_template: input.isTemplate || false,
          created_by: user?.id,
          content: [{ type: "paragraph", content: [] }] as unknown as Json,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", workspaceId] });
    },
  });

  const updatePage = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Page> & { id: string }) => {
      const { data, error } = await supabase
        .from("documents")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", workspaceId] });
    },
  });

  const deletePage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("documents")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", workspaceId] });
    },
  });

  const duplicatePage = useMutation({
    mutationFn: async (id: string) => {
      const page = pagesQuery.data?.find((p) => p.id === id);
      if (!page) throw new Error("Page not found");

      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: `${page.title} (cópia)`,
          workspace_id: workspaceId,
          parent_document_id: page.parent_document_id,
          folder_id: page.folder_id,
          icon: page.icon,
          content: page.content,
          content_text: page.content_text,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", workspaceId] });
    },
  });

  const movePage = useMutation({
    mutationFn: async ({
      id,
      parentId,
      folderId,
    }: {
      id: string;
      parentId?: string | null;
      folderId?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("documents")
        .update({
          parent_document_id: parentId,
          folder_id: folderId,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", workspaceId] });
    },
  });

  return {
    pages: pagesQuery.data || [],
    isLoading: pagesQuery.isLoading,
    error: pagesQuery.error,
    createPage,
    updatePage,
    deletePage,
    duplicatePage,
    movePage,
  };
}

export function usePageTree(workspaceId: string) {
  const { pages, isLoading, error } = usePages(workspaceId);

  const buildTree = (
    items: Page[],
    parentId: string | null = null,
    depth: number = 0
  ): PageTreeItem[] => {
    return items
      .filter((item) => item.parent_document_id === parentId)
      .map((item) => ({
        ...item,
        depth,
        children: buildTree(items, item.id, depth + 1),
      }));
  };

  const rootPages = buildTree(pages, null, 0);
  const favorites = pages.filter((p) => p.is_favorite);
  const templates = pages.filter((p) => p.is_template);
  const archived = pages.filter((p) => p.is_archived);

  return {
    tree: rootPages,
    favorites,
    templates,
    archived,
    allPages: pages,
    isLoading,
    error,
  };
}

export function usePage(pageId: string) {
  const queryClient = useQueryClient();

  const pageQuery = useQuery({
    queryKey: ["page", pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*, folder:document_folders(*), workspace:document_workspaces(*)")
        .eq("id", pageId)
        .single();

      if (error) throw error;
      return data as Page & { folder: any; workspace: any };
    },
    enabled: !!pageId,
  });

  const updatePage = useMutation({
    mutationFn: async (updates: Partial<Page>) => {
      const { data, error } = await supabase
        .from("documents")
        .update(updates)
        .eq("id", pageId)
        .select()
        .single();

      if (error) throw error;
      return data as Page;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["page", pageId], (old: any) => ({
        ...old,
        ...data,
      }));
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  return {
    page: pageQuery.data,
    isLoading: pageQuery.isLoading,
    error: pageQuery.error,
    updatePage,
  };
}
