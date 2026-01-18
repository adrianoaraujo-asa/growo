import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  TestTube,
  Save,
  RefreshCw,
  ExternalLink,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface R2Config {
  r2_account_id: string;
  r2_bucket_name: string;
  r2_endpoint: string;
  r2_public_url: string;
}

interface R2Status {
  configured: boolean;
  hasAccessKeyId: boolean;
  hasSecretAccessKey: boolean;
  hasEndpoint: boolean;
  hasBucketName: boolean;
  hasAccountId: boolean;
  hasPublicUrl: boolean;
  endpoint: string | null;
  bucketName: string | null;
  publicUrl: string | null;
}

export function StorageAdminPage() {
  const [config, setConfig] = useState<R2Config>({
    r2_account_id: "",
    r2_bucket_name: "",
    r2_endpoint: "",
    r2_public_url: "",
  });
  const [status, setStatus] = useState<R2Status | null>(null);
  const [showSecrets, setShowSecrets] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Load current configuration on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-storage", {
        body: {},
        method: "POST",
      });

      // Use query params approach
      const response = await supabase.functions.invoke("admin-storage?action=get-config");

      if (response.error) throw response.error;

      if (response.data) {
        setStatus(response.data);
        // Pre-fill form with known values
        setConfig((prev) => ({
          ...prev,
          r2_bucket_name: response.data.bucketName || "",
          r2_endpoint: response.data.endpoint?.replace("/...", "") || "",
          r2_public_url: response.data.publicUrl || "",
        }));
      }
    } catch (error) {
      console.error("Failed to load config:", error);
      // Don't show error - might not have access
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof R2Config, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setTestResult(null);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("admin-storage?action=test-connection");

      if (error) throw error;

      if (data?.success) {
        setTestResult({
          success: true,
          message: data.message || "Conexão R2 estabelecida com sucesso!",
        });
        toast.success("Conexão R2 testada com sucesso!");
        // Reload status
        loadConfig();
      } else {
        setTestResult({
          success: false,
          message: data?.error || "Erro ao testar conexão",
        });
        toast.error(data?.error || "Falha no teste de conexão");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      setTestResult({
        success: false,
        message,
      });
      toast.error("Erro ao testar conexão");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-storage?action=save-config", {
        body: {
          endpoint: config.r2_endpoint,
          bucketName: config.r2_bucket_name,
          publicUrl: config.r2_public_url,
          accountId: config.r2_account_id,
        },
      });

      if (error) throw error;

      toast.success("Configuração salva com sucesso!");
      if (data?.message) {
        toast.info(data.message, { duration: 8000 });
      }
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsSaving(false);
    }
  };

  const getMissingSecrets = () => {
    if (!status) return [];
    const missing = [];
    if (!status.hasAccessKeyId) missing.push("R2_ACCESS_KEY_ID");
    if (!status.hasSecretAccessKey) missing.push("R2_SECRET_ACCESS_KEY");
    if (!status.hasEndpoint) missing.push("R2_ENDPOINT");
    if (!status.hasBucketName) missing.push("R2_BUCKET_NAME");
    return missing;
  };

  const missingSecrets = getMissingSecrets();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold text-heading">
          Configurações de Storage
        </h1>
        <p className="text-muted-foreground">
          Configure a integração com Cloudflare R2 para armazenamento de arquivos.
        </p>
      </div>

      {/* Status Card */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Status da Conexão R2
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-muted-foreground">Carregando...</span>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-4">
                {status?.configured ? (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Configurado
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Não configurado
                  </Badge>
                )}
                
                {testResult && (
                  testResult.success ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Conexão OK
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Falha na conexão
                    </Badge>
                  )
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTest}
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4 mr-2" />
                  )}
                  Testar Conexão
                </Button>
                
                <Button variant="ghost" size="sm" onClick={loadConfig}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              </div>

              {testResult && (
                <p
                  className={`text-sm ${
                    testResult.success ? "text-green-600" : "text-destructive"
                  }`}
                >
                  {testResult.message}
                </p>
              )}

              {/* Status details */}
              {status && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                  <StatusBadge label="Access Key" configured={status.hasAccessKeyId} />
                  <StatusBadge label="Secret Key" configured={status.hasSecretAccessKey} />
                  <StatusBadge label="Endpoint" configured={status.hasEndpoint} />
                  <StatusBadge label="Bucket" configured={status.hasBucketName} />
                  <StatusBadge label="Account ID" configured={status.hasAccountId} optional />
                  <StatusBadge label="Public URL" configured={status.hasPublicUrl} optional />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Missing Secrets Alert */}
      {missingSecrets.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Secrets não configurados</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Os seguintes secrets precisam ser configurados no Supabase Dashboard:
            </p>
            <ul className="list-disc list-inside">
              {missingSecrets.map((secret) => (
                <li key={secret} className="font-mono text-sm">{secret}</li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <a
                href="https://supabase.com/dashboard/project/ujkxdoypfazesiyjqdub/settings/functions"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Supabase Edge Functions Secrets
              </a>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Como configurar os Secrets</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            Por segurança, as credenciais sensíveis (Access Key ID e Secret Access Key) 
            devem ser configuradas diretamente no Supabase Dashboard:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Acesse o <strong>Supabase Dashboard</strong></li>
            <li>Vá para <strong>Project Settings → Edge Functions</strong></li>
            <li>Na seção <strong>Secrets</strong>, adicione cada secret necessário</li>
            <li>Volte aqui e clique em <strong>Testar Conexão</strong></li>
          </ol>
        </AlertDescription>
      </Alert>

      {/* Configuration Card */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Configurações Públicas
          </CardTitle>
          <CardDescription>
            Configure as informações não-sensíveis do R2. Essas configurações são 
            armazenadas no banco de dados para referência.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="account_id">Account ID</Label>
              <Input
                id="account_id"
                placeholder="Cloudflare Account ID"
                value={config.r2_account_id}
                onChange={(e) => handleChange("r2_account_id", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Encontrado em Cloudflare Dashboard → R2 → Overview
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bucket_name">Bucket Name</Label>
              <Input
                id="bucket_name"
                placeholder="nome-do-bucket"
                value={config.r2_bucket_name}
                onChange={(e) => handleChange("r2_bucket_name", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endpoint">R2 Endpoint</Label>
            <Input
              id="endpoint"
              placeholder="https://{account_id}.r2.cloudflarestorage.com"
              value={config.r2_endpoint}
              onChange={(e) => handleChange("r2_endpoint", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Formato: https://ACCOUNT_ID.r2.cloudflarestorage.com
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="public_url">Public URL (opcional)</Label>
            <Input
              id="public_url"
              placeholder="https://files.seudominio.com"
              value={config.r2_public_url}
              onChange={(e) => handleChange("r2_public_url", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              URL pública do bucket (se configurado com custom domain)
            </p>
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleTest} disabled={isTesting}>
              {isTesting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4 mr-2" />
              )}
              Testar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Setup Guide */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle>Guia de Configuração</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Criar Bucket no Cloudflare R2</h4>
            <p className="text-sm text-muted-foreground">
              Acesse{" "}
              <a
                href="https://dash.cloudflare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                dash.cloudflare.com
              </a>{" "}
              → R2 → Create bucket
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">2. Criar API Token</h4>
            <p className="text-sm text-muted-foreground">
              Em R2 → Manage R2 API Tokens → Create API token. 
              Selecione permissões "Object Read & Write" e escolha o bucket criado.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">3. Configurar Secrets no Supabase</h4>
            <p className="text-sm text-muted-foreground">
              Adicione os seguintes secrets no Supabase Dashboard:
            </p>
            <div className="bg-muted p-3 rounded-md font-mono text-sm space-y-1">
              <div>R2_ACCESS_KEY_ID = seu_access_key</div>
              <div>R2_SECRET_ACCESS_KEY = seu_secret_key</div>
              <div>R2_ENDPOINT = https://ACCOUNT_ID.r2.cloudflarestorage.com</div>
              <div>R2_BUCKET_NAME = nome-do-bucket</div>
              <div className="text-muted-foreground"># Opcional:</div>
              <div>R2_ACCOUNT_ID = seu_account_id</div>
              <div>R2_PUBLIC_URL = https://files.seudominio.com</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">4. Testar Conexão</h4>
            <p className="text-sm text-muted-foreground">
              Use o botão "Testar Conexão" acima para verificar se a integração está funcionando.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatusBadge({ 
  label, 
  configured, 
  optional = false 
}: { 
  label: string; 
  configured: boolean; 
  optional?: boolean;
}) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${
      configured 
        ? "text-green-600" 
        : optional 
          ? "text-muted-foreground" 
          : "text-destructive"
    }`}>
      {configured ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <AlertCircle className="w-3 h-3" />
      )}
      <span>{label}</span>
      {optional && !configured && (
        <span className="text-muted-foreground">(opcional)</span>
      )}
    </div>
  );
}
