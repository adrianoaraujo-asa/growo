import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/providers/AuthProvider";
import { useUserRole } from "@/hooks/useUserRole";
import type { Database } from "@/integrations/supabase/types";

type DocumentWorkspace = Database["public"]["Tables"]["document_workspaces"]["Row"];

/**
 * Hook to get the user's accessible workspace.
 * - Superadmins: get/create global workspace (no organization_id)
 * - Regular users: get/create workspace in their organization
 */
export function useWorkspaceAccess() {
  const { user } = useAuthContext();
  const { isSuperAdmin, isLoading: roleLoading } = useUserRole();

  const query = useQuery({
    queryKey: ["workspace-access", user?.id, isSuperAdmin],
    queryFn: async (): Promise<DocumentWorkspace | null> => {
      if (!user) return null;

      if (isSuperAdmin) {
        // Superadmin: get global workspace (no organization)
        const { data: globalWorkspaces, error } = await supabase
          .from("document_workspaces")
          .select("*")
          .is("organization_id", null)
          .is("deleted_at", null)
          .order("is_default", { ascending: false })
          .limit(1);

        if (error) throw error;

        if (globalWorkspaces && globalWorkspaces.length > 0) {
          return globalWorkspaces[0];
        }

        // Create global workspace for superadmin
        const { data: newWorkspace, error: createError } = await supabase
          .from("document_workspaces")
          .insert({
            organization_id: null,
            name: "Documentos Globais",
            description: "Workspace global para administradores do sistema",
            is_default: true,
            created_by: user.id,
          })
          .select()
          .single();

        if (createError) throw createError;
        return newWorkspace;
      } else {
        // Regular user: get workspace from their organization
        const { data: orgUser } = await supabase
          .from("organization_users")
          .select("organization_id")
          .eq("user_id", user.id)
          .is("deleted_at", null)
          .order("is_primary", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!orgUser?.organization_id) {
          // User has no organization yet - will be created on first access
          return null;
        }

        // Get org workspace
        const { data: workspaces, error } = await supabase
          .from("document_workspaces")
          .select("*")
          .eq("organization_id", orgUser.organization_id)
          .is("deleted_at", null)
          .order("is_default", { ascending: false })
          .limit(1);

        if (error) throw error;

        if (workspaces && workspaces.length > 0) {
          return workspaces[0];
        }

        // Create workspace for organization
        const { data: newWorkspace, error: createError } = await supabase
          .from("document_workspaces")
          .insert({
            organization_id: orgUser.organization_id,
            name: "Documentos",
            description: "Workspace padrão para documentos",
            is_default: true,
            created_by: user.id,
          })
          .select()
          .single();

        if (createError) throw createError;
        return newWorkspace;
      }
    },
    enabled: !!user && !roleLoading,
    staleTime: 5 * 60 * 1000,
  });

  return {
    workspace: query.data,
    isLoading: query.isLoading || roleLoading,
    error: query.error,
    isSuperAdmin,
  };
}
