import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Key, 
  Plus, 
  Trash2, 
  Copy,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  key_prefix: string;
  permissions: "read" | "write" | "admin";
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
}

const permissionLabels: Record<string, { label: string; className: string }> = {
  read: { label: "Leitura", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  write: { label: "Leitura/Escrita", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  admin: { label: "Admin", className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
};

// Mock data
const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Integração ERP",
    key: "sk_live_1234567890abcdefghijklmnopqrstuv",
    key_prefix: "sk_live_1234",
    permissions: "write",
    last_used_at: "2026-01-15T10:30:00Z",
    created_at: "2025-06-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Dashboard Analytics",
    key: "sk_live_abcdefghij1234567890klmnopqrstuv",
    key_prefix: "sk_live_abcd",
    permissions: "read",
    last_used_at: "2026-01-14T16:45:00Z",
    created_at: "2025-08-15T10:00:00Z",
  },
  {
    id: "3",
    name: "Backup Service",
    key: "sk_live_qrstuvwxyz1234567890abcdefghijkl",
    key_prefix: "sk_live_qrst",
    permissions: "admin",
    expires_at: "2026-06-01T00:00:00Z",
    created_at: "2025-12-01T10:00:00Z",
  },
];

export function ApiKeysSettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
    toast.success("API Key removida!");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatLastUsed = (date?: string) => {
    if (!date) return "Nunca";
    const now = new Date();
    const usedDate = new Date(date);
    const diffHours = Math.floor(
      (now.getTime() - usedDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 1) return "Agora";
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffHours < 48) return "Ontem";
    return formatDate(date);
  };

  const handleCreateKey = (name: string, permissions: string) => {
    const newApiKey: ApiKey = {
      id: String(Date.now()),
      name,
      key: `sk_live_${Math.random().toString(36).substring(2, 34)}`,
      key_prefix: `sk_live_${Math.random().toString(36).substring(2, 6)}`,
      permissions: permissions as "read" | "write" | "admin",
      created_at: new Date().toISOString(),
    };
    setApiKeys([newApiKey, ...apiKeys]);
    setNewKey(newApiKey.key);
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
          <h1 className="text-2xl font-semibold text-heading">API Keys</h1>
          <p className="text-muted-foreground">
            Gerencie chaves de API para integrações externas.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setNewKey(null);
        }}>
          <DialogTrigger asChild>
            <Button className="btn-3d">
              <Plus className="w-4 h-4 mr-2" />
              Criar API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {newKey ? "API Key Criada" : "Criar Nova API Key"}
              </DialogTitle>
              <DialogDescription>
                {newKey
                  ? "Copie a chave abaixo. Ela não será exibida novamente."
                  : "Configure as permissões da nova chave de API."}
              </DialogDescription>
            </DialogHeader>
            {newKey ? (
              <NewKeyDisplay apiKey={newKey} onClose={() => setIsDialogOpen(false)} />
            ) : (
              <ApiKeyForm
                onClose={() => setIsDialogOpen(false)}
                onCreate={handleCreateKey}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Security Notice */}
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="flex items-center gap-4 py-4">
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
          <div>
            <p className="font-medium text-foreground">Mantenha suas chaves seguras</p>
            <p className="text-sm text-muted-foreground">
              Nunca compartilhe ou exponha suas API Keys em código público.
              Rotacione as chaves regularmente e remova as não utilizadas.
            </p>
          </div>
        </CardContent>
      </Card>

      {apiKeys.length === 0 ? (
        <Card className="card-3d">
          <CardContent className="py-12 text-center">
            <Key className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma API Key criada
            </h3>
            <p className="text-muted-foreground mb-4">
              Crie uma API Key para integrar sistemas externos.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="card-3d">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Chaves de API ({apiKeys.length})
            </CardTitle>
            <CardDescription>
              Gerencie e monitore o uso das suas API Keys.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Chave</TableHead>
                  <TableHead>Permissões</TableHead>
                  <TableHead>Último Uso</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead>Expira em</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium text-foreground">
                      {apiKey.name}
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 rounded bg-muted text-sm font-mono">
                        {apiKey.key_prefix}...
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={permissionLabels[apiKey.permissions].className}
                      >
                        {permissionLabels[apiKey.permissions].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatLastUsed(apiKey.last_used_at)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(apiKey.created_at)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {apiKey.expires_at ? formatDate(apiKey.expires_at) : "Nunca"}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revogar API Key?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Todas as
                              integrações usando esta chave deixarão de funcionar.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(apiKey.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Revogar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

interface ApiKeyFormProps {
  onClose: () => void;
  onCreate: (name: string, permissions: string) => void;
}

function ApiKeyForm({ onClose, onCreate }: ApiKeyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState("read");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      onCreate(name, permissions);
    } catch (error) {
      toast.error("Erro ao criar API Key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Chave *</Label>
        <Input
          id="name"
          placeholder="Ex: Integração ERP"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="permissions">Permissões *</Label>
        <Select value={permissions} onValueChange={setPermissions}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione as permissões" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="read">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="font-medium">Leitura</p>
                  <p className="text-xs text-muted-foreground">
                    Apenas visualizar dados
                  </p>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="write">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <div>
                  <p className="font-medium">Leitura/Escrita</p>
                  <p className="text-xs text-muted-foreground">
                    Visualizar e modificar dados
                  </p>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="admin">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="font-medium">Admin</p>
                  <p className="text-xs text-muted-foreground">
                    Acesso total incluindo configurações
                  </p>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Criar API Key
        </Button>
      </div>
    </form>
  );
}

interface NewKeyDisplayProps {
  apiKey: string;
  onClose: () => void;
}

function NewKeyDisplay({ apiKey, onClose }: NewKeyDisplayProps) {
  const [showKey, setShowKey] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API Key copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="py-4">
          <div className="relative">
            <Input
              value={apiKey}
              readOnly
              type={showKey ? "text" : "password"}
              className="pr-20 font-mono text-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
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
                onClick={handleCopy}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
        <p className="text-sm text-yellow-700">
          Guarde esta chave em um local seguro. Ela não será exibida novamente.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onClose}>
          {copied ? "Copiada!" : "Fechar"}
        </Button>
      </div>
    </div>
  );
}
