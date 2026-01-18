import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type AppRole = 'superadmin' | 'owner' | 'admin' | 'manager' | 'member' | 'viewer';

interface UseUserRoleReturn {
  roles: AppRole[];
  isSuperAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
  hasRole: (role: AppRole) => boolean;
}

export function useUserRole(): UseUserRoleReturn {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUserRoles() {
      if (!user?.id) {
        setRoles([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch roles from user_roles table (platform-wide roles like superadmin)
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (rolesError) throw rolesError;

        const fetchedRoles = userRoles?.map(r => r.role as AppRole) || [];
        setRoles(fetchedRoles);
        setError(null);
      } catch (err) {
        console.error('Error fetching user roles:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch roles'));
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRoles();
  }, [user?.id]);

  const isSuperAdmin = roles.includes('superadmin');
  
  const hasRole = (role: AppRole): boolean => {
    return roles.includes(role);
  };

  return {
    roles,
    isSuperAdmin,
    isLoading,
    error,
    hasRole,
  };
}
