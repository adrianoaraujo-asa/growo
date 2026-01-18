import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/layoutStore';
import { menuConfig, adminMenuConfig } from '@/config/menuConfig';
import { SidebarMenuItem } from './SidebarMenuItem';
import { Menu, X, Shield } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserRole } from '@/hooks/useUserRole';
import { useAppLogo } from '@/hooks/useAppLogo';

const sidebarVariants = {
  expanded: { 
    width: 260,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }
  },
  collapsed: { 
    width: 70,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const logoTextVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2, delay: 0.1 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, delay: 0.2 }
  }
};

export function AppSidebar() {
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed,
  } = useLayoutStore();
  
  const { isSuperAdmin } = useUserRole();
  const { logo } = useAppLogo();

  const isCollapsed = sidebarCollapsed;
  
  // Combine menus: client menu + admin menu (if superadmin)
  const activeMenuSections = isSuperAdmin 
    ? [...menuConfig, ...adminMenuConfig]
    : menuConfig;
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "h-full sidebar-float flex flex-col shrink-0",
          "fixed left-0 top-0 z-50 lg:sticky lg:top-0 lg:z-auto",
          sidebarCollapsed && "max-lg:-translate-x-full"
        )}
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
      >
        {/* Logo Section */}
        <div className={cn(
          "h-16 flex items-center border-b border-border/40 px-4 shrink-0",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <motion.div 
            className="flex items-center gap-3 group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {logo.url ? (
              <motion.img 
                src={logo.url}
                alt={logo.alt}
                className="w-9 h-9 rounded-xl shrink-0 object-contain"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
            ) : (
              <motion.div 
                className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 5,
                  boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.4)'
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-primary-foreground font-bold text-lg">{logo.companyName.charAt(0)}</span>
              </motion.div>
            )}
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span 
                  className="font-semibold text-lg text-heading group-hover:text-primary transition-colors"
                  variants={logoTextVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {logo.companyName}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.button
                onClick={() => setSidebarCollapsed(true)}
                className="lg:hidden p-1 hover:bg-accent rounded"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Menu */}
        <ScrollArea className="flex-1 py-4 scrollbar-thin">
          <nav className="px-3 space-y-6">
            {activeMenuSections.map((section, sectionIndex) => (
              <motion.div 
                key={section.id}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                custom={sectionIndex}
              >
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.h4 
                      className={cn(
                        "px-4 mb-3 text-[11px] font-semibold uppercase tracking-widest flex items-center gap-2",
                        section.id.startsWith('admin') 
                          ? "text-primary/70" 
                          : "text-muted-foreground/70"
                      )}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {section.id.startsWith('admin') && (
                        <Shield className="w-3 h-3" />
                      )}
                      {section.title}
                    </motion.h4>
                  )}
                </AnimatePresence>
                {isCollapsed && (
                  <motion.div 
                    className={cn(
                      "h-px mx-2 my-3",
                      section.id.startsWith('admin')
                        ? "bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                        : "bg-gradient-to-r from-transparent via-border to-transparent"
                    )}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.id} item={item} />
                  ))}
                </div>
              </motion.div>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              className="p-4 border-t border-border/40 shrink-0"
              variants={footerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div 
                className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-3 text-center backdrop-blur-sm border border-primary/10"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 4px 20px -4px hsl(var(--primary) / 0.2)'
                }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-xs text-muted-foreground font-medium">
                  Growo v1.0.0
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  );
}
