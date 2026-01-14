import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import { DashboardLayout } from "@/components/layout";

import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/dashboard/DashboardPage";
import { OrganizationsPage } from "./pages/organizations";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import TwoStepsPage from "./pages/auth/TwoStepsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Protected Routes with Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              <Route path="/analytics" element={<DashboardPage />} />
              <Route path="/organizations" element={<OrganizationsPage />} />
              <Route path="/users" element={<PlaceholderPage title="Usuários" />} />
              <Route path="/professionals" element={<PlaceholderPage title="Profissionais" />} />
              <Route path="/clients" element={<PlaceholderPage title="Clientes" />} />
              <Route path="/projects" element={<PlaceholderPage title="Projetos" />} />
              <Route path="/timesheet" element={<PlaceholderPage title="Timesheet" />} />
              <Route path="/calendar" element={<PlaceholderPage title="Calendário" />} />
              <Route path="/invoices" element={<PlaceholderPage title="Faturas" />} />
              <Route path="/billing" element={<PlaceholderPage title="Cobrança" />} />
              <Route path="/settings/*" element={<PlaceholderPage title="Configurações" />} />
              <Route path="/docs" element={<PlaceholderPage title="Documentação" />} />
              <Route path="/support" element={<PlaceholderPage title="Suporte" />} />
            </Route>

            {/* Public Auth Routes - redirect to home if authenticated */}
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
                  <RegisterPage />
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

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Placeholder page component for routes not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-heading">{title}</h1>
        <p className="text-muted-foreground">Esta página está em desenvolvimento.</p>
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
