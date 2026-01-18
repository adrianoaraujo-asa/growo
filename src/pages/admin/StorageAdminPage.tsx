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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface R2Config {
  accountId: string;
  bucketName: string;
  endpoint: string;
  publicUrl: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export function StorageAdminPage() {
  const [config, setConfig] = useState<R2Config>({
    accountId: "",
    bucketName: "",
    endpoint: "",
    publicUrl: "",
    accessKeyId: "",
    secretAccessKey: "",
  });
  const [showSecrets, setShowSecrets] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-storage?action=get-config");

      if (error) throw error;

      if (data?.configured && data?.config) {
        setIsConfigured(true);
        setConfig({
          accountId: data.config.accountId || "",
          bucketName: data.config.bucketName || "",
          endpoint: data.config.endpoint || "",
          publicUrl: data.config.publicUrl || "",
          accessKeyId: "", // Don't pre-fill secrets
          secretAccessKey: "",
        });
      }
    } catch (error) {
      console.error("Failed to load config:", error);
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
      } else {
        setTestResult({
          success: false,
          message: data?.error || "Erro ao testar conexão",
        });
        toast.error(data?.error || "Falha no teste de conexão");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      setTestResult({ success: false, message });
      toast.error("Erro ao testar conexão");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!config.bucketName || !config.endpoint || !config.accessKeyId || !config.secretAccessKey) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-storage?action=save-config", {
        body: {
          accountId: config.accountId,
          bucketName: config.bucketName,
          endpoint: config.endpoint,
          publicUrl: config.publicUrl,
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast.success("Configuração salva com sucesso!");
        setIsConfigured(true);
        // Clear sensitive fields after save
        setConfig((prev) => ({
          ...prev,
          accessKeyId: "",
          secretAccessKey: "",
        }));
        loadConfig();
      } else {
        toast.error(data?.error || "Erro ao salvar configuração");
      }
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsSaving(false);
    }
  };

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
                {isConfigured ? (
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
                      Falha
                    </Badge>
                  )
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTest}
                  disabled={isTesting || !isConfigured}
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
                <p className={`text-sm ${testResult.success ? "text-green-600" : "text-destructive"}`}>
                  {testResult.message}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Configuration Card */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Credenciais R2
          </CardTitle>
          <CardDescription>
            Configure as credenciais de acesso ao Cloudflare R2. Todas as credenciais
            são armazenadas de forma segura no banco de dados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="account_id">Account ID (opcional)</Label>
              <Input
                id="account_id"
                placeholder="Cloudflare Account ID"
                value={config.accountId}
                onChange={(e) => handleChange("accountId", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Encontrado em Cloudflare Dashboard → R2 → Overview
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bucket_name">
                Bucket Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="bucket_name"
                placeholder="nome-do-bucket"
                value={config.bucketName}
                onChange={(e) => handleChange("bucketName", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endpoint">
              R2 Endpoint <span className="text-destructive">*</span>
            </Label>
            <Input
              id="endpoint"
              placeholder="https://{account_id}.r2.cloudflarestorage.com"
              value={config.endpoint}
              onChange={(e) => handleChange("endpoint", e.target.value)}
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
              value={config.publicUrl}
              onChange={(e) => handleChange("publicUrl", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              URL pública do bucket (se configurado com custom domain)
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label className="text-base">Credenciais de Acesso</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSecrets(!showSecrets)}
            >
              {showSecrets ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Ocultar
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Mostrar
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="access_key_id">
                Access Key ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="access_key_id"
                type={showSecrets ? "text" : "password"}
                placeholder={isConfigured ? "••••••••••••" : "R2 Access Key ID"}
                value={config.accessKeyId}
                onChange={(e) => handleChange("accessKeyId", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secret_access_key">
                Secret Access Key <span className="text-destructive">*</span>
              </Label>
              <Input
                id="secret_access_key"
                type={showSecrets ? "text" : "password"}
                placeholder={isConfigured ? "••••••••••••" : "R2 Secret Access Key"}
                value={config.secretAccessKey}
                onChange={(e) => handleChange("secretAccessKey", e.target.value)}
              />
            </div>
          </div>

          {isConfigured && (
            <p className="text-sm text-muted-foreground">
              ℹ️ Credenciais já configuradas. Preencha novamente apenas se quiser atualizar.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleTest} 
              disabled={isTesting || !isConfigured}
            >
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
            <h4 className="font-medium">3. Copiar Credenciais</h4>
            <p className="text-sm text-muted-foreground">
              Copie o <strong>Access Key ID</strong> e <strong>Secret Access Key</strong> gerados.
              O endpoint está no formato: <code>https://ACCOUNT_ID.r2.cloudflarestorage.com</code>
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">4. Configurar nesta tela</h4>
            <p className="text-sm text-muted-foreground">
              Preencha os campos acima com as credenciais e clique em Salvar.
              Use o botão "Testar Conexão" para verificar se está funcionando.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
