import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Mail, 
  Shield,
  UserX,
  Calendar,
  Clock,
  Building,
  Briefcase,
  MoreHorizontal,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface UserDetail {
  id: string;
  user_id: string;
  email: string;
  display_name: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  role: "owner" | "admin" | "manager" | "member" | "viewer";
  department?: string;
  title?: string;
  joined_at: string;
  last_login_at?: string;
  phone?: string;
}

const roleLabels: Record<string, { label: string; color: string }> = {
  owner: { label: "Proprietário", color: "bg-purple-500" },
  admin: { label: "Administrador", color: "bg-blue-500" },
  manager: { label: "Gerente", color: "bg-green-500" },
  member: { label: "Membro", color: "bg-gray-500" },
  viewer: { label: "Visualizador", color: "bg-gray-400" },
};

// Mock data - in real app, fetch from API
const mockUserData: UserDetail = {
  id: "1",
  user_id: "user-1",
  email: "joao.silva@empresa.com.br",
  display_name: "João Silva",
  first_name: "João",
  last_name: "Silva",
  role: "admin",
  department: "Tecnologia",
  title: "Tech Lead",
  joined_at: "2024-02-15T10:00:00Z",
  last_login_at: "2026-01-15T08:30:00Z",
  phone: "(11) 99999-9999",
};

export function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail>(mockUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date?: string) => {
    if (!date) return "Nunca";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRoleChange = (newRole: string) => {
    setUser({ ...user, role: newRole as UserDetail["role"] });
    toast.success("Função atualizada!");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      toast.success("Dados atualizados com sucesso!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erro ao atualizar dados");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveUser = () => {
    toast.success("Usuário removido da organização!");
    navigate("/settings/users");
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/settings/users")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-heading">Detalhes do Usuário</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie informações do membro.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="card-3d md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {getInitials(user.display_name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold text-foreground">
                {user.display_name}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge
                variant="secondary"
                className={`${roleLabels[user.role].color} text-white mt-3`}
              >
                {roleLabels[user.role].label}
              </Badge>

              <Separator className="my-6" />

              <div className="w-full space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Departamento</p>
                    <p className="text-foreground">{user.department || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cargo</p>
                    <p className="text-foreground">{user.title || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Membro desde</p>
                    <p className="text-foreground">{formatDate(user.joined_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Último acesso</p>
                    <p className="text-foreground">
                      {formatDateTime(user.last_login_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details & Actions */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact Info */}
          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  {isEditing ? (
                    <Input
                      value={user.first_name}
                      onChange={(e) =>
                        setUser({ ...user, first_name: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground py-2">{user.first_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Sobrenome</Label>
                  {isEditing ? (
                    <Input
                      value={user.last_name}
                      onChange={(e) =>
                        setUser({ ...user, last_name: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground py-2">{user.last_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-foreground py-2">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  {isEditing ? (
                    <Input
                      value={user.phone || ""}
                      onChange={(e) =>
                        setUser({ ...user, phone: e.target.value })
                      }
                      placeholder="(00) 00000-0000"
                    />
                  ) : (
                    <p className="text-foreground py-2">{user.phone || "-"}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role & Permissions */}
          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Função e Permissões
              </CardTitle>
              <CardDescription>
                Defina o nível de acesso deste usuário na organização.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Função</Label>
                  <Select value={user.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label>Departamento</Label>
                  {isEditing ? (
                    <Input
                      value={user.department || ""}
                      onChange={(e) =>
                        setUser({ ...user, department: e.target.value })
                      }
                      placeholder="Ex: Tecnologia"
                    />
                  ) : (
                    <p className="text-foreground py-2">{user.department || "-"}</p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Cargo</Label>
                  {isEditing ? (
                    <Input
                      value={user.title || ""}
                      onChange={(e) =>
                        setUser({ ...user, title: e.target.value })
                      }
                      placeholder="Ex: Tech Lead"
                    />
                  ) : (
                    <p className="text-foreground py-2">{user.title || "-"}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="card-3d border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <UserX className="w-5 h-5" />
                Zona de Perigo
              </CardTitle>
              <CardDescription>
                Ações irreversíveis para este usuário.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <UserX className="w-4 h-4 mr-2" />
                    Remover da Organização
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover usuário?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. O usuário{" "}
                      <strong>{user.display_name}</strong> será removido da
                      organização e perderá acesso a todos os recursos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemoveUser}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
