
-- =============================================
-- GROWO SaaS - Complete Database Structure
-- PART 1: Schemas, Enums, Tables
-- =============================================

-- Create schemas
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS log;
CREATE SCHEMA IF NOT EXISTS system;

-- =============================================
-- ENUMS
-- =============================================

-- Public schema enums
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'manager', 'member', 'viewer');
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE public.contact_type AS ENUM ('email', 'phone', 'whatsapp', 'telegram', 'linkedin', 'other');
CREATE TYPE public.address_type AS ENUM ('billing', 'shipping', 'headquarters', 'branch', 'home', 'work', 'other');
CREATE TYPE public.document_type AS ENUM ('cpf', 'cnpj', 'passport', 'rg', 'other');
CREATE TYPE public.organization_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
CREATE TYPE public.invitation_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');
CREATE TYPE public.avatar_type AS ENUM ('user', 'organization', 'customer', 'professional');

-- Billing schema enums
CREATE TYPE billing.subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');
CREATE TYPE billing.payment_status AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'refunded', 'cancelled');
CREATE TYPE billing.invoice_status AS ENUM ('draft', 'open', 'paid', 'void', 'uncollectible');
CREATE TYPE billing.billing_interval AS ENUM ('day', 'week', 'month', 'year');

-- Log schema enums
CREATE TYPE log.log_level AS ENUM ('debug', 'info', 'warning', 'error', 'critical');
CREATE TYPE log.audit_action AS ENUM ('create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import');

-- =============================================
-- Function to update updated_at timestamp
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- PUBLIC SCHEMA TABLES
-- =============================================

-- User profiles (extends auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(200),
    avatar_url TEXT,
    gender public.gender_type,
    birth_date DATE,
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    locale VARCHAR(10) DEFAULT 'pt-BR',
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    last_login_at TIMESTAMPTZ,
    email_verified_at TIMESTAMPTZ,
    phone_verified_at TIMESTAMPTZ,
    onboarding_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE public.user_profiles IS 'Extended user profile information';

-- Organizations (tenants)
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    legal_name VARCHAR(200),
    document_type public.document_type,
    document_number VARCHAR(50),
    logo_url TEXT,
    website VARCHAR(255),
    industry VARCHAR(100),
    size VARCHAR(50),
    description TEXT,
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    locale VARCHAR(10) DEFAULT 'pt-BR',
    currency VARCHAR(3) DEFAULT 'BRL',
    status public.organization_status DEFAULT 'active',
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    trial_ends_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE public.organizations IS 'Multi-tenant organizations';

-- Organization users (membership with roles)
CREATE TABLE public.organization_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.app_role DEFAULT 'member' NOT NULL,
    title VARCHAR(100),
    department VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    permissions JSONB DEFAULT '{}',
    invited_by UUID REFERENCES auth.users(id),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,
    UNIQUE(organization_id, user_id)
);

COMMENT ON TABLE public.organization_users IS 'Organization membership and roles';

-- Organization invitations
CREATE TABLE public.organization_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role public.app_role DEFAULT 'member' NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    status public.invitation_status DEFAULT 'pending',
    invited_by UUID REFERENCES auth.users(id),
    accepted_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.organization_invitations IS 'Pending organization invitations';

-- Organization domains (SSO and email verification)
CREATE TABLE public.organization_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_primary BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_method VARCHAR(50) DEFAULT 'dns',
    verified_at TIMESTAMPTZ,
    sso_enabled BOOLEAN DEFAULT FALSE,
    sso_provider VARCHAR(50),
    sso_config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,
    UNIQUE(organization_id, domain)
);

COMMENT ON TABLE public.organization_domains IS 'Organization domains for SSO and verification';

-- Contacts (polymorphic)
CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    contactable_type VARCHAR(50) NOT NULL,
    contactable_id UUID NOT NULL,
    type public.contact_type NOT NULL,
    label VARCHAR(50),
    value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE public.contacts IS 'Polymorphic contacts for users, organizations, customers';
CREATE INDEX idx_contacts_polymorphic ON public.contacts(contactable_type, contactable_id);

