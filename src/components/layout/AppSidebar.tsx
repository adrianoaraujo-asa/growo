import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/layoutStore';
import { menuConfig } from '@/config/menuConfig';
import { SidebarMenuItem } from './SidebarMenuItem';
import { Menu, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AppSidebar() {
  const { 
    sidebarCollapsed, 
    sidebarHover,
    setSidebarCollapsed,
    setSidebarHover 
  } = useLayoutStore();

  const isCollapsed = sidebarCollapsed && !sidebarHover;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity",
          !sidebarCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarCollapsed(true)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full sidebar-float transition-all duration-300 flex flex-col",
          // Desktop
          "lg:relative lg:z-auto",
          isCollapsed ? "w-[70px]" : "w-[260px]",
          // Mobile - slide in/out
          "max-lg:translate-x-0",
          sidebarCollapsed && "max-lg:-translate-x-full"
        )}
        onMouseEnter={() => sidebarCollapsed && setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
      >
        {/* Logo Section */}
        <div className={cn(
          "h-16 flex items-center border-b border-border/40 px-4 shrink-0",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-105">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-lg text-heading transition-colors group-hover:text-primary">Growo</span>
            )}
          </div>
          
          {!isCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="lg:hidden p-1 hover:bg-accent rounded"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Menu */}
        <ScrollArea className="flex-1 py-4 scrollbar-thin">
          <nav className="px-3 space-y-6">
            {menuConfig.map((section) => (
              <div key={section.id}>
                {!isCollapsed && (
                  <h4 className="px-4 mb-3 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
                    {section.title}
                  </h4>
                )}
                {isCollapsed && (
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-2 my-3" />
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border/40 shrink-0">
            <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-3 text-center backdrop-blur-sm border border-primary/10">
              <p className="text-xs text-muted-foreground font-medium">
                Growo v1.0.0
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
