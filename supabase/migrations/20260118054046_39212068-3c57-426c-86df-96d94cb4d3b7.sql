-- Drop and recreate the function to use passed user_id instead of auth.uid()
DROP FUNCTION IF EXISTS public.upsert_storage_config;

CREATE OR REPLACE FUNCTION public.upsert_storage_config(
  p_user_id UUID,
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
BEGIN
  -- Check permissions using passed user_id
  IF p_organization_id IS NULL THEN
    -- Global config requires superadmin
    IF NOT public.has_role(p_user_id, 'superadmin') THEN
      RAISE EXCEPTION 'Only superadmins can manage global storage config';
    END IF;
  ELSE
    -- Org config requires org admin/owner
    IF NOT public.user_belongs_to_org(p_user_id, p_organization_id) THEN
      RAISE EXCEPTION 'User does not belong to this organization';
    END IF;
    IF NOT (public.has_role(p_user_id, 'owner') OR public.has_role(p_user_id, 'admin')) THEN
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
    p_user_id,
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