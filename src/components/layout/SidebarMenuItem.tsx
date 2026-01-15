import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MenuItem as MenuItemType } from '@/types/menu';
import { useLayoutStore } from '@/stores/layoutStore';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarMenuItemProps {
  item: MenuItemType;
  level?: number;
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }
  },
  hover: { 
    x: 4,
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] as const }
  }
};

const childrenVariants = {
  hidden: { 
    opacity: 0, 
    height: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }
  },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: { 
      duration: 0.3, 
      ease: [0.4, 0, 0.2, 1] as const,
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

const childItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }
  }
};

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.1, 
    rotate: 5,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }
  },
  active: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

export function SidebarMenuItem({ item, level = 0 }: SidebarMenuItemProps) {
  const location = useLocation();
  const { sidebarCollapsed, sidebarHover } = useLayoutStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const isCollapsed = sidebarCollapsed && !sidebarHover;
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.path === location.pathname;
  const isChildActive = item.children?.some(
    (child) => child.path === location.pathname || 
    child.children?.some((c) => c.path === location.pathname)
  );

  // Auto-open if child is active
  useEffect(() => {
    if (isChildActive) setIsOpen(true);
  }, [isChildActive]);

  const Icon = item.icon;

  const content = (
    <>
      {Icon ? (
        <motion.div 
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200",
            (isActive || isChildActive) 
              ? "bg-primary/15 shadow-sm" 
              : "bg-transparent group-hover:bg-accent/80"
          )}
          variants={iconVariants}
          initial="rest"
          whileHover="hover"
          animate={(isActive || isChildActive) ? "active" : "rest"}
        >
          <Icon className={cn(
            "h-5 w-5 transition-colors duration-200",
            (isActive || isChildActive) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          )} />
        </motion.div>
      ) : (
        <div className="w-9 h-9 flex items-center justify-center shrink-0">
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.3 }}
            animate={isActive ? { scale: 1.25 } : { scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Circle className={cn(
              "h-2.5 w-2.5 transition-colors duration-200",
              isActive ? "text-primary fill-primary" : "text-muted-foreground/60 group-hover:text-muted-foreground"
            )} />
          </motion.div>
        </div>
      )}
      
      {!isCollapsed && (
        <>
          <motion.span 
            className={cn(
              "flex-1 truncate transition-colors duration-200",
              (isActive || isChildActive) ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {item.title}
          </motion.span>
          
          {item.badge && (
            <motion.span 
              className={cn(
                "px-2.5 py-1 text-[10px] font-semibold rounded-full shadow-sm",
                item.badgeColor === 'primary' && "bg-primary/15 text-primary",
                item.badgeColor === 'success' && "bg-success/15 text-success",
                item.badgeColor === 'warning' && "bg-warning/15 text-warning",
                item.badgeColor === 'destructive' && "bg-destructive/15 text-destructive",
                item.badgeColor === 'info' && "bg-info/15 text-info",
                !item.badgeColor && "bg-primary/15 text-primary"
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {item.badge}
            </motion.span>
          )}
          
          {hasChildren && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </motion.div>
          )}
        </>
      )}
      
      {isCollapsed && hasChildren && (
        <ChevronRight className="h-3 w-3 absolute right-1 text-muted-foreground" />
      )}
    </>
  );

  const baseClasses = cn(
    "flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer relative group",
    (isActive || isChildActive) && "bg-primary/10 shadow-sm",
    isActive && "text-primary border-l-[3px] border-primary ml-0 pl-2.5",
    level > 0 && "ml-4"
  );

  if (hasChildren) {
    const menuItem = (
      <div>
        <motion.div
          className={baseClasses}
          onClick={() => setIsOpen(!isOpen)}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          {content}
        </motion.div>
        
        {!isCollapsed && (
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                variants={childrenVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="overflow-hidden"
              >
                {item.children?.map((child, index) => (
                  <motion.div
                    key={child.id}
                    variants={childItemVariants}
                    custom={index}
                  >
                    <SidebarMenuItem item={child} level={level + 1} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );

    if (isCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {menuItem}
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1 p-2">
            <span className="font-medium">{item.title}</span>
            {item.children?.map((child) => (
              <Link
                key={child.id}
                to={child.path || '#'}
                className="text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
              >
                {child.title}
              </Link>
            ))}
          </TooltipContent>
        </Tooltip>
      );
    }

    return menuItem;
  }

  const linkElement = (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link to={item.path || '#'} className={baseClasses}>
        {content}
      </Link>
    </motion.div>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {linkElement}
        </TooltipTrigger>
        <TooltipContent side="right">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkElement;
}