-- Addresses (polymorphic)
CREATE TABLE public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    addressable_type VARCHAR(50) NOT NULL,
    addressable_id UUID NOT NULL,
    type public.address_type DEFAULT 'other',
    label VARCHAR(50),
    street VARCHAR(255),
    number VARCHAR(20),
    complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Brasil',
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_primary BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE public.addresses IS 'Polymorphic addresses for organizations, customers, etc';
CREATE INDEX idx_addresses_polymorphic ON public.addresses(addressable_type, addressable_id);

-- Avatars (polymorphic file storage)
CREATE TABLE public.avatars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    avatar_type public.avatar_type NOT NULL,
    avatar_id UUID NOT NULL,
    file_path TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    is_current BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE public.avatars IS 'Polymorphic avatar storage';
CREATE INDEX idx_avatars_polymorphic ON public.avatars(avatar_type, avatar_id);

-- =============================================
-- BILLING SCHEMA TABLES
-- =============================================

-- Subscription plans
CREATE TABLE billing.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    features JSONB DEFAULT '[]',
    limits JSONB DEFAULT '{}',
    price_monthly DECIMAL(10, 2),
    price_yearly DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'BRL',
    trial_days INTEGER DEFAULT 14,
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE billing.plans IS 'Subscription plans with features and limits';

-- Payment providers configuration
CREATE TABLE billing.payment_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    config JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE billing.payment_providers IS 'Payment provider configurations';

-- Subscriptions
CREATE TABLE billing.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES billing.plans(id),
    status billing.subscription_status DEFAULT 'trialing',
    billing_interval billing.billing_interval DEFAULT 'month',
    quantity INTEGER DEFAULT 1,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    external_id VARCHAR(255),
    external_provider VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE billing.subscriptions IS 'Organization subscriptions';
CREATE INDEX idx_subscriptions_org ON billing.subscriptions(organization_id);
CREATE INDEX idx_subscriptions_status ON billing.subscriptions(status);

-- Customers (billing customers)
CREATE TABLE billing.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    email VARCHAR(255),
    name VARCHAR(200),
    document_type public.document_type,
    document_number VARCHAR(50),
    external_id VARCHAR(255),
    external_provider VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,
    UNIQUE(organization_id)
);

COMMENT ON TABLE billing.customers IS 'Billing customer information';

-- Payment methods
CREATE TABLE billing.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    brand VARCHAR(50),
    last_four VARCHAR(4),
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    external_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE billing.payment_methods IS 'Customer payment methods';

-- Invoices
CREATE TABLE billing.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES billing.subscriptions(id),
    customer_id UUID REFERENCES billing.customers(id),
    number VARCHAR(50),
    status billing.invoice_status DEFAULT 'draft',
    currency VARCHAR(3) DEFAULT 'BRL',
    subtotal DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    amount_due DECIMAL(10, 2) DEFAULT 0,
    due_date TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    external_id VARCHAR(255),
    external_url TEXT,
    pdf_url TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE billing.invoices IS 'Billing invoices';
CREATE INDEX idx_invoices_org ON billing.invoices(organization_id);
CREATE INDEX idx_invoices_status ON billing.invoices(status);

