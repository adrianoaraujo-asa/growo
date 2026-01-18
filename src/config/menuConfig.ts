import {
  LayoutDashboard,
  FileText,
  Settings,
  Building2,
  MapPin,
  Phone,
  CreditCard,
  Receipt,
  Users,
  Webhook,
  Key,
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
  LogIn,
  UserPlus,
  KeyRound,
  Mail,
  CheckCircle,
  Globe,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { MenuSection } from '@/types/menu';

export const menuConfig: MenuSection[] = [
  // =====================================
  // DASHBOARDS
  // =====================================
  {
    id: 'dashboards',
    title: 'Dashboards',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'analytics',
        title: 'Analytics',
        icon: BarChart3,
        path: '/analytics',
      },
    ],
  },
  
  // =====================================
  // DOCUMENTOS (WIKI) - Novo módulo core
  // =====================================
  {
    id: 'docs',
    title: 'Documentos',
    items: [
      {
        id: 'documents',
        title: 'Documentos',
        icon: FileText,
        path: '/docs',
        badge: '✓',
        badgeColor: 'success',
      },
    ],
  },

  // =====================================
  // MÓDULOS DO SAAS (Slot para cada vertical)
  // Estes itens são específicos do growo.app
  // =====================================
  {
    id: 'apps',
    title: 'Módulos',
    items: [
      {
        id: 'organizations',
        title: 'Organizações',
        icon: Building2,
        children: [
          { id: 'org-list', title: 'Lista', path: '/organizations', badge: '✓', badgeColor: 'success' as const },
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

  // =====================================
  // CONFIGURAÇÕES DA ORGANIZAÇÃO
  // =====================================
  {
    id: 'settings',
    title: 'Configurações',
    items: [
      {
        id: 'org-settings',
        title: 'Organização',
        icon: Building2,
        children: [
          { id: 'org-data', title: 'Dados da Empresa', path: '/settings/organization', badge: '✓', badgeColor: 'success' as const },
          { id: 'org-addresses', title: 'Endereços', path: '/settings/addresses', badge: '✓', badgeColor: 'success' as const },
          { id: 'org-contacts', title: 'Contatos', path: '/settings/contacts', badge: '✓', badgeColor: 'success' as const },
        ],
      },
      {
        id: 'billing-settings',
        title: 'Financeiro',
        icon: CreditCard,
        children: [
          { id: 'billing-methods', title: 'Métodos de Pagamento', path: '/settings/billing', badge: '✓', badgeColor: 'success' as const },
          { id: 'billing-subscription', title: 'Assinatura', path: '/settings/subscription', badge: '✓', badgeColor: 'success' as const },
          { id: 'billing-invoices', title: 'Faturas', path: '/settings/invoices', badge: '✓', badgeColor: 'success' as const },
        ],
      },
      {
        id: 'team-settings',
        title: 'Equipe',
        icon: Users,
        children: [
          { id: 'team-users', title: 'Usuários', path: '/settings/users', badge: '✓', badgeColor: 'success' as const },
          { id: 'team-invite', title: 'Convidar', path: '/settings/users/invite', badge: '✓', badgeColor: 'success' as const },
        ],
      },
      {
        id: 'integrations',
        title: 'Integrações',
        icon: Webhook,
        children: [
          { id: 'int-webhooks', title: 'Webhooks', path: '/settings/webhooks', badge: '✓', badgeColor: 'success' as const },
          { id: 'int-api-keys', title: 'API Keys', path: '/settings/api-keys', badge: '✓', badgeColor: 'success' as const },
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

  // =====================================
  // PERFIL DO USUÁRIO
  // =====================================
  {
    id: 'profile',
    title: 'Minha Conta',
    items: [
      {
        id: 'my-profile',
        title: 'Meu Perfil',
        icon: User,
        path: '/profile',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'security',
        title: 'Segurança',
        icon: Shield,
        children: [
          { id: 'sec-password', title: 'Alterar Senha', path: '/profile/security', badge: '✓', badgeColor: 'success' as const },
          { id: 'sec-sessions', title: 'Sessões Ativas', path: '/profile/sessions', badge: '✓', badgeColor: 'success' as const },
        ],
      },
      {
        id: 'notifications',
        title: 'Notificações',
        icon: Bell,
        path: '/profile/notifications',
        badge: '✓',
        badgeColor: 'success',
      },
    ],
  },

  // =====================================
  // PÁGINAS PÚBLICAS
  // =====================================
  {
    id: 'public-pages',
    title: 'Páginas Públicas',
    items: [
      {
        id: 'landing',
        title: 'Landing Page',
        icon: Globe,
        path: '/',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'terms',
        title: 'Termos de Uso',
        icon: FileCheck,
        path: '/terms',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'privacy',
        title: 'Privacidade',
        icon: ShieldCheck,
        path: '/privacy',
        badge: '✓',
        badgeColor: 'success',
      },
    ],
  },

  // =====================================
  // AUTENTICAÇÃO (para referência)
  // =====================================
  {
    id: 'auth-pages',
    title: 'Autenticação',
    items: [
      {
        id: 'login',
        title: 'Login',
        icon: LogIn,
        path: '/auth/login',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'register',
        title: 'Cadastro',
        icon: UserPlus,
        path: '/auth/register',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'forgot-password',
        title: 'Esqueci Senha',
        icon: KeyRound,
        path: '/auth/forgot-password',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'reset-password',
        title: 'Redefinir Senha',
        icon: KeyRound,
        path: '/auth/reset-password',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'verify-email',
        title: 'Verificar Email',
        icon: Mail,
        path: '/auth/verify-email',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'two-steps',
        title: '2FA',
        icon: Shield,
        path: '/auth/two-steps',
        badge: '✓',
        badgeColor: 'success',
      },
    ],
  },

  // =====================================
  // SIGNUP (fluxo de cadastro)
  // =====================================
  {
    id: 'signup-flow',
    title: 'Signup Flow',
    items: [
      {
        id: 'signup-credentials',
        title: '1. Credenciais',
        icon: UserPlus,
        path: '/signup',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'signup-verify',
        title: '2. Verificação',
        icon: CheckCircle,
        path: '/signup/verify',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'signup-profile',
        title: '3. Perfil',
        icon: User,
        path: '/signup/profile',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'signup-organization',
        title: '4. Organização',
        icon: Building2,
        path: '/signup/organization',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'signup-plan',
        title: '5. Plano',
        icon: CreditCard,
        path: '/signup/plan',
        badge: '✓',
        badgeColor: 'success',
      },
      {
        id: 'signup-checkout',
        title: '6. Checkout',
        icon: Receipt,
        path: '/signup/checkout',
        badge: '✓',
        badgeColor: 'success',
      },
    ],
  },

  // =====================================
  // AJUDA E SUPORTE
  // =====================================
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
// MENU ADMINISTRATIVO (Super Admin)
// =====================================
export const adminMenuConfig: MenuSection[] = [
  {
    id: 'admin',
    title: 'Administração',
    items: [
      {
        id: 'admin-dashboard',
        title: 'Dashboard Admin',
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
      {
        id: 'admin-logs',
        title: 'Logs',
        icon: FileText,
        path: '/admin/logs',
      },
    ],
  },
];
