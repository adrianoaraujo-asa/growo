import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const { error } = await resetPassword(data.email);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message,
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Email enviado!",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      illustration={
        <img
          src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/illustrations/girl-unlock-password-light.png"
          alt="Forgot password illustration"
          className="w-full max-w-lg mx-auto"
        />
      }
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-2xl font-medium text-heading">Esqueceu a senha? 🔒</h4>
          <p className="text-muted-foreground">
            {emailSent 
              ? `Enviamos um link de recuperação para ${getValues("email")}`
              : "Digite seu email e enviaremos instruções para redefinir sua senha"
            }
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoFocus
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar link de recuperação
            </Button>
          </form>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setEmailSent(false)}
          >
            Enviar novamente
          </Button>
        )}

        <div className="text-center">
          <Link
            to="/auth/login"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
