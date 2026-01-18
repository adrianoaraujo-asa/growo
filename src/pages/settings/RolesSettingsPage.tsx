import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Shield, 
  Users,
  Edit,
  Trash2,
  Crown,
  UserCog,
  Eye,
  Lock,
} from "lucide-react";

// Mock roles data
const mockRoles = [
  {
    id: "owner",
    name: "Owner",
    description: "Dono da organização com acesso total",
    color: "warning",
    isSystem: true,
    usersCount: 12,
    permissions: {
      organization: { view: true, edit: true, delete: true },
      users: { view: true, edit: true, delete: true, invite: true },
      billing: { view: true, edit: true },
      settings: { view: true, edit: true },
      documents: { view: true, edit: true, delete: true },
      api: { view: true, edit: true },
    },
  },
  {
    id: "admin",
    name: "Admin",
    description: "Administrador com amplos poderes",
    color: "info",
    isSystem: true,
    usersCount: 28,
    permissions: {
      organization: { view: true, edit: true, delete: false },
      users: { view: true, edit: true, delete: false, invite: true },
      billing: { view: true, edit: false },
      settings: { view: true, edit: true },
      documents: { view: true, edit: true, delete: true },
      api: { view: true, edit: false },
    },
  },
  {
    id: "manager",
    name: "Manager",
    description: "Gerente de equipe",
    color: "success",
    isSystem: true,
    usersCount: 45,
    permissions: {
      organization: { view: true, edit: false, delete: false },
      users: { view: true, edit: false, delete: false, invite: true },
      billing: { view: false, edit: false },
      settings: { view: true, edit: false },
      documents: { view: true, edit: true, delete: false },
      api: { view: false, edit: false },
    },
  },
  {
    id: "member",
    name: "Member",
    description: "Membro padrão da organização",
    color: "primary",
    isSystem: true,
    usersCount: 156,
    permissions: {
      organization: { view: true, edit: false, delete: false },
      users: { view: true, edit: false, delete: false, invite: false },
      billing: { view: false, edit: false },
      settings: { view: false, edit: false },
      documents: { view: true, edit: true, delete: false },
      api: { view: false, edit: false },
    },
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Acesso somente leitura",
    color: "muted",
    isSystem: true,
    usersCount: 67,
    permissions: {
      organization: { view: true, edit: false, delete: false },
      users: { view: true, edit: false, delete: false, invite: false },
      billing: { view: false, edit: false },
      settings: { view: false, edit: false },
      documents: { view: true, edit: false, delete: false },
      api: { view: false, edit: false },
    },
  },
];

const permissionModules = [
  { key: "organization", label: "Organização", actions: ["view", "edit", "delete"] },
  { key: "users", label: "Usuários", actions: ["view", "edit", "delete", "invite"] },
  { key: "billing", label: "Financeiro", actions: ["view", "edit"] },
  { key: "settings", label: "Configurações", actions: ["view", "edit"] },
  { key: "documents", label: "Documentos", actions: ["view", "edit", "delete"] },
  { key: "api", label: "API", actions: ["view", "edit"] },
];

const actionLabels: Record<string, string> = {
  view: "Ver",
  edit: "Editar",
  delete: "Excluir",
  invite: "Convidar",
};

const colorMap: Record<string, string> = {
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-info/10 text-info border-info/20",
  success: "bg-success/10 text-success border-success/20",
  primary: "bg-primary/10 text-primary border-primary/20",
  muted: "bg-muted text-muted-foreground border-muted",
};

const iconMap: Record<string, React.ElementType> = {
  owner: Crown,
  admin: Shield,
  manager: UserCog,
  member: Users,
  viewer: Eye,
};

export default function RolesSettingsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<typeof mockRoles[0] | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Papéis e Permissões"
        description="Gerencie os papéis e níveis de acesso da sua organização"
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Papel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Papel</DialogTitle>
                <DialogDescription>
                  Crie um papel personalizado com permissões específicas
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome do Papel</Label>
                  <Input placeholder="Ex: Coordenador" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea placeholder="Descreva as responsabilidades..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreateOpen(false)}>
                  Criar Papel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Roles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockRoles.map((role) => {
          const Icon = iconMap[role.id] || Shield;
          return (
            <Card 
              key={role.id} 
              className={`card-3d cursor-pointer transition-all hover:ring-2 hover:ring-primary/20 ${selectedRole?.id === role.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedRole(role)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${colorMap[role.color]?.split(' ')[0] || 'bg-muted'}`}>
                      <Icon className={`h-5 w-5 ${colorMap[role.color]?.split(' ')[1] || 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {role.name}
                        {role.isSystem && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {role.usersCount} usuários
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={colorMap[role.color]}>
                    {role.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {role.description}
                </p>
                {!role.isSystem && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Edit className="h-3 w-3" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      {selectedRole && (
        <Card className="card-3d">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Matriz de Permissões: {selectedRole.name}
                  {selectedRole.isSystem && (
                    <Badge variant="secondary" className="gap-1">
                      <Lock className="h-3 w-3" />
                      Sistema
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedRole.description}
                </CardDescription>
              </div>
              {!selectedRole.isSystem && (
                <Button variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Editar Permissões
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[200px]">Módulo</TableHead>
                    {["view", "edit", "delete", "invite"].map((action) => (
                      <TableHead key={action} className="text-center w-[100px]">
                        {actionLabels[action]}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionModules.map((module) => {
                    const modulePermissions = selectedRole.permissions[module.key as keyof typeof selectedRole.permissions] || {};
                    return (
                      <TableRow key={module.key}>
                        <TableCell className="font-medium">{module.label}</TableCell>
                        {["view", "edit", "delete", "invite"].map((action) => (
                          <TableCell key={action} className="text-center">
                            {module.actions.includes(action) ? (
                              <Checkbox 
                                checked={modulePermissions[action as keyof typeof modulePermissions] || false}
                                disabled={selectedRole.isSystem}
                              />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
