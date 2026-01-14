import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/layoutStore';
import { AppSidebar } from './AppSidebar';
import { AppNavbar } from './AppNavbar';
import { AppFooter } from './AppFooter';
import { TemplateCustomizer } from './TemplateCustomizer';
import { useTheme } from '@/hooks/useTheme';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { contentWidth, sidebarCollapsed, sidebarHover } = useLayoutStore();
  
  // Initialize theme on mount
  useTheme();

  const isCollapsed = sidebarCollapsed && !sidebarHover;

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Navbar */}
        <AppNavbar />

        {/* Page Content */}
        <main className={cn(
          "flex-1 p-6",
          contentWidth === 'boxed' && "max-w-7xl mx-auto w-full"
        )}>
          {children || <Outlet />}
        </main>

        {/* Footer */}
        <AppFooter />
      </div>

      {/* Template Customizer */}
      <TemplateCustomizer />
    </div>
  );
}
