import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Save,
  Clock,
  Share2,
  Star,
  StarOff,
  MoreHorizontal,
  History,
  Trash2,
  Copy,
  Download,
  Eye,
  Edit,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Loader2,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface DocumentData {
  id: string;
  title: string;
  content: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    name: string;
    avatar?: string;
  };
  lastEditedBy: {
    name: string;
    avatar?: string;
  };
  collaborators: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

// Mock document data
const mockDocument: DocumentData = {
  id: "doc-1",
  title: "Manual de Onboarding",
  content: `# Manual de Onboarding

Bem-vindo à equipe! Este manual contém todas as informações necessárias para novos colaboradores.

## Primeiros Passos

1. **Configuração da estação de trabalho**
   - Solicite seu equipamento ao RH
   - Configure seu email corporativo
   - Instale as ferramentas necessárias

2. **Conhecendo a equipe**
   - Agende uma reunião com seu gestor
   - Participe da integração semanal
   - Conheça os colegas do seu time

## Ferramentas e Sistemas

### Comunicação
- **Slack** - Comunicação interna
- **Google Meet** - Videoconferências
- **Email** - Comunicação formal

### Desenvolvimento
- **GitHub** - Repositório de código
- **Jira** - Gestão de projetos
- **Figma** - Design e protótipos

## Políticas Importantes

- Horário flexível (8h às 18h)
- Home office 2x por semana
- Dress code casual

## Contatos Úteis

| Departamento | Email |
|--------------|-------|
| RH | rh@empresa.com |
| TI | suporte@empresa.com |
| Financeiro | financeiro@empresa.com |

---

*Última atualização: Janeiro 2026*`,
  isFavorite: true,
  createdAt: "2025-05-10T10:00:00Z",
  updatedAt: "2026-01-15T08:30:00Z",
  createdBy: {
    name: "Ana Costa",
    avatar: "",
  },
  lastEditedBy: {
    name: "João Silva",
    avatar: "",
  },
  collaborators: [
    { id: "1", name: "Ana Costa", avatar: "" },
    { id: "2", name: "João Silva", avatar: "" },
    { id: "3", name: "Maria Santos", avatar: "" },
  ],
};

const toolbarButtons = [
  { icon: Bold, label: "Negrito", markdown: "**" },
  { icon: Italic, label: "Itálico", markdown: "*" },
  { icon: Underline, label: "Sublinhado", markdown: "__" },
  { type: "separator" },
  { icon: Heading1, label: "Título 1", markdown: "# " },
  { icon: Heading2, label: "Título 2", markdown: "## " },
  { icon: Heading3, label: "Título 3", markdown: "### " },
  { type: "separator" },
  { icon: List, label: "Lista", markdown: "- " },
  { icon: ListOrdered, label: "Lista Numerada", markdown: "1. " },
  { icon: Quote, label: "Citação", markdown: "> " },
  { type: "separator" },
  { icon: Link, label: "Link", markdown: "[texto](url)" },
  { icon: Image, label: "Imagem", markdown: "![alt](url)" },
  { icon: Code, label: "Código", markdown: "`" },
];

export function DocEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<DocumentData>(mockDocument);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedTitle, setEditedTitle] = useState(document.title);
  const [editedContent, setEditedContent] = useState(document.content);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDocument({
        ...document,
        title: editedTitle,
        content: editedContent,
        updatedAt: new Date().toISOString(),
      });
      setIsEditing(false);
      toast.success("Documento salvo!");
    } catch (error) {
      toast.error("Erro ao salvar documento");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFavorite = () => {
    setDocument({ ...document, isFavorite: !document.isFavorite });
    toast.success(
      document.isFavorite
        ? "Removido dos favoritos"
        : "Adicionado aos favoritos"
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copiado!");
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering - in production, use a proper markdown library
    let html = content
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*)\*\*\*/gim, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      // Code
      .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" class="text-primary underline">$1</a>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">$1</blockquote>')
      // Horizontal rule
      .replace(/^---$/gim, '<hr class="my-4 border-border">')
      // Line breaks
      .replace(/\n/gim, '<br>');

    return html;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/docs")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-xl font-semibold w-[400px]"
            />
          ) : (
            <h1 className="text-2xl font-semibold text-heading">
              {document.title}
            </h1>
          )}
          {document.isFavorite && !isEditing && (
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(document.title);
                  setEditedContent(document.content);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button variant="outline" onClick={handleCopyLink}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleToggleFavorite}>
                    {document.isFavorite ? (
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
                    onClick={() => navigate(`/docs/${id}/history`)}
                  >
                    <History className="w-4 h-4 mr-2" />
                    Ver histórico
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar PDF
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Atualizado {formatDate(document.updatedAt)}
        </div>
        <div className="flex items-center gap-2">
          <span>por</span>
          <Avatar className="w-5 h-5">
            <AvatarImage src={document.lastEditedBy.avatar} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials(document.lastEditedBy.name)}
            </AvatarFallback>
          </Avatar>
          {document.lastEditedBy.name}
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <div className="flex -space-x-2">
            {document.collaborators.slice(0, 3).map((collab) => (
              <Avatar key={collab.id} className="w-6 h-6 border-2 border-background">
                <AvatarImage src={collab.avatar} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(collab.name)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          {document.collaborators.length} colaboradores
        </div>
      </div>

      {/* Editor/Viewer */}
      <Card className="card-3d min-h-[600px]">
        {isEditing && (
          <div className="border-b p-2 flex items-center gap-1 flex-wrap">
            <TooltipProvider>
              {toolbarButtons.map((btn, index) =>
                btn.type === "separator" ? (
                  <Separator key={index} orientation="vertical" className="h-6 mx-1" />
                ) : (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {btn.icon && <btn.icon className="w-4 h-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{btn.label}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              )}
            </TooltipProvider>
          </div>
        )}
        <CardContent className="p-6">
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[500px] font-mono text-sm resize-none border-none focus-visible:ring-0 p-0"
              placeholder="Digite o conteúdo em Markdown..."
            />
          ) : (
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(document.content) }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
