import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Eye, EyeOff, Loader2, ChevronLeft, ChevronRight, 
  Home, Building2, CreditCard, Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  registerAccountSchema, 
  registerCompanySchema,
  RegisterAccountFormData,
  RegisterCompanyFormData 
} from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: "month" | "year";
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Para começar e testar a plataforma",
    price: 0,
    period: "month",
  },
  {
    id: "starter",
    name: "Starter",
    description: "Para pequenas empresas",
    price: 99,
    period: "month",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Para empresas em crescimento",
    price: 299,
    period: "month",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Para grandes organizações",
    price: 999,
    period: "month",
  },
];

const industries = [
  "Tecnologia",
  "Saúde",
  "Educação",
  "Varejo",
  "Serviços",
  "Indústria",
  "Agronegócio",
  "Outros",
];

const companySizes = [
  "1-10 funcionários",
  "11-50 funcionários",
  "51-200 funcionários",
  "201-500 funcionários",
  "500+ funcionários",
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("starter");
  const [accountData, setAccountData] = useState<RegisterAccountFormData | null>(null);
  const [companyData, setCompanyData] = useState<RegisterCompanyFormData | null>(null);
  
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Step 1: Account form
  const accountForm = useForm<RegisterAccountFormData>({
    resolver: zodResolver(registerAccountSchema),
    defaultValues: accountData || undefined,
  });

  // Step 2: Company form
  const companyForm = useForm<RegisterCompanyFormData>({
    resolver: zodResolver(registerCompanySchema),
    defaultValues: companyData || undefined,
  });

  const steps = [
    { number: 1, title: "Conta", subtitle: "Dados da conta", icon: Home },
    { number: 2, title: "Empresa", subtitle: "Dados da empresa", icon: Building2 },
    { number: 3, title: "Plano", subtitle: "Escolha seu plano", icon: CreditCard },
  ];

  const handleAccountSubmit = (data: RegisterAccountFormData) => {
    setAccountData(data);
    setCurrentStep(2);
  };

  const handleCompanySubmit = (data: RegisterCompanyFormData) => {
    setCompanyData(data);
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    if (!accountData) return;

    setIsLoading(true);
    try {
      const { error } = await signUp(accountData.email, accountData.password, {
        first_name: accountData.firstName,
        last_name: accountData.lastName,
        company_name: companyData?.companyName,
        document_number: companyData?.documentNumber,
        phone: companyData?.phone,
        website: companyData?.website,
        industry: companyData?.industry,
        size: companyData?.size,
        plan: selectedPlan,
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            variant: "destructive",
            title: "Erro ao criar conta",
            description: "Este email já está cadastrado. Tente fazer login.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao criar conta",
            description: error.message,
          });
        }
      } else {
        toast({
          title: "Conta criada!",
          description: "Verifique seu email para ativar sua conta.",
        });
        navigate("/auth/verify-email");
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

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Logo */}
      <Link to="/" className="auth-brand z-10">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
          <svg 
            viewBox="0 0 32 22" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-primary-foreground"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
              fill="currentColor"
            />
            <path
              opacity="0.06"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
              fill="#000"
            />
            <path
              opacity="0.06"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
              fill="#000"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-heading">Sneat</span>
      </Link>

      {/* Left - Illustration */}
      <div className="hidden lg:flex lg:w-4/12 items-center justify-end p-8 pe-0">
        <img
          src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/illustrations/create-account-light.png"
          alt="Register illustration"
          className="w-full max-w-md"
        />
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-8/12 flex items-center justify-center p-6 bg-card">
        <div className="w-full max-w-2xl">
          {/* Stepper */}
          <div className="flex items-center justify-center mb-12 pt-16">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      currentStep >= step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <p className={cn(
                      "text-sm font-medium",
                      currentStep >= step.number ? "text-heading" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex items-center mx-4 mb-8">
                    <ChevronRight className={cn(
                      "w-5 h-5",
                      currentStep > step.number ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Account */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xl font-medium text-heading">Informações da Conta</h4>
                <p className="text-muted-foreground">Digite seus dados de acesso</p>
              </div>

              <form onSubmit={accountForm.handleSubmit(handleAccountSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      placeholder="João"
                      {...accountForm.register("firstName")}
                      className={accountForm.formState.errors.firstName ? "border-destructive" : ""}
                    />
                    {accountForm.formState.errors.firstName && (
                      <p className="text-sm text-destructive">{accountForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      placeholder="Silva"
                      {...accountForm.register("lastName")}
                      className={accountForm.formState.errors.lastName ? "border-destructive" : ""}
                    />
                    {accountForm.formState.errors.lastName && (
                      <p className="text-sm text-destructive">{accountForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...accountForm.register("email")}
                    className={accountForm.formState.errors.email ? "border-destructive" : ""}
                  />
                  {accountForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{accountForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="············"
                        {...accountForm.register("password")}
                        className={accountForm.formState.errors.password ? "border-destructive pr-10" : "pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {accountForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{accountForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar senha</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="············"
                        {...accountForm.register("confirmPassword")}
                        className={accountForm.formState.errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {accountForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">{accountForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" disabled>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>
                  <Button type="submit">
                    Próximo
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>

              <p className="text-center text-sm">
                <span className="text-muted-foreground">Já tem uma conta? </span>
                <Link to="/auth/login" className="text-primary hover:underline">
                  Entrar
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: Company */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xl font-medium text-heading">Informações da Empresa</h4>
                <p className="text-muted-foreground">Digite os dados da sua empresa</p>
              </div>

              <form onSubmit={companyForm.handleSubmit(handleCompanySubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da empresa</Label>
                    <Input
                      id="companyName"
                      placeholder="Minha Empresa Ltda"
                      {...companyForm.register("companyName")}
                      className={companyForm.formState.errors.companyName ? "border-destructive" : ""}
                    />
                    {companyForm.formState.errors.companyName && (
                      <p className="text-sm text-destructive">{companyForm.formState.errors.companyName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentNumber">CNPJ/CPF</Label>
                    <Input
                      id="documentNumber"
                      placeholder="00.000.000/0000-00"
                      {...companyForm.register("documentNumber")}
                      className={companyForm.formState.errors.documentNumber ? "border-destructive" : ""}
                    />
                    {companyForm.formState.errors.documentNumber && (
                      <p className="text-sm text-destructive">{companyForm.formState.errors.documentNumber.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      {...companyForm.register("phone")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://minhaempresa.com.br"
                      {...companyForm.register("website")}
                      className={companyForm.formState.errors.website ? "border-destructive" : ""}
                    />
                    {companyForm.formState.errors.website && (
                      <p className="text-sm text-destructive">{companyForm.formState.errors.website.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Setor</Label>
                    <Select onValueChange={(value) => companyForm.setValue("industry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Tamanho</Label>
                    <Select onValueChange={(value) => companyForm.setValue("size", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={goBack}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>
                  <Button type="submit">
                    Próximo
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Plan */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xl font-medium text-heading">Escolha seu Plano</h4>
                <p className="text-muted-foreground">Selecione o plano ideal para sua empresa</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={cn(
                      "p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50",
                      selectedPlan === plan.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    )}
                  >
                    <h5 className="font-medium text-heading">{plan.name}</h5>
                    <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                    <div className="mt-3 flex items-baseline">
                      <span className="text-primary text-sm">R$</span>
                      <span className="text-2xl font-bold text-primary ml-1">{plan.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">/{plan.period === "month" ? "mês" : "ano"}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={goBack}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                <Button 
                  onClick={handleFinalSubmit} 
                  disabled={isLoading}
                  className="bg-success hover:bg-success/90"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar conta
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
