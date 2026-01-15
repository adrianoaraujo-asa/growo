import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ChevronLeft, Search } from "lucide-react";
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
import SignupLayout from "@/components/auth/SignupLayout";
import { useSignupStore } from "@/stores/signupStore";
import { useToast } from "@/hooks/use-toast";

const organizationSchema = z.object({
  companyName: z.string().min(2, "Mínimo 2 caracteres"),
  documentNumber: z.string().min(11, "CPF/CNPJ inválido"),
  companySize: z.string().min(1, "Selecione o tamanho"),
  industry: z.string().optional(),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

const industries = [
  "Tecnologia",
  "Saúde",
  "Educação",
  "Varejo",
  "Serviços",
  "Indústria",
  "Agronegócio",
  "Financeiro",
  "Outros",
];

const companySizes = [
  { value: "1-10", label: "1-10 funcionários" },
  { value: "11-50", label: "11-50 funcionários" },
  { value: "51-200", label: "51-200 funcionários" },
  { value: "200+", label: "200+ funcionários" },
];

// CNPJ/CPF mask and validation
function formatDocument(value: string) {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 11) {
    // CPF: 000.000.000-00
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  // CNPJ: 00.000.000/0000-00
  return numbers
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export default function SignupOrganizationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCnpj, setIsFetchingCnpj] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, updateData } = useSignupStore();

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      companyName: data.companyName || "",
      documentNumber: data.documentNumber || "",
      companySize: data.companySize || "",
      industry: data.industry || "",
    },
  });

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDocument(e.target.value);
    form.setValue("documentNumber", formatted);
  };

  // Fetch company data from CNPJ (ReceitaWS API)
  const handleFetchCnpj = async () => {
    const docNumber = form.getValues("documentNumber").replace(/\D/g, "");
    
    if (docNumber.length !== 14) {
      toast({
        variant: "destructive",
        title: "CNPJ inválido",
        description: "Digite um CNPJ válido para buscar os dados.",
      });
      return;
    }

    setIsFetchingCnpj(true);
    
    try {
      const response = await fetch(`https://receitaws.com.br/v1/cnpj/${docNumber}`);
      const data = await response.json();
      
      if (data.status === "ERROR") {
        toast({
          variant: "destructive",
          title: "CNPJ não encontrado",
          description: data.message || "Não foi possível encontrar os dados.",
        });
      } else {
        form.setValue("companyName", data.nome || data.fantasia || "");
        toast({
          title: "Dados encontrados!",
          description: "Informações da empresa preenchidas automaticamente.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao buscar CNPJ",
        description: "Não foi possível consultar a Receita Federal.",
      });
    } finally {
      setIsFetchingCnpj(false);
    }
  };

  const onSubmit = async (formData: OrganizationFormData) => {
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    updateData({
      companyName: formData.companyName,
      documentNumber: formData.documentNumber,
      companySize: formData.companySize,
      industry: formData.industry,
    });
    
    setIsLoading(false);
    navigate("/signup/plan");
  };

  return (
    <SignupLayout currentStep={4}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-heading">Dados da empresa</h1>
          <p className="text-muted-foreground">
            Informe os dados da sua organização
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="documentNumber">CNPJ ou CPF</Label>
            <div className="flex gap-2">
              <Input
                id="documentNumber"
                placeholder="00.000.000/0000-00"
                {...form.register("documentNumber")}
                onChange={handleDocumentChange}
                className={form.formState.errors.documentNumber ? "border-destructive" : ""}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleFetchCnpj}
                disabled={isFetchingCnpj}
                title="Buscar dados do CNPJ"
              >
                {isFetchingCnpj ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
            {form.formState.errors.documentNumber && (
              <p className="text-sm text-destructive">{form.formState.errors.documentNumber.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Digite o CNPJ e clique na lupa para buscar automaticamente
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da empresa</Label>
            <Input
              id="companyName"
              placeholder="Minha Empresa Ltda"
              {...form.register("companyName")}
              className={form.formState.errors.companyName ? "border-destructive" : ""}
            />
            {form.formState.errors.companyName && (
              <p className="text-sm text-destructive">{form.formState.errors.companyName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companySize">Tamanho</Label>
              <Select
                value={form.watch("companySize")}
                onValueChange={(value) => form.setValue("companySize", value)}
              >
                <SelectTrigger className={form.formState.errors.companySize ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.companySize && (
                <p className="text-sm text-destructive">{form.formState.errors.companySize.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Setor (opcional)</Label>
              <Select
                value={form.watch("industry")}
                onValueChange={(value) => form.setValue("industry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
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
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/signup/profile")}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continuar
            </Button>
          </div>
        </form>
      </div>
    </SignupLayout>
  );
}
