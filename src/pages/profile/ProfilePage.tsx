import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User,
  Mail,
  Phone,
  Calendar,
  Camera,
  Loader2,
  Globe,
  Clock
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(50),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres").max(50),
  displayName: z.string().max(50).optional(),
  phone: z.string().max(20).optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  locale: z.string().optional(),
  timezone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Mock user data
const mockUser = {
  id: "user-1",
  email: "joao.silva@empresa.com.br",
  firstName: "João",
  lastName: "Silva",
  displayName: "João Silva",
  phone: "(11) 99999-9999",
  birthDate: "1990-05-15",
  gender: "male",
  locale: "pt-BR",
  timezone: "America/Sao_Paulo",
  avatarUrl: "",
  emailVerifiedAt: "2024-01-15T10:00:00Z",
  createdAt: "2024-01-15T10:00:00Z",
};

const timezones = [
  { value: "America/Sao_Paulo", label: "São Paulo (GMT-3)" },
  { value: "America/Fortaleza", label: "Fortaleza (GMT-3)" },
  { value: "America/Manaus", label: "Manaus (GMT-4)" },
  { value: "America/Rio_Branco", label: "Rio Branco (GMT-5)" },
  { value: "America/New_York", label: "New York (GMT-5)" },
  { value: "Europe/London", label: "London (GMT+0)" },
  { value: "Europe/Lisbon", label: "Lisboa (GMT+0)" },
];

const locales = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en-US", label: "English (US)" },
  { value: "es-ES", label: "Español" },
];

export function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      displayName: mockUser.displayName,
      phone: mockUser.phone,
      birthDate: mockUser.birthDate,
      gender: mockUser.gender,
      locale: mockUser.locale,
      timezone: mockUser.timezone,
    },
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold text-heading">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="card-3d md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={mockUser.avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {getInitials(mockUser.firstName, mockUser.lastName)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-3 right-0 rounded-full w-8 h-8"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {mockUser.displayName}
              </h2>
              <p className="text-muted-foreground">{mockUser.email}</p>

              <Separator className="my-6" />

              <div className="w-full space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground">{mockUser.email}</p>
                    {mockUser.emailVerifiedAt && (
                      <span className="text-xs text-green-600">✓ Verificado</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="text-foreground">{mockUser.phone || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Membro desde</p>
                    <p className="text-foreground">{formatDate(mockUser.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize seus dados pessoais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome *</FormLabel>
                          <FormControl>
                            <Input placeholder="João" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sobrenome *</FormLabel>
                          <FormControl>
                            <Input placeholder="Silva" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome de Exibição</FormLabel>
                        <FormControl>
                          <Input placeholder="Como você gostaria de ser chamado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gênero</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Masculino</SelectItem>
                            <SelectItem value="female">Feminino</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                            <SelectItem value="prefer_not_to_say">Prefiro não dizer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Locale & Timezone */}
          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Localização e Idioma
              </CardTitle>
              <CardDescription>
                Configure seu fuso horário e idioma preferido.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="locale"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idioma</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o idioma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locales.map((locale) => (
                              <SelectItem key={locale.value} value={locale.value}>
                                {locale.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuso Horário</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o fuso horário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timezones.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  {tz.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
