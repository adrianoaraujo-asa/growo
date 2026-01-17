-- Enable RLS on system.settings if not already enabled
ALTER TABLE system.settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to public settings
DROP POLICY IF EXISTS "Allow public read on public settings" ON system.settings;
CREATE POLICY "Allow public read on public settings" 
ON system.settings 
FOR SELECT 
USING (is_public = true);

-- Enable RLS on billing.plans if not already enabled
ALTER TABLE billing.plans ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to public plans
DROP POLICY IF EXISTS "Allow public read on public plans" ON billing.plans;
CREATE POLICY "Allow public read on public plans" 
ON billing.plans 
FOR SELECT 
USING (is_public = true AND is_active = true AND deleted_at IS NULL);