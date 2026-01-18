import { useState } from 'react';
import { Settings, Mail, CreditCard, Palette, Shield, Globe, Link, Share2, Save } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { FormCard } from '@/components/ui/form-card';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'general', label: 'Geral', icon: Settings },
  { id: 'email', label: 'Email/SMTP', icon: Mail },
  { id: 'payments', label: 'Pagamentos', icon: CreditCard },
  { id: 'appearance', label: 'Aparência', icon: Palette },
  { id: 'security', label: 'Segurança', icon: Shield },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <FormCard 
              title="Identidade"
              description="Informações básicas da aplicação"
              actions={<Button><Save className="h-4 w-4 mr-2" />Salvar</Button>}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da aplicação</Label>
                  <Input defaultValue="ASA Template" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição curta</Label>
                  <Input defaultValue="Plataforma SaaS moderna" />
                </div>
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">A</span>
                    </div>
                    <Button variant="outline">Upload</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">A</span>
                    </div>
                    <Button variant="outline">Upload</Button>
                  </div>
                </div>
              </div>
            </FormCard>

            <FormCard 
              title="URLs"
              description="Links importantes do sistema"
              actions={<Button><Save className="h-4 w-4 mr-2" />Salvar</Button>}
            >
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Globe className="h-4 w-4" />URL do sistema</Label>
                  <Input defaultValue="https://app.asatemplate.com" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Link className="h-4 w-4" />URL da documentação</Label>
                  <Input defaultValue="https://docs.asatemplate.com" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Link className="h-4 w-4" />URL do suporte</Label>
                  <Input defaultValue="https://support.asatemplate.com" />
                </div>
              </div>
            </FormCard>

            <FormCard 
              title="Redes Sociais"
              description="Links para redes sociais"
              actions={<Button><Save className="h-4 w-4 mr-2" />Salvar</Button>}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Twitter/X</Label>
                  <Input placeholder="https://twitter.com/..." />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input placeholder="https://linkedin.com/company/..." />
                </div>
                <div className="space-y-2">
                  <Label>GitHub</Label>
                  <Input placeholder="https://github.com/..." />
                </div>
              </div>
            </FormCard>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <FormCard 
              title="Servidor SMTP"
              description="Configurações do servidor de email"
              actions={
                <>
                  <Button variant="outline">Testar Conexão</Button>
                  <Button><Save className="h-4 w-4 mr-2" />Salvar</Button>
                </>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Host</Label>
                  <Input placeholder="smtp.example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Porta</Label>
                  <Input placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label>Usuário</Label>
                  <Input placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Senha</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <Switch id="use-tls" />
                  <Label htmlFor="use-tls">Usar TLS</Label>
                </div>
              </div>
            </FormCard>

            <FormCard 
              title="Remetente Padrão"
              description="Configurações do remetente de emails"
              actions={<Button><Save className="h-4 w-4 mr-2" />Salvar</Button>}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do remetente</Label>
                  <Input defaultValue="ASA Template" />
                </div>
                <div className="space-y-2">
                  <Label>Email do remetente</Label>
                  <Input type="email" defaultValue="noreply@asatemplate.com" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Reply-to</Label>
                  <Input type="email" defaultValue="support@asatemplate.com" />
                </div>
              </div>
            </FormCard>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <FormCard 
              title="Gateway Principal"
              description="Configurações do gateway de pagamento"
              actions={
                <>
                  <Button variant="outline">Testar Conexão</Button>
                  <Button><Save className="h-4 w-4 mr-2" />Salvar</Button>
                </>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select defaultValue="stripe">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="pagseguro">PagSeguro</SelectItem>
                      <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ambiente</Label>
                  <Select defaultValue="sandbox">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="production">Produção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input type="password" placeholder="pk_test_..." />
                </div>
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <Input type="password" placeholder="sk_test_..." />
                </div>
              </div>
            </FormCard>

            <FormCard 
              title="Configurações"
              description="Opções gerais de pagamento"
              actions={<Button><Save className="h-4 w-4 mr-2" />Salvar</Button>}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Moeda padrão</Label>
                  <Select defaultValue="BRL">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">BRL - Real</SelectItem>
                      <SelectItem value="USD">USD - Dólar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Dias para vencimento</Label>
                  <Input type="number" defaultValue="7" />
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="auto-retry" defaultChecked />
                  <Label htmlFor="auto-retry">Retry automático</Label>
                </div>
                <div className="space-y-2">
                  <Label>Número de retries</Label>
                  <Input type="number" defaultValue="3" />
                </div>
              </div>
            </FormCard>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <FormCard 
              title="Autenticação"
              description="Configurações de segurança de login"
              actions={<Button><Save className="h-4 w-4 mr-2" />Salvar</Button>}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Exigir MFA para admins</Label>
                    <p className="text-sm text-muted-foreground">Administradores devem usar autenticação de dois fatores</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Login social (Google)</Label>
                    <p className="text-sm text-muted-foreground">Permitir login com Google</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Login social (Microsoft)</Label>
                    <p className="text-sm text-muted-foreground">Permitir login com Microsoft</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </FormCard>

            <FormCard 
              title="Sessões"
              description="Configurações de sessão do usuário"
              actions={<Button><Save className="h-4 w-4 mr-2" />Salvar</Button>}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tempo de sessão (minutos)</Label>
                  <Input type="number" defaultValue="60" />
                </div>
                <div className="space-y-2">
                  <Label>Máximo de sessões simultâneas</Label>
                  <Input type="number" defaultValue="5" />
                </div>
                <div className="flex items-center gap-3 col-span-2">
                  <Switch id="remember-me" defaultChecked />
                  <Label htmlFor="remember-me">Permitir "Lembrar de mim"</Label>
                </div>
              </div>
            </FormCard>

            <FormCard 
              title="Rate Limiting"
              description="Proteção contra ataques de força bruta"
              actions={<Button><Save className="h-4 w-4 mr-2" />Salvar</Button>}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tentativas de login</Label>
                  <Input type="number" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label>Tempo de bloqueio (minutos)</Label>
                  <Input type="number" defaultValue="15" />
                </div>
              </div>
            </FormCard>
          </div>
        );

      default:
        return (
          <Card className="card-3d p-8 text-center text-muted-foreground">
            Conteúdo da aba "{activeTab}" será implementado
          </Card>
        );
    }
  };

  return (
    <div className="p-6">
      <PageHeader 
        title="Configurações" 
        description="Configurações globais da plataforma"
      />

      <div className="flex gap-6 mt-6">
        {/* Vertical Tabs */}
        <Card className="card-3d w-64 h-fit flex-shrink-0">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                    activeTab === tab.id 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
