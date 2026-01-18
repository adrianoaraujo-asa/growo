import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/providers/AuthProvider";
import type { Json } from "@/integrations/supabase/types";

export interface Version {
  id: string;
  document_id: string;
  version_number: number;
  title: string;
  content: Json | null;
  content_text: string | null;
  changes_summary: string | null;
  created_by: string | null;
  created_at: string;
  author?: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function useVersions(documentId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  const versionsQuery = useQuery({
    queryKey: ["versions", documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_versions")
        .select("*")
        .eq("document_id", documentId)
        .order("version_number", { ascending: false });

      if (error) throw error;
      return data as Version[];
    },
    enabled: !!documentId,
  });

  const createVersion = useMutation({
    mutationFn: async (input: {
      title: string;
      content: Json;
      contentText?: string;
      changesSummary?: string;
    }) => {
      // Get the latest version number
      const latestVersion = versionsQuery.data?.[0]?.version_number || 0;

      const { data, error } = await supabase
        .from("document_versions")
        .insert({
          document_id: documentId,
          version_number: latestVersion + 1,
          title: input.title,
          content: input.content,
          content_text: input.contentText,
          changes_summary: input.changesSummary,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Version;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versions", documentId] });
    },
  });

  const restoreVersion = useMutation({
    mutationFn: async (versionId: string) => {
      const version = versionsQuery.data?.find((v) => v.id === versionId);
      if (!version) throw new Error("Version not found");

      // First, save current state as a new version
      const { data: currentDoc, error: docError } = await supabase
        .from("documents")
        .select("title, content, content_text")
        .eq("id", documentId)
        .single();

      if (docError) throw docError;

      const latestVersionNumber = versionsQuery.data?.[0]?.version_number || 0;

      // Save current as version before restoring
      await supabase.from("document_versions").insert({
        document_id: documentId,
        version_number: latestVersionNumber + 1,
        title: currentDoc.title,
        content: currentDoc.content,
        content_text: currentDoc.content_text,
        changes_summary: `Versão antes de restaurar v${version.version_number}`,
        created_by: user?.id,
      });

      // Restore the selected version
      const { error: updateError } = await supabase
        .from("documents")
        .update({
          title: version.title,
          content: version.content,
          content_text: version.content_text,
        })
        .eq("id", documentId);

      if (updateError) throw updateError;

      return version;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versions", documentId] });
      queryClient.invalidateQueries({ queryKey: ["page", documentId] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  const compareVersions = (v1Id: string, v2Id: string) => {
    const v1 = versionsQuery.data?.find((v) => v.id === v1Id);
    const v2 = versionsQuery.data?.find((v) => v.id === v2Id);
    
    if (!v1 || !v2) return null;

    return {
      version1: v1,
      version2: v2,
      titleChanged: v1.title !== v2.title,
      contentChanged: JSON.stringify(v1.content) !== JSON.stringify(v2.content),
    };
  };

  return {
    versions: versionsQuery.data || [],
    isLoading: versionsQuery.isLoading,
    error: versionsQuery.error,
    createVersion,
    restoreVersion,
    compareVersions,
    latestVersion: versionsQuery.data?.[0],
  };
}

// Auto-save version every N saves
export function useAutoVersion(documentId: string, saveCount: number, threshold: number = 10) {
  const { createVersion, latestVersion } = useVersions(documentId);
  const { user } = useAuthContext();

  const shouldCreateVersion = saveCount > 0 && saveCount % threshold === 0;

  const createAutoVersion = async (title: string, content: Json, contentText?: string) => {
    if (!shouldCreateVersion) return;

    await createVersion.mutateAsync({
      title,
      content,
      contentText,
      changesSummary: `Auto-save a cada ${threshold} alterações`,
    });
  };

  return {
    shouldCreateVersion,
    createAutoVersion,
    lastVersionDate: latestVersion?.created_at,
  };
}
