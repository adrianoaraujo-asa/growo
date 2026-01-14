
-- Fix security warnings: add policies for tables without them and fix function search_path

-- Policy for system_logs (service role only - deny all for regular users)
CREATE POLICY "System logs are service role only"
ON log.system_logs FOR SELECT
TO service_role
USING (true);

-- Policy for email_templates (service role only)
CREATE POLICY "Email templates are service role only"
ON system.email_templates FOR SELECT
TO service_role
USING (true);

-- Policy for scheduled_jobs (service role only)
CREATE POLICY "Scheduled jobs are service role only"
ON system.scheduled_jobs FOR SELECT
TO service_role
USING (true);

-- Fix function search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;
