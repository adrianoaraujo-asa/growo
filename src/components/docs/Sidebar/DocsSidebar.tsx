// components/docs/Sidebar/DocsSidebar.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  ChevronDown,
  FileText,
  Star,
  Trash2,
  Settings,
  FolderOpen,
  Home,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PageTreeItem } from "./PageTreeItem";
import { QuickSearch } from "./QuickSearch";
import type { PageTreeItem as PageTreeItemType } from "@/types/blocks";

interface DocsSidebarProps {
  workspaceId: string;
  pages: PageTreeItemType[];
  loading?: boolean;
  currentPageId?: string;
  onPageSelect: (pageId: string) => void;
  onCreatePage: (parentId?: string) => void;
  onDeletePage?: (pageId: string) => void;
  onToggleFavorite?: (pageId: string) => void;
  collapsed?: boolean;
}

export function DocsSidebar({
  workspaceId,
  pages,
  loading = false,
  currentPageId,
  onPageSelect,
  onCreatePage,
  onDeletePage,
  onToggleFavorite,
  collapsed = false,
}: DocsSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Get root pages (no parent)
  const rootPages = pages.filter((p) => !p.parentId && !p.isArchived);
  
  // Get favorites
  const favorites = pages.filter((p) => p.isFavorite && !p.isArchived);
  
  // Get trash count
  const trashCount = pages.filter((p) => p.isArchived).length;

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getChildPages = (parentId: string) => {
    return pages.filter((p) => p.parentId === parentId && !p.isArchived);
  };

  if (collapsed) {
    return (
      <aside className="docs-sidebar w-16 h-full bg-muted/30 border-r flex flex-col">
        <div className="p-2 space-y-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="w-full"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCreatePage()}
            className="w-full"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/docs")}
            className="w-full"
          >
            <Home className="w-4 h-4" />
          </Button>
        </div>
        <QuickSearch
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          workspaceId={workspaceId}
          onSelectPage={onPageSelect}
          pages={pages}
        />
      </aside>
    );
  }

  return (
    <aside className="docs-sidebar w-64 h-full bg-muted/30 border-r flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Documentos</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="h-8 w-8"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-2 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="w-4 h-4 mr-2" />
          <span>Busca Rápida</span>
          <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => onCreatePage()}
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Nova Página</span>
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground",
            location.pathname === "/docs" && "bg-accent text-accent-foreground"
          )}
          onClick={() => navigate("/docs")}
        >
          <Home className="w-4 h-4 mr-2" />
          <span>Início</span>
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="px-2 py-1">
            <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <Star className="w-3 h-3" />
              Favoritos
            </div>
            <div className="space-y-0.5">
              {favorites.map((page) => (
                <PageTreeItem
                  key={page.id}
                  page={page}
                  level={0}
                  isSelected={page.id === currentPageId}
                  isExpanded={expandedItems.has(page.id)}
                  onSelect={onPageSelect}
                  onToggleExpand={toggleExpand}
                  onCreateChild={onCreatePage}
                  onDelete={onDeletePage}
                  onToggleFavorite={onToggleFavorite}
                  childPages={getChildPages(page.id)}
                  allPages={pages}
                />
              ))}
            </div>
          </div>
        )}

        {/* Page Tree */}
        <div className="px-2 py-1">
          <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <FileText className="w-3 h-3" />
            Páginas
          </div>
          {loading ? (
            <div className="p-4 flex items-center justify-center text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Carregando...
            </div>
          ) : rootPages.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma página ainda</p>
              <Button
                variant="link"
                size="sm"
                onClick={() => onCreatePage()}
                className="mt-1"
              >
                Criar primeira página
              </Button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {rootPages.map((page) => (
                <PageTreeItem
                  key={page.id}
                  page={page}
                  level={0}
                  isSelected={page.id === currentPageId}
                  isExpanded={expandedItems.has(page.id)}
                  onSelect={onPageSelect}
                  onToggleExpand={toggleExpand}
                  onCreateChild={onCreatePage}
                  onDelete={onDeletePage}
                  onToggleFavorite={onToggleFavorite}
                  childPages={getChildPages(page.id)}
                  allPages={pages}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Trash */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/docs/trash")}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          <span>Lixeira</span>
          {trashCount > 0 && (
            <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
              {trashCount}
            </span>
          )}
        </Button>
      </div>

      {/* Quick Search Modal */}
      <QuickSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        workspaceId={workspaceId}
        onSelectPage={onPageSelect}
        pages={pages}
      />
    </aside>
  );
}

export default DocsSidebar;
