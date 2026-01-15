import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SignupLayout from "@/components/auth/SignupLayout";
import { useSignupStore } from "@/stores/signupStore";
import { cn } from "@/lib/utils";

export default function SignupVerifyPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, updateData } = useSignupStore();

  // Countdown for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    
    // Focus last filled input or first empty
    const lastFilledIndex = newOtp.findIndex((v) => !v);
    inputRefs.current[lastFilledIndex === -1 ? 5 : lastFilledIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast({
        variant: "destructive",
        title: "Código incompleto",
        description: "Digite todos os 6 dígitos do código.",
      });
      return;
    }

    setIsLoading(true);

    // Simulate verification (in production, call API)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo, accept any 6-digit code
    if (code === "000000") {
      toast({
        variant: "destructive",
        title: "Código inválido",
        description: "O código inserido está incorreto. Tente novamente.",
      });
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setIsLoading(false);
      return;
    }

    updateData({ emailVerified: true });
    toast({
      title: "Email verificado!",
      description: "Sua conta foi verificada com sucesso.",
    });
    setIsLoading(false);
    navigate("/signup/profile");
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendCooldown(60);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    toast({
      title: "Código reenviado",
      description: `Um novo código foi enviado para ${data.email}`,
    });
  };

  const maskedEmail = data.email?.replace(/(.{2})(.*)(@.*)/, "$1***$3") || "";

  return (
    <SignupLayout currentStep={2}>
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-heading">Verifique seu email</h1>
            <p className="text-muted-foreground">
              Enviamos um código de 6 dígitos para
              <br />
              <span className="font-medium text-foreground">{maskedEmail}</span>
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* OTP Input */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={cn(
                  "w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                  digit ? "border-primary bg-primary/5" : "border-border bg-background"
                )}
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            className="w-full"
            disabled={isLoading || otp.join("").length !== 6}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verificar
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Não recebeu o código?
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={!canResend}
              className="text-primary"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", !canResend && "animate-spin")} />
              {canResend ? "Reenviar código" : `Reenviar em ${resendCooldown}s`}
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate("/signup")}
              className="text-muted-foreground"
            >
              Usar outro email
            </Button>
          </div>
        </div>
      </div>
    </SignupLayout>
  );
}
