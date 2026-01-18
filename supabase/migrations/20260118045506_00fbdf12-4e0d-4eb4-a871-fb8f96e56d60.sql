-- =============================================
-- MÓDULO DE DOCUMENTOS/WIKI - Notion-like
-- =============================================

-- Habilitar extensão pg_trgm para busca (DEVE vir primeiro)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Tipo de permissão para documentos
CREATE TYPE public.document_permission_level AS ENUM ('owner', 'editor', 'viewer');

-- =============================================
-- TABELA: Workspaces de documentos (por org)
-- =============================================
CREATE TABLE public.document_workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL DEFAULT 'Documentos',
    description TEXT,
    icon VARCHAR(100) DEFAULT '📚',
    is_default BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_doc_workspaces_org ON public.document_workspaces(organization_id) WHERE deleted_at IS NULL;
COMMENT ON TABLE public.document_workspaces IS 'Workspaces de documentos por organização';

-- =============================================
-- TABELA: Pastas (hierárquicas)
-- =============================================
CREATE TABLE public.document_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.document_workspaces(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.document_folders(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100) DEFAULT '📁',
    color VARCHAR(50),
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    path TEXT NOT NULL DEFAULT '',
    depth INTEGER DEFAULT 0,
    is_private BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_doc_folders_workspace ON public.document_folders(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_doc_folders_parent ON public.document_folders(parent_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_doc_folders_path ON public.document_folders USING gin(path gin_trgm_ops);
COMMENT ON TABLE public.document_folders IS 'Pastas hierárquicas para organizar documentos';

-- =============================================
-- TABELA: Documentos
-- =============================================
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.document_workspaces(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES public.document_folders(id) ON DELETE SET NULL,
    parent_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    
    title VARCHAR(500) NOT NULL DEFAULT 'Sem título',
    content JSONB DEFAULT '{}',
    content_text TEXT DEFAULT '',
    icon VARCHAR(100) DEFAULT '📄',
    cover_image_url TEXT,
    cover_image_r2_key TEXT,
    
    slug VARCHAR(255),
    excerpt TEXT,
    word_count INTEGER DEFAULT 0,
    reading_time_minutes INTEGER DEFAULT 0,
    
    is_published BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    locked_by UUID REFERENCES auth.users(id),
    locked_at TIMESTAMPTZ,
    
    version INTEGER DEFAULT 1,
    
    created_by UUID REFERENCES auth.users(id),
    last_edited_by UUID REFERENCES auth.users(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_documents_workspace ON public.documents(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_folder ON public.documents(folder_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_parent ON public.documents(parent_document_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_fulltext ON public.documents USING gin(to_tsvector('portuguese', content_text));
CREATE INDEX idx_documents_title ON public.documents USING gin(title gin_trgm_ops);
COMMENT ON TABLE public.documents IS 'Documentos com conteúdo estruturado (Notion-like)';

-- =============================================
-- TABELA: Versões de documentos
-- =============================================
CREATE TABLE public.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    title VARCHAR(500) NOT NULL,
    content JSONB DEFAULT '{}',
    content_text TEXT,
    changes_summary TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_doc_versions_document ON public.document_versions(document_id);
CREATE UNIQUE INDEX idx_doc_versions_unique ON public.document_versions(document_id, version_number);
COMMENT ON TABLE public.document_versions IS 'Histórico de versões dos documentos';

-- =============================================
-- TABELA: Permissões granulares
-- =============================================
CREATE TABLE public.document_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES public.document_folders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_wide BOOLEAN DEFAULT FALSE,
    permission_level document_permission_level NOT NULL DEFAULT 'viewer',
    inherited_from_folder_id UUID REFERENCES public.document_folders(id),
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ,
    
    CONSTRAINT check_target CHECK (
        (document_id IS NOT NULL AND folder_id IS NULL) OR
        (document_id IS NULL AND folder_id IS NOT NULL)
    ),
    CONSTRAINT check_grantee CHECK (
        (user_id IS NOT NULL AND organization_wide = FALSE) OR
        (user_id IS NULL AND organization_wide = TRUE)
    )
);

CREATE INDEX idx_doc_permissions_document ON public.document_permissions(document_id) WHERE document_id IS NOT NULL;
CREATE INDEX idx_doc_permissions_folder ON public.document_permissions(folder_id) WHERE folder_id IS NOT NULL;
CREATE INDEX idx_doc_permissions_user ON public.document_permissions(user_id) WHERE user_id IS NOT NULL;
COMMENT ON TABLE public.document_permissions IS 'Permissões granulares para documentos e pastas';

-- =============================================
-- TABELA: Anexos (R2)
-- =============================================
CREATE TABLE public.document_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    original_filename VARCHAR(500),
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    r2_key TEXT NOT NULL,
    r2_url TEXT,
    metadata JSONB DEFAULT '{}',
    is_inline BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_doc_attachments_document ON public.document_attachments(document_id) WHERE deleted_at IS NULL;
COMMENT ON TABLE public.document_attachments IS 'Anexos de documentos armazenados no Cloudflare R2';

-- =============================================
-- TABELA: Links compartilháveis
-- =============================================
CREATE TABLE public.document_share_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    token VARCHAR(100) NOT NULL UNIQUE,
    permission_level document_permission_level NOT NULL DEFAULT 'viewer',
    password_hash TEXT,
    expires_at TIMESTAMPTZ,
    max_views INTEGER,
    view_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_doc_share_links_token ON public.document_share_links(token) WHERE is_active = TRUE;
COMMENT ON TABLE public.document_share_links IS 'Links compartilháveis para documentos';

-- =============================================
-- FUNÇÕES AUXILIARES
-- =============================================

CREATE OR REPLACE FUNCTION public.user_can_access_document(
    _user_id UUID,
    _document_id UUID,
    _required_level document_permission_level DEFAULT 'viewer'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    doc_record RECORD;
    has_access BOOLEAN := FALSE;
BEGIN
    SELECT d.*, w.organization_id INTO doc_record
    FROM documents d
    JOIN document_workspaces w ON w.id = d.workspace_id
    WHERE d.id = _document_id AND d.deleted_at IS NULL;
    
    IF NOT FOUND THEN RETURN FALSE; END IF;
    IF doc_record.created_by = _user_id THEN RETURN TRUE; END IF;
    IF NOT user_belongs_to_org(_user_id, doc_record.organization_id) THEN RETURN FALSE; END IF;
    
    SELECT TRUE INTO has_access
    FROM document_permissions dp
    WHERE dp.document_id = _document_id
      AND (dp.user_id = _user_id OR dp.organization_wide = TRUE)
      AND (dp.expires_at IS NULL OR dp.expires_at > NOW())
      AND CASE 
          WHEN _required_level = 'viewer' THEN TRUE
          WHEN _required_level = 'editor' THEN dp.permission_level IN ('editor', 'owner')
          WHEN _required_level = 'owner' THEN dp.permission_level = 'owner'
          ELSE FALSE
      END
    LIMIT 1;
    
    IF has_access THEN RETURN TRUE; END IF;
    
    IF doc_record.folder_id IS NOT NULL THEN
        SELECT TRUE INTO has_access
        FROM document_permissions dp
        WHERE dp.folder_id = doc_record.folder_id
          AND (dp.user_id = _user_id OR dp.organization_wide = TRUE)
          AND (dp.expires_at IS NULL OR dp.expires_at > NOW())
          AND CASE 
              WHEN _required_level = 'viewer' THEN TRUE
              WHEN _required_level = 'editor' THEN dp.permission_level IN ('editor', 'owner')
              WHEN _required_level = 'owner' THEN dp.permission_level = 'owner'
              ELSE FALSE
          END
        LIMIT 1;
    END IF;
    
    RETURN COALESCE(has_access, FALSE);
END;
$$;

CREATE OR REPLACE FUNCTION public.user_can_access_folder(
    _user_id UUID,
    _folder_id UUID,
    _required_level document_permission_level DEFAULT 'viewer'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    folder_record RECORD;
    has_access BOOLEAN := FALSE;
BEGIN
    SELECT f.*, w.organization_id INTO folder_record
    FROM document_folders f
    JOIN document_workspaces w ON w.id = f.workspace_id
    WHERE f.id = _folder_id AND f.deleted_at IS NULL;
    
    IF NOT FOUND THEN RETURN FALSE; END IF;
    IF folder_record.created_by = _user_id THEN RETURN TRUE; END IF;
    IF NOT user_belongs_to_org(_user_id, folder_record.organization_id) THEN RETURN FALSE; END IF;
    
    SELECT TRUE INTO has_access
    FROM document_permissions dp
    WHERE dp.folder_id = _folder_id
      AND (dp.user_id = _user_id OR dp.organization_wide = TRUE)
      AND (dp.expires_at IS NULL OR dp.expires_at > NOW())
      AND CASE 
          WHEN _required_level = 'viewer' THEN TRUE
          WHEN _required_level = 'editor' THEN dp.permission_level IN ('editor', 'owner')
          WHEN _required_level = 'owner' THEN dp.permission_level = 'owner'
          ELSE FALSE
      END
    LIMIT 1;
    
    IF NOT COALESCE(has_access, FALSE) AND folder_record.parent_id IS NOT NULL THEN
        RETURN user_can_access_folder(_user_id, folder_record.parent_id, _required_level);
    END IF;
    
    RETURN COALESCE(has_access, FALSE);
END;
$$;

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE public.document_workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view workspaces of their org" ON public.document_workspaces FOR SELECT
USING (user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Admins can manage workspaces" ON public.document_workspaces FOR ALL
USING (EXISTS (
    SELECT 1 FROM organization_users ou
    WHERE ou.organization_id = document_workspaces.organization_id
      AND ou.user_id = auth.uid()
      AND ou.role IN ('owner', 'admin')
      AND ou.deleted_at IS NULL
));

ALTER TABLE public.document_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view accessible folders" ON public.document_folders FOR SELECT
USING (
    user_can_access_folder(auth.uid(), id, 'viewer')
    OR created_by = auth.uid()
    OR (NOT is_private AND EXISTS (
        SELECT 1 FROM document_workspaces w
        WHERE w.id = workspace_id AND user_belongs_to_org(auth.uid(), w.organization_id)
    ))
);

CREATE POLICY "Users can create folders" ON public.document_folders FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM document_workspaces w
    WHERE w.id = workspace_id AND user_belongs_to_org(auth.uid(), w.organization_id)
));

CREATE POLICY "Users can update folders" ON public.document_folders FOR UPDATE
USING (created_by = auth.uid() OR user_can_access_folder(auth.uid(), id, 'editor'));

CREATE POLICY "Users can delete folders" ON public.document_folders FOR DELETE
USING (created_by = auth.uid() OR user_can_access_folder(auth.uid(), id, 'owner'));

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view documents" ON public.documents FOR SELECT
USING (
    user_can_access_document(auth.uid(), id, 'viewer')
    OR created_by = auth.uid()
    OR (is_published AND EXISTS (
        SELECT 1 FROM document_workspaces w
        WHERE w.id = workspace_id AND user_belongs_to_org(auth.uid(), w.organization_id)
    ))
);

CREATE POLICY "Users can create documents" ON public.documents FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM document_workspaces w
    WHERE w.id = workspace_id AND user_belongs_to_org(auth.uid(), w.organization_id)
));

CREATE POLICY "Users can update documents" ON public.documents FOR UPDATE
USING (created_by = auth.uid() OR user_can_access_document(auth.uid(), id, 'editor'));

CREATE POLICY "Users can delete documents" ON public.documents FOR DELETE
USING (created_by = auth.uid() OR user_can_access_document(auth.uid(), id, 'owner'));

ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view versions" ON public.document_versions FOR SELECT
USING (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND user_can_access_document(auth.uid(), d.id, 'viewer')
));

CREATE POLICY "Users can create versions" ON public.document_versions FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND user_can_access_document(auth.uid(), d.id, 'editor')
));

ALTER TABLE public.document_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view permissions" ON public.document_permissions FOR SELECT
USING (
    user_id = auth.uid()
    OR (document_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM documents d WHERE d.id = document_id
          AND (d.created_by = auth.uid() OR user_can_access_document(auth.uid(), d.id, 'owner'))
    ))
    OR (folder_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM document_folders f WHERE f.id = folder_id
          AND (f.created_by = auth.uid() OR user_can_access_folder(auth.uid(), f.id, 'owner'))
    ))
);

CREATE POLICY "Owners can manage permissions" ON public.document_permissions FOR ALL
USING (
    (document_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM documents d WHERE d.id = document_id
          AND (d.created_by = auth.uid() OR user_can_access_document(auth.uid(), d.id, 'owner'))
    ))
    OR (folder_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM document_folders f WHERE f.id = folder_id
          AND (f.created_by = auth.uid() OR user_can_access_folder(auth.uid(), f.id, 'owner'))
    ))
);

