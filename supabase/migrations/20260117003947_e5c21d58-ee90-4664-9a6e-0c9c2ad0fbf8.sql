-- Grant usage on billing and system schemas to anon and authenticated roles
GRANT USAGE ON SCHEMA billing TO anon, authenticated;
GRANT USAGE ON SCHEMA system TO anon, authenticated;

-- Grant SELECT on billing.plans for public access
GRANT SELECT ON billing.plans TO anon, authenticated;

-- Grant SELECT on system.settings for public access
GRANT SELECT ON system.settings TO anon, authenticated;