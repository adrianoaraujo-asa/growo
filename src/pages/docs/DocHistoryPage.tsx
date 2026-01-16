import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Clock,
  User,
  RotateCcw,
  Eye,
  FileText,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface VersionHistory {
  id: string;
  version: number;
  title: string;
  createdAt: string;
  createdBy: {
    name: string;
    avatar?: string;
  };
  changesSummary: string;
  content: string;
}

// Mock version history
const mockVersions: VersionHistory[] = [
  {
    id: "v5",
    version: 5,
    title: "Manual de Onboarding",
    createdAt: "2026-01-15T08:30:00Z",
    createdBy: { name: "João Silva", avatar: "" },
    changesSummary: "Atualizado seção de ferramentas",
    content: "# Manual de Onboarding\n\nVersão atualizada com novas ferramentas...",
  },
  {
    id: "v4",
    version: 4,
    title: "Manual de Onboarding",
    createdAt: "2026-01-10T14:20:00Z",
    createdBy: { name: "Ana Costa", avatar: "" },
    changesSummary: "Adicionado tabela de contatos",
    content: "# Manual de Onboarding\n\nAdicionada tabela com contatos...",
  },
  {
    id: "v3",
    version: 3,
    title: "Manual de Onboarding",
    createdAt: "2025-12-20T09:15:00Z",
    createdBy: { name: "Maria Santos", avatar: "" },
    changesSummary: "Revisão geral e correções",
    content: "# Manual de Onboarding\n\nRevisão completa do documento...",
  },
  {
    id: "v2",
    version: 2,
    title: "Manual de Onboarding",
    createdAt: "2025-11-05T16:00:00Z",
    createdBy: { name: "João Silva", avatar: "" },
    changesSummary: "Adicionado políticas de home office",
    content: "# Manual de Onboarding\n\nNova seção sobre home office...",
  },
  {
    id: "v1",
    version: 1,
    title: "Manual de Onboarding",
    createdAt: "2025-05-10T10:00:00Z",
    createdBy: { name: "Ana Costa", avatar: "" },
    changesSummary: "Versão inicial do documento",
    content: "# Manual de Onboarding\n\nVersão inicial do manual...",
  },
];

export function DocHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [versions] = useState<VersionHistory[]>(mockVersions);
  const [selectedVersion, setSelectedVersion] = useState<VersionHistory | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

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

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const versionDate = new Date(date);
    const diffDays = Math.floor(
      (now.getTime() - versionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses atrás`;
    return `${Math.floor(diffDays / 365)} anos atrás`;
  };

  const handleRestore = (version: VersionHistory) => {
    toast.success(`Documento restaurado para versão ${version.version}`);
    navigate(`/docs/${id}`);
  };

  const handlePreview = (version: VersionHistory) => {
    setSelectedVersion(version);
    setPreviewOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/docs/${id}`)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-heading">Histórico de Versões</h1>
          <p className="text-muted-foreground">
            Visualize e restaure versões anteriores do documento.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Versions List */}
        <Card className="card-3d md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-5 h-5" />
              Versões ({versions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="divide-y">
                {versions.map((version, index) => (
                  <div
                    key={version.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedVersion?.id === version.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedVersion(version)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={index === 0 ? "default" : "secondary"}
                          className={index === 0 ? "bg-green-500" : ""}
                        >
                          v{version.version}
                        </Badge>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs">
                            Atual
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {getRelativeTime(version.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-2">
                      {version.changesSummary}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Avatar className="w-4 h-4">
                        <AvatarImage src={version.createdBy.avatar} />
                        <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                          {getInitials(version.createdBy.name)}
                        </AvatarFallback>
                      </Avatar>
                      {version.createdBy.name}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Version Details */}
        <Card className="card-3d md:col-span-2">
          <CardContent className="pt-6">
            {selectedVersion ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Versão {selectedVersion.version}</Badge>
                      {selectedVersion.id === versions[0].id && (
                        <Badge className="bg-green-500">Versão Atual</Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {selectedVersion.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedVersion.changesSummary}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handlePreview(selectedVersion)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </Button>
                    {selectedVersion.id !== versions[0].id && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restaurar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Restaurar versão?</AlertDialogTitle>
                            <AlertDialogDescription>
                              O documento será restaurado para a versão{" "}
                              {selectedVersion.version}. A versão atual será
                              salva como uma nova versão no histórico.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRestore(selectedVersion)}
                            >
                              Restaurar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <User className="w-4 h-4" />
                      Autor
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={selectedVersion.createdBy.avatar} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(selectedVersion.createdBy.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">
                        {selectedVersion.createdBy.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Clock className="w-4 h-4" />
                      Data e Hora
                    </div>
                    <span className="font-medium text-foreground">
                      {formatDate(selectedVersion.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Content Preview */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Prévia do Conteúdo
                  </h4>
                  <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                    {selectedVersion.content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Selecione uma versão
                </h3>
                <p className="text-muted-foreground">
                  Clique em uma versão na lista para ver os detalhes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedVersion?.title} - Versão {selectedVersion?.version}
            </DialogTitle>
            <DialogDescription>
              {formatDate(selectedVersion?.createdAt || "")}
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans">
              {selectedVersion?.content}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
