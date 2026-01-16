import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  DollarSign,
  Settings,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface NotificationSetting {
  id: string;
  category: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

interface NotificationPreferences {
  emailDigest: "realtime" | "daily" | "weekly" | "never";
  quietHoursStart: string;
  quietHoursEnd: string;
  quietHoursEnabled: boolean;
}

// Mock data
const mockNotificationSettings: NotificationSetting[] = [
  {
    id: "1",
    category: "projects",
    label: "Atualizações de Projetos",
    description: "Notificações sobre mudanças em projetos que você participa.",
    email: true,
    push: true,
    inApp: true,
  },
  {
    id: "2",
    category: "tasks",
    label: "Atribuição de Tarefas",
    description: "Quando uma tarefa for atribuída a você.",
    email: true,
    push: true,
    inApp: true,
  },
  {
    id: "3",
    category: "comments",
    label: "Comentários e Menções",
    description: "Quando alguém comentar ou mencionar você.",
    email: true,
    push: true,
    inApp: true,
  },
  {
    id: "4",
    category: "team",
    label: "Atividades da Equipe",
    description: "Novos membros, atualizações de função e saídas.",
    email: false,
    push: false,
    inApp: true,
  },
  {
    id: "5",
    category: "billing",
    label: "Faturamento e Pagamentos",
    description: "Faturas, pagamentos e alertas de assinatura.",
    email: true,
    push: false,
    inApp: true,
  },
  {
    id: "6",
    category: "security",
    label: "Segurança",
    description: "Alertas de login e alterações de segurança.",
    email: true,
    push: true,
    inApp: true,
  },
  {
    id: "7",
    category: "marketing",
    label: "Novidades e Atualizações",
    description: "Novos recursos, dicas e conteúdo do blog.",
    email: false,
    push: false,
    inApp: false,
  },
];

const mockPreferences: NotificationPreferences = {
  emailDigest: "daily",
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  quietHoursEnabled: true,
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "projects":
      return <FileText className="w-5 h-5" />;
    case "tasks":
      return <Calendar className="w-5 h-5" />;
    case "comments":
      return <MessageSquare className="w-5 h-5" />;
    case "team":
      return <Users className="w-5 h-5" />;
    case "billing":
      return <DollarSign className="w-5 h-5" />;
    case "security":
      return <Settings className="w-5 h-5" />;
    case "marketing":
      return <Bell className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

export function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>(mockNotificationSettings);
  const [preferences, setPreferences] = useState<NotificationPreferences>(mockPreferences);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (
    settingId: string,
    channel: "email" | "push" | "inApp"
  ) => {
    setSettings(
      settings.map((s) =>
        s.id === settingId ? { ...s, [channel]: !s[channel] } : s
      )
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Preferências salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar preferências");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableAll = (channel: "email" | "push" | "inApp") => {
    setSettings(settings.map((s) => ({ ...s, [channel]: true })));
  };

  const handleDisableAll = (channel: "email" | "push" | "inApp") => {
    setSettings(settings.map((s) => ({ ...s, [channel]: false })));
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
          <h1 className="text-2xl font-semibold text-heading">
            Preferências de Notificação
          </h1>
          <p className="text-muted-foreground">
            Configure como e quando deseja receber notificações.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salvar Alterações
        </Button>
      </div>

      {/* Delivery Preferences */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>
            Configure suas preferências gerais de entrega.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Resumo por Email</Label>
              <Select
                value={preferences.emailDigest}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    emailDigest: value as NotificationPreferences["emailDigest"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Em tempo real</SelectItem>
                  <SelectItem value="daily">Resumo diário</SelectItem>
                  <SelectItem value="weekly">Resumo semanal</SelectItem>
                  <SelectItem value="never">Nunca</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Frequência de envio de resumos por email.
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Horário Silencioso</Label>
                <p className="text-sm text-muted-foreground">
                  Pausar notificações push durante determinado horário.
                </p>
              </div>
              <Switch
                checked={preferences.quietHoursEnabled}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, quietHoursEnabled: checked })
                }
              />
            </div>
            {preferences.quietHoursEnabled && (
              <div className="grid gap-4 md:grid-cols-2 pl-4 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label>Início</Label>
                  <Select
                    value={preferences.quietHoursStart}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, quietHoursStart: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={`${String(i).padStart(2, "0")}:00`}
                        >
                          {`${String(i).padStart(2, "0")}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fim</Label>
                  <Select
                    value={preferences.quietHoursEnd}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, quietHoursEnd: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={`${String(i).padStart(2, "0")}:00`}
                        >
                          {`${String(i).padStart(2, "0")}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Categorias de Notificação
          </CardTitle>
          <CardDescription>
            Escolha como deseja ser notificado para cada categoria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Channel Headers */}
          <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 mb-4 pb-4 border-b">
            <div></div>
            <div className="flex flex-col items-center gap-1 w-16">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Email</span>
            </div>
            <div className="flex flex-col items-center gap-1 w-16">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Push</span>
            </div>
            <div className="flex flex-col items-center gap-1 w-16">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">In-App</span>
            </div>
          </div>

          {/* Settings List */}
          <div className="space-y-4">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center py-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                    {getCategoryIcon(setting.category)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center w-16">
                  <Switch
                    checked={setting.email}
                    onCheckedChange={() => handleToggle(setting.id, "email")}
                  />
                </div>
                <div className="flex justify-center w-16">
                  <Switch
                    checked={setting.push}
                    onCheckedChange={() => handleToggle(setting.id, "push")}
                  />
                </div>
                <div className="flex justify-center w-16">
                  <Switch
                    checked={setting.inApp}
                    onCheckedChange={() => handleToggle(setting.id, "inApp")}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
            <span className="text-sm text-muted-foreground mr-2">Ações rápidas:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEnableAll("email")}
            >
              <Mail className="w-3 h-3 mr-1" />
              Ativar todos emails
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDisableAll("email")}
            >
              <Mail className="w-3 h-3 mr-1" />
              Desativar emails
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEnableAll("push")}
            >
              <Smartphone className="w-3 h-3 mr-1" />
              Ativar push
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDisableAll("push")}
            >
              <Smartphone className="w-3 h-3 mr-1" />
              Desativar push
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
