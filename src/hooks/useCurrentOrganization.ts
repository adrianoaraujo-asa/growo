import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/providers/AuthProvider";
import type { Database } from "@/integrations/supabase/types";

type Organization = Database["public"]["Tables"]["organizations"]["Row"];

export function useCurrentOrganization() {
  const { user } = useAuthContext();

  return useQuery({
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
        .single();

      if (orgUserError || !orgUser) return null;

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
}
