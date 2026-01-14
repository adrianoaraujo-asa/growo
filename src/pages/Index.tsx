import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-heading">Bem-vindo ao Sneat!</h1>
        <p className="text-xl text-muted-foreground">
          {user ? `Logado como ${user.email}` : "Sistema de gestão empresarial"}
        </p>
        
        <div className="flex gap-4 justify-center">
          {user ? (
            <Button onClick={() => signOut()} variant="outline">
              Sair
            </Button>
          ) : (
            <>
              <Link to="/auth/login">
                <Button>Entrar</Button>
              </Link>
              <Link to="/auth/register">
                <Button variant="outline">Criar conta</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
