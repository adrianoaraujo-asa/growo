-- Create organization for system owner (superadmin)
INSERT INTO public.organizations (name, slug, created_by, status, description)
VALUES ('ASA Digital', 'asa-digital', '031384f6-ed6c-40d7-9f34-e21a3886c456', 'active', 'Organização do administrador do sistema');

-- Add superadmin as owner of the organization
INSERT INTO public.organization_users (organization_id, user_id, role, is_primary, joined_at)
SELECT id, '031384f6-ed6c-40d7-9f34-e21a3886c456', 'owner', true, now()
FROM public.organizations WHERE slug = 'asa-digital';

-- Create default document workspace for the organization
INSERT INTO public.document_workspaces (organization_id, name, description, is_default, created_by)
SELECT id, 'Documentos', 'Workspace padrão para documentos', true, '031384f6-ed6c-40d7-9f34-e21a3886c456'
FROM public.organizations WHERE slug = 'asa-digital';