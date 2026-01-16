import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignupLayout from "@/components/auth/SignupLayout";
import { useSignupStore } from "@/stores/signupStore";

const profileSchema = z.object({
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  phone: z.string().min(10, "Telefone inválido").max(15, "Telefone inválido"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Phone mask function
function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

export default function SignupProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { data, updateData } = useSignupStore();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      phone: data.phone || "",
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    form.setValue("phone", formatted);
  };

  const onSubmit = async (formData: ProfileFormData) => {
    setIsLoading(true);
    
    updateData({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    });
    
    setIsLoading(false);
    navigate("/signup/organization");
  };

  return (
    <SignupLayout currentStep={3}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-heading">Dados pessoais</h1>
          <p className="text-muted-foreground">
            Complete suas informações para personalizar sua experiência
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                placeholder="João"
                autoFocus
                {...form.register("firstName")}
                className={form.formState.errors.firstName ? "border-destructive" : ""}
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                placeholder="Silva"
                {...form.register("lastName")}
                className={form.formState.errors.lastName ? "border-destructive" : ""}
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              {...form.register("phone")}
              onChange={handlePhoneChange}
              className={form.formState.errors.phone ? "border-destructive" : ""}
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/signup/verify")}
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
