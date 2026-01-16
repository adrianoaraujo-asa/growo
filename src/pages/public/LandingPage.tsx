import { Link } from "react-router-dom";
import dashboardPreview from "@/assets/dashboard-preview.png";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Check, 
  BarChart3, 
  Clock, 
  ChevronDown,
  Star,
  Briefcase,
  FolderKanban,
  UserCog,
  CalendarDays,
  Building2,
  Play,
  Menu,
  X,
  Mail,
  Linkedin,
  Twitter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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

// Features data - Focado no growo.app
const features = [
  {
    icon: UserCog,
    title: "Gestão de Profissionais",
    description: "Cadastre profissionais com skills, disponibilidade e histórico de alocações em projetos."
  },
  {
    icon: Briefcase,
    title: "Gestão de Clientes",
    description: "Organize seus clientes com contratos, contatos e histórico de projetos realizados."
  },
  {
    icon: FolderKanban,
    title: "Projetos & Kanban",
    description: "Gerencie projetos com visão Kanban, alocação de recursos e acompanhamento de entregas."
  },
  {
    icon: Clock,
    title: "Timesheet Inteligente",
    description: "Controle de horas trabalhadas com aprovações, relatórios e integração com faturamento."
  },
  {
    icon: CalendarDays,
    title: "Calendário Integrado",
    description: "Visualize alocações, férias, feriados e disponibilidade da equipe em um só lugar."
  },
  {
    icon: BarChart3,
    title: "Relatórios & Analytics",
    description: "Dashboards com métricas de produtividade, rentabilidade e utilização de recursos."
  }
];

// Plans data
const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Para pequenas equipes",
    price: { monthly: 0, yearly: 0 },
    features: [
      "Até 5 profissionais",
      "3 projetos ativos",
      "Timesheet básico",
      "Relatórios essenciais",
      "Suporte por email"
    ],
    cta: "Começar Grátis",
    popular: false
  },
  {
    id: "professional",
    name: "Professional",
    description: "Para empresas em crescimento",
    price: { monthly: 99, yearly: 948 },
    features: [
      "Até 25 profissionais",
      "Projetos ilimitados",
      "Timesheet avançado",
      "Kanban & Calendar",
      "API & Integrações",
      "Relatórios avançados",
      "Suporte prioritário"
    ],
    cta: "Iniciar Trial Grátis",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Para grandes organizações",
    price: { monthly: 299, yearly: 2868 },
    features: [
      "Profissionais ilimitados",
      "Multi-organizações",
      "SSO & SAML",
      "SLA 99.9%",
      "Onboarding dedicado",
      "Suporte 24/7",
      "Customizações"
    ],
    cta: "Falar com Vendas",
    popular: false
  }
];

// FAQ data
const faqs = [
  {
    question: "O que é o growo.app?",
    answer: "O growo.app é uma plataforma completa de gestão para empresas de TI, permitindo gerenciar profissionais, clientes, projetos e controle de horas trabalhadas em um único lugar."
  },
  {
    question: "Como funciona o período de trial?",
    answer: "Você tem acesso completo a todos os recursos do plano Professional por 14 dias. Não cobramos nada até o final do período, e você pode cancelar a qualquer momento."
  },
  {
    question: "Posso importar dados de outras ferramentas?",
    answer: "Sim! Oferecemos importação de planilhas Excel/CSV e integrações com as principais ferramentas do mercado como Jira, Trello e Clockify."
  },
  {
    question: "Como funciona o controle de horas?",
    answer: "O Timesheet permite lançamento manual ou automático de horas, com aprovação por gestores, relatórios detalhados e integração com faturamento."
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Utilizamos criptografia de ponta a ponta, backups automáticos diários e servidores com certificação SOC 2. Seus dados estão protegidos por políticas rigorosas de segurança."
  },
  {
    question: "Vocês oferecem suporte em português?",
    answer: "Sim! Todo nosso suporte é em português, incluindo documentação, chat ao vivo e atendimento telefônico para planos Enterprise."
  }
];

