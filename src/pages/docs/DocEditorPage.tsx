import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Loader2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useDocument } from "@/hooks/useDocuments";
import { useR2Storage } from "@/hooks/useR2Storage";
import { SimpleEditor } from "@/components/docs/SimpleEditor";
import { DocumentPermissions } from "@/components/docs/DocumentPermissions";
import type { Json } from "@/integrations/supabase/types";

interface ContentBlock {
  id: string;
  type: "paragraph" | "heading1" | "heading2" | "heading3" | "bulletList" | "numberedList" | "checkList" | "quote" | "code" | "divider" | "image";
  content: string;
  checked?: boolean;
  imageUrl?: string;
}

const defaultBlocks: ContentBlock[] = [
  { id: "1", type: "paragraph", content: "" },
];

export function DocEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { document, isLoading, error, updateDocument } = useDocument(id || "");
  const { uploadFile } = useR2Storage();
  
  const [isSaving, setIsSaving] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState<ContentBlock[]>(defaultBlocks);
  const [showPermissions, setShowPermissions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Sync state with document data
  useEffect(() => {
    if (document) {
      setEditedTitle(document.title);
      if (document.content && Array.isArray(document.content)) {
        setEditedContent(document.content as unknown as ContentBlock[]);
      } else {
        setEditedContent(defaultBlocks);
      }
    }
  }, [document]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSave = useCallback(async () => {
    if (!document) return;
    
    setIsSaving(true);
    try {
      const contentText = editedContent
        .map(block => block.content || "")
        .join("\n");

      const wordCount = contentText.split(/\s+/).filter(Boolean).length;
      const readingTimeMinutes = Math.ceil(wordCount / 200);

      await updateDocument.mutateAsync({
        title: editedTitle,
        content: editedContent as unknown as Json,
        content_text: contentText,
        word_count: wordCount,
        reading_time_minutes: readingTimeMinutes,
        excerpt: contentText.substring(0, 200),
      });
      
      toast.success("Documento salvo!");
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Erro ao salvar documento");
    } finally {
      setIsSaving(false);
    }
  }, [document, editedTitle, editedContent, updateDocument]);

  const handleToggleFavorite = useCallback(async () => {
    if (!document) return;
    
    try {
      await updateDocument.mutateAsync({
        is_favorite: !document.is_favorite,
      });
      toast.success(
        document.is_favorite
          ? "Removido dos favoritos"
          : "Adicionado aos favoritos"
      );
    } catch (error) {
      toast.error("Erro ao atualizar favoritos");
    }
  }, [document, updateDocument]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copiado!");
  };

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const result = await uploadFile(file, {
        documentId: id,
        folder: `documents/${id}/images`,
      });
      toast.success("Imagem enviada!");
      return result.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao enviar imagem");
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [uploadFile, id]);

  const handleContentChange = useCallback((blocks: ContentBlock[]) => {
    setEditedContent(blocks);
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (document && (editedTitle !== document.title || 
          JSON.stringify(editedContent) !== JSON.stringify(document.content))) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [document, editedTitle, editedContent, handleSave]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Documento não encontrado</p>
        <Button variant="outline" onClick={() => navigate("/docs")}>
          Voltar para Documentos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/docs")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Input
            ref={titleInputRef}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="text-xl font-semibold w-[400px] border-none bg-transparent focus-visible:ring-1"
            placeholder="Título do documento..."
          />
          {document.is_favorite && (
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {isUploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando imagem...
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => setShowPermissions(true)}>
            <Users className="w-4 h-4 mr-2" />
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
                {document.is_favorite ? (
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
              <DropdownMenuItem onClick={handleCopyLink}>
                <Share2 className="w-4 h-4 mr-2" />
                Copiar link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/docs/${id}/history`)}>
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
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Atualizado {formatDate(document.updated_at)}
        </div>
        {document.word_count && (
          <div className="flex items-center gap-2">
            <span>{document.word_count} palavras</span>
            <span>•</span>
            <span>{document.reading_time_minutes || 1} min de leitura</span>
          </div>
        )}
      </div>

      {/* Editor */}
      <Card variant="flat" className="min-h-[600px]">
        <CardContent className="p-0">
          <SimpleEditor
            initialContent={editedContent}
            onChange={handleContentChange}
            onImageUpload={handleImageUpload}
            placeholder="Comece a escrever ou pressione Enter para novo bloco..."
          />
        </CardContent>
      </Card>

      {/* Permissions Dialog */}
      <DocumentPermissions
        documentId={id || ""}
        open={showPermissions}
        onOpenChange={setShowPermissions}
      />
    </div>
  );
}
