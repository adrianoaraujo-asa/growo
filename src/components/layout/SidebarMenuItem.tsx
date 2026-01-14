import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Circle } from 'lucide-react';
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
  useState(() => {
    if (isChildActive) setIsOpen(true);
  });

  const Icon = item.icon;

  const content = (
    <>
      {Icon ? (
        <Icon className={cn(
          "h-5 w-5 shrink-0 transition-colors",
          (isActive || isChildActive) ? "text-primary" : "text-muted-foreground"
        )} />
      ) : (
        <Circle className={cn(
          "h-2 w-2 shrink-0 ml-1.5",
          isActive ? "text-primary fill-primary" : "text-muted-foreground"
        )} />
      )}
      
      {!isCollapsed && (
        <>
          <span className={cn(
            "flex-1 truncate transition-colors",
            (isActive || isChildActive) ? "text-foreground font-medium" : "text-muted-foreground"
          )}>
            {item.title}
          </span>
          
          {item.badge && (
            <span className={cn(
              "px-2 py-0.5 text-xs rounded-full",
              item.badgeColor === 'primary' && "bg-primary/10 text-primary",
              item.badgeColor === 'success' && "bg-success/10 text-success",
              item.badgeColor === 'warning' && "bg-warning/10 text-warning",
              item.badgeColor === 'destructive' && "bg-destructive/10 text-destructive",
              item.badgeColor === 'info' && "bg-info/10 text-info",
              !item.badgeColor && "bg-primary/10 text-primary"
            )}>
              {item.badge}
            </span>
          )}
          
          {hasChildren && (
            <ChevronDown className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          )}
        </>
      )}
      
      {isCollapsed && hasChildren && (
        <ChevronRight className="h-3 w-3 absolute right-1 text-muted-foreground" />
      )}
    </>
  );

  const baseClasses = cn(
    "flex items-center gap-3 px-4 py-2.5 rounded-md cursor-pointer transition-all relative group",
    "hover:bg-accent",
    (isActive || isChildActive) && "bg-primary/10 hover:bg-primary/15",
    isActive && "text-primary",
    level > 0 && "ml-4"
  );

  if (hasChildren) {
    const menuItem = (
      <div>
        <div
          className={baseClasses}
          onClick={() => setIsOpen(!isOpen)}
        >
          {content}
        </div>
        
        {!isCollapsed && (
          <div className={cn(
            "overflow-hidden transition-all duration-200",
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}>
            {item.children?.map((child) => (
              <SidebarMenuItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
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
                className="text-sm text-muted-foreground hover:text-foreground py-1"
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
    <Link to={item.path || '#'} className={baseClasses}>
      {content}
    </Link>
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
