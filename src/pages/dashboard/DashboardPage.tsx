import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Clock,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const stats = [
  {
    title: 'Receita Total',
    value: 'R$ 45.231,89',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
    color: 'primary',
  },
  {
    title: 'Projetos Ativos',
    value: '24',
    change: '+4',
    trend: 'up',
    icon: FolderKanban,
    color: 'success',
  },
  {
    title: 'Horas Trabalhadas',
    value: '1,234',
    change: '+12.5%',
    trend: 'up',
    icon: Clock,
    color: 'info',
  },
  {
    title: 'Clientes',
    value: '48',
    change: '+6',
    trend: 'up',
    icon: Users,
    color: 'warning',
  },
];

const recentProjects = [
  { name: 'Sistema ERP', client: 'Empresa ABC', status: 'Em andamento', progress: 65 },
  { name: 'App Mobile', client: 'Startup XYZ', status: 'Em revisão', progress: 90 },
  { name: 'Website Institucional', client: 'Corp 123', status: 'Aguardando', progress: 20 },
  { name: 'Integração API', client: 'Tech Ltd', status: 'Concluído', progress: 100 },
];

const recentActivities = [
  { user: 'João Silva', action: 'criou um novo projeto', time: '5 min atrás', icon: FolderKanban },
  { user: 'Maria Santos', action: 'completou uma tarefa', time: '15 min atrás', icon: CheckCircle2 },
  { user: 'Pedro Oliveira', action: 'adicionou um comentário', time: '1 hora atrás', icon: AlertCircle },
  { user: 'Ana Costa', action: 'registrou 8 horas', time: '2 horas atrás', icon: Clock },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-heading">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo de volta! Aqui está uma visão geral.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-heading mt-1">{stat.value}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      stat.trend === 'up' ? "text-success" : "text-destructive"
                    )}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs mês anterior</span>
                  </div>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  stat.color === 'primary' && "bg-primary/10",
                  stat.color === 'success' && "bg-success/10",
                  stat.color === 'info' && "bg-info/10",
                  stat.color === 'warning' && "bg-warning/10"
                )}>
                  <stat.icon className={cn(
                    "h-6 w-6",
                    stat.color === 'primary' && "text-primary",
                    stat.color === 'success' && "text-success",
                    stat.color === 'info' && "text-info",
                    stat.color === 'warning' && "text-warning"
                  )} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Projects */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Projetos Recentes</CardTitle>
            <CardDescription>Últimos projetos atualizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-foreground truncate">{project.name}</p>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        project.status === 'Concluído' && "bg-success/10 text-success",
                        project.status === 'Em andamento' && "bg-primary/10 text-primary",
                        project.status === 'Em revisão' && "bg-warning/10 text-warning",
                        project.status === 'Aguardando' && "bg-muted text-muted-foreground"
                      )}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas atualizações da equipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium text-foreground">{activity.user}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Novo Projeto</p>
                <p className="text-xs text-muted-foreground">Criar projeto</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-success hover:bg-success/5 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">Novo Cliente</p>
                <p className="text-xs text-muted-foreground">Adicionar cliente</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-info hover:bg-info/5 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="font-medium text-foreground">Registrar Horas</p>
                <p className="text-xs text-muted-foreground">Timesheet</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-warning hover:bg-warning/5 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-foreground">Nova Fatura</p>
                <p className="text-xs text-muted-foreground">Gerar fatura</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
