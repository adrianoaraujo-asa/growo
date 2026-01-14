import { useAuthContext } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Erro ao sair: " + error.message);
    } else {
      toast.success("Logout realizado com sucesso!");
      navigate("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-foreground">Sneat SaaS</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border p-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Bem-vindo ao Dashboard! 🎉
            </h1>
            <p className="text-muted-foreground mb-6">
              Você está autenticado como <strong>{user?.email}</strong>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-2">Próximo Passo</h3>
                <p className="text-sm text-muted-foreground">
                  Criar o layout do dashboard com sidebar e navbar
                </p>
              </div>
              <div className="bg-success/5 rounded-lg p-6 border border-success/20">
                <h3 className="font-semibold text-foreground mb-2">Autenticação</h3>
                <p className="text-sm text-muted-foreground">
                  ✓ Login, Registro e Proteção de Rotas implementados
                </p>
              </div>
              <div className="bg-warning/5 rounded-lg p-6 border border-warning/20">
                <h3 className="font-semibold text-foreground mb-2">Em Breve</h3>
                <p className="text-sm text-muted-foreground">
                  Integração com Stripe para pagamentos
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
