import { 
  Users, 
  DollarSign, 
  Clock,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { StaggerContainer, StaggerItem } from '@/components/animations/MotionWrapper';
import { cn } from '@/lib/utils';

const stats = [
  {
    title: 'Receita Total',
    value: 45231,
    prefix: 'R$ ',
    change: '+20.1%',
    trend: 'up' as const,
    icon: DollarSign,
    color: 'primary' as const,
  },
  {
    title: 'Projetos Ativos',
    value: 24,
    change: '+4',
    trend: 'up' as const,
    icon: FolderKanban,
    color: 'success' as const,
  },
  {
    title: 'Horas Trabalhadas',
    value: 1234,
    change: '+12.5%',
    trend: 'up' as const,
    icon: Clock,
    color: 'info' as const,
  },
  {
    title: 'Clientes',
    value: 48,
    change: '+6',
    trend: 'up' as const,
    icon: Users,
    color: 'warning' as const,
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
    <StaggerContainer className="space-y-6">
      {/* Page Header */}
      <StaggerItem>
        <div>
          <h1 className="text-2xl font-semibold text-heading">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta! Aqui está uma visão geral.</p>
        </div>
      </StaggerItem>

      {/* Stats Cards - Animated */}
      <StaggerItem>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              prefix={stat.prefix}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              color={stat.color}
              delay={index * 100}
            />
          ))}
        </div>
      </StaggerItem>

      {/* Main Content Row */}
      <StaggerItem>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Projects */}
          <Card className="lg:col-span-2 card-3d">
            <CardHeader>
              <CardTitle className="text-heading">Projetos Recentes</CardTitle>
              <CardDescription>Últimos projetos atualizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center gap-4 p-3 -mx-3 rounded-lg transition-all duration-200 hover:bg-muted/40"
                  >
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3">
                      <FolderKanban className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{project.name}</p>
                        <span className={cn(
                          "text-xs px-2.5 py-1 rounded-full font-medium shadow-sm transition-all duration-200 group-hover:shadow-md",
                          project.status === 'Concluído' && "bg-success/10 text-success",
                          project.status === 'Em andamento' && "bg-primary/10 text-primary",
                          project.status === 'Em revisão' && "bg-warning/10 text-warning",
                          project.status === 'Aguardando' && "bg-muted text-muted-foreground"
                        )}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                      <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
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
          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="text-heading">Atividades Recentes</CardTitle>
              <CardDescription>Últimas atualizações da equipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={index} 
                    className="group flex items-start gap-3 p-2 -mx-2 rounded-lg transition-all duration-200 hover:bg-muted/40"
                  >
                    <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shrink-0 mt-0.5 shadow-md transition-transform duration-200 group-hover:scale-110">
                      <activity.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">{activity.user}</span>{' '}
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
      </StaggerItem>

      {/* Quick Actions */}
      <StaggerItem>
        <Card className="card-3d overflow-hidden">
          <CardHeader>
            <CardTitle className="text-heading">Ações Rápidas</CardTitle>
          </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="group relative flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-left overflow-hidden hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <FolderKanban className="h-5 w-5 text-white" />
              </div>
              <div className="relative">
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Novo Projeto</p>
                <p className="text-xs text-muted-foreground">Criar projeto</p>
              </div>
            </button>
            <button className="group relative flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:border-success/50 hover:shadow-lg transition-all duration-300 text-left overflow-hidden hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-gradient-to-r from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-lg shadow-success/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="relative">
                <p className="font-semibold text-foreground group-hover:text-success transition-colors">Novo Cliente</p>
                <p className="text-xs text-muted-foreground">Adicionar cliente</p>
              </div>
            </button>
            <button className="group relative flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:border-info/50 hover:shadow-lg transition-all duration-300 text-left overflow-hidden hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-gradient-to-r from-info/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-info to-info/80 flex items-center justify-center shadow-lg shadow-info/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div className="relative">
                <p className="font-semibold text-foreground group-hover:text-info transition-colors">Registrar Horas</p>
                <p className="text-xs text-muted-foreground">Timesheet</p>
              </div>
            </button>
            <button className="group relative flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:border-warning/50 hover:shadow-lg transition-all duration-300 text-left overflow-hidden hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-gradient-to-r from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center shadow-lg shadow-warning/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div className="relative">
                <p className="font-semibold text-foreground group-hover:text-warning transition-colors">Nova Fatura</p>
                <p className="text-xs text-muted-foreground">Gerar fatura</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
      </StaggerItem>
    </StaggerContainer>
  );
}