ALTER TABLE public.document_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view attachments" ON public.document_attachments FOR SELECT
USING (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND user_can_access_document(auth.uid(), d.id, 'viewer')
));

CREATE POLICY "Users can upload attachments" ON public.document_attachments FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND user_can_access_document(auth.uid(), d.id, 'editor')
));

CREATE POLICY "Users can delete attachments" ON public.document_attachments FOR DELETE
USING (
    uploaded_by = auth.uid()
    OR EXISTS (
        SELECT 1 FROM documents d WHERE d.id = document_id AND user_can_access_document(auth.uid(), d.id, 'owner')
    )
);

ALTER TABLE public.document_share_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view share links" ON public.document_share_links FOR SELECT
USING (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id
      AND (d.created_by = auth.uid() OR user_can_access_document(auth.uid(), d.id, 'owner'))
));

CREATE POLICY "Users can create share links" ON public.document_share_links FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND user_can_access_document(auth.uid(), d.id, 'editor')
));

CREATE POLICY "Users can manage share links" ON public.document_share_links FOR ALL
USING (
    created_by = auth.uid()
    OR EXISTS (
        SELECT 1 FROM documents d WHERE d.id = document_id AND user_can_access_document(auth.uid(), d.id, 'owner')
    )
);

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_doc_workspaces_updated_at
    BEFORE UPDATE ON public.document_workspaces
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doc_folders_updated_at
    BEFORE UPDATE ON public.document_folders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.create_document_version()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF OLD.content IS DISTINCT FROM NEW.content THEN
        INSERT INTO document_versions (document_id, version_number, title, content, content_text, created_by)
        VALUES (NEW.id, NEW.version, OLD.title, OLD.content, OLD.content_text, NEW.last_edited_by);
        NEW.version := OLD.version + 1;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_document_version
    BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.create_document_version();

CREATE OR REPLACE FUNCTION public.update_folder_path()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    parent_path TEXT;
    parent_depth INTEGER;
BEGIN
    IF NEW.parent_id IS NULL THEN
        NEW.path := '/' || NEW.id::TEXT;
        NEW.depth := 0;
    ELSE
        SELECT path, depth INTO parent_path, parent_depth FROM document_folders WHERE id = NEW.parent_id;
        NEW.path := parent_path || '/' || NEW.id::TEXT;
        NEW.depth := COALESCE(parent_depth, 0) + 1;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_folder_path_insert
    BEFORE INSERT ON public.document_folders
    FOR EACH ROW EXECUTE FUNCTION public.update_folder_path();

CREATE TRIGGER trigger_folder_path_update
    BEFORE UPDATE ON public.document_folders
    FOR EACH ROW 
    WHEN (OLD.parent_id IS DISTINCT FROM NEW.parent_id)
    EXECUTE FUNCTION public.update_folder_path();