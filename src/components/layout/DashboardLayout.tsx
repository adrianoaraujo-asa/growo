import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/layoutStore';
import { AppSidebar } from './AppSidebar';
import { AppNavbar } from './AppNavbar';
import { AppFooter } from './AppFooter';
import { TemplateCustomizer } from './TemplateCustomizer';
import { useTheme } from '@/hooks/useTheme';
import { PageTransition } from '@/components/animations/PageTransition';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { contentWidth } = useLayoutStore();
  
  // Initialize theme on mount
  useTheme();

  return (
    <div className="h-screen flex w-full bg-background overflow-hidden">
      {/* Sidebar - Fixed */}
      <AppSidebar />

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Navbar - Fixed at top */}
        <AppNavbar />

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Page Content with Animation */}
          <main className={cn(
            "p-6",
            contentWidth === 'boxed' && "max-w-7xl mx-auto w-full"
          )}>
            <PageTransition>
              {children}
            </PageTransition>
          </main>

          {/* Footer */}
          <AppFooter />
        </div>
      </div>

      {/* Template Customizer */}
      <TemplateCustomizer />
    </div>
  );
}
