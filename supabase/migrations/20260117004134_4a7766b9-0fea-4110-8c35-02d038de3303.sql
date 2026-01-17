-- Fix security definer views by recreating with security_invoker
DROP VIEW IF EXISTS public.public_billing_plans;
DROP VIEW IF EXISTS public.public_landing_settings;

-- Recreate views with security_invoker = true (uses caller's permissions)
CREATE VIEW public.public_billing_plans 
WITH (security_invoker = true) AS
SELECT 
  id,
  name,
  slug,
  description,
  features,
  price_monthly,
  price_yearly,
  currency,
  trial_days,
  limits,
  sort_order
FROM billing.plans
WHERE is_active = true 
  AND is_public = true 
  AND deleted_at IS NULL;

CREATE VIEW public.public_landing_settings
WITH (security_invoker = true) AS
SELECT 
  key,
  value
FROM system.settings
WHERE key IN (
  'landing_page_logo',
  'landing_page_colors', 
  'landing_page_social_links',
  'landing_page_company_info'
);

-- Grant SELECT on views to anon (public access)
GRANT SELECT ON public.public_billing_plans TO anon, authenticated;
GRANT SELECT ON public.public_landing_settings TO anon, authenticated;

-- Create RLS policies on underlying tables to allow anon access via views
-- billing.plans - allow anon to read public plans
CREATE POLICY "Public can read active public plans" 
ON billing.plans 
FOR SELECT 
TO anon
USING (is_active = true AND is_public = true AND deleted_at IS NULL);

-- system.settings - allow anon to read landing page settings  
CREATE POLICY "Public can read landing page settings"
ON system.settings
FOR SELECT
TO anon
USING (key IN (
  'landing_page_logo',
  'landing_page_colors', 
  'landing_page_social_links',
  'landing_page_company_info'
));