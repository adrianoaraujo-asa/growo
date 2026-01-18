import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  ExternalLink,
  Settings,
  CheckCircle,
  XCircle,
  Plug,
  Slack,
  Github,
  Mail,
  Calendar,
  Cloud,
  Database,
  MessageSquare,
  CreditCard,
  FileText,
  Zap,
} from "lucide-react";

// Mock integrations data
const mockIntegrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Receba notificações e atualizações no Slack",
    icon: Slack,
    category: "communication",
    isConnected: true,
    isEnabled: true,
    connectedAt: "2025-01-10T10:00:00Z",
    config: { workspace: "ASA Digital", channel: "#general" },
  },
  {
    id: "github",
    name: "GitHub",
    description: "Sincronize repositórios e issues",
    icon: Github,
    category: "development",
    isConnected: true,
    isEnabled: true,
    connectedAt: "2024-12-15T14:00:00Z",
    config: { org: "asa-digital", repos: 5 },
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sincronize eventos e reuniões",
    icon: Calendar,
    category: "productivity",
    isConnected: false,
    isEnabled: false,
    connectedAt: null,
    config: null,
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Processamento de pagamentos",
    icon: CreditCard,
    category: "billing",
    isConnected: true,
    isEnabled: true,
    connectedAt: "2024-08-20T08:00:00Z",
    config: { mode: "live", customerId: "cus_xxx" },
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Envio de emails transacionais",
    icon: Mail,
    category: "communication",
    isConnected: false,
    isEnabled: false,
    connectedAt: null,
    config: null,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Sincronize documentos e bases de dados",
    icon: FileText,
    category: "productivity",
    isConnected: false,
    isEnabled: false,
    connectedAt: null,
    config: null,
  },
  {
    id: "aws-s3",
    name: "AWS S3",
    description: "Armazenamento de arquivos na nuvem",
    icon: Cloud,
    category: "storage",
    isConnected: false,
    isEnabled: false,
    connectedAt: null,
    config: null,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Banco de dados relacional",
    icon: Database,
    category: "database",
    isConnected: true,
    isEnabled: true,
    connectedAt: "2024-06-01T12:00:00Z",
    config: { host: "db.supabase.co", status: "healthy" },
  },
  {
    id: "discord",
    name: "Discord",
    description: "Notificações e comandos via Discord",
    icon: MessageSquare,
    category: "communication",
    isConnected: false,
    isEnabled: false,
    connectedAt: null,
    config: null,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automações com +5000 apps",
    icon: Zap,
    category: "automation",
    isConnected: false,
    isEnabled: false,
    connectedAt: null,
    config: null,
  },
];

const categories = [
  { id: "all", label: "Todas" },
  { id: "communication", label: "Comunicação" },
  { id: "development", label: "Desenvolvimento" },
  { id: "productivity", label: "Produtividade" },
  { id: "billing", label: "Pagamentos" },
  { id: "storage", label: "Armazenamento" },
  { id: "database", label: "Banco de Dados" },
  { id: "automation", label: "Automação" },
];

export default function IntegrationsSettingsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [configDialog, setConfigDialog] = useState<typeof mockIntegrations[0] | null>(null);

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(search.toLowerCase()) ||
      integration.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrations.filter(i => i.isConnected).length;

  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(i => i.id === id ? { ...i, isEnabled: !i.isEnabled } : i)
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrações"
        description="Conecte sua organização a serviços externos"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-3d">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Plug className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{integrations.length}</p>
                <p className="text-sm text-muted-foreground">Integrações Disponíveis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-3d">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{connectedCount}</p>
                <p className="text-sm text-muted-foreground">Conectadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-3d">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted">
                <XCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{integrations.length - connectedCount}</p>
                <p className="text-sm text-muted-foreground">Não Conectadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar integrações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.id} className="card-3d">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${integration.isConnected ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Icon className={`h-5 w-5 ${integration.isConnected ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {categories.find(c => c.id === integration.category)?.label}
                      </Badge>
                    </div>
                  </div>
                  {integration.isConnected && (
                    <Switch
                      checked={integration.isEnabled}
                      onCheckedChange={() => toggleIntegration(integration.id)}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                  {integration.description}
                </CardDescription>

                {integration.isConnected ? (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-success">Conectado</span>
                      <span className="text-muted-foreground">
                        em {new Date(integration.connectedAt!).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={() => setConfigDialog(integration)}
                      >
                        <Settings className="h-3 w-3" />
                        Configurar
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                        Desconectar
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Conectar
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Config Dialog */}
      <Dialog open={!!configDialog} onOpenChange={() => setConfigDialog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {configDialog && <configDialog.icon className="h-5 w-5" />}
              Configurar {configDialog?.name}
            </DialogTitle>
            <DialogDescription>
              Ajuste as configurações da integração
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {configDialog?.config && Object.entries(configDialog.config).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
                <Input value={String(value)} disabled />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialog(null)}>
              Fechar
            </Button>
            <Button>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
