import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Save,
  Loader2,
  HardDrive,
  Settings,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useCurrentOrganization } from "@/hooks/useCurrentOrganization";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Json } from "@/integrations/supabase/types";

interface StorageSettings {
  r2_enabled: boolean;
  r2_bucket_name: string;
  r2_public_url: string;
  r2_access_key_id: string;
  r2_secret_access_key: string;
  r2_endpoint: string;
  r2_account_id: string;
}

const defaultSettings: StorageSettings = {
  r2_enabled: false,
  r2_bucket_name: "",
  r2_public_url: "",
  r2_access_key_id: "",
  r2_secret_access_key: "",
  r2_endpoint: "",
  r2_account_id: "",
};

export function OrganizationStoragePage() {
  const { data: organization, isLoading: orgLoading } = useCurrentOrganization();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<StorageSettings>(defaultSettings);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");

  // Fetch current settings
  const { isLoading: settingsLoading } = useQuery({
    queryKey: ["organization-storage-settings", organization?.id],
    queryFn: async () => {
      if (!organization) return null;
      
      const settings = organization.settings as Record<string, unknown> | null;
      if (settings?.storage) {
        const storageSettings = settings.storage as StorageSettings;
        setFormData({
          ...defaultSettings,
          ...storageSettings,
          // Never show actual secret key
          r2_secret_access_key: storageSettings.r2_secret_access_key ? "••••••••" : "",
        });
        return storageSettings;
      }
      return null;
    },
    enabled: !!organization,
  });

  // Save settings mutation
  const saveSettings = useMutation({
    mutationFn: async (settings: StorageSettings) => {
      if (!organization) throw new Error("No organization");

      const currentSettings = (organization.settings as Record<string, unknown>) || {};
      
      // Don't overwrite secret if it's masked
      const settingsToSave = {
        ...settings,
        r2_secret_access_key: settings.r2_secret_access_key === "••••••••" 
          ? (currentSettings.storage as StorageSettings)?.r2_secret_access_key || ""
          : settings.r2_secret_access_key,
      };

      const { error } = await supabase
        .from("organizations")
        .update({
          settings: {
            ...currentSettings,
            storage: settingsToSave,
          } as Json,
        })
        .eq("id", organization.id);

      if (error) throw error;
      return settingsToSave;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-storage-settings"] });
      queryClient.invalidateQueries({ queryKey: ["current-organization"] });
      toast.success("Configurações salvas com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error saving settings:", error);
      toast.error("Erro ao salvar configurações");
    },
  });

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus("idle");

    try {
      // Save settings first
      await saveSettings.mutateAsync(formData);

      // Test connection via edge function
      const { data, error } = await supabase.functions.invoke("r2-storage", {
        body: { action: "test-connection" },
      });

      if (error) throw error;

      setConnectionStatus("success");
      toast.success("Conexão com R2 funcionando!");
    } catch (error) {
      console.error("Connection test failed:", error);
      setConnectionStatus("error");
      toast.error("Falha na conexão com R2");
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = () => {
    saveSettings.mutate(formData);
  };

  const isLoading = orgLoading || settingsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading flex items-center gap-2">
            <HardDrive className="w-6 h-6" />
            Armazenamento
          </h1>
          <p className="text-muted-foreground">
            Configure o armazenamento de arquivos da sua organização.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saveSettings.isPending}>
          {saveSettings.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar
        </Button>
      </div>

      {/* Info Alert */}
      <Alert>
        <Cloud className="h-4 w-4" />
        <AlertTitle>Cloudflare R2</AlertTitle>
        <AlertDescription>
          Configure seu próprio bucket Cloudflare R2 para armazenar arquivos da sua organização.
          Isso permite controle total sobre seus dados e custos de armazenamento.
          <a 
            href="https://developers.cloudflare.com/r2/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 ml-2 text-primary hover:underline"
          >
            Saiba mais <ExternalLink className="w-3 h-3" />
          </a>
        </AlertDescription>
      </Alert>

      {/* Enable/Disable */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Storage Personalizado</CardTitle>
              <CardDescription>
                Ative para usar seu próprio bucket R2 ao invés do armazenamento padrão.
              </CardDescription>
            </div>
            <Switch
              checked={formData.r2_enabled}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, r2_enabled: checked }))
              }
            />
          </div>
        </CardHeader>
      </Card>

      {/* R2 Configuration */}
      {formData.r2_enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações do Cloudflare R2
            </CardTitle>
            <CardDescription>
              Insira as credenciais do seu bucket R2. Você pode encontrá-las no 
              painel do Cloudflare em R2 {">"} API Tokens.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="r2_account_id">Account ID</Label>
                <Input
                  id="r2_account_id"
                  value={formData.r2_account_id}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, r2_account_id: e.target.value }))
                  }
                  placeholder="Seu Account ID do Cloudflare"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r2_bucket_name">Nome do Bucket</Label>
                <Input
                  id="r2_bucket_name"
                  value={formData.r2_bucket_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, r2_bucket_name: e.target.value }))
                  }
                  placeholder="meu-bucket"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="r2_endpoint">Endpoint</Label>
              <Input
                id="r2_endpoint"
                value={formData.r2_endpoint}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, r2_endpoint: e.target.value }))
                }
                placeholder="https://<account-id>.r2.cloudflarestorage.com"
              />
              <p className="text-xs text-muted-foreground">
                Formato: https://{"<account-id>"}.r2.cloudflarestorage.com
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="r2_public_url">URL Pública (opcional)</Label>
              <Input
                id="r2_public_url"
                value={formData.r2_public_url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, r2_public_url: e.target.value }))
                }
                placeholder="https://cdn.seudominio.com"
              />
              <p className="text-xs text-muted-foreground">
                URL personalizada para acesso público aos arquivos (custom domain).
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Credenciais de API</h4>
              
              <div className="space-y-2">
                <Label htmlFor="r2_access_key_id">Access Key ID</Label>
                <Input
                  id="r2_access_key_id"
                  value={formData.r2_access_key_id}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, r2_access_key_id: e.target.value }))
                  }
                  placeholder="Sua Access Key ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="r2_secret_access_key">Secret Access Key</Label>
                <Input
                  id="r2_secret_access_key"
                  type="password"
                  value={formData.r2_secret_access_key}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, r2_secret_access_key: e.target.value }))
                  }
                  placeholder="Sua Secret Access Key"
                />
                <p className="text-xs text-muted-foreground">
                  A secret key é armazenada de forma segura e criptografada.
                </p>
              </div>
            </div>

            <Separator />

            {/* Test Connection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {connectionStatus === "success" && (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                )}
                {connectionStatus === "error" && (
                  <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Erro na conexão
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTestingConnection || !formData.r2_access_key_id || !formData.r2_bucket_name}
              >
                {isTestingConnection ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Cloud className="w-4 h-4 mr-2" />
                )}
                Testar Conexão
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Usage (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Uso do Armazenamento</CardTitle>
          <CardDescription>
            Visualize o espaço utilizado pela sua organização.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Espaço utilizado</span>
                <span className="text-muted-foreground">0 MB / ∞</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            O uso detalhado estará disponível após configurar o armazenamento.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
