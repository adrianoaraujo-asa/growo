import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/providers/AuthProvider";
import type { Database } from "@/integrations/supabase/types";

type Organization = Database["public"]["Tables"]["organizations"]["Row"];
type DocumentWorkspace = Database["public"]["Tables"]["document_workspaces"]["Row"];

export function useCurrentOrganization() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["current-organization", user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get the user's primary organization
      const { data: orgUser, error: orgUserError } = await supabase
        .from("organization_users")
        .select("organization_id")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (orgUserError) throw orgUserError;
      
      // If no organization, create one
      if (!orgUser) {
        const newOrg = await createDefaultOrganization(user.id, user.email || "user");
        return newOrg;
      }

      // Get the organization details
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", orgUser.organization_id)
        .single();

      if (orgError) throw orgError;
      return org as Organization;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return query;
}

async function createDefaultOrganization(userId: string, userEmail: string): Promise<Organization> {
  const orgName = userEmail.split("@")[0] || "Minha Organização";
  const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");

  // Create organization
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name: orgName,
      slug: `${slug}-${Date.now()}`,
      created_by: userId,
      status: "active" as const,
    })
    .select()
    .single();

  if (orgError) throw orgError;

  // Add user to organization as owner
  const { error: memberError } = await supabase
    .from("organization_users")
    .insert({
      organization_id: org.id,
      user_id: userId,
      role: "owner" as const,
      is_primary: true,
      joined_at: new Date().toISOString(),
    });

  if (memberError) {
    console.error("Failed to add user to organization:", memberError);
  }

  // Create default document workspace
  await createDefaultWorkspace(org.id, userId);

  return org as Organization;
}

async function createDefaultWorkspace(organizationId: string, userId: string): Promise<DocumentWorkspace> {
  const { data: workspace, error } = await supabase
    .from("document_workspaces")
    .insert({
      organization_id: organizationId,
      name: "Documentos",
      description: "Workspace padrão para documentos",
      is_default: true,
      created_by: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return workspace as DocumentWorkspace;
}

export function useEnsureDefaultWorkspace(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ["ensure-workspace", organizationId],
    queryFn: async () => {
      if (!organizationId || !user) return null;

      // Check if workspace exists
      const { data: workspaces, error } = await supabase
        .from("document_workspaces")
        .select("*")
        .eq("organization_id", organizationId)
        .is("deleted_at", null)
        .limit(1);

      if (error) throw error;

      if (workspaces && workspaces.length > 0) {
        return workspaces[0] as DocumentWorkspace;
      }

      // Create default workspace
      return await createDefaultWorkspace(organizationId, user.id);
    },
    enabled: !!organizationId && !!user,
    staleTime: 5 * 60 * 1000,
  });
}
