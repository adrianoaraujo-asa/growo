-- Assign superadmin role to the user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'superadmin'::public.app_role
FROM auth.users
WHERE email = 'adriano.araujo@asadigital.io'
ON CONFLICT (user_id, role) DO NOTHING;

-- Add policy for superadmins to view all user roles
CREATE POLICY "Superadmins can view all user roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'));

-- Add policy for superadmins to manage user roles
CREATE POLICY "Superadmins can manage user roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'))
WITH CHECK (public.has_role(auth.uid(), 'superadmin'));