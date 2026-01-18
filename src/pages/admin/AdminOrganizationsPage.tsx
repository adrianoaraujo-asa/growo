import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, DollarSign, AlertTriangle, Plus, Eye, Edit, UserCog, Ban, Trash2, MoreHorizontal } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatsGrid } from '@/components/ui/stats-grid';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColumnDef } from '@tanstack/react-table';

// Mock data
const organizations = [
  { 
    id: '1', 
    name: 'Acme Corporation', 
    document: '12.345.678/0001-90',
    logo: null,
    plan: 'Pro',
    users: 15,
    mrr: 99,
    status: 'active',
    createdAt: '2025-01-15'
  },
  { 
    id: '2', 
    name: 'Tech Startup Brasil', 
    document: '98.765.432/0001-10',
    logo: null,
    plan: 'Free',
    users: 3,
    mrr: 0,
    status: 'trial',
    createdAt: '2025-01-17'
  },
  { 
    id: '3', 
    name: 'Enterprise Solutions SA', 
    document: '11.222.333/0001-44',
    logo: null,
    plan: 'Enterprise',
    users: 150,
    mrr: 499,
    status: 'active',
    createdAt: '2024-12-01'
  },
  { 
    id: '4', 
    name: 'Late Payments Co', 
    document: '55.666.777/0001-88',
    logo: null,
    plan: 'Pro',
    users: 8,
    mrr: 99,
    status: 'suspended',
    createdAt: '2024-11-15'
  },
  { 
    id: '5', 
    name: 'New Company', 
    document: '99.888.777/0001-66',
    logo: null,
    plan: 'Pro',
    users: 5,
    mrr: 99,
    status: 'trial',
    createdAt: '2025-01-18'
  },
];

type Organization = typeof organizations[0];

const statusConfig = {
  active: { label: 'Ativo', variant: 'default' as const, className: 'bg-success/10 text-success border-success/20' },
  trial: { label: 'Trial', variant: 'outline' as const, className: 'bg-warning/10 text-warning border-warning/20' },
  suspended: { label: 'Suspenso', variant: 'destructive' as const, className: 'bg-destructive/10 text-destructive border-destructive/20' },
  cancelled: { label: 'Cancelado', variant: 'secondary' as const, className: '' },
};

export default function AdminOrganizationsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const filteredOrgs = organizations.filter(org => {
    if (statusFilter !== 'all' && org.status !== statusFilter) return false;
    if (planFilter !== 'all' && org.plan !== planFilter) return false;
    return true;
  });

  const stats = [
    { title: 'Total', value: 1234, change: '+12%', trend: 'up' as const, icon: Building2, color: 'primary' as const },
    { title: 'Em Trial', value: 45, change: '+8%', trend: 'up' as const, icon: Users, color: 'warning' as const },
    { title: 'Ativas', value: 1150, change: '+5%', trend: 'up' as const, icon: Building2, color: 'success' as const },
    { title: 'Inadimplentes', value: 12, change: '-2%', trend: 'down' as const, icon: AlertTriangle, color: 'warning' as const },
  ];

  const columns: ColumnDef<Organization>[] = [
    {
      accessorKey: 'name',
      header: 'Organização',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.original.logo || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {row.original.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-heading">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.document}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'plan',
      header: 'Plano',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.plan}</Badge>
      ),
    },
    {
      accessorKey: 'users',
      header: 'Usuários',
    },
    {
      accessorKey: 'mrr',
      header: 'MRR',
      cell: ({ row }) => (
        <span className="font-medium">
          R$ {row.original.mrr.toLocaleString('pt-BR')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const config = statusConfig[row.original.status as keyof typeof statusConfig];
        return (
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Criado em',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/admin/organizations/${row.original.id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserCog className="h-4 w-4 mr-2" />
              Login como
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-warning">
              <Ban className="h-4 w-4 mr-2" />
              Suspender
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title="Organizações" 
        description="Gerenciar organizações da plataforma"
        action={
          <Button className="btn-float gap-2">
            <Plus className="h-4 w-4" />
            Nova Organização
          </Button>
        }
      />

      <StatsGrid stats={stats} />

      {/* Filters */}
      <Card className="card-3d p-4">
        <div className="flex gap-4 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="suspended">Suspenso</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Plano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <DataTable 
        columns={columns} 
        data={filteredOrgs}
        searchPlaceholder="Buscar organizações..."
      />
    </div>
  );
}
