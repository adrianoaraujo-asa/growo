-- RPC functions for admin settings management (system.settings access)

-- List settings by keys
CREATE OR REPLACE FUNCTION public.admin_list_settings(p_keys text[])
RETURNS TABLE (id uuid, key varchar, value jsonb, is_public boolean, created_at timestamptz, updated_at timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, system
AS $$
  SELECT id, key, value, is_public, created_at, updated_at 
  FROM system.settings 
  WHERE key = ANY(p_keys);
$$;

-- Upsert a setting
CREATE OR REPLACE FUNCTION public.admin_upsert_setting(
  p_key varchar,
  p_value jsonb,
  p_is_public boolean DEFAULT true
)
RETURNS TABLE (id uuid, key varchar, value jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, system
AS $$
DECLARE
  v_id uuid;
BEGIN
  -- Try to update first
  UPDATE system.settings 
  SET value = p_value, updated_at = NOW()
  WHERE key = p_key
  RETURNING system.settings.id INTO v_id;
  
  -- If not found, insert
  IF v_id IS NULL THEN
    INSERT INTO system.settings (key, value, is_public)
    VALUES (p_key, p_value, p_is_public)
    RETURNING system.settings.id INTO v_id;
  END IF;
  
  RETURN QUERY SELECT s.id, s.key, s.value FROM system.settings s WHERE s.id = v_id;
END;
$$;