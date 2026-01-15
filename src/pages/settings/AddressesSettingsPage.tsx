import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Edit, Trash2, Star, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Address {
  id: string;
  label: string;
  type: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
}

const addressTypes = [
  { value: "headquarters", label: "Sede" },
  { value: "branch", label: "Filial" },
  { value: "billing", label: "Cobrança" },
  { value: "shipping", label: "Entrega" },
  { value: "other", label: "Outro" },
];

// Mock data
const mockAddresses: Address[] = [
  {
    id: "1",
    label: "Escritório Principal",
    type: "headquarters",
    street: "Av. Paulista",
    number: "1000",
    complement: "Sala 1001",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    postal_code: "01310-100",
    country: "Brasil",
    is_primary: true,
  },
  {
    id: "2",
    label: "Filial Rio",
    type: "branch",
    street: "Av. Rio Branco",
    number: "156",
    neighborhood: "Centro",
    city: "Rio de Janeiro",
    state: "RJ",
    postal_code: "20040-003",
    country: "Brasil",
    is_primary: false,
  },
];

export function AddressesSettingsPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      setAddresses(addresses.filter((a) => a.id !== id));
      toast.success("Endereço removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover endereço");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPrimary = async (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        is_primary: a.id === id,
      }))
    );
    toast.success("Endereço principal atualizado!");
  };

  const getTypeLabel = (type: string) => {
    return addressTypes.find((t) => t.value === type)?.label || type;
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
          <h1 className="text-2xl font-semibold text-heading">Endereços</h1>
          <p className="text-muted-foreground">
            Gerencie os endereços da sua organização.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-3d">
              <Plus className="w-4 h-4 mr-2" />
              Novo Endereço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Editar Endereço" : "Novo Endereço"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do endereço.
              </DialogDescription>
            </DialogHeader>
            <AddressForm
              address={editingAddress}
              onClose={() => {
                setIsDialogOpen(false);
                setEditingAddress(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card className="card-3d">
          <CardContent className="py-12 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum endereço cadastrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Adicione o primeiro endereço da sua organização.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Endereço
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className="card-3d">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">
                          {address.label}
                        </h3>
                        <Badge variant="secondary">
                          {getTypeLabel(address.type)}
                        </Badge>
                        {address.is_primary && (
                          <Badge variant="default" className="bg-primary">
                            <Star className="w-3 h-3 mr-1" />
                            Principal
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address.street}, {address.number}
                        {address.complement && ` - ${address.complement}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.neighborhood}, {address.city} - {address.state}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        CEP: {address.postal_code}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!address.is_primary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetPrimary(address.id)}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Definir como principal
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingAddress(address);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover endereço?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O endereço será
                            permanentemente removido.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(address.id)}
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

interface AddressFormProps {
  address?: Address | null;
  onClose: () => void;
}

function AddressForm({ address, onClose }: AddressFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Implement API call
      toast.success(
        address ? "Endereço atualizado!" : "Endereço adicionado!"
      );
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar endereço");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="label">Identificação *</Label>
          <Input
            id="label"
            placeholder="Ex: Escritório Principal"
            defaultValue={address?.label}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select defaultValue={address?.type || "headquarters"}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {addressTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="postal_code">CEP *</Label>
        <Input
          id="postal_code"
          placeholder="00000-000"
          defaultValue={address?.postal_code}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="street">Logradouro *</Label>
          <Input
            id="street"
            placeholder="Rua, Avenida, etc."
            defaultValue={address?.street}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="number">Número *</Label>
          <Input
            id="number"
            placeholder="123"
            defaultValue={address?.number}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            placeholder="Sala, Andar, etc."
            defaultValue={address?.complement}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro *</Label>
          <Input
            id="neighborhood"
            placeholder="Bairro"
            defaultValue={address?.neighborhood}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade *</Label>
          <Input
            id="city"
            placeholder="Cidade"
            defaultValue={address?.city}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado *</Label>
          <Input
            id="state"
            placeholder="UF"
            defaultValue={address?.state}
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
          {address ? "Salvar" : "Adicionar"}
        </Button>
      </div>
    </form>
  );
}
