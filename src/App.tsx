import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import { DashboardLayout } from "@/components/layout";

import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/dashboard/DashboardPage";
import { OrganizationsPage } from "./pages/organizations";

// Public Pages
import { LandingPage, TermsPage, PrivacyPage } from "./pages/public";

// Admin Pages
import { PlansAdminPage, LandingSettingsAdminPage } from "./pages/admin";

// Settings Pages
import {
  OrganizationSettingsPage,
  AddressesSettingsPage,
  ContactsSettingsPage,
  UsersSettingsPage,
  UserDetailsPage,
  UserInvitePage,
  BillingSettingsPage,
  SubscriptionSettingsPage,
  InvoicesSettingsPage,
  WebhooksSettingsPage,
  ApiKeysSettingsPage,
} from "./pages/settings";

// Profile Pages
import {
  ProfilePage,
  SecurityPage,
  SessionsPage,
  NotificationsPage,
} from "./pages/profile";

// Docs Pages
import {
  DocsPage,
  DocEditorPage,
  DocHistoryPage,
} from "./pages/docs";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import TwoStepsPage from "./pages/auth/TwoStepsPage";

// Signup Pages (6 steps)
import {
  SignupCredentialsPage,
  SignupVerifyPage,
  SignupProfilePage,
  SignupOrganizationPage,
  SignupPlanPage,
  SignupCheckoutPage,
} from "./pages/signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* =====================================
                ÁREA PÚBLICA - LANDING & PAGES
            ===================================== */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Protected Routes with Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* =====================================
                  DASHBOARDS
              ===================================== */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />

              {/* =====================================
                  DOCUMENTOS (WIKI)
              ===================================== */}
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/docs/:id" element={<DocEditorPage />} />
              <Route path="/docs/:id/history" element={<DocHistoryPage />} />

              {/* =====================================
                  MÓDULOS DO SAAS (growo.app)
              ===================================== */}
              <Route path="/organizations" element={<OrganizationsPage />} />
              <Route path="/organizations/new" element={<PlaceholderPage title="Nova Organização" />} />
              <Route path="/professionals" element={<PlaceholderPage title="Profissionais" />} />
              <Route path="/professionals/skills" element={<PlaceholderPage title="Skills" />} />
              <Route path="/clients" element={<PlaceholderPage title="Clientes" />} />
              <Route path="/projects" element={<PlaceholderPage title="Projetos" />} />
              <Route path="/projects/kanban" element={<PlaceholderPage title="Kanban" />} />
              <Route path="/timesheet" element={<PlaceholderPage title="Lançamentos" />} />
              <Route path="/timesheet/calendar" element={<PlaceholderPage title="Calendário de Timesheet" />} />
              <Route path="/timesheet/reports" element={<PlaceholderPage title="Relatórios de Timesheet" />} />
              <Route path="/calendar" element={<PlaceholderPage title="Calendário" />} />

              {/* =====================================
                  CONFIGURAÇÕES DA ORGANIZAÇÃO
              ===================================== */}
              <Route path="/settings/organization" element={<OrganizationSettingsPage />} />
              <Route path="/settings/addresses" element={<AddressesSettingsPage />} />
              <Route path="/settings/contacts" element={<ContactsSettingsPage />} />
              <Route path="/settings/billing" element={<BillingSettingsPage />} />
              <Route path="/settings/subscription" element={<SubscriptionSettingsPage />} />
              <Route path="/settings/invoices" element={<InvoicesSettingsPage />} />
              <Route path="/settings/users" element={<UsersSettingsPage />} />
              <Route path="/settings/users/invite" element={<UserInvitePage />} />
              <Route path="/settings/users/:id" element={<UserDetailsPage />} />
              <Route path="/settings/webhooks" element={<WebhooksSettingsPage />} />
              <Route path="/settings/api-keys" element={<ApiKeysSettingsPage />} />
              <Route path="/settings/preferences" element={<PlaceholderPage title="Preferências" description="Configurações de localização e aparência." />} />

              {/* =====================================
                  PERFIL DO USUÁRIO
              ===================================== */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/security" element={<SecurityPage />} />
              <Route path="/profile/sessions" element={<SessionsPage />} />
              <Route path="/profile/notifications" element={<NotificationsPage />} />

              {/* =====================================
                  NOTIFICAÇÕES
              ===================================== */}
              <Route path="/notifications" element={<PlaceholderPage title="Notificações" description="Central de notificações." />} />

              {/* =====================================
                  AJUDA E SUPORTE
              ===================================== */}
              <Route path="/help" element={<PlaceholderPage title="Central de Ajuda" description="Encontre respostas para suas dúvidas." />} />
              <Route path="/help/contact" element={<PlaceholderPage title="Suporte" description="Entre em contato com nossa equipe." />} />

              {/* =====================================
                  ÁREA ADMINISTRATIVA (Super Admin)
              ===================================== */}
              <Route path="/admin" element={<PlaceholderPage title="Dashboard Admin" description="Visão geral do sistema." />} />
              <Route path="/admin/organizations" element={<PlaceholderPage title="Organizações (Admin)" />} />
              <Route path="/admin/users" element={<PlaceholderPage title="Usuários (Admin)" />} />
              <Route path="/admin/plans" element={<PlansAdminPage />} />
              <Route path="/admin/features" element={<PlaceholderPage title="Features" />} />
              <Route path="/admin/landing" element={<LandingSettingsAdminPage />} />
              <Route path="/admin/logs" element={<PlaceholderPage title="Logs do Sistema" />} />
            </Route>

            {/* =====================================
                ONBOARDING PÓS-CONVITE
            ===================================== */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/onboarding/profile" element={<PlaceholderPage title="Completar Perfil" description="Step 1 de 5" />} />
              <Route path="/onboarding/avatar" element={<PlaceholderPage title="Upload Avatar" description="Step 2 de 5" />} />
              <Route path="/onboarding/address" element={<PlaceholderPage title="Endereço" description="Step 3 de 5 (opcional)" />} />
              <Route path="/onboarding/contacts" element={<PlaceholderPage title="Contatos" description="Step 4 de 5" />} />
              <Route path="/onboarding/documents" element={<PlaceholderPage title="Documentos" description="Step 5 de 5 (opcional)" />} />
            </Route>

            {/* =====================================
                ÁREA PÚBLICA - AUTH
            ===================================== */}
            <Route
              path="/auth/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/auth/register"
              element={
                <PublicRoute>
                  <Navigate to="/signup" replace />
                </PublicRoute>
              }
            />
            <Route
              path="/auth/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPasswordPage />
                </PublicRoute>
              }
            />
            
            {/* These routes need to work for authenticated users too */}
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
            <Route path="/auth/two-steps" element={<TwoStepsPage />} />

            {/* =====================================
                SIGNUP FLOW (6 Steps)
            ===================================== */}
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupCredentialsPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup/verify"
              element={
                <PublicRoute>
                  <SignupVerifyPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup/profile"
              element={
                <PublicRoute>
                  <SignupProfilePage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup/organization"
              element={
                <PublicRoute>
                  <SignupOrganizationPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup/plan"
              element={
                <PublicRoute>
                  <SignupPlanPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup/checkout"
              element={
                <PublicRoute>
                  <SignupCheckoutPage />
                </PublicRoute>
              }
            />

            {/* Invite acceptance */}
            <Route path="/invite/:token" element={<PlaceholderPage title="Aceitar Convite" />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Placeholder page component for routes not yet implemented
function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-heading">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
        {!description && <p className="text-muted-foreground">Esta página está em desenvolvimento.</p>}
      </div>
      <div className="bg-card border rounded-lg p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-3xl">🚧</span>
        </div>
        <h2 className="text-lg font-medium text-foreground mb-2">Em Construção</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Estamos trabalhando para trazer esta funcionalidade em breve. Volte mais tarde!
        </p>
      </div>
    </div>
  );
}

export default App;
