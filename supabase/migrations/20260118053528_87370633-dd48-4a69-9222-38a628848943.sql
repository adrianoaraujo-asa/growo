-- Create a secure table for R2 credentials in system schema
CREATE TABLE IF NOT EXISTS system.storage_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(50) NOT NULL DEFAULT 'r2',
  organization_id UUID NULL, -- NULL = global config, otherwise org-specific
  account_id TEXT,
  bucket_name TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  public_url TEXT,
  access_key_id TEXT NOT NULL,
  secret_access_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID,
  UNIQUE(provider, organization_id)
);

-- Enable RLS
ALTER TABLE system.storage_config ENABLE ROW LEVEL SECURITY;

-- Only superadmins can access global config (org_id IS NULL)
-- Org admins can access their org's config
CREATE POLICY "Superadmins can manage global storage config"
ON system.storage_config
FOR ALL
USING (
  organization_id IS NULL AND public.has_role(auth.uid(), 'superadmin')
);

CREATE POLICY "Org admins can manage their storage config"
ON system.storage_config
FOR ALL
USING (
  organization_id IS NOT NULL 
  AND public.user_belongs_to_org(auth.uid(), organization_id)
  AND (
    public.has_role(auth.uid(), 'owner') 
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- RPC function to get storage config (returns decrypted for edge functions)
CREATE OR REPLACE FUNCTION public.get_storage_config(p_organization_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  provider VARCHAR(50),
  organization_id UUID,
  account_id TEXT,
  bucket_name TEXT,
  endpoint TEXT,
  public_url TEXT,
  access_key_id TEXT,
  secret_access_key TEXT,
  is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, system
AS $$
BEGIN
  -- First try org-specific config, then fall back to global
  RETURN QUERY
  SELECT 
    sc.id,
    sc.provider,
    sc.organization_id,
    sc.account_id,
    sc.bucket_name,
    sc.endpoint,
    sc.public_url,
    sc.access_key_id,
    sc.secret_access_key,
    sc.is_active
  FROM system.storage_config sc
  WHERE 
    (sc.organization_id = p_organization_id OR (p_organization_id IS NULL AND sc.organization_id IS NULL))
    AND sc.is_active = true
    AND sc.provider = 'r2'
  ORDER BY sc.organization_id NULLS LAST
  LIMIT 1;
END;
$$;

-- RPC function to upsert storage config
CREATE OR REPLACE FUNCTION public.upsert_storage_config(
  p_organization_id UUID DEFAULT NULL,
  p_account_id TEXT DEFAULT NULL,
  p_bucket_name TEXT DEFAULT NULL,
  p_endpoint TEXT DEFAULT NULL,
  p_public_url TEXT DEFAULT NULL,
  p_access_key_id TEXT DEFAULT NULL,
  p_secret_access_key TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, system
AS $$
DECLARE
  v_id UUID;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  -- Check permissions
  IF p_organization_id IS NULL THEN
    -- Global config requires superadmin
    IF NOT public.has_role(v_user_id, 'superadmin') THEN
      RAISE EXCEPTION 'Only superadmins can manage global storage config';
    END IF;
  ELSE
    -- Org config requires org admin/owner
    IF NOT public.user_belongs_to_org(v_user_id, p_organization_id) THEN
      RAISE EXCEPTION 'User does not belong to this organization';
    END IF;
    IF NOT (public.has_role(v_user_id, 'owner') OR public.has_role(v_user_id, 'admin')) THEN
      RAISE EXCEPTION 'Only org owners/admins can manage storage config';
    END IF;
  END IF;

  -- Upsert config
  INSERT INTO system.storage_config (
    organization_id,
    account_id,
    bucket_name,
    endpoint,
    public_url,
    access_key_id,
    secret_access_key,
    created_by,
    updated_at
  ) VALUES (
    p_organization_id,
    p_account_id,
    p_bucket_name,
    p_endpoint,
    p_public_url,
    p_access_key_id,
    p_secret_access_key,
    v_user_id,
    now()
  )
  ON CONFLICT (provider, organization_id) 
  DO UPDATE SET
    account_id = COALESCE(p_account_id, system.storage_config.account_id),
    bucket_name = COALESCE(p_bucket_name, system.storage_config.bucket_name),
    endpoint = COALESCE(p_endpoint, system.storage_config.endpoint),
    public_url = COALESCE(p_public_url, system.storage_config.public_url),
    access_key_id = COALESCE(p_access_key_id, system.storage_config.access_key_id),
    secret_access_key = COALESCE(p_secret_access_key, system.storage_config.secret_access_key),
    updated_at = now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;