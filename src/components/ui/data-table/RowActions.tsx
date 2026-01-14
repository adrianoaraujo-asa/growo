import * as React from "react";
import { MoreVertical, Edit, Trash2, Eye, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface RowAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  separator?: boolean;
}

interface RowActionsProps {
  actions?: RowAction[];
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  className?: string;
}

export function RowActions({
  actions,
  onView,
  onEdit,
  onDelete,
  onArchive,
  className,
}: RowActionsProps) {
  // Build default actions if not provided
  const defaultActions: RowAction[] = [];
  
  if (onView) {
    defaultActions.push({
      label: "Visualizar",
      icon: <Eye className="h-4 w-4" />,
      onClick: onView,
    });
  }
  
  if (onEdit) {
    defaultActions.push({
      label: "Editar",
      icon: <Edit className="h-4 w-4" />,
      onClick: onEdit,
    });
  }
  
  if (onArchive) {
    defaultActions.push({
      label: "Arquivar",
      icon: <Archive className="h-4 w-4" />,
      onClick: onArchive,
    });
  }
  
  if (onDelete) {
    defaultActions.push({
      label: "Excluir",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: onDelete,
      variant: "danger",
      separator: true,
    });
  }

  const allActions = actions || defaultActions;

  if (allActions.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {allActions.map((action, index) => (
            <React.Fragment key={action.label}>
              {action.separator && index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={action.onClick}
                className={cn(
                  "gap-2 cursor-pointer",
                  action.variant === "danger" && "text-destructive focus:text-destructive"
                )}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {onEdit && (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Button>
      )}
    </div>
  );
}