// Clients/Logos placeholder
const trustedBy = [
  "Empresa 1",
  "Empresa 2", 
  "Empresa 3",
  "Empresa 4",
  "Empresa 5"
];

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm" 
          : "bg-background/80 backdrop-blur-xl border-b border-border/50"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-primary-foreground font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-semibold text-heading">growo</span>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <a 
                href="#features" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Recursos
              </a>
              <a 
                href="#pricing" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Preços
              </a>
              <a 
                href="#faq" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                FAQ
              </a>
              <a 
                href="#testimonials" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Depoimentos
              </a>
            </nav>

            {/* CTA - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/auth/login">
                <Button variant="ghost" size="sm" className="font-medium">
                  Entrar
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="btn-float font-medium">
                  Começar Grátis
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-t border-border"
            >
              <nav className="flex flex-col p-4 space-y-3">
                <a 
                  href="#features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors py-2 font-medium"
                >
                  Recursos
                </a>
                <a 
                  href="#pricing" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors py-2 font-medium"
                >
                  Preços
                </a>
                <a 
                  href="#faq" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors py-2 font-medium"
                >
                  FAQ
                </a>
                <a 
                  href="#testimonials" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors py-2 font-medium"
                >
                  Depoimentos
                </a>
                <div className="pt-3 border-t border-border flex flex-col gap-2">
                  <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full font-medium">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full btn-float font-medium">
                      Começar Grátis
                    </Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
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
                Novo: Integração com Jira disponível
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-heading mb-6 leading-tight"
            >
              Gerencie sua{" "}
              <span className="text-primary">equipe de TI</span>
              {" "}com eficiência
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Plataforma completa para gestão de profissionais, projetos e timesheet. 
              Simplifique a alocação de recursos e maximize a produtividade da sua equipe.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/signup">
                <Button size="lg" className="btn-float text-base px-8">
                  Começar Grátis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-base px-8">
                <Play className="w-4 h-4 mr-2" />
                Ver Demonstração
              </Button>
            </motion.div>

            <motion.p 
              variants={fadeInUp}
              className="mt-4 text-sm text-muted-foreground"
            >
              ✓ Sem cartão de crédito • ✓ 14 dias grátis • ✓ Cancele quando quiser
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
                src={dashboardPreview} 
                alt="Dashboard do growo.app - Gestão de projetos de TI"
                className="w-full aspect-video rounded-lg object-cover object-top shadow-2xl"
              />
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Empresas que confiam no growo.app
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {trustedBy.map((company, index) => (
              <motion.div
                key={company}
                className="text-2xl font-semibold text-muted-foreground/50"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Recursos</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
              Tudo que você precisa para gerenciar sua equipe
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas integradas para simplificar a gestão de projetos e profissionais de TI.
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

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Como Funciona</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
              Comece em minutos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Três passos simples para organizar sua operação de TI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Cadastre sua equipe",
                description: "Adicione profissionais com suas skills, disponibilidade e informações de contato."
              },
              {
                step: "02",
                title: "Crie seus projetos",
                description: "Organize projetos por cliente, aloque profissionais e defina prazos."
              },
              {
                step: "03",
                title: "Acompanhe em tempo real",
                description: "Monitore horas trabalhadas, entregas e rentabilidade dos projetos."
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-heading mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
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
                <Badge variant="default" className="ml-2">Economize 20%</Badge>
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

                <Link to="/signup">
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Depoimentos</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
              O que nossos clientes dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "O growo simplificou completamente nossa gestão de alocações. Antes era tudo em planilhas, agora temos controle total.",
                author: "Nome do Cliente",
                role: "CEO",
                company: "Empresa Tech"
              },
              {
                quote: "O timesheet integrado economizou horas do nosso RH. A aprovação de horas ficou muito mais ágil.",
                author: "Nome do Cliente",
                role: "CTO",
                company: "Consultoria XYZ"
              },
              {
                quote: "Finalmente conseguimos ter visibilidade real da rentabilidade de cada projeto. Ferramenta essencial.",
                author: "Nome do Cliente",
                role: "Diretor de Operações",
                company: "Software House"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="card-3d p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-heading">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                </div>
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
              Pronto para organizar sua equipe?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Comece grátis e veja como o growo pode transformar a gestão dos seus projetos de TI.
            </p>
            <Link to="/signup">
              <Button size="lg" className="btn-float text-base px-8">
                Começar Grátis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4 group">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                  <span className="text-primary-foreground font-bold text-lg">G</span>
                </div>
                <span className="text-xl font-semibold text-heading">growo</span>
              </Link>
              <p className="text-muted-foreground max-w-sm mb-6">
                Plataforma completa de gestão para empresas de TI. 
                Profissionais, projetos e timesheet em um só lugar.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a 
                  href="mailto:contato@growo.app" 
                  className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-heading mb-4">Produto</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Depoimentos
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-heading mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="/auth/login" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Entrar
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Criar Conta
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} growo.app. Todos os direitos reservados.
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
