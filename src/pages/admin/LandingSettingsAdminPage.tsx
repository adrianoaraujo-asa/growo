import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Palette, Building2, Share2, Image } from "lucide-react";
import type { LandingPageLogo, LandingPageColors, LandingPageSocialLinks, LandingPageCompanyInfo } from "@/types/landing";
import { defaultColors, defaultLogo, defaultSocialLinks, defaultCompanyInfo } from "@/hooks/useLandingPageConfig";

const SUPABASE_URL = "https://ujkxdoypfazesiyjqdub.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqa3hkb3lwZmF6ZXNpeWpxZHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjM0NjcsImV4cCI6MjA4MzkzOTQ2N30.VoL7GY0_MMLV-7H0GHM_EKBxzvqqP_6sqlesOZO0WVc";

interface SettingRow {
  id: string;
  key: string;
  value: unknown;
}

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || "";
}

async function fetchSettings(): Promise<SettingRow[]> {
  const token = await getAccessToken();
  const keys = ["landing_page_logo", "landing_page_colors", "landing_page_social_links", "landing_page_company_info"];
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/admin-settings?keys=${keys.join(",")}`,
    {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
  if (!response.ok) return [];
  return response.json();
}

async function upsertSetting(key: string, value: unknown): Promise<void> {
  const token = await getAccessToken();
  
  const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-settings`, {
    method: "POST",
    headers: { 
      "apikey": SUPABASE_ANON_KEY, 
      "Authorization": `Bearer ${token}`, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ key, value, is_public: true })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save setting");
  }
}

export default function LandingSettingsAdminPage() {
  const queryClient = useQueryClient();
  const [logo, setLogo] = useState<LandingPageLogo>(defaultLogo);
  const [colors, setColors] = useState<LandingPageColors>(defaultColors);
  const [socialLinks, setSocialLinks] = useState<LandingPageSocialLinks>(defaultSocialLinks);
  const [companyInfo, setCompanyInfo] = useState<LandingPageCompanyInfo>(defaultCompanyInfo);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-landing-settings"],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    if (settings) {
      const logoS = settings.find(s => s.key === "landing_page_logo");
      const colorsS = settings.find(s => s.key === "landing_page_colors");
      const socialS = settings.find(s => s.key === "landing_page_social_links");
      const companyS = settings.find(s => s.key === "landing_page_company_info");
      if (logoS?.value) setLogo(logoS.value as LandingPageLogo);
      if (colorsS?.value) setColors(colorsS.value as LandingPageColors);
      if (socialS?.value) setSocialLinks(socialS.value as LandingPageSocialLinks);
      if (companyS?.value) setCompanyInfo(companyS.value as LandingPageCompanyInfo);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: unknown }) => {
      await upsertSetting(key, value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-landing-settings"] });
      queryClient.invalidateQueries({ queryKey: ["landing-page-settings"] });
      toast({ title: "Salvo com sucesso!" });
    },
    onError: (error) => {
      toast({ title: "Erro ao salvar", description: String(error), variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Configurações da Landing Page</h1>
        <p className="text-muted-foreground">Personalize a aparência da página inicial.</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company"><Building2 className="h-4 w-4 mr-2" />Empresa</TabsTrigger>
          <TabsTrigger value="logo"><Image className="h-4 w-4 mr-2" />Logo</TabsTrigger>
          <TabsTrigger value="colors"><Palette className="h-4 w-4 mr-2" />Cores</TabsTrigger>
          <TabsTrigger value="social"><Share2 className="h-4 w-4 mr-2" />Redes Sociais</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader><CardTitle>Informações da Empresa</CardTitle><CardDescription>Dados exibidos na landing page.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nome</Label><Input value={companyInfo.name} onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={companyInfo.email || ""} onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value || null })} /></div>
              </div>
              <div className="space-y-2"><Label>Descrição</Label><Textarea value={companyInfo.description} onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })} rows={3} /></div>
              <div className="flex justify-end"><Button onClick={() => saveMutation.mutate({ key: "landing_page_company_info", value: companyInfo })} disabled={saveMutation.isPending}><Save className="h-4 w-4 mr-2" />Salvar</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo">
          <Card>
            <CardHeader><CardTitle>Logo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>URL da Logo</Label><Input value={logo.url || ""} onChange={(e) => setLogo({ ...logo, url: e.target.value || null })} placeholder="https://..." /></div>
              <div className="space-y-2"><Label>Texto Alt</Label><Input value={logo.alt} onChange={(e) => setLogo({ ...logo, alt: e.target.value })} /></div>
              <div className="flex justify-end"><Button onClick={() => saveMutation.mutate({ key: "landing_page_logo", value: logo })} disabled={saveMutation.isPending}><Save className="h-4 w-4 mr-2" />Salvar</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors">
          <Card>
            <CardHeader><CardTitle>Paleta de Cores</CardTitle><CardDescription>Use HSL (ex: "262.1 83.3% 57.8%")</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Primary</Label><Input value={colors.primary} onChange={(e) => setColors({ ...colors, primary: e.target.value })} /></div>
                <div className="space-y-2"><Label>Background</Label><Input value={colors.background} onChange={(e) => setColors({ ...colors, background: e.target.value })} /></div>
                <div className="space-y-2"><Label>Foreground</Label><Input value={colors.foreground} onChange={(e) => setColors({ ...colors, foreground: e.target.value })} /></div>
                <div className="space-y-2"><Label>Accent</Label><Input value={colors.accent} onChange={(e) => setColors({ ...colors, accent: e.target.value })} /></div>
              </div>
              <div className="flex justify-end"><Button onClick={() => saveMutation.mutate({ key: "landing_page_colors", value: colors })} disabled={saveMutation.isPending}><Save className="h-4 w-4 mr-2" />Salvar</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader><CardTitle>Redes Sociais</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Facebook</Label><Input value={socialLinks.facebook || ""} onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value || null })} /></div>
                <div className="space-y-2"><Label>Instagram</Label><Input value={socialLinks.instagram || ""} onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value || null })} /></div>
                <div className="space-y-2"><Label>LinkedIn</Label><Input value={socialLinks.linkedin || ""} onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value || null })} /></div>
                <div className="space-y-2"><Label>Twitter</Label><Input value={socialLinks.twitter || ""} onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value || null })} /></div>
              </div>
              <div className="flex justify-end"><Button onClick={() => saveMutation.mutate({ key: "landing_page_social_links", value: socialLinks })} disabled={saveMutation.isPending}><Save className="h-4 w-4 mr-2" />Salvar</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
