import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Mail, 
  UserPlus,
  Loader2,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const roleDescriptions: Record<string, string> = {
  admin: "Pode gerenciar usuários, configurações e todos os recursos da organização.",
  manager: "Pode gerenciar projetos e equipes, mas não configurações da organização.",
  member: "Pode acessar e contribuir em projetos aos quais foi atribuído.",
  viewer: "Pode apenas visualizar informações, sem permissão de edição.",
};

export function UserInvitePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "member",
    department: "",
    title: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Convite enviado para ${formData.email}!`);
      navigate("/settings/users");
    } catch (error) {
      toast.error("Erro ao enviar convite");
    } finally {
      setIsLoading(false);
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/settings/users")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-heading">Convidar Usuário</h1>
          <p className="text-muted-foreground">
            Envie um convite para um novo membro da organização.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Dados do Convite
              </CardTitle>
              <CardDescription>
                Preencha as informações do novo membro.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com.br"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    O convite será enviado para este email.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Função *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
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
                  <p className="text-xs text-muted-foreground">
                    {roleDescriptions[formData.role]}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      placeholder="Ex: Tecnologia, RH, etc."
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Cargo</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Desenvolvedor, Analista, etc."
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem Personalizada</Label>
                  <Textarea
                    id="message"
                    placeholder="Adicione uma mensagem personalizada ao convite (opcional)"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/settings/users")}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Convite
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="card-3d border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Como funciona?
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>
                      1. O usuário receberá um email com o link de convite.
                    </li>
                    <li>
                      2. O convite expira em 7 dias se não for aceito.
                    </li>
                    <li>
                      3. Após aceitar, o usuário terá acesso imediato.
                    </li>
                    <li>
                      4. Você pode gerenciar permissões a qualquer momento.
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="text-base">Funções Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(roleDescriptions).map(([role, description]) => (
                <div key={role}>
                  <p className="font-medium text-foreground capitalize">
                    {role === "admin"
                      ? "Administrador"
                      : role === "manager"
                      ? "Gerente"
                      : role === "member"
                      ? "Membro"
                      : "Visualizador"}
                  </p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
