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
  Home
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

interface Document {
  id: string;
  title: string;
  type: "document" | "folder";
  parentId: string | null;
  content?: string;
  excerpt?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  icon?: string;
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: "folder-1",
    title: "Políticas da Empresa",
    type: "folder",
    parentId: null,
    isFavorite: false,
    createdAt: "2025-06-01T10:00:00Z",
    updatedAt: "2025-12-01T10:00:00Z",
    createdBy: "João Silva",
    icon: "📁",
  },
  {
    id: "folder-2",
    title: "Guias Técnicos",
    type: "folder",
    parentId: null,
    isFavorite: true,
    createdAt: "2025-07-15T10:00:00Z",
    updatedAt: "2026-01-10T10:00:00Z",
    createdBy: "Maria Santos",
    icon: "📚",
  },
  {
    id: "folder-3",
    title: "Templates",
    type: "folder",
    parentId: null,
    isFavorite: false,
    createdAt: "2025-08-20T10:00:00Z",
    updatedAt: "2025-11-05T10:00:00Z",
    createdBy: "Pedro Oliveira",
    icon: "📋",
  },
  {
    id: "doc-1",
    title: "Manual de Onboarding",
    type: "document",
    parentId: null,
    excerpt: "Este manual contém todas as informações necessárias para novos colaboradores...",
    isFavorite: true,
    createdAt: "2025-05-10T10:00:00Z",
    updatedAt: "2026-01-15T08:30:00Z",
    createdBy: "Ana Costa",
    icon: "📖",
  },
  {
    id: "doc-2",
    title: "Código de Conduta",
    type: "document",
    parentId: "folder-1",
    excerpt: "O código de conduta estabelece os princípios e valores que guiam...",
    isFavorite: false,
    createdAt: "2025-06-15T10:00:00Z",
    updatedAt: "2025-09-20T14:00:00Z",
    createdBy: "João Silva",
    icon: "⚖️",
  },
  {
    id: "doc-3",
    title: "Política de Home Office",
    type: "document",
    parentId: "folder-1",
    excerpt: "Esta política define as regras e diretrizes para trabalho remoto...",
    isFavorite: false,
    createdAt: "2025-07-01T10:00:00Z",
    updatedAt: "2025-10-15T11:00:00Z",
    createdBy: "Maria Santos",
    icon: "🏠",
  },
  {
    id: "doc-4",
    title: "Guia de API",
    type: "document",
    parentId: "folder-2",
    excerpt: "Documentação completa da API REST incluindo endpoints, autenticação...",
    isFavorite: true,
    createdAt: "2025-08-10T10:00:00Z",
    updatedAt: "2026-01-12T16:45:00Z",
    createdBy: "Pedro Oliveira",
    icon: "🔌",
  },
  {
    id: "doc-5",
    title: "Arquitetura do Sistema",
    type: "document",
    parentId: "folder-2",
    excerpt: "Visão geral da arquitetura técnica, incluindo microserviços, banco de dados...",
    isFavorite: false,
    createdAt: "2025-09-05T10:00:00Z",
    updatedAt: "2025-12-20T09:00:00Z",
    createdBy: "Ana Costa",
    icon: "🏗️",
  },
];

export function DocsPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [newItemType, setNewItemType] = useState<"document" | "folder">("document");
  const [newItemTitle, setNewItemTitle] = useState("");

  // Get current folder path for breadcrumb
  const getBreadcrumbPath = (): Document[] => {
    const path: Document[] = [];
    let currentId = currentFolderId;
    
    while (currentId) {
      const folder = documents.find((d) => d.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return path;
  };

  // Filter documents based on search and current folder
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Filter by current folder
    if (!searchTerm) {
      filtered = filtered.filter((d) => d.parentId === currentFolderId);
    } else {
      // When searching, show all matching documents
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (d.excerpt && d.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort: folders first, then by title
    return filtered.sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return a.title.localeCompare(b.title);
    });
  }, [documents, searchTerm, currentFolderId]);

  const breadcrumbPath = getBreadcrumbPath();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleToggleFavorite = (id: string) => {
    setDocuments(
      documents.map((d) =>
        d.id === id ? { ...d, isFavorite: !d.isFavorite } : d
      )
    );
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
    toast.success("Item removido!");
  };

  const handleCreateNew = () => {
    if (!newItemTitle.trim()) {
      toast.error("Digite um título");
      return;
    }

    const newItem: Document = {
      id: `${newItemType}-${Date.now()}`,
      title: newItemTitle,
      type: newItemType,
      parentId: currentFolderId,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Você",
      icon: newItemType === "folder" ? "📁" : "📄",
      excerpt: newItemType === "document" ? "Documento em branco..." : undefined,
    };

    setDocuments([...documents, newItem]);
    setNewItemTitle("");
    setIsNewDialogOpen(false);
    toast.success(`${newItemType === "folder" ? "Pasta" : "Documento"} criado!`);

    if (newItemType === "document") {
      navigate(`/docs/${newItem.id}`);
    }
  };

  const handleOpenItem = (item: Document) => {
    if (item.type === "folder") {
      setCurrentFolderId(item.id);
      setSearchTerm("");
    } else {
      navigate(`/docs/${item.id}`);
    }
  };

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
            <Button className="btn-3d">
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
                <Button onClick={handleCreateNew}>Criar</Button>
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
          onClick={() => setCurrentFolderId(null)}
        >
          <Home className="w-4 h-4" />
        </Button>
        {breadcrumbPath.map((folder, index) => (
          <div key={folder.id} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => setCurrentFolderId(folder.id)}
            >
              {folder.icon} {folder.title}
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

      {/* Content */}
      {filteredDocuments.length === 0 ? (
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
          {filteredDocuments.map((item) => (
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
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(item.id);
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
                      {item.type === "document" && (
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
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
                          handleDelete(item.id);
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
                {item.type === "document" && item.excerpt && (
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
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredDocuments.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer group"
                  onClick={() => handleOpenItem(item)}
                >
                  <div className="text-2xl">
                    {item.type === "folder" ? (
                      <Folder className="w-6 h-6 text-primary" />
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
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        {item.type === "folder" ? "Pasta" : "Documento"}
                      </Badge>
                    </div>
                    {item.type === "document" && item.excerpt && (
                      <p className="text-sm text-muted-foreground truncate">
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(item.updatedAt)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.createdBy}
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
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(item.id);
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
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
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
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
