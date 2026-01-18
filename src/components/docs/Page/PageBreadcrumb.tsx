import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  id: string;
  title: string;
  icon?: string | null;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}>
      <Link
        to="/docs"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Documentos</span>
      </Link>

      {items.map((item, index) => (
        <div key={item.id} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4" />
          {index === items.length - 1 ? (
            <span className="text-foreground font-medium flex items-center gap-1">
              {item.icon && <span>{item.icon}</span>}
              {item.title || "Sem título"}
            </span>
          ) : (
            <Link
              to={`/docs/${item.id}`}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              {item.icon && <span>{item.icon}</span>}
              {item.title || "Sem título"}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
