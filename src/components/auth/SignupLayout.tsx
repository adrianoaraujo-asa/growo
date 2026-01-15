import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Mail, Building2, CreditCard, Check,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSignupStore } from "@/stores/signupStore";
import { useEffect } from "react";

interface SignupLayoutProps {
  children: React.ReactNode;
  currentStep: number;
}

const steps = [
  { number: 1, title: "Credenciais", subtitle: "Email e senha", icon: Mail, path: "/signup" },
  { number: 2, title: "Verificação", subtitle: "Confirmar email", icon: Check, path: "/signup/verify" },
  { number: 3, title: "Perfil", subtitle: "Dados pessoais", icon: User, path: "/signup/profile" },
  { number: 4, title: "Empresa", subtitle: "Dados da empresa", icon: Building2, path: "/signup/organization" },
  { number: 5, title: "Plano", subtitle: "Escolha seu plano", icon: CreditCard, path: "/signup/plan" },
  { number: 6, title: "Pagamento", subtitle: "Finalizar cadastro", icon: CreditCard, path: "/signup/checkout" },
];

export default function SignupLayout({ children, currentStep }: SignupLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { canAccessStep, setStep } = useSignupStore();

  // Redirect if trying to access invalid step
  useEffect(() => {
    if (!canAccessStep(currentStep) && currentStep > 1) {
      // Find the last valid step
      for (let i = currentStep - 1; i >= 1; i--) {
        if (canAccessStep(i)) {
          navigate(steps[i - 1].path);
          return;
        }
      }
      navigate("/signup");
    } else {
      setStep(currentStep);
    }
  }, [currentStep, canAccessStep, navigate, setStep]);

  return (
    <div className="min-h-screen flex">
      {/* Logo - Fixed position */}
      <Link to="/" className="fixed top-6 left-6 z-10 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
          <svg viewBox="0 0 32 22" fill="none" className="w-5 h-5 text-primary-foreground">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z" fill="currentColor"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z" fill="currentColor"/>
          </svg>
        </div>
        <span className="text-heading font-semibold">ASA.Template</span>
      </Link>

      {/* Left Side - Stepper */}
      <div className="hidden lg:flex w-80 bg-muted/30 border-r border-border/50 flex-col pt-24 px-6">
        <div className="space-y-1">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isAccessible = canAccessStep(step.number);

            return (
              <div key={step.number}>
                <button
                  onClick={() => isAccessible && navigate(step.path)}
                  disabled={!isAccessible}
                  className={cn(
                    "w-full flex items-center gap-4 p-3 rounded-lg transition-all text-left",
                    isCurrent && "bg-primary/10",
                    isAccessible && !isCurrent && "hover:bg-muted cursor-pointer",
                    !isAccessible && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0",
                    isCompleted && "bg-success text-success-foreground",
                    isCurrent && "bg-primary text-primary-foreground",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium text-sm truncate",
                      isCurrent ? "text-heading" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {step.subtitle}
                    </p>
                  </div>
                </button>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="ml-8 my-1">
                    <div className={cn(
                      "w-0.5 h-6 rounded-full transition-colors",
                      isCompleted ? "bg-success" : "bg-border"
                    )} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help text */}
        <div className="mt-auto pb-8">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Stepper */}
        <div className="lg:hidden pt-20 px-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                  currentStep > step.number && "bg-success text-success-foreground",
                  currentStep === step.number && "bg-primary text-primary-foreground",
                  currentStep < step.number && "bg-muted text-muted-foreground"
                )}>
                  {currentStep > step.number ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mb-4">
            Step {currentStep} de {steps.length}: {steps[currentStep - 1].title}
          </p>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center p-6 lg:pt-24">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
