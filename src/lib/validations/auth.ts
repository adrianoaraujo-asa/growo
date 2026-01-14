import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const registerAccountSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirmação de senha é obrigatória"),
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const registerCompanySchema = z.object({
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  documentNumber: z.string().min(11, "CNPJ/CPF inválido"),
  phone: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  industry: z.string().optional(),
  size: z.string().optional(),
});

export const twoFactorSchema = z.object({
  code: z.string().length(6, "Código deve ter 6 dígitos"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type RegisterAccountFormData = z.infer<typeof registerAccountSchema>;
export type RegisterCompanyFormData = z.infer<typeof registerCompanySchema>;
export type TwoFactorFormData = z.infer<typeof twoFactorSchema>;
