import { useQuery } from "@tanstack/react-query";
import type { 
  LandingPageLogo, 
  LandingPageColors, 
  LandingPageSocialLinks, 
  LandingPageCompanyInfo,
  BillingPlan,
  LandingPageConfig
} from "@/types/landing";

const SUPABASE_URL = "https://ujkxdoypfazesiyjqdub.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqa3hkb3lwZmF6ZXNpeWpxZHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjM0NjcsImV4cCI6MjA4MzkzOTQ2N30.VoL7GY0_MMLV-7H0GHM_EKBxzvqqP_6sqlesOZO0WVc";

// Default values
const defaultLogo: LandingPageLogo = {
  url: null,
  alt: "growo.app"
};

const defaultColors: LandingPageColors = {
  primary: "262.1 83.3% 57.8%",
  primary_foreground: "210 20% 98%",
  secondary: "220 14.3% 95.9%",
  secondary_foreground: "220.9 39.3% 11%",
  accent: "262.1 83.3% 57.8%",
  accent_foreground: "210 20% 98%",
  background: "0 0% 100%",
  foreground: "224 71.4% 4.1%",
  muted: "220 14.3% 95.9%",
  muted_foreground: "220 8.9% 46.1%",
  card: "0 0% 100%",
  card_foreground: "224 71.4% 4.1%",
  border: "220 13% 91%"
};

const defaultSocialLinks: LandingPageSocialLinks = {
  facebook: null,
  twitter: null,
  linkedin: null,
  instagram: null,
  youtube: null,
  github: null
};

const defaultCompanyInfo: LandingPageCompanyInfo = {
  name: "growo.app",
  description: "Plataforma de gestão de projetos de TI",
  email: "contato@growo.app",
  phone: null,
  address: null
};

async function fetchLandingPageSettings(): Promise<Array<{ key: string; value: unknown }> | null> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/system.settings?key=in.("landing_page_logo","landing_page_colors","landing_page_social_links","landing_page_company_info")&select=key,value`,
      {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    
    if (!response.ok) {
      console.error("Error fetching landing page settings:", response.statusText);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching landing page settings:", error);
    return null;
  }
}

async function fetchBillingPlans(): Promise<BillingPlan[]> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/billing.plans?is_active=eq.true&is_public=eq.true&deleted_at=is.null&order=sort_order.asc`,
      {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    
    if (!response.ok) {
      console.error("Error fetching billing plans:", response.statusText);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching billing plans:", error);
    return [];
  }
}

export function useLandingPageConfig() {
  const settingsQuery = useQuery({
    queryKey: ["landing-page-settings"],
    queryFn: fetchLandingPageSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const plansQuery = useQuery({
    queryKey: ["billing-plans-public"],
    queryFn: fetchBillingPlans,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Parse settings into typed objects
  const settings = settingsQuery.data;
  
  const logo: LandingPageLogo = settings?.find(s => s.key === "landing_page_logo")?.value as LandingPageLogo ?? defaultLogo;
  const colors: LandingPageColors = settings?.find(s => s.key === "landing_page_colors")?.value as LandingPageColors ?? defaultColors;
  const socialLinks: LandingPageSocialLinks = settings?.find(s => s.key === "landing_page_social_links")?.value as LandingPageSocialLinks ?? defaultSocialLinks;
  const companyInfo: LandingPageCompanyInfo = settings?.find(s => s.key === "landing_page_company_info")?.value as LandingPageCompanyInfo ?? defaultCompanyInfo;

  const config: LandingPageConfig = {
    logo,
    colors,
    socialLinks,
    companyInfo,
    plans: plansQuery.data || []
  };

  return {
    config,
    isLoading: settingsQuery.isLoading || plansQuery.isLoading,
    isError: settingsQuery.isError || plansQuery.isError,
    error: settingsQuery.error || plansQuery.error
  };
}

export { defaultColors, defaultLogo, defaultSocialLinks, defaultCompanyInfo };
