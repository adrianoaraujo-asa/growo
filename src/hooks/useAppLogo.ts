import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import defaultLogoImage from "@/assets/logo-default.png";

export interface AppLogo {
  url: string | null;
  alt: string;
  companyName: string;
}

const defaultLogo: AppLogo = {
  url: null,
  alt: "Logo",
  companyName: "Growo",
};

async function fetchLogo(): Promise<AppLogo> {
  const { data: settings } = await supabase
    .from("public_landing_settings")
    .select("key, value")
    .in("key", ["landing_page_logo", "landing_page_company_info"]);

  if (!settings || settings.length === 0) {
    return defaultLogo;
  }

  const logoSetting = settings.find((s) => s.key === "landing_page_logo");
  const companySetting = settings.find((s) => s.key === "landing_page_company_info");

  const logo = logoSetting?.value as { url?: string; alt?: string } | null;
  const company = companySetting?.value as { name?: string } | null;

  return {
    url: logo?.url || null,
    alt: logo?.alt || defaultLogo.alt,
    companyName: company?.name || defaultLogo.companyName,
  };
}

export function useAppLogo() {
  const { data: logo, isLoading } = useQuery({
    queryKey: ["app-logo"],
    queryFn: fetchLogo,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    logo: logo || defaultLogo,
    isLoading,
    defaultLogoImage,
  };
}
