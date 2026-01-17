// Landing page configuration types

export interface LandingPageLogo {
  url: string | null;
  alt: string;
}

export interface LandingPageColors {
  primary: string;
  primary_foreground: string;
  secondary: string;
  secondary_foreground: string;
  accent: string;
  accent_foreground: string;
  background: string;
  foreground: string;
  muted: string;
  muted_foreground: string;
  card: string;
  card_foreground: string;
  border: string;
}

export interface LandingPageSocialLinks {
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  youtube: string | null;
  github: string | null;
}

export interface LandingPageCompanyInfo {
  name: string;
  description: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface BillingPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  features: string[];
  limits: Record<string, number>;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  trial_days: number;
  is_active: boolean;
  is_public: boolean;
  sort_order: number;
  metadata: Record<string, unknown>;
}

export interface LandingPageConfig {
  logo: LandingPageLogo;
  colors: LandingPageColors;
  socialLinks: LandingPageSocialLinks;
  companyInfo: LandingPageCompanyInfo;
  plans: BillingPlan[];
}
