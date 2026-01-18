import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  Folder,
  FolderOpen,
  Plus, 
  Search,
  Grid,
  List,
  MoreHorizontal,
  Star,
  StarOff,
  Trash2,
  Edit,
  Copy,
  Clock,
  ChevronRight,
  Home,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useWorkspaceAccess } from "@/hooks/useWorkspaceAccess";
import { 
  useDocumentFolders, 
  useDocuments, 
  useCreateFolder 
} from "@/hooks/useDocuments";
import type { Database } from "@/integrations/supabase/types";

type DocumentFolder = Database["public"]["Tables"]["document_folders"]["Row"];
type Document = Database["public"]["Tables"]["documents"]["Row"];

export function DocsPage() {
  const navigate = useNavigate();
  const { workspace, isLoading: workspaceLoading, isSuperAdmin } = useWorkspaceAccess();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [newItemType, setNewItemType] = useState<"document" | "folder">("document");
  const [newItemTitle, setNewItemTitle] = useState("");

  // Fetch folders and documents
  const { data: folders = [], isLoading: foldersLoading } = useDocumentFolders(
    workspace?.id || "",
    currentFolderId
  );

  const { 
    documents, 
    isLoading: documentsLoading,
    createDocument,
    deleteDocument,
    toggleFavorite
  } = useDocuments(workspace?.id || "", currentFolderId);

  const createFolder = useCreateFolder(workspace?.id || "");

  const isLoading = workspaceLoading || foldersLoading || documentsLoading;

  // Build breadcrumb path
  const [breadcrumbPath, setBreadcrumbPath] = useState<DocumentFolder[]>([]);

  const getBreadcrumbPath = async (folderId: string | null) => {
    if (!folderId) {
      setBreadcrumbPath([]);
      return;
    }
    // For simplicity, just show current folder
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setBreadcrumbPath([folder]);
    }
  };

  // Combined items (folders + documents)
  const items = useMemo(() => {
    const folderItems = folders.map(f => ({
      id: f.id,
      title: f.name,
      type: "folder" as const,
      isFavorite: false,
      createdAt: f.created_at,
      updatedAt: f.updated_at,
      icon: f.icon || "📁",
      excerpt: f.description,
    }));

    const docItems = documents.map(d => ({
      id: d.id,
      title: d.title,
      type: "document" as const,
      isFavorite: d.is_favorite || false,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
      icon: d.icon || "📄",
      excerpt: d.excerpt,
    }));

    let combined = [...folderItems, ...docItems];

    // Filter by search
    if (searchTerm) {
      combined = combined.filter(
        item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort: folders first, then favorites, then by title
    return combined.sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [folders, documents, searchTerm]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleToggleFavorite = (id: string, currentFavorite: boolean) => {
    toggleFavorite.mutate({ id, isFavorite: currentFavorite });
  };

  const handleDelete = (id: string, type: "folder" | "document") => {
    if (type === "document") {
      deleteDocument.mutate(id);
    }
    // TODO: Add folder delete mutation
  };

  const handleCreateNew = async () => {
    if (!newItemTitle.trim()) {
      toast.error("Digite um título");
      return;
    }

    if (!workspace) {
      toast.error("Nenhum workspace encontrado");
      return;
    }

    if (newItemType === "folder") {
      createFolder.mutate(
        {
          name: newItemTitle,
          parent_id: currentFolderId,
          icon: "📁",
        },
        {
          onSuccess: () => {
            setNewItemTitle("");
            setIsNewDialogOpen(false);
          },
        }
      );
    } else {
      createDocument.mutate(
        {
          title: newItemTitle,
          folder_id: currentFolderId,
          icon: "📄",
          content: [{ id: "1", type: "paragraph", content: "" }],
        },
        {
          onSuccess: (data) => {
            setNewItemTitle("");
            setIsNewDialogOpen(false);
            navigate(`/docs/${data.id}`);
          },
        }
      );
    }
  };

  const handleOpenItem = (item: typeof items[0]) => {
    if (item.type === "folder") {
      setCurrentFolderId(item.id);
      setSearchTerm("");
    } else {
      navigate(`/docs/${item.id}`);
    }
  };

  // Show loading state or prompt to create workspace
  if (!isLoading && !workspace) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center min-h-[400px] space-y-4"
      >
        <FileText className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Nenhum workspace de documentos</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Você ainda não tem um workspace de documentos configurado. 
          Um workspace padrão será criado automaticamente.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Documentos</h1>
          <p className="text-muted-foreground">
            Base de conhecimento e documentação colaborativa.
          </p>
        </div>
        <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-3d" disabled={!workspace}>
              <Plus className="w-4 h-4 mr-2" />
              Novo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo</DialogTitle>
              <DialogDescription>
                Adicione um novo documento ou pasta.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={newItemType}
                  onValueChange={(v) => setNewItemType(v as "document" | "folder")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Documento
                      </div>
                    </SelectItem>
                    <SelectItem value="folder">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4" />
                        Pasta
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  placeholder={
                    newItemType === "folder"
                      ? "Nome da pasta"
                      : "Título do documento"
                  }
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateNew()}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateNew}
                  disabled={createDocument.isPending || createFolder.isPending}
                >
                  {(createDocument.isPending || createFolder.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Criar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => {
            setCurrentFolderId(null);
            setBreadcrumbPath([]);
          }}
        >
          <Home className="w-4 h-4" />
        </Button>
        {breadcrumbPath.map((folder) => (
          <div key={folder.id} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => setCurrentFolderId(folder.id)}
            >
              {folder.icon} {folder.name}
            </Button>
          </div>
        ))}
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
          <TabsList>
            <TabsTrigger value="grid">
              <Grid className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <Card className="card-3d">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm ? "Nenhum resultado encontrado" : "Pasta vazia"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Tente buscar por outros termos."
                : "Crie um novo documento ou pasta para começar."}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsNewDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Novo
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className="card-3d cursor-pointer hover:border-primary/50 transition-colors group"
              onClick={() => handleOpenItem(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">
                    {item.type === "folder" ? (
                      <FolderOpen className="w-8 h-8 text-primary" />
                    ) : (
                      <span>{item.icon || "📄"}</span>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {item.type === "document" && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(item.id, item.isFavorite);
                          }}
                        >
                          {item.isFavorite ? (
                            <>
                              <StarOff className="w-4 h-4 mr-2" />
                              Remover dos favoritos
                            </>
                          ) : (
                            <>
                              <Star className="w-4 h-4 mr-2" />
                              Adicionar aos favoritos
                            </>
                          )}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id, item.type);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground truncate flex-1">
                    {item.title}
                  </h3>
                  {item.isFavorite && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
                  )}
                </div>
                {item.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {item.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDate(item.updatedAt)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-3d">
          <div className="divide-y">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 hover:bg-accent/50 cursor-pointer transition-colors group"
                onClick={() => handleOpenItem(item)}
              >
                <div className="text-2xl">
                  {item.type === "folder" ? (
                    <FolderOpen className="w-6 h-6 text-primary" />
                  ) : (
                    <span>{item.icon || "📄"}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground truncate">
                      {item.title}
                    </h3>
                    {item.isFavorite && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
                    )}
                  </div>
                  {item.excerpt && (
                    <p className="text-sm text-muted-foreground truncate">
                      {item.excerpt}
                    </p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(item.updatedAt)}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {item.type === "document" && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(item.id, item.isFavorite);
                        }}
                      >
                        {item.isFavorite ? (
                          <>
                            <StarOff className="w-4 h-4 mr-2" />
                            Remover dos favoritos
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4 mr-2" />
                            Adicionar aos favoritos
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id, item.type);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
}
