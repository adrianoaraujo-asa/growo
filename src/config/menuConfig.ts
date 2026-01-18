import {
  LayoutDashboard,
  FileText,
  Building2,
  CreditCard,
  Users,
  Webhook,
  Sliders,
  User,
  Shield,
  Bell,
  MonitorSmartphone,
  HelpCircle,
  MessageSquare,
  FolderKanban,
  Clock,
  CalendarDays,
  BarChart3,
  Briefcase,
  UserCog,
  Activity,
  Database,
  Settings,
} from 'lucide-react';
import { MenuSection } from '@/types/menu';

// =====================================
// MENU DO CLIENTE (Usuários regulares)
// Telas que o cliente vê baseado no perfil
// =====================================
export const menuConfig: MenuSection[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard',
      },
      {
        id: 'analytics',
        title: 'Analytics',
        icon: BarChart3,
        path: '/analytics',
      },
    ],
  },
  
  {
    id: 'docs',
    title: 'Documentos',
    items: [
      {
        id: 'documents',
        title: 'Documentos',
        icon: FileText,
        path: '/docs',
      },
    ],
  },

  {
    id: 'apps',
    title: 'Módulos',
    items: [
      {
        id: 'organizations',
        title: 'Organizações',
        icon: Building2,
        children: [
          { id: 'org-list', title: 'Lista', path: '/organizations' },
          { id: 'org-new', title: 'Nova Organização', path: '/organizations/new' },
        ],
      },
      {
        id: 'professionals',
        title: 'Profissionais',
        icon: UserCog,
        children: [
          { id: 'prof-list', title: 'Lista', path: '/professionals' },
          { id: 'prof-skills', title: 'Skills', path: '/professionals/skills' },
        ],
      },
      {
        id: 'clients',
        title: 'Clientes',
        icon: Briefcase,
        path: '/clients',
      },
      {
        id: 'projects',
        title: 'Projetos',
        icon: FolderKanban,
        children: [
          { id: 'proj-list', title: 'Lista', path: '/projects' },
          { id: 'proj-kanban', title: 'Kanban', path: '/projects/kanban' },
        ],
      },
      {
        id: 'timesheet',
        title: 'Timesheet',
        icon: Clock,
        children: [
          { id: 'time-entries', title: 'Lançamentos', path: '/timesheet' },
          { id: 'time-calendar', title: 'Calendário', path: '/timesheet/calendar' },
          { id: 'time-reports', title: 'Relatórios', path: '/timesheet/reports' },
        ],
      },
      {
        id: 'calendar',
        title: 'Calendário',
        icon: CalendarDays,
        path: '/calendar',
      },
    ],
  },

  {
    id: 'settings',
    title: 'Configurações',
    items: [
      {
        id: 'org-settings',
        title: 'Organização',
        icon: Building2,
        children: [
          { id: 'org-data', title: 'Dados da Empresa', path: '/settings/organization' },
          { id: 'org-addresses', title: 'Endereços', path: '/settings/addresses' },
          { id: 'org-contacts', title: 'Contatos', path: '/settings/contacts' },
        ],
      },
      {
        id: 'billing-settings',
        title: 'Financeiro',
        icon: CreditCard,
        children: [
          { id: 'billing-methods', title: 'Métodos de Pagamento', path: '/settings/billing' },
          { id: 'billing-subscription', title: 'Assinatura', path: '/settings/subscription' },
          { id: 'billing-invoices', title: 'Faturas', path: '/settings/invoices' },
        ],
      },
      {
        id: 'team-settings',
        title: 'Equipe',
        icon: Users,
        children: [
          { id: 'team-users', title: 'Usuários', path: '/settings/users' },
          { id: 'team-invite', title: 'Convidar', path: '/settings/users/invite' },
        ],
      },
      {
        id: 'integrations',
        title: 'Integrações',
        icon: Webhook,
        children: [
          { id: 'int-webhooks', title: 'Webhooks', path: '/settings/webhooks' },
          { id: 'int-api-keys', title: 'API Keys', path: '/settings/api-keys' },
        ],
      },
      {
        id: 'preferences',
        title: 'Preferências',
        icon: Sliders,
        path: '/settings/preferences',
      },
    ],
  },

  {
    id: 'profile',
    title: 'Minha Conta',
    items: [
      {
        id: 'my-profile',
        title: 'Meu Perfil',
        icon: User,
        path: '/profile',
      },
      {
        id: 'security',
        title: 'Segurança',
        icon: Shield,
        children: [
          { id: 'sec-password', title: 'Alterar Senha', path: '/profile/security' },
          { id: 'sec-sessions', title: 'Sessões Ativas', path: '/profile/sessions' },
        ],
      },
      {
        id: 'notifications',
        title: 'Notificações',
        icon: Bell,
        path: '/profile/notifications',
      },
    ],
  },

  {
    id: 'help',
    title: 'Ajuda',
    items: [
      {
        id: 'help-center',
        title: 'Central de Ajuda',
        icon: HelpCircle,
        path: '/help',
      },
      {
        id: 'support',
        title: 'Suporte',
        icon: MessageSquare,
        path: '/help/contact',
      },
    ],
  },
];

// =====================================
// MENU DO SUPERADMIN
// Inclui telas dos clientes + configurações do produto
// =====================================
export const adminMenuConfig: MenuSection[] = [
  // ----- Gestão de Clientes -----
  {
    id: 'admin-clients',
    title: 'Gestão de Clientes',
    items: [
      {
        id: 'admin-dashboard',
        title: 'Dashboard',
        icon: LayoutDashboard,
        path: '/admin',
      },
      {
        id: 'admin-orgs',
        title: 'Organizações',
        icon: Building2,
        path: '/admin/organizations',
      },
      {
        id: 'admin-users',
        title: 'Usuários',
        icon: Users,
        path: '/admin/users',
      },
      {
        id: 'admin-subscriptions',
        title: 'Assinaturas',
        icon: CreditCard,
        path: '/admin/subscriptions',
      },
    ],
  },

  // ----- Configurações do Produto -----
  {
    id: 'admin-product',
    title: 'Configurações do Produto',
    items: [
      {
        id: 'admin-plans',
        title: 'Planos',
        icon: CreditCard,
        path: '/admin/plans',
      },
      {
        id: 'admin-features',
        title: 'Features',
        icon: Sliders,
        path: '/admin/features',
      },
      {
        id: 'admin-landing',
        title: 'Landing Page',
        icon: MonitorSmartphone,
        path: '/admin/landing',
      },
    ],
  },

  // ----- Sistema -----
  {
    id: 'admin-system',
    title: 'Sistema',
    items: [
      {
        id: 'admin-logs',
        title: 'Logs',
        icon: FileText,
        path: '/admin/logs',
      },
      {
        id: 'admin-health',
        title: 'Health Check',
        icon: Activity,
        path: '/admin/health',
      },
      {
        id: 'admin-database',
        title: 'Banco de Dados',
        icon: Database,
        path: '/admin/database',
      },
      {
        id: 'admin-settings',
        title: 'Configurações Globais',
        icon: Settings,
        path: '/admin/settings',
      },
    ],
  },
];