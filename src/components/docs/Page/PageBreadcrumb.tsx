// components/docs/Page/PageBreadcrumb.tsx
import { ChevronRight, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PageTreeItem } from "@/types/blocks";

interface BreadcrumbItem {
  id: string;
  title: string;
  icon: string | null;
}

interface PageBreadcrumbProps {
  path: BreadcrumbItem[];
  currentTitle: string;
  currentIcon: string | null;
  onNavigate: (pageId: string | null) => void;
  className?: string;
}

export function PageBreadcrumb({
  path,
  currentTitle,
  currentIcon,
  onNavigate,
  className,
}: PageBreadcrumbProps) {
  return (
    <nav className={cn("flex items-center gap-1 text-sm", className)}>
      {/* Home */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-muted-foreground hover:text-foreground"
        onClick={() => onNavigate(null)}
      >
        <Home className="w-4 h-4" />
      </Button>

      {/* Path items */}
      {path.map((item) => (
        <div key={item.id} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-muted-foreground hover:text-foreground max-w-[150px]"
            onClick={() => onNavigate(item.id)}
          >
            {item.icon ? (
              <span className="mr-1.5">{item.icon}</span>
            ) : (
              <FileText className="w-3.5 h-3.5 mr-1.5" />
            )}
            <span className="truncate">{item.title || "Sem título"}</span>
          </Button>
        </div>
      ))}

      {/* Current page */}
      {(path.length > 0 || currentTitle) && (
        <div className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1.5 px-2 py-1 text-foreground font-medium max-w-[200px]">
            {currentIcon ? (
              <span>{currentIcon}</span>
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            <span className="truncate">{currentTitle || "Sem título"}</span>
          </div>
        </div>
      )}
    </nav>
  );
}

export default PageBreadcrumb;
