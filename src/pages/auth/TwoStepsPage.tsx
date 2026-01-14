import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function TwoStepsPage() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const maskedPhone = "******1234";

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    
    // Focus last filled input or first empty one
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    
    if (fullCode.length !== 6) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Digite o código completo de 6 dígitos.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement 2FA verification
      console.log("Verifying code:", fullCode);
      
      toast({
        title: "Verificado!",
        description: "Autenticação de dois fatores concluída.",
      });
      navigate("/");
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Código inválido. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    toast({
      title: "Código reenviado",
      description: "Um novo código foi enviado para seu dispositivo.",
    });
  };

  return (
    <AuthLayout
      illustration={
        <img
          src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/illustrations/girl-verify-password-light.png"
          alt="Two steps verification illustration"
          className="w-full max-w-lg mx-auto"
        />
      }
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-2xl font-medium text-heading">Verificação em duas etapas 💬</h4>
          <p className="text-muted-foreground">
            Enviamos um código de verificação para seu celular.
            <br />
            Digite o código do seu dispositivo.
            <span className="block mt-1 font-medium text-heading">{maskedPhone}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Digite seu código de segurança de 6 dígitos
            </p>
            <div className="flex gap-2 justify-between">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-lg font-medium"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verificar minha conta
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Não recebeu o código?{" "}
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
