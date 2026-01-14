import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  title: string;
  icon?: LucideIcon;
  path?: string;
  badge?: string;
  badgeColor?: 'primary' | 'success' | 'warning' | 'destructive' | 'info';
  children?: MenuItem[];
  section?: string;
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}
