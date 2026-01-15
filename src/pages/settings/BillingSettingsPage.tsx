import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Star,
  Shield,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  type: "card";
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

// Mock data
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    brand: "visa",
    last4: "4242",
    exp_month: 12,
    exp_year: 2027,
    is_default: true,
  },
  {
    id: "2",
    type: "card",
    brand: "mastercard",
    last4: "5555",
    exp_month: 6,
    exp_year: 2026,
    is_default: false,
  },
];

const brandLogos: Record<string, string> = {
  visa: "💳 Visa",
  mastercard: "💳 Mastercard",
  amex: "💳 American Express",
  elo: "💳 Elo",
};

export function BillingSettingsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
      toast.success("Método de pagamento removido!");
    } catch (error) {
      toast.error("Erro ao remover método de pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        is_default: pm.id === id,
      }))
    );
    toast.success("Método de pagamento padrão atualizado!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Métodos de Pagamento</h1>
          <p className="text-muted-foreground">
            Gerencie seus cartões e métodos de pagamento.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-3d">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Cartão
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Cartão</DialogTitle>
              <DialogDescription>
                Adicione um novo cartão de crédito ou débito.
              </DialogDescription>
            </DialogHeader>
            <CardForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Security Notice */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-4">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <p className="font-medium text-foreground">Seus dados estão seguros</p>
            <p className="text-sm text-muted-foreground">
              Todas as transações são processadas com criptografia de ponta a ponta.
              Não armazenamos os dados completos do seu cartão.
            </p>
          </div>
        </CardContent>
      </Card>

      {paymentMethods.length === 0 ? (
        <Card className="card-3d">
          <CardContent className="py-12 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum método de pagamento
            </h3>
            <p className="text-muted-foreground mb-4">
              Adicione um cartão para começar a usar o serviço.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Cartão
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {paymentMethods.map((pm) => (
            <Card key={pm.id} className="card-3d">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-10 rounded bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-medium">
                      {pm.brand.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">
                          {brandLogos[pm.brand] || `💳 ${pm.brand}`}
                        </h3>
                        {pm.is_default && (
                          <Badge variant="default" className="bg-primary">
                            <Star className="w-3 h-3 mr-1" />
                            Padrão
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        •••• •••• •••• {pm.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expira em {String(pm.exp_month).padStart(2, "0")}/{pm.exp_year}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!pm.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(pm.id)}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Definir como padrão
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover cartão?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O cartão será
                            removido da sua conta.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(pm.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

interface CardFormProps {
  onClose: () => void;
}

function CardForm({ onClose }: CardFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      toast.success("Cartão adicionado com sucesso!");
      onClose();
    } catch (error) {
      toast.error("Erro ao adicionar cartão");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card_number">Número do Cartão *</Label>
        <Input
          id="card_number"
          placeholder="0000 0000 0000 0000"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="card_name">Nome no Cartão *</Label>
        <Input
          id="card_name"
          placeholder="Nome como está no cartão"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Validade *</Label>
          <Input
            id="expiry"
            placeholder="MM/AA"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV *</Label>
          <Input
            id="cvv"
            placeholder="123"
            maxLength={4}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Adicionar Cartão
        </Button>
      </div>
    </form>
  );
}
