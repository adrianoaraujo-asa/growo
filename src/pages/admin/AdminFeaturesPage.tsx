import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Sparkles, 
  ToggleLeft,
  Users,
  Zap,
  Lock,
  Unlock,
  Settings,
  Code,
  FileText,
  Building2,
  Calendar,
} from "lucide-react";

// Mock features data
const mockFeatures = [
  {
    id: "1",
    name: "Documentos",
    slug: "documents",
    description: "Sistema de documentação colaborativa tipo Wiki/Notion",
    icon: FileText,
    isEnabled: true,
    isPublic: true,
    plans: ["starter", "pro", "enterprise"],
    usersCount: 156,
  },
  {
    id: "2",
    name: "Organizações",
    slug: "organizations",
    description: "Gerenciamento de organizações e multi-tenancy",
    icon: Building2,
    isEnabled: true,
    isPublic: true,
    plans: ["pro", "enterprise"],
    usersCount: 89,
  },
  {
    id: "3",
    name: "API Access",
    slug: "api_access",
    description: "Acesso à API REST para integrações",
    icon: Code,
    isEnabled: true,
    isPublic: false,
    plans: ["enterprise"],
    usersCount: 34,
  },
  {
    id: "4",
    name: "Calendário",
    slug: "calendar",
    description: "Calendário integrado com eventos e lembretes",
    icon: Calendar,
    isEnabled: false,
    isPublic: false,
    plans: [],
    usersCount: 0,
  },
  {
    id: "5",
    name: "Automações",
    slug: "automations",
    description: "Workflows automatizados e integrações",
    icon: Zap,
    isEnabled: false,
    isPublic: false,
    plans: [],
    usersCount: 0,
  },
];

const planBadgeColors: Record<string, string> = {
  starter: "bg-muted text-muted-foreground",
  pro: "bg-primary/10 text-primary",
  enterprise: "bg-warning/10 text-warning",
};

export default function AdminFeaturesPage() {
  const [search, setSearch] = useState("");
  const [features, setFeatures] = useState(mockFeatures);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredFeatures = features.filter((feature) =>
    feature.name.toLowerCase().includes(search.toLowerCase()) ||
    feature.slug.toLowerCase().includes(search.toLowerCase())
  );

  const enabledCount = features.filter(f => f.isEnabled).length;
  const disabledCount = features.filter(f => !f.isEnabled).length;

  const toggleFeature = (id: string) => {
    setFeatures(prev => 
      prev.map(f => f.id === id ? { ...f, isEnabled: !f.isEnabled } : f)
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Features & Recursos"
        description="Gerencie os recursos disponíveis na plataforma"
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Feature
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nova Feature</DialogTitle>
                <DialogDescription>
                  Adicione um novo recurso à plataforma
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input placeholder="Ex: Relatórios Avançados" />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input placeholder="Ex: advanced_reports" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea placeholder="Descreva o recurso..." />
                </div>
                <div className="space-y-2">
                  <Label>Planos</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione os planos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Habilitado por padrão</Label>
                  <Switch />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreateOpen(false)}>
                  Criar Feature
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-3d">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{features.length}</p>
                <p className="text-sm text-muted-foreground">Total de Features</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-3d">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <Unlock className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{enabledCount}</p>
                <p className="text-sm text-muted-foreground">Habilitadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-3d">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{disabledCount}</p>
                <p className="text-sm text-muted-foreground">Desabilitadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar features..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.id} className={`card-3d transition-all ${!feature.isEnabled && 'opacity-60'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${feature.isEnabled ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Icon className={`h-5 w-5 ${feature.isEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{feature.name}</CardTitle>
                      <code className="text-xs text-muted-foreground">{feature.slug}</code>
                    </div>
                  </div>
                  <Switch
                    checked={feature.isEnabled}
                    onCheckedChange={() => toggleFeature(feature.id)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Planos:</span>
                  <div className="flex gap-1">
                    {feature.plans.length > 0 ? (
                      feature.plans.map((plan) => (
                        <Badge key={plan} variant="secondary" className={`text-xs ${planBadgeColors[plan]}`}>
                          {plan}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Nenhum</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Usuários ativos:</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{feature.usersCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Visibilidade:</span>
                  <Badge variant="outline" className={feature.isPublic ? 'text-success border-success/20' : ''}>
                    {feature.isPublic ? 'Pública' : 'Privada'}
                  </Badge>
                </div>

                <div className="pt-2 border-t">
                  <Button variant="ghost" size="sm" className="w-full gap-2">
                    <Settings className="h-4 w-4" />
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
