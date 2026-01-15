import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Check, 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  Clock, 
  FileText,
  ChevronDown,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Features data
const features = [
  {
    icon: Users,
    title: "Multi-Tenant",
    description: "Gerencie múltiplas organizações com isolamento completo de dados e permissões granulares."
  },
  {
    icon: FileText,
    title: "Documentação Wiki",
    description: "Editor Markdown colaborativo estilo Notion com histórico de versões e compartilhamento."
  },
  {
    icon: Shield,
    title: "Segurança Avançada",
    description: "Autenticação MFA, SSO, controle de sessões e políticas de acesso por role."
  },
  {
    icon: BarChart3,
    title: "Analytics Integrado",
    description: "Dashboards personalizáveis com métricas em tempo real e relatórios exportáveis."
  },
  {
    icon: Zap,
    title: "API & Webhooks",
    description: "Integre com qualquer sistema através de nossa API RESTful e webhooks configuráveis."
  },
  {
    icon: Clock,
    title: "Automações",
    description: "Fluxos de trabalho automatizados com triggers e ações personalizáveis."
  }
];

// Plans data
const plans = [
  {
    id: "free",
    name: "Free",
    description: "Para começar e testar",
    price: { monthly: 0, yearly: 0 },
    features: [
      "1 usuário",
      "1 organização",
      "100 documentos",
      "1GB de armazenamento",
      "Suporte por email"
    ],
    cta: "Começar Grátis",
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    description: "Para equipes em crescimento",
    price: { monthly: 49.90, yearly: 479 },
    features: [
      "5 usuários",
      "3 organizações",
      "Documentos ilimitados",
      "10GB de armazenamento",
      "API & Webhooks",
      "Suporte prioritário",
      "14 dias de trial"
    ],
    cta: "Iniciar Trial",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Para grandes organizações",
    price: { monthly: 299.90, yearly: 2999 },
    features: [
      "Usuários ilimitados",
      "Organizações ilimitadas",
      "Documentos ilimitados",
      "100GB de armazenamento",
      "SSO & SAML",
      "SLA 99.9%",
      "Suporte 24/7",
      "30 dias de trial"
    ],
    cta: "Falar com Vendas",
    popular: false
  }
];

// FAQ data
const faqs = [
  {
    question: "Como funciona o período de trial?",
    answer: "Você tem acesso completo a todos os recursos do plano escolhido durante o período de trial. Não cobramos nada até o final do período, e você pode cancelar a qualquer momento."
  },
  {
    question: "Posso mudar de plano depois?",
    answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. O valor será calculado proporcionalmente ao período restante."
  },
  {
    question: "Como funciona o multi-tenant?",
    answer: "Cada organização tem seus dados completamente isolados. Você pode pertencer a múltiplas organizações e alternar entre elas facilmente."
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Utilizamos criptografia de ponta a ponta, backups automáticos e servidores com certificação SOC 2. Seus dados estão protegidos por políticas de segurança rigorosas."
  },
  {
    question: "Vocês oferecem suporte em português?",
    answer: "Sim! Todo nosso suporte é em português, incluindo documentação, chat e atendimento telefônico para planos Enterprise."
  },
  {
    question: "Posso importar dados de outros sistemas?",
    answer: "Oferecemos ferramentas de importação para os principais sistemas do mercado. Nossa equipe também pode auxiliar em migrações personalizadas."
  }
];

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 32 22" fill="none" className="w-5 h-5 text-primary-foreground">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-xl font-semibold text-heading">ASA.Template</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Recursos
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm" className="btn-float">Começar Grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="secondary" className="mb-6">
                <Star className="w-3 h-3 mr-1 fill-warning text-warning" />
                Template SaaS Multi-Tenant
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-heading mb-6 leading-tight"
            >
              Construa seu SaaS em{" "}
              <span className="text-primary">tempo recorde</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Template completo com autenticação, multi-tenancy, billing, documentação wiki 
              e tudo que você precisa para lançar seu produto rapidamente.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/auth/register">
                <Button size="lg" className="btn-float text-base px-8">
                  Começar Grátis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-base px-8">
                Ver Demonstração
              </Button>
            </motion.div>

            <motion.p 
              variants={fadeInUp}
              className="mt-4 text-sm text-muted-foreground"
            >
              Sem cartão de crédito • Setup em 5 minutos • Cancele quando quiser
            </motion.p>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            className="mt-16 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="card-3d p-2 max-w-5xl mx-auto">
              <img 
                src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/dashboards/dashboard-analytics.png"
                alt="Dashboard Preview"
                className="w-full rounded-lg"
              />
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Recursos</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
              Tudo que você precisa para seu SaaS
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades prontas para uso que economizam meses de desenvolvimento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card-3d p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Preços</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
              Planos para todos os tamanhos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Escolha o plano ideal para sua empresa. Todos incluem suporte e atualizações.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3">
              <span className={cn(
                "text-sm transition-colors",
                billingPeriod === "monthly" ? "text-foreground" : "text-muted-foreground"
              )}>
                Mensal
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-colors",
                  billingPeriod === "yearly" ? "bg-primary" : "bg-muted"
                )}
              >
                <span className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                  billingPeriod === "yearly" ? "translate-x-7" : "translate-x-1"
                )} />
              </button>
              <span className={cn(
                "text-sm transition-colors",
                billingPeriod === "yearly" ? "text-foreground" : "text-muted-foreground"
              )}>
                Anual
              </span>
              {billingPeriod === "yearly" && (
                <Badge variant="default" className="ml-2">-20%</Badge>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={cn(
                  "card-3d p-6 relative",
                  plan.popular && "ring-2 ring-primary"
                )}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Mais Popular
                  </Badge>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-heading mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-4xl font-bold text-heading">
                      {billingPeriod === "monthly" 
                        ? plan.price.monthly.toLocaleString('pt-BR')
                        : Math.round(plan.price.yearly / 12).toLocaleString('pt-BR')
                      }
                    </span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  {billingPeriod === "yearly" && plan.price.yearly > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      R$ {plan.price.yearly.toLocaleString('pt-BR')}/ano
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/auth/register">
                  <Button 
                    className={cn(
                      "w-full",
                      plan.popular ? "btn-float" : ""
                    )}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-muted-foreground">
              Tudo que você precisa saber para começar.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="card-elevated overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-heading">{faq.question}</span>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform",
                    openFaq === index && "rotate-180"
                  )} />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
              Pronto para começar?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Crie sua conta gratuitamente e comece a construir seu SaaS hoje mesmo.
            </p>
            <Link to="/auth/register">
              <Button size="lg" className="btn-float text-base px-8">
                Começar Grátis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 32 22" fill="none" className="w-5 h-5 text-primary-foreground">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="text-xl font-semibold text-heading">ASA.Template</span>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                Template SaaS multi-tenant completo para acelerar o desenvolvimento do seu produto.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-heading mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Recursos</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Preços</a></li>
                <li><a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-heading mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Termos de Uso</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacidade</Link></li>
                <li><Link to="/status" className="text-muted-foreground hover:text-foreground transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ASA.Template. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground">
              Feito com ❤️ no Brasil
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
