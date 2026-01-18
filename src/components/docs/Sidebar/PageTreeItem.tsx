import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Star,
  StarOff,
  Trash2,
  Copy,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface PageTreeItemType {
  id: string;
  title: string;
  icon: string | null;
  is_favorite: boolean | null;
  children?: PageTreeItemType[];
  depth?: number;
}

interface PageTreeItemProps {
  page: PageTreeItemType;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCreateSubpage: (parentId: string) => void;
  depth?: number;
}

export function PageTreeItem({
  page,
  isActive,
  onSelect,
  onDelete,
  onToggleFavorite,
  onCreateSubpage,
  depth = 0,
}: PageTreeItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const hasChildren = page.children && page.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer text-sm",
          "hover:bg-accent/50 transition-colors",
          isActive && "bg-accent text-accent-foreground"
        )}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onClick={() => onSelect(page.id)}
      >
        {/* Expand/Collapse */}
        <button
          className="h-4 w-4 flex items-center justify-center shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )
          ) : null}
        </button>

        {/* Icon */}
        <span className="shrink-0 text-base">{page.icon || "📄"}</span>

        {/* Title */}
        <span className="flex-1 truncate">
          {page.title || "Sem título"}
        </span>

        {/* Favorite indicator */}
        {page.is_favorite && !showActions && (
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onCreateSubpage(page.id)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onToggleFavorite(page.id)}>
                  {page.is_favorite ? (
                    <>
                      <StarOff className="h-4 w-4 mr-2" />
                      Remover dos favoritos
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Adicionar aos favoritos
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCreateSubpage(page.id)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar subpágina
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(page.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {page.children!.map((child) => (
            <PageTreeItem
              key={child.id}
              page={child}
              isActive={isActive}
              onSelect={onSelect}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onCreateSubpage={onCreateSubpage}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
