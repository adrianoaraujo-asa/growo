import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Copy
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z
    .string()
    .min(8, "Nova senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos um caractere especial"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export function SecurityPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [setup2FAStep, setSetup2FAStep] = useState<"qr" | "verify">("qr");
  const [otpValue, setOtpValue] = useState("");

  // Mock 2FA secret
  const mock2FASecret = "JBSWY3DPEHPK3PXP";
  const mockQRCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Growo:joao.silva@empresa.com.br?secret=${mock2FASecret}&issuer=Growo`;

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Senha alterada com sucesso!");
      form.reset();
    } catch (error) {
      toast.error("Erro ao alterar senha");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable2FA = () => {
    setIs2FADialogOpen(true);
    setSetup2FAStep("qr");
    setOtpValue("");
  };

  const handleVerify2FA = async () => {
    if (otpValue.length !== 6) {
      toast.error("Digite o código de 6 dígitos");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIs2FAEnabled(true);
      setIs2FADialogOpen(false);
      toast.success("Autenticação em duas etapas ativada!");
    } catch (error) {
      toast.error("Código inválido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIs2FAEnabled(false);
      toast.success("Autenticação em duas etapas desativada!");
    } catch (error) {
      toast.error("Erro ao desativar 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { label: "Fraca", color: "bg-red-500", width: "33%" };
    if (strength <= 4) return { label: "Média", color: "bg-yellow-500", width: "66%" };
    return { label: "Forte", color: "bg-green-500", width: "100%" };
  };

  const newPassword = form.watch("newPassword");
  const passwordStrength = getPasswordStrength(newPassword || "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold text-heading">Segurança</h1>
        <p className="text-muted-foreground">
          Gerencie sua senha e configurações de segurança.
        </p>
      </div>

      {/* Password Change */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Alterar Senha
          </CardTitle>
          <CardDescription>
            Mantenha sua conta segura com uma senha forte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Atual *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Digite sua senha atual"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Digite sua nova senha"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    {newPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${passwordStrength.color} transition-all`}
                              style={{ width: passwordStrength.width }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {passwordStrength.label}
                          </span>
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
                            {newPassword.length >= 8 ? "✓" : "○"} Mínimo 8 caracteres
                          </li>
                          <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
                            {/[A-Z]/.test(newPassword) ? "✓" : "○"} Uma letra maiúscula
                          </li>
                          <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>
                            {/[a-z]/.test(newPassword) ? "✓" : "○"} Uma letra minúscula
                          </li>
                          <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>
                            {/[0-9]/.test(newPassword) ? "✓" : "○"} Um número
                          </li>
                          <li className={/[^A-Za-z0-9]/.test(newPassword) ? "text-green-600" : ""}>
                            {/[^A-Za-z0-9]/.test(newPassword) ? "✓" : "○"} Um caractere especial
                          </li>
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nova Senha *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirme sua nova senha"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Alterar Senha
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Autenticação em Duas Etapas (2FA)
          </CardTitle>
          <CardDescription>
            Adicione uma camada extra de segurança à sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${is2FAEnabled ? "bg-green-500/10" : "bg-muted"}`}>
                <Shield className={`w-6 h-6 ${is2FAEnabled ? "text-green-600" : "text-muted-foreground"}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">Aplicativo Autenticador</p>
                  {is2FAEnabled ? (
                    <Badge className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ativado
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Desativado</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {is2FAEnabled
                    ? "Sua conta está protegida com autenticação em duas etapas."
                    : "Use um aplicativo como Google Authenticator ou Authy."}
                </p>
              </div>
            </div>
            <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
              <DialogTrigger asChild>
                {is2FAEnabled ? (
                  <Button variant="outline" onClick={handleDisable2FA} disabled={isLoading}>
                    Desativar
                  </Button>
                ) : (
                  <Button onClick={handleEnable2FA}>Ativar</Button>
                )}
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Configurar 2FA</DialogTitle>
                  <DialogDescription>
                    {setup2FAStep === "qr"
                      ? "Escaneie o QR Code com seu aplicativo autenticador."
                      : "Digite o código de verificação."}
                  </DialogDescription>
                </DialogHeader>

                {setup2FAStep === "qr" ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img
                        src={mockQRCodeURL}
                        alt="QR Code 2FA"
                        className="w-48 h-48 rounded-lg border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ou insira o código manualmente:</Label>
                      <div className="relative">
                        <Input
                          value={mock2FASecret}
                          readOnly
                          className="font-mono text-sm pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => {
                            navigator.clipboard.writeText(mock2FASecret);
                            toast.success("Código copiado!");
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => setSetup2FAStep("verify")}
                    >
                      Próximo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otpValue}
                        onChange={setOtpValue}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      Digite o código de 6 dígitos do seu aplicativo autenticador.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSetup2FAStep("qr")}
                      >
                        Voltar
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleVerify2FA}
                        disabled={isLoading || otpValue.length !== 6}
                      >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Verificar
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {!is2FAEnabled && (
            <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
              <p className="text-sm text-yellow-700">
                Recomendamos ativar a autenticação em duas etapas para maior
                segurança da sua conta.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
