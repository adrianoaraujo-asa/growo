import { motion } from "framer-motion";
import { 
  Crown, 
  Check, 
  ArrowRight,
  Zap,
  Users,
  HardDrive,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: PlanFeature[];
  popular?: boolean;
}

const currentPlan = {
  id: "professional",
  name: "Professional",
  price: 99,
  interval: "month" as const,
  current_period_end: "2026-02-15",
  usage: {
    users: { used: 8, limit: 25 },
    storage: { used: 2.5, limit: 10 }, // GB
    projects: { used: 12, limit: 50 },
  },
};

const availablePlans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    interval: "month",
    features: [
      { name: "Até 5 usuários", included: true },
      { name: "2GB de armazenamento", included: true },
      { name: "10 projetos", included: true },
      { name: "Suporte por email", included: true },
      { name: "API access", included: false },
      { name: "SSO", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 99,
    interval: "month",
    popular: true,
    features: [
      { name: "Até 25 usuários", included: true },
      { name: "10GB de armazenamento", included: true },
      { name: "50 projetos", included: true },
      { name: "Suporte prioritário", included: true },
      { name: "API access", included: true },
      { name: "SSO", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 249,
    interval: "month",
    features: [
      { name: "Usuários ilimitados", included: true },
      { name: "100GB de armazenamento", included: true },
      { name: "Projetos ilimitados", included: true },
      { name: "Suporte 24/7", included: true },
      { name: "API access", included: true },
      { name: "SSO", included: true },
    ],
  },
];

export function SubscriptionSettingsPage() {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold text-heading">Assinatura</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie seu plano atual.
        </p>
      </div>

      {/* Current Plan Overview */}
      <Card className="card-3d border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Plano {currentPlan.name}
                  <Badge variant="default" className="bg-primary">Ativo</Badge>
                </CardTitle>
                <CardDescription>
                  Próxima cobrança: {formatDate(currentPlan.current_period_end)}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">
                R$ {currentPlan.price}
                <span className="text-lg font-normal text-muted-foreground">/mês</span>
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          
          {/* Usage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Usuários</span>
                </div>
                <span className="font-medium">
                  {currentPlan.usage.users.used} / {currentPlan.usage.users.limit}
                </span>
              </div>
              <Progress 
                value={(currentPlan.usage.users.used / currentPlan.usage.users.limit) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Armazenamento</span>
                </div>
                <span className="font-medium">
                  {currentPlan.usage.storage.used}GB / {currentPlan.usage.storage.limit}GB
                </span>
              </div>
              <Progress 
                value={(currentPlan.usage.storage.used / currentPlan.usage.storage.limit) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Projetos</span>
                </div>
                <span className="font-medium">
                  {currentPlan.usage.projects.used} / {currentPlan.usage.projects.limit}
                </span>
              </div>
              <Progress 
                value={(currentPlan.usage.projects.used / currentPlan.usage.projects.limit) * 100} 
                className="h-2"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              Cancelar Assinatura
            </Button>
            <Button variant="outline">
              Baixar Faturas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Alterar Plano
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availablePlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`card-3d relative ${plan.id === currentPlan.id ? "border-primary ring-2 ring-primary/20" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">Mais Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">R$ {plan.price}</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2 text-sm">
                      <Check className={`w-4 h-4 ${feature.included ? "text-green-500" : "text-muted-foreground/30"}`} />
                      <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={plan.id === currentPlan.id ? "secondary" : "default"}
                  className="w-full"
                  disabled={plan.id === currentPlan.id}
                >
                  {plan.id === currentPlan.id ? (
                    "Plano Atual"
                  ) : plan.price > currentPlan.price ? (
                    <>
                      Fazer Upgrade
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    "Fazer Downgrade"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Enterprise CTA */}
      <Card className="card-3d bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Precisa de mais?</h3>
              <p className="text-sm text-muted-foreground">
                Entre em contato para um plano personalizado para sua empresa.
              </p>
            </div>
          </div>
          <Button>
            Falar com Vendas
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