-- Invoice items
CREATE TABLE billing.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES billing.invoices(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE billing.invoice_items IS 'Invoice line items';

-- Payments
CREATE TABLE billing.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES billing.invoices(id),
    customer_id UUID REFERENCES billing.customers(id),
    payment_method_id UUID REFERENCES billing.payment_methods(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    status billing.payment_status DEFAULT 'pending',
    failure_reason TEXT,
    refunded_amount DECIMAL(10, 2) DEFAULT 0,
    external_id VARCHAR(255),
    external_provider VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE billing.payments IS 'Payment transactions';
CREATE INDEX idx_payments_org ON billing.payments(organization_id);
CREATE INDEX idx_payments_status ON billing.payments(status);

-- Usage records (for metered billing)
CREATE TABLE billing.usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES billing.subscriptions(id),
    metric VARCHAR(100) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE billing.usage_records IS 'Usage records for metered billing';
CREATE INDEX idx_usage_org_metric ON billing.usage_records(organization_id, metric);
CREATE INDEX idx_usage_recorded ON billing.usage_records(recorded_at);

-- =============================================
-- LOG SCHEMA TABLES
-- =============================================

-- Audit logs
CREATE TABLE log.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action log.audit_action NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE log.audit_logs IS 'Audit trail for all system actions';
CREATE INDEX idx_audit_org ON log.audit_logs(organization_id);
CREATE INDEX idx_audit_user ON log.audit_logs(user_id);
CREATE INDEX idx_audit_resource ON log.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_created ON log.audit_logs(created_at);

-- Activity logs
CREATE TABLE log.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    properties JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE log.activity_logs IS 'User activity tracking';
CREATE INDEX idx_activity_org ON log.activity_logs(organization_id);
CREATE INDEX idx_activity_user ON log.activity_logs(user_id);
CREATE INDEX idx_activity_type ON log.activity_logs(activity_type);

-- System logs
CREATE TABLE log.system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level log.log_level DEFAULT 'info',
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    source VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE log.system_logs IS 'System-level logging';
CREATE INDEX idx_system_level ON log.system_logs(level);
CREATE INDEX idx_system_created ON log.system_logs(created_at);

-- =============================================
-- SYSTEM SCHEMA TABLES
-- =============================================

-- Feature flags
CREATE TABLE system.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    rules JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE system.feature_flags IS 'Feature flags for gradual rollout';

-- Feature flag overrides (per organization)
CREATE TABLE system.feature_flag_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_flag_id UUID NOT NULL REFERENCES system.feature_flags(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    is_enabled BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(feature_flag_id, organization_id)
);

COMMENT ON TABLE system.feature_flag_overrides IS 'Organization-specific feature flag overrides';

-- System settings
CREATE TABLE system.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE system.settings IS 'Global system settings';

-- Email templates
CREATE TABLE system.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE system.email_templates IS 'Email templates for transactional emails';

-- Scheduled jobs
CREATE TABLE system.scheduled_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    cron_expression VARCHAR(100) NOT NULL,
    handler VARCHAR(255) NOT NULL,
    payload JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE system.scheduled_jobs IS 'Scheduled background jobs';

-- =============================================
-- HELPER FUNCTIONS (after tables exist)
-- =============================================

-- Function to check user role (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.organization_users
        WHERE user_id = _user_id
          AND role = _role
          AND deleted_at IS NULL
    )
$$;

-- Function to check if user belongs to organization
CREATE OR REPLACE FUNCTION public.user_belongs_to_org(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.organization_users
        WHERE user_id = _user_id
          AND organization_id = _org_id
          AND deleted_at IS NULL
    )
$$;

-- Function to get user's current organization
CREATE OR REPLACE FUNCTION public.get_user_organization(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT organization_id
    FROM public.organization_users
    WHERE user_id = _user_id
      AND deleted_at IS NULL
    ORDER BY created_at ASC
    LIMIT 1
$$;

-- =============================================
-- TRIGGERS FOR updated_at
-- =============================================

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organization_users_updated_at BEFORE UPDATE ON public.organization_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organization_invitations_updated_at BEFORE UPDATE ON public.organization_invitations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organization_domains_updated_at BEFORE UPDATE ON public.organization_domains FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_avatars_updated_at BEFORE UPDATE ON public.avatars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON billing.plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_providers_updated_at BEFORE UPDATE ON billing.payment_providers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON billing.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON billing.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON billing.payment_methods FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON billing.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoice_items_updated_at BEFORE UPDATE ON billing.invoice_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON system.feature_flags FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_feature_flag_overrides_updated_at BEFORE UPDATE ON system.feature_flag_overrides FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON system.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON system.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scheduled_jobs_updated_at BEFORE UPDATE ON system.scheduled_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY - Enable RLS
-- =============================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.payment_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE log.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE log.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE log.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE system.feature_flag_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE system.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE system.scheduled_jobs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - User Profiles
-- =============================================

CREATE POLICY "Users can view their own profile"
ON public.user_profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- =============================================
-- RLS POLICIES - Organizations
-- =============================================

CREATE POLICY "Users can view organizations they belong to"
ON public.organizations FOR SELECT
TO authenticated
USING (public.user_belongs_to_org(auth.uid(), id));

CREATE POLICY "Owners and admins can update their organization"
ON public.organizations FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.organization_users
        WHERE organization_id = id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Authenticated users can create organizations"
ON public.organizations FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- =============================================
-- RLS POLICIES - Organization Users
-- =============================================

CREATE POLICY "Users can view members of their organizations"
ON public.organization_users FOR SELECT
TO authenticated
USING (public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Owners and admins can insert organization members"
ON public.organization_users FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.organization_users ou
        WHERE ou.organization_id = organization_id
        AND ou.user_id = auth.uid()
        AND ou.role IN ('owner', 'admin')
        AND ou.deleted_at IS NULL
    )
    OR NOT EXISTS (
        SELECT 1 FROM public.organization_users ou
        WHERE ou.organization_id = organization_id
    )
);

CREATE POLICY "Owners and admins can update organization members"
ON public.organization_users FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.organization_users ou
        WHERE ou.organization_id = organization_id
        AND ou.user_id = auth.uid()
        AND ou.role IN ('owner', 'admin')
        AND ou.deleted_at IS NULL
    )
);

