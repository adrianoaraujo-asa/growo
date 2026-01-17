-- Create public views to expose billing plans and system settings

-- View for public billing plans
CREATE OR REPLACE VIEW public.public_billing_plans AS
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

-- View for public landing page settings
CREATE OR REPLACE VIEW public.public_landing_settings AS
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