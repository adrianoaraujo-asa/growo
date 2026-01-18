import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Para começar a explorar",
    price: { monthly: 0, yearly: 0 },
    features: [
      "1 usuário",
      "5 projetos",
      "1 GB de armazenamento",
      "Suporte por email",
    ],
    cta: "Começar Grátis",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Para profissionais e pequenas equipes",
    price: { monthly: 49.90, yearly: 479 },
    features: [
      "Até 10 usuários",
      "Projetos ilimitados",
      "50 GB de armazenamento",
      "Suporte prioritário",
      "Integrações avançadas",
      "Relatórios customizados",
    ],
    cta: "Começar Trial de 14 dias",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Para grandes organizações",
    price: { monthly: 299.90, yearly: 2999 },
    features: [
      "Usuários ilimitados",
      "Projetos ilimitados",
      "Armazenamento ilimitado",
      "Suporte 24/7 dedicado",
      "SSO/SAML",
      "API dedicada",
      "SLA garantido",
      "Onboarding personalizado",
    ],
    cta: "Falar com Vendas",
    popular: false,
  },
];

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const formatPrice = (price: number) => {
    if (price === 0) return "Grátis";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getMonthlyEquivalent = (yearlyPrice: number) => {
    return Math.round(yearlyPrice / 12);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            ASA.Template
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/signup">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Preços simples e transparentes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground mb-8"
          >
            Escolha o plano ideal para o seu negócio. Sem surpresas, sem taxas ocultas.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4"
          >
            <Label
              htmlFor="billing-toggle"
              className={cn(
                "text-sm font-medium transition-colors",
                !isYearly ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Mensal
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label
              htmlFor="billing-toggle"
              className={cn(
                "text-sm font-medium transition-colors flex items-center gap-2",
                isYearly ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Anual
              <span className="bg-success/10 text-success text-xs px-2 py-0.5 rounded-full font-medium">
                Economize 20%
              </span>
            </Label>
          </motion.div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card
                  className={cn(
                    "relative h-full transition-all duration-300 hover:shadow-xl",
                    plan.popular && "border-primary shadow-lg scale-105 z-10"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Mais Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Price */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-foreground">
                        {formatPrice(
                          isYearly
                            ? getMonthlyEquivalent(plan.price.yearly)
                            : plan.price.monthly
                        )}
                      </div>
                      {plan.price.monthly > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {isYearly ? "/mês (cobrado anualmente)" : "/mês"}
                        </p>
                      )}
                      {isYearly && plan.price.yearly > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Total: {formatPrice(plan.price.yearly)}/ano
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm">
                          <Check className="w-4 h-4 text-success shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link to={plan.id === "enterprise" ? "#" : "/signup"}>
                      <Button
                        className="w-full group"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold text-foreground mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-muted-foreground text-sm">
                Sim! Você pode cancelar sua assinatura a qualquer momento. Não há multas ou taxas de cancelamento.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold text-foreground mb-2">
                O que acontece após o período de trial?
              </h3>
              <p className="text-muted-foreground text-sm">
                Após o trial, sua conta será automaticamente convertida para o plano pago escolhido. 
                Você será notificado antes da cobrança.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold text-foreground mb-2">
                Posso mudar de plano depois?
              </h3>
              <p className="text-muted-foreground text-sm">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                As mudanças serão refletidas na próxima cobrança.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ASA.Template. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}