import { useState } from "react";
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
  r2_account_id: string;
  r2_access_key_id: string;
  r2_secret_access_key: string;
  r2_bucket_name: string;
  r2_endpoint: string;
  r2_public_url: string;
}

export function StorageAdminPage() {
  const [config, setConfig] = useState<R2Config>({
    r2_account_id: "",
    r2_access_key_id: "",
    r2_secret_access_key: "",
    r2_bucket_name: "",
    r2_endpoint: "",
    r2_public_url: "",
  });
  const [showSecrets, setShowSecrets] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (field: keyof R2Config, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setTestResult(null);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("test-r2");

      if (error) throw error;

      if (data?.success) {
        setTestResult({
          success: true,
          message: `Conexão estabelecida! Arquivo de teste criado: ${data.testFile?.key}`,
        });
        toast.success("Conexão R2 testada com sucesso!");
      } else {
        setTestResult({
          success: false,
          message: data?.error || "Erro ao testar conexão",
        });
        toast.error("Falha no teste de conexão");
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
      // Note: Secrets should be configured via Supabase Dashboard or Vault
      // This is just a placeholder for the UI
      toast.info(
        "Os secrets do R2 devem ser configurados diretamente no Supabase Dashboard > Edge Functions > Secrets"
      );
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
          Configure a integração com Cloudflare R2 para armazenamento de
          arquivos.
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
        <CardContent>
          <div className="flex items-center gap-4">
            {testResult ? (
              testResult.success ? (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Conectado
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Erro
                </Badge>
              )
            ) : (
              <Badge variant="secondary">
                <AlertCircle className="w-4 h-4 mr-1" />
                Não testado
              </Badge>
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
          </div>
          {testResult && (
            <p
              className={`mt-3 text-sm ${
                testResult.success ? "text-green-600" : "text-destructive"
              }`}
            >
              {testResult.message}
            </p>
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
            Configure as credenciais de acesso ao Cloudflare R2. Estas
            credenciais são armazenadas de forma segura como secrets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Importante:</strong> Os secrets do R2 devem ser
              configurados no{" "}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Supabase Dashboard
              </a>{" "}
              → Edge Functions → Secrets. Os seguintes secrets são necessários:
            </p>
            <ul className="mt-2 text-sm text-amber-700 dark:text-amber-300 list-disc list-inside">
              <li>R2_ACCESS_KEY_ID</li>
              <li>R2_SECRET_ACCESS_KEY</li>
              <li>R2_ENDPOINT</li>
              <li>R2_BUCKET_NAME</li>
              <li>R2_ACCOUNT_ID (opcional)</li>
              <li>R2_PUBLIC_URL (opcional)</li>
            </ul>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="account_id">Account ID</Label>
              <Input
                id="account_id"
                placeholder="Cloudflare Account ID"
                value={config.r2_account_id}
                onChange={(e) => handleChange("r2_account_id", e.target.value)}
              />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="public_url">Public URL (opcional)</Label>
            <Input
              id="public_url"
              placeholder="https://files.seudominio.com"
              value={config.r2_public_url}
              onChange={(e) => handleChange("r2_public_url", e.target.value)}
            />
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
              <Label htmlFor="access_key_id">Access Key ID</Label>
              <Input
                id="access_key_id"
                type={showSecrets ? "text" : "password"}
                placeholder="R2 Access Key ID"
                value={config.r2_access_key_id}
                onChange={(e) =>
                  handleChange("r2_access_key_id", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secret_access_key">Secret Access Key</Label>
              <Input
                id="secret_access_key"
                type={showSecrets ? "text" : "password"}
                placeholder="R2 Secret Access Key"
                value={config.r2_secret_access_key}
                onChange={(e) =>
                  handleChange("r2_secret_access_key", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleTest} disabled={isTesting}>
              {isTesting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
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

      {/* Usage Info */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle>Como Configurar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Acesse o Cloudflare Dashboard</h4>
            <p className="text-sm text-muted-foreground">
              Vá para{" "}
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
            <h4 className="font-medium">2. Crie as Credenciais de API</h4>
            <p className="text-sm text-muted-foreground">
              Em R2 → Manage R2 API Tokens → Create API token. Selecione
              permissões "Object Read & Write".
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">3. Configure os Secrets no Supabase</h4>
            <p className="text-sm text-muted-foreground">
              No Supabase Dashboard, vá para Edge Functions → Secrets e adicione
              cada secret listado acima.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">4. Teste a Conexão</h4>
            <p className="text-sm text-muted-foreground">
              Use o botão "Testar Conexão" acima para verificar se a integração
              está funcionando.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
