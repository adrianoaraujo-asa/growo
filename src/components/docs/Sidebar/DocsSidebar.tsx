import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Star,
  Trash2,
  FileText,
  FolderOpen,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PageTreeItem, type PageTreeItemType } from "./PageTreeItem";

interface DocsSidebarProps {
  pages: PageTreeItemType[];
  favorites: PageTreeItemType[];
  currentPageId?: string;
  onCreatePage: (parentId?: string) => void;
  onDeletePage: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSelectPage: (id: string) => void;
  isLoading?: boolean;
}

export function DocsSidebar({
  pages,
  favorites,
  currentPageId,
  onCreatePage,
  onDeletePage,
  onToggleFavorite,
  onSelectPage,
  isLoading,
}: DocsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFavorites, setExpandedFavorites] = useState(true);
  const [expandedPages, setExpandedPages] = useState(true);
  const navigate = useNavigate();

  const filteredPages = searchQuery
    ? pages.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pages;

  return (
    <div className="flex flex-col h-full bg-muted/30 border-r">
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Documentos</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onCreatePage()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar páginas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Favorites Section */}
          {favorites.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setExpandedFavorites(!expandedFavorites)}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground w-full px-2 py-1"
              >
                {expandedFavorites ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <Star className="h-3 w-3 mr-1" />
                Favoritos
              </button>
              {expandedFavorites && (
                <div className="mt-1">
                  {favorites.map((page) => (
                    <PageTreeItem
                      key={page.id}
                      page={page}
                      isActive={page.id === currentPageId}
                      onSelect={onSelectPage}
                      onDelete={onDeletePage}
                      onToggleFavorite={onToggleFavorite}
                      onCreateSubpage={onCreatePage}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All Pages Section */}
          <div>
            <button
              onClick={() => setExpandedPages(!expandedPages)}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground w-full px-2 py-1"
            >
              {expandedPages ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              <FolderOpen className="h-3 w-3 mr-1" />
              Páginas
            </button>
            {expandedPages && (
              <div className="mt-1">
                {isLoading ? (
                  <div className="text-xs text-muted-foreground px-2 py-4 text-center">
                    Carregando...
                  </div>
                ) : filteredPages.length === 0 ? (
                  <div className="text-xs text-muted-foreground px-2 py-4 text-center">
                    {searchQuery ? "Nenhum resultado" : "Nenhuma página"}
                  </div>
                ) : (
                  filteredPages.map((page) => (
                    <PageTreeItem
                      key={page.id}
                      page={page}
                      isActive={page.id === currentPageId}
                      onSelect={onSelectPage}
                      onDelete={onDeletePage}
                      onToggleFavorite={onToggleFavorite}
                      onCreateSubpage={onCreatePage}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={() => navigate("/docs")}
        >
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </div>
    </div>
  );
}
