// components/docs/Sidebar/QuickSearch.tsx
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  FileText, 
  Clock, 
  Star,
  ArrowRight,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { PageTreeItem } from "@/types/blocks";

interface QuickSearchProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  onSelectPage: (pageId: string) => void;
  pages: PageTreeItem[];
}

export function QuickSearch({
  open,
  onClose,
  workspaceId,
  onSelectPage,
  pages,
}: QuickSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter pages by query
  const filteredPages = useMemo(() => {
    if (!query.trim()) {
      // Show recent/favorites when no query
      return pages
        .filter((p) => !p.isArchived)
        .sort((a, b) => {
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return 0;
        })
        .slice(0, 10);
    }

    const searchLower = query.toLowerCase();
    return pages
      .filter(
        (p) =>
          !p.isArchived &&
          p.title.toLowerCase().includes(searchLower)
      )
      .slice(0, 10);
  }, [pages, query]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredPages]);

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredPages.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredPages[selectedIndex]) {
            handleSelect(filteredPages[selectedIndex].id);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredPages, selectedIndex, onClose]);

  const handleSelect = (pageId: string) => {
    onSelectPage(pageId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar páginas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 text-lg px-0"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuery("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="border-t mt-2">
          {filteredPages.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma página encontrada</p>
              {query && (
                <p className="text-sm mt-1">
                  Tente buscar com outros termos
                </p>
              )}
            </div>
          ) : (
            <ScrollArea className="max-h-[400px]">
              <div className="p-2">
                {!query && (
                  <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {filteredPages.some((p) => p.isFavorite) ? "Favoritos & Recentes" : "Recentes"}
                  </div>
                )}
                {filteredPages.map((page, index) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <button
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors",
                        index === selectedIndex
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      )}
                      onClick={() => handleSelect(page.id)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <span className="text-lg shrink-0">
                        {page.icon || <FileText className="w-5 h-5 text-muted-foreground" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {page.title || "Sem título"}
                        </div>
                      </div>
                      {page.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
                      )}
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="border-t p-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd>
              abrir
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">esc</kbd>
              fechar
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QuickSearch;
