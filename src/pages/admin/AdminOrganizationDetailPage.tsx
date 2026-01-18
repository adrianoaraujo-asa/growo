import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, MapPin, Phone, Users, CreditCard, FileText, Wallet, Webhook, Key, History, Mail, Globe, Calendar, Clock } from 'lucide-react';
import { DetailPageLayout } from '@/components/layouts/DetailPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormCard } from '@/components/ui/form-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

// Mock data
const organization = {
  id: '1',
  name: 'Acme Corporation',
  legalName: 'Acme Corporation LTDA',
  document: '12.345.678/0001-90',
  email: 'contato@acme.com',
  phone: '(11) 3333-4444',
  website: 'https://acme.com',
  industry: 'Tecnologia',
  size: '51-200',
  status: 'active',
  createdAt: '2025-01-15T10:30:00',
  lastAccess: '2025-01-18T14:32:00',
  plan: {
    name: 'Pro',
    price: 99,
    usersLimit: 25,
    usersUsed: 15,
    storageLimit: 10,
    storageUsed: 3.2,
    renewsAt: '2025-02-15',
  },
};

const users = [
  { id: '1', name: 'João Silva', email: 'joao@acme.com', role: 'Owner', status: 'active', lastAccess: '2025-01-18' },
  { id: '2', name: 'Maria Santos', email: 'maria@acme.com', role: 'Admin', status: 'active', lastAccess: '2025-01-17' },
  { id: '3', name: 'Pedro Costa', email: 'pedro@acme.com', role: 'Member', status: 'active', lastAccess: '2025-01-16' },
];

const invoices = [
  { id: 'INV-001', date: '2025-01-15', amount: 99, status: 'paid' },
  { id: 'INV-002', date: '2024-12-15', amount: 99, status: 'paid' },
  { id: 'INV-003', date: '2024-11-15', amount: 99, status: 'paid' },
];

const tabs = [
  { id: 'account', label: 'Conta', icon: Building2, href: '/admin/organizations/1' },
  { id: 'addresses', label: 'Endereços', icon: MapPin, href: '/admin/organizations/1/addresses' },
  { id: 'contacts', label: 'Contatos', icon: Phone, href: '/admin/organizations/1/contacts' },
  { id: 'users', label: 'Usuários', icon: Users, href: '/admin/organizations/1/users' },
  { id: 'subscription', label: 'Assinatura', icon: CreditCard, href: '/admin/organizations/1/subscription' },
  { id: 'invoices', label: 'Faturas', icon: FileText, href: '/admin/organizations/1/invoices' },
  { id: 'payment-methods', label: 'Pagamentos', icon: Wallet, href: '/admin/organizations/1/payment-methods' },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook, href: '/admin/organizations/1/webhooks' },
  { id: 'api-keys', label: 'API Keys', icon: Key, href: '/admin/organizations/1/api-keys' },
  { id: 'logs', label: 'Logs', icon: History, href: '/admin/organizations/1/logs' },
];

const userColumns: ColumnDef<typeof users[0]>[] = [
  { accessorKey: 'name', header: 'Nome' },
  { accessorKey: 'email', header: 'Email' },
  { 
    accessorKey: 'role', 
    header: 'Papel',
    cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>
  },
  { 
    accessorKey: 'status', 
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant="default" className="bg-success/10 text-success border-success/20">
        Ativo
      </Badge>
    )
  },
  { accessorKey: 'lastAccess', header: 'Último acesso' },
];

const invoiceColumns: ColumnDef<typeof invoices[0]>[] = [
  { accessorKey: 'id', header: 'Número' },
  { accessorKey: 'date', header: 'Data' },
  { 
    accessorKey: 'amount', 
    header: 'Valor',
    cell: ({ row }) => `R$ ${row.original.amount.toLocaleString('pt-BR')}`
  },
  { 
    accessorKey: 'status', 
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant="default" className="bg-success/10 text-success border-success/20">
        Paga
      </Badge>
    )
  },
];

export default function AdminOrganizationDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('account');

  const sidebar = {
    avatar: undefined,
    title: organization.name,
    subtitle: organization.legalName,
    status: { label: 'Ativo', variant: 'success' as const },
    details: [
      { label: 'CNPJ', value: organization.document },
      { label: 'Email', value: organization.email },
      { label: 'Telefone', value: organization.phone },
      { label: 'Criado em', value: new Date(organization.createdAt).toLocaleDateString('pt-BR') },
      { label: 'Último acesso', value: 'Hoje, 14:32' },
    ],
    actions: [
      { label: 'Editar', onClick: () => console.log('edit'), variant: 'outline' as const },
      { label: 'Suspender', onClick: () => console.log('suspend'), variant: 'destructive' as const },
    ],
  };

  const secondaryCard = (
    <Card className="card-3d">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Plano: {organization.plan.name}</span>
          <Badge variant="outline">R$ {organization.plan.price}/mês</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Renova em: {new Date(organization.plan.renewsAt).toLocaleDateString('pt-BR')}
        </p>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Usuários: {organization.plan.usersUsed}/{organization.plan.usersLimit}</span>
              <span>{Math.round((organization.plan.usersUsed / organization.plan.usersLimit) * 100)}%</span>
            </div>
            <Progress value={(organization.plan.usersUsed / organization.plan.usersLimit) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Storage: {organization.plan.storageUsed}/{organization.plan.storageLimit}GB</span>
              <span>{Math.round((organization.plan.storageUsed / organization.plan.storageLimit) * 100)}%</span>
            </div>
            <Progress value={(organization.plan.storageUsed / organization.plan.storageLimit) * 100} className="h-2" />
          </div>
        </div>

        <Button variant="outline" className="w-full" size="sm">
          Alterar Plano
        </Button>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <FormCard 
              title="Dados da Empresa"
              actions={
                <>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar</Button>
                </>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Fantasia</Label>
                  <Input defaultValue={organization.name} />
                </div>
                <div className="space-y-2">
                  <Label>Razão Social</Label>
                  <Input defaultValue={organization.legalName} />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input defaultValue={organization.document} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" defaultValue={organization.email} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input defaultValue={organization.phone} />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input defaultValue={organization.website} />
                </div>
                <div className="space-y-2">
                  <Label>Segmento</Label>
                  <Select defaultValue={organization.industry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Saude">Saúde</SelectItem>
                      <SelectItem value="Educacao">Educação</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tamanho</Label>
                  <Select defaultValue={organization.size}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 funcionários</SelectItem>
                      <SelectItem value="11-50">11-50 funcionários</SelectItem>
                      <SelectItem value="51-200">51-200 funcionários</SelectItem>
                      <SelectItem value="201-500">201-500 funcionários</SelectItem>
                      <SelectItem value="500+">Mais de 500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FormCard>

            <FormCard title="Configurações Regionais">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="America/Sao_Paulo">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">America/São Paulo</SelectItem>
                      <SelectItem value="America/Manaus">America/Manaus</SelectItem>
                      <SelectItem value="America/Recife">America/Recife</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select defaultValue="pt-BR">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Moeda</Label>
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
              </div>
            </FormCard>
          </div>
        );
      case 'users':
        return <DataTable columns={userColumns} data={users} />;
      case 'invoices':
        return <DataTable columns={invoiceColumns} data={invoices} />;
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
      <DetailPageLayout
        sidebar={sidebar}
        secondaryCard={secondaryCard}
        tabs={tabs}
        activeTab={activeTab}
      >
        {renderTabContent()}
      </DetailPageLayout>
    </div>
  );
}