CREATE POLICY "Owners and admins can delete organization members"
ON public.organization_users FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.organization_users ou
        WHERE ou.organization_id = organization_id
        AND ou.user_id = auth.uid()
        AND ou.role IN ('owner', 'admin')
        AND ou.deleted_at IS NULL
    )
);

-- =============================================
-- RLS POLICIES - Organization Invitations
-- =============================================

CREATE POLICY "Users can view invitations for their organizations"
ON public.organization_invitations FOR SELECT
TO authenticated
USING (public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Owners and admins can insert invitations"
ON public.organization_invitations FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.organization_users
        WHERE organization_id = organization_invitations.organization_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Owners and admins can update invitations"
ON public.organization_invitations FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.organization_users
        WHERE organization_id = organization_invitations.organization_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Owners and admins can delete invitations"
ON public.organization_invitations FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.organization_users
        WHERE organization_id = organization_invitations.organization_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
        AND deleted_at IS NULL
    )
);

-- =============================================
-- RLS POLICIES - Organization Domains
-- =============================================

CREATE POLICY "Users can view domains of their organizations"
ON public.organization_domains FOR SELECT
TO authenticated
USING (public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Owners can manage organization domains"
ON public.organization_domains FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.organization_users
        WHERE organization_id = organization_domains.organization_id
        AND user_id = auth.uid()
        AND role = 'owner'
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Owners can update organization domains"
ON public.organization_domains FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.organization_users
        WHERE organization_id = organization_domains.organization_id
        AND user_id = auth.uid()
        AND role = 'owner'
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Owners can delete organization domains"
ON public.organization_domains FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.organization_users
        WHERE organization_id = organization_domains.organization_id
        AND user_id = auth.uid()
        AND role = 'owner'
        AND deleted_at IS NULL
    )
);

-- =============================================
-- RLS POLICIES - Contacts, Addresses, Avatars
-- =============================================

