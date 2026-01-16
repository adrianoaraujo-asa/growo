import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  Clock,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface Session {
  id: string;
  device: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

// Mock data
const mockSessions: Session[] = [
  {
    id: "1",
    device: "Chrome no Windows",
    deviceType: "desktop",
    browser: "Chrome 120",
    os: "Windows 11",
    ip: "189.123.45.67",
    location: "São Paulo, Brasil",
    lastActive: "2026-01-16T10:30:00Z",
    isCurrent: true,
  },
  {
    id: "2",
    device: "Safari no iPhone",
    deviceType: "mobile",
    browser: "Safari 17",
    os: "iOS 17.2",
    ip: "189.123.45.89",
    location: "São Paulo, Brasil",
    lastActive: "2026-01-15T18:45:00Z",
    isCurrent: false,
  },
  {
    id: "3",
    device: "Firefox no MacOS",
    deviceType: "desktop",
    browser: "Firefox 121",
    os: "macOS Sonoma",
    ip: "200.156.78.90",
    location: "Rio de Janeiro, Brasil",
    lastActive: "2026-01-14T09:15:00Z",
    isCurrent: false,
  },
  {
    id: "4",
    device: "Chrome no Android",
    deviceType: "mobile",
    browser: "Chrome 120",
    os: "Android 14",
    ip: "187.45.123.78",
    location: "Belo Horizonte, Brasil",
    lastActive: "2026-01-10T14:20:00Z",
    isCurrent: false,
  },
];

export function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [isLoading, setIsLoading] = useState(false);
  const [terminatingSessionId, setTerminatingSessionId] = useState<string | null>(null);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "desktop":
        return <Monitor className="w-5 h-5" />;
      case "mobile":
        return <Smartphone className="w-5 h-5" />;
      case "tablet":
        return <Tablet className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const formatLastActive = (date: string) => {
    const now = new Date();
    const activeDate = new Date(date);
    const diffMinutes = Math.floor(
      (now.getTime() - activeDate.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 1) return "Agora";
    if (diffMinutes < 60) return `${diffMinutes} minutos atrás`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} horas atrás`;
    if (diffMinutes < 2880) return "Ontem";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleTerminateSession = async (sessionId: string) => {
    setTerminatingSessionId(sessionId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSessions(sessions.filter((s) => s.id !== sessionId));
      toast.success("Sessão encerrada com sucesso!");
    } catch (error) {
      toast.error("Erro ao encerrar sessão");
    } finally {
      setTerminatingSessionId(null);
    }
  };

  const handleTerminateAllSessions = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSessions(sessions.filter((s) => s.isCurrent));
      toast.success("Todas as outras sessões foram encerradas!");
    } catch (error) {
      toast.error("Erro ao encerrar sessões");
    } finally {
      setIsLoading(false);
    }
  };

  const currentSession = sessions.find((s) => s.isCurrent);
  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Sessões Ativas</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie os dispositivos conectados à sua conta.
          </p>
        </div>
        {otherSessions.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Encerrar Todas
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Encerrar todas as sessões?</AlertDialogTitle>
                <AlertDialogDescription>
                  Todas as outras sessões serão encerradas. Você continuará
                  conectado apenas neste dispositivo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleTerminateAllSessions}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Encerrar Todas
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Current Session */}
      {currentSession && (
        <Card className="card-3d border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Sessão Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  {getDeviceIcon(currentSession.deviceType)}
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    {currentSession.device}
                  </h3>
                  <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      {currentSession.browser} • {currentSession.os}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {currentSession.location} • {currentSession.ip}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Ativo agora
                    </div>
                  </div>
                </div>
              </div>
              <Badge className="bg-green-500">Ativa</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Sessions */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Outras Sessões ({otherSessions.length})
          </CardTitle>
          <CardDescription>
            Dispositivos que acessaram sua conta recentemente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {otherSessions.length === 0 ? (
            <div className="py-8 text-center">
              <Monitor className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma outra sessão ativa
              </h3>
              <p className="text-muted-foreground">
                Você está conectado apenas neste dispositivo.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {otherSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-muted text-muted-foreground">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {session.device}
                      </h3>
                      <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          {session.browser} • {session.os}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {session.location} • {session.ip}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {formatLastActive(session.lastActive)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={terminatingSessionId === session.id}
                      >
                        {terminatingSessionId === session.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <LogOut className="w-4 h-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Encerrar sessão?</AlertDialogTitle>
                        <AlertDialogDescription>
                          A sessão em <strong>{session.device}</strong> será
                          encerrada e o dispositivo será desconectado.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleTerminateSession(session.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Encerrar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="card-3d border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="flex items-center gap-4 py-4">
          <AlertTriangle className="w-8 h-8 text-yellow-600 shrink-0" />
          <div>
            <p className="font-medium text-foreground">Não reconhece uma sessão?</p>
            <p className="text-sm text-muted-foreground">
              Se você identificar uma sessão desconhecida, encerre-a imediatamente
              e altere sua senha. Considere ativar a autenticação em duas etapas.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
