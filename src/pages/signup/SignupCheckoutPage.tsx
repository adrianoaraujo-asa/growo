import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ChevronLeft, CreditCard, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SignupLayout from "@/components/auth/SignupLayout";
import { useSignupStore } from "@/stores/signupStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const checkoutSchema = z.object({
  cardNumber: z.string().min(19, "Número do cartão inválido"),
  cardName: z.string().min(3, "Nome no cartão é obrigatório"),
  cardExpiry: z.string().min(5, "Data de validade inválida"),
  cardCvv: z.string().min(3, "CVV inválido").max(4, "CVV inválido"),
  saveCard: z.boolean().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Card number formatting
function formatCardNumber(value: string) {
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
}

// Expiry formatting
function formatExpiry(value: string) {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length >= 2) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
  }
  return numbers;
}

// Detect card brand
function getCardBrand(number: string) {
  const cleanNumber = number.replace(/\D/g, "");
  if (/^4/.test(cleanNumber)) return "visa";
  if (/^5[1-5]/.test(cleanNumber)) return "mastercard";
  if (/^3[47]/.test(cleanNumber)) return "amex";
  if (/^6(?:011|5)/.test(cleanNumber)) return "discover";
  return null;
}

const plans: Record<string, { name: string; price: { monthly: number; yearly: number }; trial: number | null }> = {
  pro: { name: "Pro", price: { monthly: 49.90, yearly: 479 }, trial: 14 },
  enterprise: { name: "Enterprise", price: { monthly: 299.90, yearly: 2999 }, trial: 30 },
};

export default function SignupCheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, reset } = useSignupStore();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvv: "",
      saveCard: true,
    },
  });

  const cardNumber = form.watch("cardNumber");
  const cardBrand = getCardBrand(cardNumber);
  const selectedPlan = plans[data.selectedPlan || "pro"];
  const price = data.billingPeriod === "monthly" ? selectedPlan.price.monthly : selectedPlan.price.yearly;
  const monthlyPrice = data.billingPeriod === "monthly" ? price : Math.round(price / 12);

  const onSubmit = async (formData: CheckoutFormData) => {
    setIsLoading(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In production, this would:
    // 1. Tokenize card with payment gateway
    // 2. Create subscription
    // 3. Create user account
    // 4. Send confirmation email

    toast({
      title: "Conta criada com sucesso! 🎉",
      description: selectedPlan.trial
        ? `Seu período de teste de ${selectedPlan.trial} dias começou.`
        : "Bem-vindo ao ASA.Template!",
    });

    reset();
    setIsLoading(false);
    navigate("/dashboard");
  };

  return (
    <SignupLayout currentStep={6}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-heading">Finalizar cadastro</h1>
          <p className="text-muted-foreground">
            Insira os dados do cartão para completar
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-muted/50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Plano</span>
            <span className="font-medium text-heading">{selectedPlan.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Período</span>
            <span className="font-medium text-heading">
              {data.billingPeriod === "monthly" ? "Mensal" : "Anual"}
            </span>
          </div>
          {selectedPlan.trial && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Trial</span>
              <span className="font-medium text-success">{selectedPlan.trial} dias grátis</span>
            </div>
          )}
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-medium text-heading">Total hoje</span>
            <span className="font-bold text-heading text-lg">
              {selectedPlan.trial ? "R$ 0,00" : `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </span>
          </div>
          {selectedPlan.trial && (
            <p className="text-xs text-muted-foreground">
              Primeira cobrança de R$ {monthlyPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              {data.billingPeriod === "yearly" ? "/mês" : ""} em {selectedPlan.trial} dias
            </p>
          )}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número do cartão</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                {...form.register("cardNumber")}
                onChange={(e) => form.setValue("cardNumber", formatCardNumber(e.target.value))}
                className={cn("pl-10", form.formState.errors.cardNumber && "border-destructive")}
              />
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              {cardBrand && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium uppercase text-muted-foreground">
                  {cardBrand}
                </div>
              )}
            </div>
            {form.formState.errors.cardNumber && (
              <p className="text-sm text-destructive">{form.formState.errors.cardNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">Nome no cartão</Label>
            <Input
              id="cardName"
              placeholder="JOÃO M SILVA"
              {...form.register("cardName")}
              onChange={(e) => form.setValue("cardName", e.target.value.toUpperCase())}
              className={form.formState.errors.cardName ? "border-destructive" : ""}
            />
            {form.formState.errors.cardName && (
              <p className="text-sm text-destructive">{form.formState.errors.cardName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">Validade</Label>
              <Input
                id="cardExpiry"
                placeholder="MM/AA"
                maxLength={5}
                {...form.register("cardExpiry")}
                onChange={(e) => form.setValue("cardExpiry", formatExpiry(e.target.value))}
                className={form.formState.errors.cardExpiry ? "border-destructive" : ""}
              />
              {form.formState.errors.cardExpiry && (
                <p className="text-sm text-destructive">{form.formState.errors.cardExpiry.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardCvv">CVV</Label>
              <div className="relative">
                <Input
                  id="cardCvv"
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  {...form.register("cardCvv")}
                  onChange={(e) => form.setValue("cardCvv", e.target.value.replace(/\D/g, ""))}
                  className={cn("pl-10", form.formState.errors.cardCvv && "border-destructive")}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {form.formState.errors.cardCvv && (
                <p className="text-sm text-destructive">{form.formState.errors.cardCvv.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveCard"
              checked={form.watch("saveCard")}
              onCheckedChange={(checked) => form.setValue("saveCard", checked as boolean)}
            />
            <Label htmlFor="saveCard" className="text-sm font-normal cursor-pointer">
              Salvar cartão para próximas cobranças
            </Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/signup/plan")}
              disabled={isLoading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button type="submit" className="flex-1 btn-float" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Finalizar Cadastro
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Pagamento seguro com criptografia SSL
          </p>
        </form>
      </div>
    </SignupLayout>
  );
}