CREATE POLICY "Users can view contacts of their organizations"
ON public.contacts FOR SELECT
TO authenticated
USING (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can manage contacts of their organizations"
ON public.contacts FOR INSERT
TO authenticated
WITH CHECK (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can update contacts of their organizations"
ON public.contacts FOR UPDATE
TO authenticated
USING (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can delete contacts of their organizations"
ON public.contacts FOR DELETE
TO authenticated
USING (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can view addresses of their organizations"
ON public.addresses FOR SELECT
TO authenticated
USING (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can manage addresses of their organizations"
ON public.addresses FOR INSERT
TO authenticated
WITH CHECK (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can update addresses of their organizations"
ON public.addresses FOR UPDATE
TO authenticated
USING (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can delete addresses of their organizations"
ON public.addresses FOR DELETE
TO authenticated
USING (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can view avatars of their organizations"
ON public.avatars FOR SELECT
TO authenticated
USING (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can manage avatars of their organizations"
ON public.avatars FOR INSERT
TO authenticated
WITH CHECK (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can update avatars of their organizations"
ON public.avatars FOR UPDATE
TO authenticated
USING (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can delete avatars of their organizations"
ON public.avatars FOR DELETE
TO authenticated
USING (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

-- =============================================
-- RLS POLICIES - Billing
-- =============================================

CREATE POLICY "Anyone can view active public plans"
ON billing.plans FOR SELECT
USING (is_active = true AND is_public = true AND deleted_at IS NULL);

CREATE POLICY "Users can view subscriptions of their organizations"
ON billing.subscriptions FOR SELECT
TO authenticated
USING (public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can view payment providers of their organizations"
ON billing.payment_providers FOR SELECT
TO authenticated
USING (public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can view customers of their organizations"
ON billing.customers FOR SELECT
TO authenticated
USING (public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can view payment methods of their organizations"
ON billing.payment_methods FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM billing.customers c
        WHERE c.id = payment_methods.customer_id
        AND public.user_belongs_to_org(auth.uid(), c.organization_id)
    )
);

CREATE POLICY "Users can view invoices of their organizations"
ON billing.invoices FOR SELECT
TO authenticated
USING (public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can view invoice items of their organizations"
ON billing.invoice_items FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM billing.invoices i
        WHERE i.id = invoice_items.invoice_id
        AND public.user_belongs_to_org(auth.uid(), i.organization_id)
    )
);

CREATE POLICY "Users can view payments of their organizations"
ON billing.payments FOR SELECT
TO authenticated
USING (public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can view usage records of their organizations"
ON billing.usage_records FOR SELECT
TO authenticated
USING (public.user_belongs_to_org(auth.uid(), organization_id));

-- =============================================
-- RLS POLICIES - Logs
-- =============================================

CREATE POLICY "Users can view audit logs of their organizations"
ON log.audit_logs FOR SELECT
TO authenticated
USING (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Users can view activity logs of their organizations"
ON log.activity_logs FOR SELECT
TO authenticated
USING (organization_id IS NULL OR public.user_belongs_to_org(auth.uid(), organization_id));

-- =============================================
-- RLS POLICIES - System
-- =============================================

CREATE POLICY "Anyone can view enabled feature flags"
ON system.feature_flags FOR SELECT
USING (is_enabled = true);

CREATE POLICY "Users can view feature flag overrides for their orgs"
ON system.feature_flag_overrides FOR SELECT
TO authenticated
USING (public.user_belongs_to_org(auth.uid(), organization_id));

CREATE POLICY "Anyone can view public settings"
ON system.settings FOR SELECT
USING (is_public = true);

-- =============================================
-- TRIGGER: Auto-create user profile on signup
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name'
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- INSERT DEFAULT PLANS
-- =============================================

INSERT INTO billing.plans (name, slug, description, features, limits, price_monthly, price_yearly, trial_days, sort_order) VALUES
('Free', 'free', 'Plano gratuito para começar', '["1 projeto", "2 usuários", "Suporte por email"]', '{"projects": 1, "users": 2, "storage_gb": 1}', 0, 0, 0, 1),
('Starter', 'starter', 'Para pequenas equipes', '["5 projetos", "5 usuários", "Relatórios básicos", "Suporte prioritário"]', '{"projects": 5, "users": 5, "storage_gb": 10}', 49.90, 479.90, 14, 2),
('Professional', 'professional', 'Para equipes em crescimento', '["Projetos ilimitados", "20 usuários", "Relatórios avançados", "Integrações", "API Access"]', '{"projects": -1, "users": 20, "storage_gb": 50}', 149.90, 1439.90, 14, 3),
('Enterprise', 'enterprise', 'Para grandes organizações', '["Tudo do Professional", "Usuários ilimitados", "SSO", "SLA", "Suporte dedicado"]', '{"projects": -1, "users": -1, "storage_gb": 500}', 499.90, 4799.90, 30, 4);
