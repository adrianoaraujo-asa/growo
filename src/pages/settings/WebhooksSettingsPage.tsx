import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Webhook, 
  Plus, 
  Trash2, 
  MoreHorizontal,
  CheckCircle,
  XCircle,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface WebhookEndpoint {
  id: string;
  url: string;
  description: string;
  events: string[];
  secret: string;
  is_active: boolean;
  last_triggered_at?: string;
  last_status?: "success" | "failed";
  created_at: string;
}

const availableEvents = [
  { id: "user.created", label: "Usuário criado" },
  { id: "user.updated", label: "Usuário atualizado" },
  { id: "user.deleted", label: "Usuário removido" },
  { id: "project.created", label: "Projeto criado" },
  { id: "project.updated", label: "Projeto atualizado" },
  { id: "project.deleted", label: "Projeto removido" },
  { id: "timesheet.submitted", label: "Timesheet enviado" },
  { id: "invoice.created", label: "Fatura criada" },
  { id: "invoice.paid", label: "Fatura paga" },
];

// Mock data
const mockWebhooks: WebhookEndpoint[] = [
  {
    id: "1",
    url: "https://api.exemplo.com/webhooks/growo",
    description: "Integração com ERP",
    events: ["user.created", "project.created", "timesheet.submitted"],
    secret: "whsec_1234567890abcdef",
    is_active: true,
    last_triggered_at: "2026-01-15T10:30:00Z",
    last_status: "success",
    created_at: "2025-06-01T10:00:00Z",
  },
  {
    id: "2",
    url: "https://hooks.slack.com/services/xxx/yyy/zzz",
    description: "Notificações Slack",
    events: ["user.created", "invoice.paid"],
    secret: "whsec_abcdef1234567890",
    is_active: false,
    last_triggered_at: "2025-12-20T14:00:00Z",
    last_status: "failed",
    created_at: "2025-08-15T10:00:00Z",
  },
];

export function WebhooksSettingsPage() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(mockWebhooks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    setWebhooks(webhooks.filter((wh) => wh.id !== id));
    toast.success("Webhook removido!");
  };

  const handleToggle = (id: string) => {
    setWebhooks(
      webhooks.map((wh) =>
        wh.id === id ? { ...wh, is_active: !wh.is_active } : wh
      )
    );
    const webhook = webhooks.find((wh) => wh.id === id);
    toast.success(
      webhook?.is_active ? "Webhook desativado!" : "Webhook ativado!"
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Webhooks</h1>
          <p className="text-muted-foreground">
            Configure endpoints para receber eventos em tempo real.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-3d">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Webhook</DialogTitle>
              <DialogDescription>
                Configure um novo endpoint para receber eventos.
              </DialogDescription>
            </DialogHeader>
            <WebhookForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-4">
          <Webhook className="w-8 h-8 text-primary" />
          <div>
            <p className="font-medium text-foreground">Webhooks em tempo real</p>
            <p className="text-sm text-muted-foreground">
              Receba notificações HTTP POST automaticamente quando eventos ocorrerem
              na sua organização.
            </p>
          </div>
        </CardContent>
      </Card>

      {webhooks.length === 0 ? (
        <Card className="card-3d">
          <CardContent className="py-12 text-center">
            <Webhook className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum webhook configurado
            </h3>
            <p className="text-muted-foreground mb-4">
              Configure um webhook para receber eventos em tempo real.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Webhook
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <Card key={webhook.id} className="card-3d">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-foreground">
                        {webhook.description}
                      </h3>
                      <Badge
                        variant={webhook.is_active ? "default" : "secondary"}
                        className={webhook.is_active ? "bg-green-500" : ""}
                      >
                        {webhook.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                      {webhook.last_status && (
                        <Badge
                          variant="outline"
                          className={
                            webhook.last_status === "success"
                              ? "border-green-500/20 text-green-600"
                              : "border-red-500/20 text-red-600"
                          }
                        >
                          {webhook.last_status === "success" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {webhook.last_status === "success"
                            ? "Sucesso"
                            : "Falha"}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground font-mono mb-3">
                      {webhook.url}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {availableEvents.find((e) => e.id === event)?.label ||
                            event}
                        </Badge>
                      ))}
                    </div>

                    {webhook.last_triggered_at && (
                      <p className="text-xs text-muted-foreground">
                        Último disparo: {formatDate(webhook.last_triggered_at)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={webhook.is_active}
                      onCheckedChange={() => handleToggle(webhook.id)}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(webhook.secret);
                            toast.success("Secret copiado!");
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar Secret
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerar Secret
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-destructive"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remover
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remover webhook?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. O webhook será
                                removido e não receberá mais eventos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(webhook.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

interface WebhookFormProps {
  onClose: () => void;
}

function WebhookForm({ onClose }: WebhookFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showSecret, setShowSecret] = useState(false);
  const generatedSecret = "whsec_" + Math.random().toString(36).substring(2, 18);

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((e) => e !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvents.length === 0) {
      toast.error("Selecione pelo menos um evento");
      return;
    }
    setIsLoading(true);
    try {
      toast.success("Webhook criado com sucesso!");
      onClose();
    } catch (error) {
      toast.error("Erro ao criar webhook");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL do Endpoint *</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://api.exemplo.com/webhooks"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição *</Label>
        <Input
          id="description"
          placeholder="Ex: Integração com ERP"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Signing Secret</Label>
        <div className="relative">
          <Input
            value={generatedSecret}
            readOnly
            type={showSecret ? "text" : "password"}
            className="pr-20 font-mono text-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setShowSecret(!showSecret)}
            >
              {showSecret ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                navigator.clipboard.writeText(generatedSecret);
                toast.success("Secret copiado!");
              }}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Use este secret para verificar a autenticidade dos webhooks.
        </p>
      </div>

      <div className="space-y-3">
        <Label>Eventos *</Label>
        <div className="grid grid-cols-2 gap-2 border rounded-lg p-3">
          {availableEvents.map((event) => (
            <div key={event.id} className="flex items-center space-x-2">
              <Checkbox
                id={event.id}
                checked={selectedEvents.includes(event.id)}
                onCheckedChange={() => handleEventToggle(event.id)}
              />
              <label
                htmlFor={event.id}
                className="text-sm cursor-pointer text-foreground"
              >
                {event.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Criar Webhook
        </Button>
      </div>
    </form>
  );
}
