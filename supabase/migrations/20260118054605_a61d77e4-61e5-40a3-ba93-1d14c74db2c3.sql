-- Allow global workspaces (no organization) for superadmins
ALTER TABLE public.document_workspaces ALTER COLUMN organization_id DROP NOT NULL;

-- Create index for global workspaces
CREATE INDEX IF NOT EXISTS idx_document_workspaces_global ON public.document_workspaces(id) WHERE organization_id IS NULL;

-- Update RLS policies to allow superadmins to access global workspaces
DROP POLICY IF EXISTS "Users can view workspaces in their organization" ON public.document_workspaces;
DROP POLICY IF EXISTS "Users can create workspaces in their organization" ON public.document_workspaces;
DROP POLICY IF EXISTS "Admins can update workspaces" ON public.document_workspaces;
DROP POLICY IF EXISTS "Admins can delete workspaces" ON public.document_workspaces;

-- Superadmins can manage global workspaces, org users can manage org workspaces
CREATE POLICY "Users can view accessible workspaces" ON public.document_workspaces
FOR SELECT USING (
  -- Superadmins see global workspaces
  (organization_id IS NULL AND public.has_role(auth.uid(), 'superadmin'))
  OR
  -- Users see their org workspaces
  (organization_id IS NOT NULL AND public.user_belongs_to_org(auth.uid(), organization_id))
);

CREATE POLICY "Users can create workspaces" ON public.document_workspaces
FOR INSERT WITH CHECK (
  -- Superadmins can create global workspaces
  (organization_id IS NULL AND public.has_role(auth.uid(), 'superadmin'))
  OR
  -- Users can create org workspaces
  (organization_id IS NOT NULL AND public.user_belongs_to_org(auth.uid(), organization_id))
);

CREATE POLICY "Users can update workspaces" ON public.document_workspaces
FOR UPDATE USING (
  (organization_id IS NULL AND public.has_role(auth.uid(), 'superadmin'))
  OR
  (organization_id IS NOT NULL AND public.user_belongs_to_org(auth.uid(), organization_id))
);

CREATE POLICY "Users can delete workspaces" ON public.document_workspaces
FOR DELETE USING (
  (organization_id IS NULL AND public.has_role(auth.uid(), 'superadmin'))
  OR
  (organization_id IS NOT NULL AND public.user_belongs_to_org(auth.uid(), organization_id))
);

-- Similar policies for documents - allow access to documents in global workspaces
DROP POLICY IF EXISTS "Users can view documents" ON public.documents;
DROP POLICY IF EXISTS "Users can create documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete documents" ON public.documents;

CREATE POLICY "Users can view documents" ON public.documents
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.document_workspaces w 
    WHERE w.id = documents.workspace_id 
    AND (
      (w.organization_id IS NULL AND public.has_role(auth.uid(), 'superadmin'))
      OR 
      (w.organization_id IS NOT NULL AND public.user_belongs_to_org(auth.uid(), w.organization_id))
    )
  )
);

CREATE POLICY "Users can create documents" ON public.documents
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.document_workspaces w 
    WHERE w.id = documents.workspace_id 
    AND (
      (w.organization_id IS NULL AND public.has_role(auth.uid(), 'superadmin'))
      OR 
      (w.organization_id IS NOT NULL AND public.user_belongs_to_org(auth.uid(), w.organization_id))
    )
  )
);

CREATE POLICY "Users can update documents" ON public.documents
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.document_workspaces w 
    WHERE w.id = documents.workspace_id 
    AND (
      (w.organization_id IS NULL AND public.has_role(auth.uid(), 'superadmin'))
      OR 
      (w.organization_id IS NOT NULL AND public.user_belongs_to_org(auth.uid(), w.organization_id))
    )
  )
);

CREATE POLICY "Users can delete documents" ON public.documents
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.document_workspaces w 
    WHERE w.id = documents.workspace_id 
    AND (
      (w.organization_id IS NULL AND public.has_role(auth.uid(), 'superadmin'))
      OR 
      (w.organization_id IS NOT NULL AND public.user_belongs_to_org(auth.uid(), w.organization_id))
    )
  )
);

-- Similar policies for folders
DROP POLICY IF EXISTS "Users can view folders" ON public.document_folders;
DROP POLICY IF EXISTS "Users can create folders" ON public.document_folders;
DROP POLICY IF EXISTS "Users can update folders" ON public.document_folders;
DROP POLICY IF EXISTS "Users can delete folders" ON public.document_folders;

CREATE POLICY "Users can view folders" ON public.document_folders
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.document_workspaces w 
    WHERE w.id = document_folders.workspace_id 
    AND (
      (w.organization_id IS NULL AND public.has_role(auth.uid(), 'superadmin'))
      OR 
      (w.organization_id IS NOT NULL AND public.user_belongs_to_org(auth.uid(), w.organization_id))
    )
  )
);

CREATE POLICY "Users can create folders" ON public.document_folders
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.document_workspaces w 
    WHERE w.id = document_folders.workspace_id 
    AND (
      (w.organization_id IS NULL AND public.has_role(auth.uid(), 'superadmin'))
      OR 
      (w.organization_id IS NOT NULL AND public.user_belongs_to_org(auth.uid(), w.organization_id))
    )
  )
);

CREATE POLICY "Users can update folders" ON public.document_folders
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.document_workspaces w 
    WHERE w.id = document_folders.workspace_id 
    AND (
      (w.organization_id IS NULL AND public.has_role(auth.uid(), 'superadmin'))
      OR 
      (w.organization_id IS NOT NULL AND public.user_belongs_to_org(auth.uid(), w.organization_id))
    )
  )
);

CREATE POLICY "Users can delete folders" ON public.document_folders
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.document_workspaces w 
    WHERE w.id = document_folders.workspace_id 
    AND (
      (w.organization_id IS NULL AND public.has_role(auth.uid(), 'superadmin'))
      OR 
      (w.organization_id IS NOT NULL AND public.user_belongs_to_org(auth.uid(), w.organization_id))
    )
  )
);