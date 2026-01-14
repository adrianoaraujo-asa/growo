import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  Clock,
  FileText,
  Settings,
  Shield,
  CreditCard,
  Bell,
  HelpCircle,
  UserCog,
  Briefcase,
  CalendarDays,
  BarChart3,
  Receipt,
} from 'lucide-react';
import { MenuSection } from '@/types/menu';

export const menuConfig: MenuSection[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: LayoutDashboard,
        path: '/',
        badge: 'Novo',
        badgeColor: 'primary',
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
    id: 'apps',
    title: 'Apps & Páginas',
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
        id: 'users',
        title: 'Usuários',
        icon: Users,
        children: [
          { id: 'users-list', title: 'Lista', path: '/users' },
          { id: 'users-roles', title: 'Permissões', path: '/users/roles' },
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
    id: 'billing',
    title: 'Financeiro',
    items: [
      {
        id: 'invoices',
        title: 'Faturas',
        icon: Receipt,
        children: [
          { id: 'inv-list', title: 'Lista', path: '/invoices' },
          { id: 'inv-new', title: 'Nova Fatura', path: '/invoices/new' },
        ],
      },
      {
        id: 'billing',
        title: 'Cobrança',
        icon: CreditCard,
        path: '/billing',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Configurações',
    items: [
      {
        id: 'account',
        title: 'Minha Conta',
        icon: Settings,
        path: '/settings/account',
      },
      {
        id: 'security',
        title: 'Segurança',
        icon: Shield,
        path: '/settings/security',
      },
      {
        id: 'notifications',
        title: 'Notificações',
        icon: Bell,
        path: '/settings/notifications',
      },
    ],
  },
  {
    id: 'misc',
    title: 'Outros',
    items: [
      {
        id: 'docs',
        title: 'Documentação',
        icon: FileText,
        path: '/docs',
      },
      {
        id: 'support',
        title: 'Suporte',
        icon: HelpCircle,
        path: '/support',
      },
    ],
  },
];
