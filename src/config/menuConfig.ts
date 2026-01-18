import {
  LayoutDashboard,
  FileText,
  Building2,
  CreditCard,
  Users,
  Webhook,
  User,
  Shield,
  Bell,
  MonitorSmartphone,
  Key,
} from 'lucide-react';
import { MenuSection } from '@/types/menu';

// =====================================
// MENU DO CLIENTE (Usuários regulares)
// Apenas telas que estão implementadas
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
        badge: '✓',
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
        badge: '✓',
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
        path: '/organizations',
        badge: '✓',
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
          { id: 'org-data', title: 'Dados da Empresa', path: '/settings/organization', badge: '✓' },
          { id: 'org-addresses', title: 'Endereços', path: '/settings/addresses', badge: '✓' },
          { id: 'org-contacts', title: 'Contatos', path: '/settings/contacts', badge: '✓' },
        ],
      },
      {
        id: 'billing-settings',
        title: 'Financeiro',
        icon: CreditCard,
        children: [
          { id: 'billing-methods', title: 'Métodos de Pagamento', path: '/settings/billing', badge: '✓' },
          { id: 'billing-subscription', title: 'Assinatura', path: '/settings/subscription', badge: '✓' },
          { id: 'billing-invoices', title: 'Faturas', path: '/settings/invoices', badge: '✓' },
        ],
      },
      {
        id: 'team-settings',
        title: 'Equipe',
        icon: Users,
        children: [
          { id: 'team-users', title: 'Usuários', path: '/settings/users', badge: '✓' },
          { id: 'team-invite', title: 'Convidar', path: '/settings/users/invite', badge: '✓' },
        ],
      },
      {
        id: 'integrations',
        title: 'Integrações',
        icon: Webhook,
        children: [
          { id: 'int-webhooks', title: 'Webhooks', path: '/settings/webhooks', badge: '✓' },
          { id: 'int-api-keys', title: 'API Keys', path: '/settings/api-keys', badge: '✓' },
        ],
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
        badge: '✓',
      },
      {
        id: 'security',
        title: 'Segurança',
        icon: Shield,
        children: [
          { id: 'sec-password', title: 'Alterar Senha', path: '/profile/security', badge: '✓' },
          { id: 'sec-sessions', title: 'Sessões Ativas', path: '/profile/sessions', badge: '✓' },
        ],
      },
      {
        id: 'notifications',
        title: 'Notificações',
        icon: Bell,
        path: '/profile/notifications',
        badge: '✓',
      },
    ],
  },
];

// =====================================
// MENU DO SUPERADMIN
// Apenas telas implementadas
// =====================================
export const adminMenuConfig: MenuSection[] = [
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
        badge: '✓',
      },
      {
        id: 'admin-landing',
        title: 'Landing Page',
        icon: MonitorSmartphone,
        path: '/admin/landing',
        badge: '✓',
      },
    ],
  },
];
