import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/AuthLayout";

interface VerifyEmailPageProps {
  email?: string;
}

export default function VerifyEmailPage({ email = "seu@email.com" }: VerifyEmailPageProps) {
  const handleResend = () => {
    // TODO: Implement resend verification email
    console.log("Resending verification email...");
  };

  return (
    <AuthLayout
      illustration={
        <img
          src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/illustrations/boy-verify-email-light.png"
          alt="Verify email illustration"
          className="w-full max-w-lg mx-auto"
        />
      }
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-2xl font-medium text-heading">Verifique seu email ✉️</h4>
          <p className="text-muted-foreground">
            Enviamos um link de ativação para seu email:{" "}
            <span className="font-medium text-heading">{email}</span>
            <br />
            Por favor, siga o link para continuar.
          </p>
        </div>

        <Link to="/">
          <Button className="w-full">
            Pular por enquanto
          </Button>
        </Link>

        <p className="text-center text-sm text-muted-foreground">
          Não recebeu o email?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-primary hover:underline"
          >
            Reenviar
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
