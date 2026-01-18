import { useState } from 'react';
import { Building2, Users, DollarSign, TrendingDown, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatsGrid } from '@/components/ui/stats-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock data for charts
const signupsData = [
  { date: 'Jan 1', value: 12 },
  { date: 'Jan 5', value: 19 },
  { date: 'Jan 10', value: 15 },
  { date: 'Jan 15', value: 25 },
  { date: 'Jan 20', value: 32 },
  { date: 'Jan 25', value: 28 },
  { date: 'Jan 30', value: 45 },
];

const planDistribution = [
  { name: 'Free', value: 400, color: 'hsl(var(--muted-foreground))' },
  { name: 'Pro', value: 300, color: 'hsl(var(--primary))' },
  { name: 'Enterprise', value: 100, color: 'hsl(var(--success))' },
];

const revenueByPlan = [
  { plan: 'Free', revenue: 0 },
  { plan: 'Pro', revenue: 29700 },
  { plan: 'Enterprise', revenue: 50000 },
];

const recentOrgs = [
  { id: '1', name: 'Acme Corp', plan: 'Pro', status: 'active', date: '2025-01-18' },
  { id: '2', name: 'Tech Startup', plan: 'Free', status: 'trial', date: '2025-01-17' },
  { id: '3', name: 'Big Enterprise', plan: 'Enterprise', status: 'active', date: '2025-01-16' },
  { id: '4', name: 'Small Biz', plan: 'Pro', status: 'active', date: '2025-01-15' },
  { id: '5', name: 'Innovate Inc', plan: 'Pro', status: 'trial', date: '2025-01-14' },
];

const trialsExpiring = [
  { id: '1', name: 'Tech Startup', daysLeft: 3 },
  { id: '2', name: 'Innovate Inc', daysLeft: 5 },
  { id: '3', name: 'New Co', daysLeft: 7 },
];

const pendingPayments = [
  { id: '1', org: 'Late Payer Corp', amount: 99, dueDate: '2025-01-10' },
  { id: '2', org: 'Forgot Payment Inc', amount: 299, dueDate: '2025-01-12' },
];

const orgColumns: ColumnDef<typeof recentOrgs[0]>[] = [
  { accessorKey: 'name', header: 'Organização' },
  { 
    accessorKey: 'plan', 
    header: 'Plano',
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.plan}</Badge>
    )
  },
  { 
    accessorKey: 'status', 
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
        {row.original.status === 'active' ? 'Ativo' : 'Trial'}
      </Badge>
    )
  },
  { accessorKey: 'date', header: 'Data' },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button variant="ghost" size="icon">
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState('30d');

  const stats = [
    { title: 'Total Orgs', value: 1234, change: '+12%', trend: 'up' as const, icon: Building2, color: 'primary' as const },
    { title: 'Usuários', value: 5678, change: '+8%', trend: 'up' as const, icon: Users, color: 'success' as const },
    { title: 'MRR', value: 79700, prefix: 'R$ ', change: '+15%', trend: 'up' as const, icon: DollarSign, color: 'info' as const },
    { title: 'Churn Rate', value: 2, suffix: '%', change: '-0.5%', trend: 'down' as const, icon: TrendingDown, color: 'warning' as const },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Dashboard SuperAdmin" 
          description="Visão geral da saúde da plataforma"
        />
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="1y">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <StatsGrid stats={stats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signups Chart */}
        <Card className="card-3d">
          <CardHeader>
            <CardTitle className="text-base">Novos Cadastros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={signupsData}>
                  <defs>
                    <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#colorSignups)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="card-3d">
          <CardHeader>
            <CardTitle className="text-base">Distribuição por Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Plan */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="text-base">Receita por Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByPlan}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="plan" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recent Organizations */}
        <Card className="card-3d xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Últimas Organizações</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable columns={orgColumns} data={recentOrgs} />
          </CardContent>
        </Card>

        {/* Trials Expiring & Pending Payments */}
        <div className="space-y-6">
          <Card className="card-3d">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Trials Expirando
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trialsExpiring.map((trial) => (
                  <div key={trial.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-medium text-sm">{trial.name}</span>
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      {trial.daysLeft} dias
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-3d">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-destructive" />
                Pagamentos Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{payment.org}</p>
                      <p className="text-xs text-muted-foreground">Venc: {payment.dueDate}</p>
                    </div>
                    <span className="font-semibold text-destructive">
                      R$ {payment.amount}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
