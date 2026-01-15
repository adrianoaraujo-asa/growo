import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Shield,
  UserX,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface OrganizationUser {
  id: string;
  user_id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: "owner" | "admin" | "manager" | "member" | "viewer";
  department?: string;
  title?: string;
  joined_at: string;
  last_login_at?: string;
}

const roleLabels: Record<string, { label: string; color: string }> = {
  owner: { label: "Proprietário", color: "bg-purple-500" },
  admin: { label: "Administrador", color: "bg-blue-500" },
  manager: { label: "Gerente", color: "bg-green-500" },
  member: { label: "Membro", color: "bg-gray-500" },
  viewer: { label: "Visualizador", color: "bg-gray-400" },
};

// Mock data
const mockUsers: OrganizationUser[] = [
  {
    id: "1",
    user_id: "user-1",
    email: "joao@empresa.com.br",
    display_name: "João Silva",
    role: "owner",
    department: "Diretoria",
    title: "CEO",
    joined_at: "2024-01-15T10:00:00Z",
    last_login_at: "2026-01-15T08:30:00Z",
  },
  {
    id: "2",
    user_id: "user-2",
    email: "maria@empresa.com.br",
    display_name: "Maria Santos",
    avatar_url: "",
    role: "admin",
    department: "TI",
    title: "CTO",
    joined_at: "2024-02-01T10:00:00Z",
    last_login_at: "2026-01-14T16:45:00Z",
  },
  {
    id: "3",
    user_id: "user-3",
    email: "pedro@empresa.com.br",
    display_name: "Pedro Oliveira",
    role: "manager",
    department: "Projetos",
    title: "Gerente de Projetos",
    joined_at: "2024-03-10T10:00:00Z",
    last_login_at: "2026-01-15T09:15:00Z",
  },
  {
    id: "4",
    user_id: "user-4",
    email: "ana@empresa.com.br",
    display_name: "Ana Costa",
    role: "member",
    department: "Desenvolvimento",
    title: "Desenvolvedora Senior",
    joined_at: "2024-04-20T10:00:00Z",
    last_login_at: "2026-01-15T07:00:00Z",
  },
];

export function UsersSettingsPage() {
  const [users] = useState<OrganizationUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatLastLogin = (date?: string) => {
    if (!date) return "Nunca";
    const now = new Date();
    const loginDate = new Date(date);
    const diffHours = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Agora";
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffHours < 48) return "Ontem";
    return formatDate(date);
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
          <h1 className="text-2xl font-semibold text-heading">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os membros da sua organização.
          </p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-3d">
              <Plus className="w-4 h-4 mr-2" />
              Convidar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Convidar Novo Usuário</DialogTitle>
              <DialogDescription>
                Envie um convite para um novo membro da organização.
              </DialogDescription>
            </DialogHeader>
            <InviteForm onClose={() => setIsInviteDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="card-3d">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Membros ({users.length})
              </CardTitle>
              <CardDescription>
                Gerencie permissões e acessos dos usuários.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-[250px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(user.display_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {user.display_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${roleLabels[user.role].color} text-white`}
                    >
                      {roleLabels[user.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-foreground">{user.department || "-"}</p>
                      {user.title && (
                        <p className="text-sm text-muted-foreground">
                          {user.title}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatLastLogin(user.last_login_at)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.joined_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="w-4 h-4 mr-2" />
                          Alterar permissão
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <UserX className="w-4 h-4 mr-2" />
                          Remover da organização
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface InviteFormProps {
  onClose: () => void;
}

function InviteForm({ onClose }: InviteFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      toast.success("Convite enviado com sucesso!");
      onClose();
    } catch (error) {
      toast.error("Erro ao enviar convite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="email@exemplo.com.br"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Função *</Label>
        <Select defaultValue="member">
          <SelectTrigger>
            <SelectValue placeholder="Selecione a função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="manager">Gerente</SelectItem>
            <SelectItem value="member">Membro</SelectItem>
            <SelectItem value="viewer">Visualizador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Departamento</Label>
        <Input
          id="department"
          placeholder="Ex: Desenvolvimento, RH, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Cargo</Label>
        <Input
          id="title"
          placeholder="Ex: Desenvolvedor, Analista, etc."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar Convite"}
        </Button>
      </div>
    </form>
  );
}
