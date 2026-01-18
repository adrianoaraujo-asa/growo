// components/docs/Sidebar/PageTreeItem.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  MoreHorizontal, 
  Plus, 
  Star, 
  StarOff, 
  Trash2,
  Copy,
  ExternalLink,
  FileText,
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
import type { PageTreeItem as PageTreeItemType } from "@/types/blocks";

interface PageTreeItemProps {
  page: PageTreeItemType;
  level: number;
  isSelected?: boolean;
  isExpanded?: boolean;
  onSelect: (pageId: string) => void;
  onToggleExpand: (pageId: string) => void;
  onCreateChild?: (parentId: string) => void;
  onDelete?: (pageId: string) => void;
  onToggleFavorite?: (pageId: string) => void;
  childPages?: PageTreeItemType[];
  allPages?: PageTreeItemType[];
}

export function PageTreeItem({
  page,
  level,
  isSelected = false,
  isExpanded = false,
  onSelect,
  onToggleExpand,
  onCreateChild,
  onDelete,
  onToggleFavorite,
  childPages = [],
  allPages = [],
}: PageTreeItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = childPages.length > 0;
  const paddingLeft = 12 + level * 12;

  const getChildPagesForItem = (parentId: string) => {
    return allPages.filter((p) => p.parentId === parentId && !p.isArchived);
  };

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer transition-colors",
          isSelected
            ? "bg-accent text-accent-foreground"
            : "hover:bg-accent/50 text-foreground"
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelect(page.id)}
      >
        {/* Expand/Collapse button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(page.id);
          }}
          className={cn(
            "p-0.5 rounded hover:bg-accent transition-transform",
            !hasChildren && "invisible"
          )}
        >
          <ChevronRight
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform",
              isExpanded && "rotate-90"
            )}
          />
        </button>

        {/* Icon */}
        <span className="text-base shrink-0">
          {page.icon || <FileText className="w-4 h-4 text-muted-foreground" />}
        </span>

        {/* Title */}
        <span className="flex-1 truncate text-sm">
          {page.title || "Sem título"}
        </span>

        {/* Favorite indicator */}
        {page.isFavorite && !isHovered && (
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 shrink-0" />
        )}

        {/* Actions on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-0.5"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {onToggleFavorite && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(page.id);
                      }}
                    >
                      {page.isFavorite ? (
                        <>
                          <StarOff className="w-4 h-4 mr-2" />
                          Remover favorito
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4 mr-2" />
                          Adicionar favorito
                        </>
                      )}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir em nova aba
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(page.id);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {onCreateChild && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateChild(page.id);
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            {childPages.map((child) => (
              <PageTreeItem
                key={child.id}
                page={child}
                level={level + 1}
                isSelected={false}
                isExpanded={false}
                onSelect={onSelect}
                onToggleExpand={onToggleExpand}
                onCreateChild={onCreateChild}
                onDelete={onDelete}
                onToggleFavorite={onToggleFavorite}
                childPages={getChildPagesForItem(child.id)}
                allPages={allPages}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PageTreeItem;
