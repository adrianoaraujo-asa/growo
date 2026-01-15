import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SignupLayout from "@/components/auth/SignupLayout";
import { useSignupStore } from "@/stores/signupStore";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Para começar",
    price: { monthly: 0, yearly: 0 },
    features: [
      "1 usuário",
      "1 organização",
      "100 documentos",
      "1GB de armazenamento",
    ],
    trial: null,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Para equipes",
    price: { monthly: 49.90, yearly: 479 },
    features: [
      "5 usuários",
      "3 organizações",
      "Documentos ilimitados",
      "10GB de armazenamento",
      "API & Webhooks",
      "Suporte prioritário",
    ],
    trial: 14,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Para grandes empresas",
    price: { monthly: 299.90, yearly: 2999 },
    features: [
      "Usuários ilimitados",
      "Organizações ilimitadas",
      "Documentos ilimitados",
      "100GB de armazenamento",
      "SSO & SAML",
      "SLA 99.9%",
      "Suporte 24/7",
    ],
    trial: 30,
    popular: false,
  },
];

export default function SignupPlanPage() {
  const navigate = useNavigate();
  const { data, updateData } = useSignupStore();
  const [selectedPlan, setSelectedPlan] = useState(data.selectedPlan || "pro");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(data.billingPeriod || "monthly");

  const handleContinue = () => {
    updateData({
      selectedPlan,
      billingPeriod,
    });

    // Free plan goes directly to dashboard (no payment)
    if (selectedPlan === "free") {
      // TODO: Create account and redirect to dashboard
      navigate("/dashboard");
    } else {
      navigate("/signup/checkout");
    }
  };

  return (
    <SignupLayout currentStep={5}>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-heading">Escolha seu plano</h1>
          <p className="text-muted-foreground">
            Selecione o plano ideal para sua empresa
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3">
          <span className={cn(
            "text-sm transition-colors",
            billingPeriod === "monthly" ? "text-foreground font-medium" : "text-muted-foreground"
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
            billingPeriod === "yearly" ? "text-foreground font-medium" : "text-muted-foreground"
          )}>
            Anual
          </span>
          {billingPeriod === "yearly" && (
            <Badge variant="default" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              -20%
            </Badge>
          )}
        </div>

        {/* Plans Grid */}
        <div className="space-y-3">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const price = billingPeriod === "monthly" ? plan.price.monthly : Math.round(plan.price.yearly / 12);

            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 transition-all text-left relative",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                  plan.popular && !isSelected && "border-primary/30"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2.5 right-4 text-xs">
                    Recomendado
                  </Badge>
                )}

                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                    isSelected ? "border-primary bg-primary" : "border-border"
                  )}>
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-heading">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-muted-foreground">R$</span>
                          <span className="text-xl font-bold text-heading">{price.toLocaleString('pt-BR')}</span>
                          <span className="text-xs text-muted-foreground">/mês</span>
                        </div>
                        {plan.trial && (
                          <p className="text-xs text-success">{plan.trial} dias grátis</p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <ul className="mt-3 grid grid-cols-2 gap-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Check className="w-3 h-3 text-success shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/signup/organization")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={handleContinue} className="flex-1">
            {selectedPlan === "free" ? "Criar conta grátis" : "Continuar para pagamento"}
          </Button>
        </div>
      </div>
    </SignupLayout>
  );
}
