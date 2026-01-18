import { useState } from 'react';
import { Activity, Globe, AlertTriangle, Webhook, Search, Filter } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';

// Mock data
const activityLogs = [
  { id: '1', datetime: '2025-01-18 14:32', user: 'João Silva', org: 'Acme Corp', action: 'Login', details: 'Chrome/Windows', ip: '189.10.20.30' },
  { id: '2', datetime: '2025-01-18 14:30', user: 'Maria Santos', org: 'Acme Corp', action: 'Editou usuário', details: 'Pedro Costa', ip: '189.10.20.31' },
  { id: '3', datetime: '2025-01-18 13:15', user: 'Sistema', org: 'Acme Corp', action: 'Fatura gerada', details: '#INV-001', ip: '-' },
  { id: '4', datetime: '2025-01-18 10:00', user: 'João Silva', org: 'Acme Corp', action: 'Criou API Key', details: 'Produção ERP', ip: '189.10.20.30' },
];

const apiLogs = [
  { id: '1', datetime: '2025-01-18 14:32', method: 'GET', endpoint: '/api/users', status: 200, time: '45ms', org: 'Acme Corp', ip: '189.10.20.30' },
  { id: '2', datetime: '2025-01-18 14:31', method: 'POST', endpoint: '/api/invoices', status: 201, time: '120ms', org: 'Acme Corp', ip: '189.10.20.30' },
  { id: '3', datetime: '2025-01-18 14:30', method: 'PUT', endpoint: '/api/users/123', status: 200, time: '85ms', org: 'Tech Startup', ip: '200.20.30.40' },
  { id: '4', datetime: '2025-01-18 14:29', method: 'DELETE', endpoint: '/api/keys/abc', status: 403, time: '15ms', org: 'Acme Corp', ip: '189.10.20.30' },
];

const errorLogs = [
  { id: '1', datetime: '2025-01-18 13:00', type: 'DatabaseError', message: 'Connection timeout', user: 'Sistema', org: 'Acme Corp' },
  { id: '2', datetime: '2025-01-18 12:45', type: 'ValidationError', message: 'Invalid email format', user: 'João Silva', org: 'Tech Startup' },
  { id: '3', datetime: '2025-01-18 11:30', type: 'AuthError', message: 'Invalid credentials', user: 'Anônimo', org: '-' },
];

const webhookLogs = [
  { id: '1', datetime: '2025-01-18 14:00', endpoint: 'https://erp.acme.com/webhook', event: 'invoice.created', status: 200, time: '250ms', retries: 0 },
  { id: '2', datetime: '2025-01-18 13:30', endpoint: 'https://slack.com/webhook', event: 'user.created', status: 200, time: '180ms', retries: 0 },
  { id: '3', datetime: '2025-01-18 12:00', endpoint: 'https://api.example.com/notify', event: 'payment.failed', status: 500, time: '5000ms', retries: 3 },
];

const activityColumns: ColumnDef<typeof activityLogs[0]>[] = [
  { accessorKey: 'datetime', header: 'Data/Hora' },
  { accessorKey: 'user', header: 'Usuário' },
  { accessorKey: 'org', header: 'Organização' },
  { accessorKey: 'action', header: 'Ação' },
  { accessorKey: 'details', header: 'Detalhes' },
  { accessorKey: 'ip', header: 'IP' },
];

const apiColumns: ColumnDef<typeof apiLogs[0]>[] = [
  { accessorKey: 'datetime', header: 'Data/Hora' },
  { 
    accessorKey: 'method', 
    header: 'Método',
    cell: ({ row }) => {
      const colors: Record<string, string> = {
        GET: 'bg-success/10 text-success',
        POST: 'bg-info/10 text-info',
        PUT: 'bg-warning/10 text-warning',
        DELETE: 'bg-destructive/10 text-destructive',
      };
      return (
        <Badge variant="outline" className={colors[row.original.method]}>
          {row.original.method}
        </Badge>
      );
    }
  },
  { accessorKey: 'endpoint', header: 'Endpoint' },
  { 
    accessorKey: 'status', 
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const isSuccess = status >= 200 && status < 300;
      return (
        <Badge variant="outline" className={isSuccess ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}>
          {status}
        </Badge>
      );
    }
  },
  { accessorKey: 'time', header: 'Tempo' },
  { accessorKey: 'org', header: 'Org' },
  { accessorKey: 'ip', header: 'IP' },
];

const errorColumns: ColumnDef<typeof errorLogs[0]>[] = [
  { accessorKey: 'datetime', header: 'Data/Hora' },
  { 
    accessorKey: 'type', 
    header: 'Tipo',
    cell: ({ row }) => (
      <Badge variant="destructive">{row.original.type}</Badge>
    )
  },
  { accessorKey: 'message', header: 'Mensagem' },
  { accessorKey: 'user', header: 'Usuário' },
  { accessorKey: 'org', header: 'Org' },
];

const webhookColumns: ColumnDef<typeof webhookLogs[0]>[] = [
  { accessorKey: 'datetime', header: 'Data/Hora' },
  { 
    accessorKey: 'endpoint', 
    header: 'Endpoint',
    cell: ({ row }) => (
      <span className="text-xs font-mono truncate max-w-[200px] block">
        {row.original.endpoint}
      </span>
    )
  },
  { accessorKey: 'event', header: 'Evento' },
  { 
    accessorKey: 'status', 
    header: 'Status',
    cell: ({ row }) => {
      const isSuccess = row.original.status === 200;
      return (
        <Badge variant="outline" className={isSuccess ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}>
          {row.original.status}
        </Badge>
      );
    }
  },
  { accessorKey: 'time', header: 'Tempo' },
  { 
    accessorKey: 'retries', 
    header: 'Retries',
    cell: ({ row }) => row.original.retries > 0 ? (
      <Badge variant="outline" className="bg-warning/10 text-warning">{row.original.retries}</Badge>
    ) : '0'
  },
];

const tabs = [
  { id: 'activity', label: 'Activity Log', icon: Activity },
  { id: 'api', label: 'API Requests', icon: Globe },
  { id: 'errors', label: 'Errors', icon: AlertTriangle },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
];

export default function AdminLogsPage() {
  const [activeTab, setActiveTab] = useState('activity');

  const renderContent = () => {
    switch (activeTab) {
      case 'activity':
        return <DataTable columns={activityColumns} data={activityLogs} searchPlaceholder="Buscar logs..." />;
      case 'api':
        return <DataTable columns={apiColumns} data={apiLogs} searchPlaceholder="Buscar requisições..." />;
      case 'errors':
        return <DataTable columns={errorColumns} data={errorLogs} searchPlaceholder="Buscar erros..." />;
      case 'webhooks':
        return <DataTable columns={webhookColumns} data={webhookLogs} searchPlaceholder="Buscar webhooks..." />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Logs & Auditoria" 
        description="Monitoramento e auditoria do sistema"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border/50 p-1 h-auto">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Filters */}
      <Card className="card-3d p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input placeholder="Buscar..." className="input-float" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mês</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Mais filtros
          </Button>
        </div>
      </Card>

      {renderContent()}
    </div>
  );
}
