import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SignupLayout from "@/components/auth/SignupLayout";
import { useSignupStore } from "@/stores/signupStore";
import { cn } from "@/lib/utils";

const credentialsSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Deve conter uma letra maiúscula")
    .regex(/[0-9]/, "Deve conter um número"),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, "Você deve aceitar os termos"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type CredentialsFormData = z.infer<typeof credentialsSchema>;

// Password requirements checker
function getPasswordStrength(password: string) {
  const requirements = [
    { label: "Mínimo 8 caracteres", met: password.length >= 8 },
    { label: "Uma letra maiúscula", met: /[A-Z]/.test(password) },
    { label: "Um número", met: /[0-9]/.test(password) },
  ];
  
  const metCount = requirements.filter((r) => r.met).length;
  const strength = metCount === 0 ? 0 : metCount === 1 ? 1 : metCount === 2 ? 2 : 3;
  
  return { requirements, strength };
}

export default function SignupCredentialsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { data, updateData } = useSignupStore();

  const form = useForm<CredentialsFormData>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: data.email || "",
      password: data.password || "",
      confirmPassword: "",
      terms: false,
    },
  });

  const password = form.watch("password") || "";
  const { requirements, strength } = getPasswordStrength(password);

  const onSubmit = async (formData: CredentialsFormData) => {
    setIsLoading(true);
    
    // Simulate API call to check if email exists
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    updateData({
      email: formData.email,
      password: formData.password,
    });
    
    setIsLoading(false);
    navigate("/signup/verify");
  };

  return (
    <SignupLayout currentStep={1}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-heading">Criar sua conta</h1>
          <p className="text-muted-foreground">
            Digite seu email e crie uma senha segura
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoFocus
              {...form.register("email")}
              className={form.formState.errors.email ? "border-destructive" : ""}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="············"
                {...form.register("password")}
                className={cn(
                  "pr-10",
                  form.formState.errors.password && "border-destructive"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2 mt-3">
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        strength >= level
                          ? strength === 1
                            ? "bg-destructive"
                            : strength === 2
                            ? "bg-warning"
                            : "bg-success"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Força: {strength === 0 ? "Muito fraca" : strength === 1 ? "Fraca" : strength === 2 ? "Média" : "Forte"}
                </p>
                <ul className="space-y-1">
                  {requirements.map((req) => (
                    <li key={req.label} className="flex items-center gap-2 text-xs">
                      {req.met ? (
                        <Check className="w-3 h-3 text-success" />
                      ) : (
                        <X className="w-3 h-3 text-muted-foreground" />
                      )}
                      <span className={req.met ? "text-success" : "text-muted-foreground"}>
                        {req.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="············"
                {...form.register("confirmPassword")}
                className={cn(
                  "pr-10",
                  form.formState.errors.confirmPassword && "border-destructive"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={form.watch("terms")}
              onCheckedChange={(checked) => form.setValue("terms", checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
              Eu aceito os{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </Label>
          </div>
          {form.formState.errors.terms && (
            <p className="text-sm text-destructive">{form.formState.errors.terms.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continuar
          </Button>
        </form>

        <p className="text-center text-sm">
          <span className="text-muted-foreground">Já tem uma conta? </span>
          <Link to="/auth/login" className="text-primary hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </SignupLayout>
  );
}
