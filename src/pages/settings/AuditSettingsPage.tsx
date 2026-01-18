import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Download,
  Filter,
  Calendar,
  User,
  Settings,
  FileText,
  Users,
  Shield,
  Key,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Eye,
  Clock,
  Activity,
} from "lucide-react";

// Mock audit logs
const mockAuditLogs = [
  {
    id: "1",
    action: "user.login",
    description: "Usuário fez login",
    user: { name: "Adriano Araujo", email: "adriano@asadigital.io" },
    ip: "189.44.xxx.xxx",
    userAgent: "Chrome 120 / macOS",
    resource: null,
    timestamp: "2025-01-18T10:30:00Z",
    status: "success",
  },
  {
    id: "2",
    action: "document.create",
    description: "Documento criado",
    user: { name: "Maria Silva", email: "maria@empresa.com" },
    ip: "200.12.xxx.xxx",
    userAgent: "Firefox 121 / Windows",
    resource: { type: "document", name: "Roadmap Q1 2025" },
    timestamp: "2025-01-18T09:45:00Z",
    status: "success",
  },
  {
    id: "3",
    action: "user.invite",
    description: "Usuário convidado",
    user: { name: "João Santos", email: "joao@startup.io" },
    ip: "177.88.xxx.xxx",
    userAgent: "Safari 17 / iOS",
    resource: { type: "user", name: "carlos@startup.io" },
    timestamp: "2025-01-18T09:15:00Z",
    status: "success",
  },
  {
    id: "4",
    action: "settings.update",
    description: "Configurações alteradas",
    user: { name: "Adriano Araujo", email: "adriano@asadigital.io" },
    ip: "189.44.xxx.xxx",
    userAgent: "Chrome 120 / macOS",
    resource: { type: "settings", name: "Notificações" },
    timestamp: "2025-01-17T16:30:00Z",
    status: "success",
  },
  {
    id: "5",
    action: "api_key.create",
    description: "API Key gerada",
    user: { name: "Maria Silva", email: "maria@empresa.com" },
    ip: "200.12.xxx.xxx",
    userAgent: "Chrome 120 / Windows",
    resource: { type: "api_key", name: "Production Key" },
    timestamp: "2025-01-17T14:00:00Z",
    status: "success",
  },
  {
    id: "6",
    action: "user.login_failed",
    description: "Tentativa de login falhou",
    user: { name: "Desconhecido", email: "hacker@evil.com" },
    ip: "45.33.xxx.xxx",
    userAgent: "curl/7.68",
    resource: null,
    timestamp: "2025-01-17T03:22:00Z",
    status: "failed",
  },
  {
    id: "7",
    action: "document.delete",
    description: "Documento excluído",
    user: { name: "João Santos", email: "joao@startup.io" },
    ip: "177.88.xxx.xxx",
    userAgent: "Chrome 120 / Android",
    resource: { type: "document", name: "Rascunho antigo" },
    timestamp: "2025-01-16T11:45:00Z",
    status: "success",
  },
  {
    id: "8",
    action: "user.logout",
    description: "Usuário fez logout",
    user: { name: "Ana Costa", email: "ana@tech.com" },
    ip: "201.55.xxx.xxx",
    userAgent: "Edge 120 / Windows",
    resource: null,
    timestamp: "2025-01-16T18:00:00Z",
    status: "success",
  },
];

const actionIcons: Record<string, React.ElementType> = {
  "user.login": LogIn,
  "user.logout": LogOut,
  "user.login_failed": Shield,
  "user.invite": Users,
  "document.create": Plus,
  "document.update": Edit,
  "document.delete": Trash2,
  "document.view": Eye,
  "settings.update": Settings,
  "api_key.create": Key,
};

const actionColors: Record<string, string> = {
  "user.login": "bg-success/10 text-success",
  "user.logout": "bg-muted text-muted-foreground",
  "user.login_failed": "bg-destructive/10 text-destructive",
  "user.invite": "bg-info/10 text-info",
  "document.create": "bg-primary/10 text-primary",
  "document.update": "bg-warning/10 text-warning",
  "document.delete": "bg-destructive/10 text-destructive",
  "document.view": "bg-muted text-muted-foreground",
  "settings.update": "bg-warning/10 text-warning",
  "api_key.create": "bg-primary/10 text-primary",
};

export default function AuditSettingsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch = 
      log.user.name.toLowerCase().includes(search.toLowerCase()) ||
      log.user.email.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action.startsWith(actionFilter);
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    return matchesSearch && matchesAction && matchesStatus;
  });

  const successCount = mockAuditLogs.filter(l => l.status === "success").length;
  const failedCount = mockAuditLogs.filter(l => l.status === "failed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Auditoria"
        description="Acompanhe todas as atividades da sua organização"
        action={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Logs
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-3d">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockAuditLogs.length}</p>
                <p className="text-sm text-muted-foreground">Total de Eventos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-3d">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{successCount}</p>
                <p className="text-sm text-muted-foreground">Bem-sucedidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-3d">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{failedCount}</p>
                <p className="text-sm text-muted-foreground">Falhas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-3d">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/10">
                <Clock className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">7 dias</p>
                <p className="text-sm text-muted-foreground">Retenção</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuário ou ação..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo de Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Ações</SelectItem>
                <SelectItem value="user">Usuários</SelectItem>
                <SelectItem value="document">Documentos</SelectItem>
                <SelectItem value="settings">Configurações</SelectItem>
                <SelectItem value="api_key">API Keys</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
                <SelectItem value="failed">Falha</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Período
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="card-3d">
        <CardContent className="pt-6">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Ação</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>IP / User Agent</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const ActionIcon = actionIcons[log.action] || Activity;
                  const actionColor = actionColors[log.action] || "bg-muted text-muted-foreground";
                  return (
                    <TableRow key={log.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${actionColor}`}>
                            <ActionIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{log.description}</p>
                            <code className="text-xs text-muted-foreground">{log.action}</code>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {log.user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{log.user.name}</p>
                            <p className="text-xs text-muted-foreground">{log.user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.resource ? (
                          <div>
                            <Badge variant="outline" className="text-xs">
                              {log.resource.type}
                            </Badge>
                            <p className="text-sm mt-1">{log.resource.name}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-mono">{log.ip}</p>
                          <p className="text-xs text-muted-foreground">{log.userAgent}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(log.timestamp).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={log.status === "success" 
                            ? "bg-success/10 text-success border-success/20" 
                            : "bg-destructive/10 text-destructive border-destructive/20"
                          }
                        >
                          {log.status === "success" ? "Sucesso" : "Falha"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
