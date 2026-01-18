-- Function to list all plans for admin (including non-public)
CREATE OR REPLACE FUNCTION public.admin_list_plans()
RETURNS SETOF billing.plans
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, billing
AS $$
  SELECT * FROM billing.plans 
  WHERE deleted_at IS NULL 
  ORDER BY sort_order ASC;
$$;

-- Function to create a plan
CREATE OR REPLACE FUNCTION public.admin_create_plan(
  p_name VARCHAR,
  p_slug VARCHAR,
  p_description TEXT DEFAULT NULL,
  p_features JSONB DEFAULT '[]'::JSONB,
  p_limits JSONB DEFAULT '{}'::JSONB,
  p_price_monthly NUMERIC DEFAULT 0,
  p_price_yearly NUMERIC DEFAULT 0,
  p_currency VARCHAR DEFAULT 'BRL',
  p_trial_days INTEGER DEFAULT 0,
  p_is_active BOOLEAN DEFAULT TRUE,
  p_is_public BOOLEAN DEFAULT TRUE,
  p_sort_order INTEGER DEFAULT 0
)
RETURNS billing.plans
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, billing
AS $$
DECLARE
  v_result billing.plans;
BEGIN
  INSERT INTO billing.plans (
    name, slug, description, features, limits,
    price_monthly, price_yearly, currency, trial_days,
    is_active, is_public, sort_order
  ) VALUES (
    p_name, p_slug, p_description, p_features, p_limits,
    p_price_monthly, p_price_yearly, p_currency, p_trial_days,
    p_is_active, p_is_public, p_sort_order
  )
  RETURNING * INTO v_result;
  
  RETURN v_result;
END;
$$;

-- Function to update a plan
CREATE OR REPLACE FUNCTION public.admin_update_plan(
  p_id UUID,
  p_name VARCHAR DEFAULT NULL,
  p_slug VARCHAR DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_features JSONB DEFAULT NULL,
  p_limits JSONB DEFAULT NULL,
  p_price_monthly NUMERIC DEFAULT NULL,
  p_price_yearly NUMERIC DEFAULT NULL,
  p_currency VARCHAR DEFAULT NULL,
  p_trial_days INTEGER DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT NULL,
  p_is_public BOOLEAN DEFAULT NULL,
  p_sort_order INTEGER DEFAULT NULL
)
RETURNS billing.plans
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, billing
AS $$
DECLARE
  v_result billing.plans;
BEGIN
  UPDATE billing.plans SET
    name = COALESCE(p_name, name),
    slug = COALESCE(p_slug, slug),
    description = COALESCE(p_description, description),
    features = COALESCE(p_features, features),
    limits = COALESCE(p_limits, limits),
    price_monthly = COALESCE(p_price_monthly, price_monthly),
    price_yearly = COALESCE(p_price_yearly, price_yearly),
    currency = COALESCE(p_currency, currency),
    trial_days = COALESCE(p_trial_days, trial_days),
    is_active = COALESCE(p_is_active, is_active),
    is_public = COALESCE(p_is_public, is_public),
    sort_order = COALESCE(p_sort_order, sort_order),
    updated_at = NOW()
  WHERE id = p_id
  RETURNING * INTO v_result;
  
  RETURN v_result;
END;
$$;

-- Function to soft delete a plan
CREATE OR REPLACE FUNCTION public.admin_delete_plan(p_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, billing
AS $$
BEGIN
  UPDATE billing.plans SET
    deleted_at = NOW(),
    updated_at = NOW()
  WHERE id = p_id;
  
  RETURN TRUE;
END;
$$;