import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { 
  Search, 
  Book,
  MessageCircle,
  FileText,
  Video,
  Zap,
  Users,
  CreditCard,
  Settings,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// FAQ data
const faqItems = [
  {
    category: "getting-started",
    question: "Como faço para criar minha primeira organização?",
    answer: "Após fazer login, você será guiado pelo processo de onboarding. Clique em 'Criar Organização' no dashboard e preencha os dados básicos como nome, CNPJ e endereço. Você pode adicionar mais informações posteriormente nas configurações."
  },
  {
    category: "getting-started",
    question: "Como convido membros para minha equipe?",
    answer: "Acesse Configurações > Equipe > Convidar. Digite o email do novo membro, selecione o papel (Admin, Manager, Member ou Viewer) e clique em Enviar Convite. O convidado receberá um email com link para criar sua conta."
  },
  {
    category: "billing",
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos cartões de crédito (Visa, Mastercard, Amex), boleto bancário e PIX. Para planos Enterprise, também oferecemos faturamento mensal com nota fiscal."
  },
  {
    category: "billing",
    question: "Como faço para cancelar minha assinatura?",
    answer: "Você pode cancelar a qualquer momento em Configurações > Financeiro > Assinatura. O cancelamento será efetivado ao final do período já pago. Seus dados ficam disponíveis por 30 dias após o cancelamento."
  },
  {
    category: "documents",
    question: "Posso compartilhar documentos com pessoas fora da organização?",
    answer: "Sim! Use o botão 'Compartilhar' no documento e gere um link público. Você pode definir permissões (apenas visualização ou edição), prazo de expiração e proteção por senha."
  },
  {
    category: "security",
    question: "Meus dados estão seguros?",
    answer: "Absolutamente. Utilizamos criptografia AES-256 para dados em repouso, TLS 1.3 para transmissão, e seguimos as melhores práticas de segurança. Nossos servidores ficam em data centers certificados SOC 2 e ISO 27001."
  },
  {
    category: "security",
    question: "Como ativo a autenticação de dois fatores?",
    answer: "Acesse Meu Perfil > Segurança > Autenticação de Dois Fatores. Você pode usar um app autenticador (Google Authenticator, Authy) ou receber códigos por SMS."
  },
  {
    category: "integrations",
    question: "Quais integrações estão disponíveis?",
    answer: "Oferecemos integrações nativas com Slack, GitHub, Google Calendar, Stripe e muito mais. Também disponibilizamos uma API REST completa e webhooks para integrações customizadas."
  },
];

const categories = [
  { id: "getting-started", label: "Primeiros Passos", icon: Zap, count: 2 },
  { id: "documents", label: "Documentos", icon: FileText, count: 1 },
  { id: "billing", label: "Pagamentos", icon: CreditCard, count: 2 },
  { id: "security", label: "Segurança", icon: Shield, count: 2 },
  { id: "integrations", label: "Integrações", icon: Settings, count: 1 },
];

const helpResources = [
  {
    title: "Documentação",
    description: "Guias completos e referência da API",
    icon: Book,
    href: "#",
    badge: "Novo",
  },
  {
    title: "Tutoriais em Vídeo",
    description: "Aprenda visualmente com nossos vídeos",
    icon: Video,
    href: "#",
  },
  {
    title: "Comunidade",
    description: "Conecte-se com outros usuários",
    icon: Users,
    href: "#",
  },
  {
    title: "Status do Sistema",
    description: "Verifique a disponibilidade dos serviços",
    icon: Sparkles,
    href: "#",
    badge: "Operacional",
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaq = faqItems.filter((item) => {
    const matchesSearch = 
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Central de Ajuda"
        description="Encontre respostas para suas dúvidas"
        action={
          <Button asChild className="gap-2">
            <Link to="/help/contact">
              <MessageCircle className="h-4 w-4" />
              Falar com Suporte
            </Link>
          </Button>
        }
      />

      {/* Search */}
      <Card className="card-3d bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="pt-6">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-semibold">Como podemos ajudar?</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar artigos, tutoriais e FAQs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {helpResources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.title} className="card-3d hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  {resource.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {resource.badge}
                    </Badge>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold flex items-center gap-2 group-hover:text-primary transition-colors">
                    {resource.title}
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {resource.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <Card className="card-3d lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Categorias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <Button
              variant={selectedCategory === null ? "secondary" : "ghost"}
              className="w-full justify-between"
              onClick={() => setSelectedCategory(null)}
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Todas
              </span>
              <Badge variant="outline">{faqItems.length}</Badge>
            </Button>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "secondary" : "ghost"}
                  className="w-full justify-between"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </span>
                  <Badge variant="outline">{category.count}</Badge>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="card-3d lg:col-span-3">
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
            <CardDescription>
              {filteredFaq.length} {filteredFaq.length === 1 ? "resultado" : "resultados"} encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFaq.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaq.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-8 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg">Nenhum resultado encontrado</h3>
                <p className="text-muted-foreground mt-1">
                  Tente buscar com outras palavras ou entre em contato com o suporte.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/help/contact">Falar com Suporte</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact CTA */}
      <Card className="card-3d bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-primary/10">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Não encontrou o que procurava?</h3>
                <p className="text-muted-foreground">
                  Nossa equipe de suporte está pronta para ajudar.
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="gap-2">
              <Link to="/help/contact">
                Entrar em Contato
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
