import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Edit, Trash2, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useAddresses } from "@/hooks/useAddresses";
import { useCurrentOrganization } from "@/hooks/useCurrentOrganization";
import { Skeleton } from "@/components/ui/skeleton";
import type { Database } from "@/integrations/supabase/types";

type AddressType = Database["public"]["Enums"]["address_type"];

const addressTypes: { value: AddressType; label: string }[] = [
  { value: "headquarters", label: "Sede" },
  { value: "branch", label: "Filial" },
  { value: "billing", label: "Cobrança" },
  { value: "shipping", label: "Entrega" },
  { value: "home", label: "Residencial" },
  { value: "work", label: "Trabalho" },
  { value: "other", label: "Outro" },
];

export function AddressesSettingsPage() {
  const { data: organization, isLoading: orgLoading } = useCurrentOrganization();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const {
    addresses,
    isLoading: addressesLoading,
    deleteAddress,
    setPrimaryAddress,
  } = useAddresses({
    addressableType: "organization",
    addressableId: organization?.id || "",
  });

  const isLoading = orgLoading || addressesLoading;
  const editingAddress = editingAddressId 
    ? addresses.find(a => a.id === editingAddressId) 
    : null;

  const handleDelete = async (id: string) => {
    await deleteAddress.mutateAsync(id);
  };

  const handleSetPrimary = async (id: string) => {
    await setPrimaryAddress.mutateAsync(id);
  };

  const getTypeLabel = (type: string | null) => {
    if (!type) return "Outro";
    return addressTypes.find((t) => t.value === type)?.label || type;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!organization) {
    return (
      <Card className="card-3d">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Você não está vinculado a nenhuma organização.
          </p>
        </CardContent>
      </Card>
    );
  }

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
            Gerencie os endereços da organização <strong>{organization.name}</strong>.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingAddressId(null);
        }}>
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
              organizationId={organization.id}
              onClose={() => {
                setIsDialogOpen(false);
                setEditingAddressId(null);
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
                          {address.label || getTypeLabel(address.type)}
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
                        disabled={setPrimaryAddress.isPending}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Definir como principal
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingAddressId(address.id);
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
  address?: Database["public"]["Tables"]["addresses"]["Row"] | null;
  organizationId: string;
  onClose: () => void;
}

function AddressForm({ address, organizationId, onClose }: AddressFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: address?.label || "",
    type: (address?.type || "headquarters") as AddressType,
    postal_code: address?.postal_code || "",
    street: address?.street || "",
    number: address?.number || "",
    complement: address?.complement || "",
    neighborhood: address?.neighborhood || "",
    city: address?.city || "",
    state: address?.state || "",
    country: address?.country || "Brasil",
  });

  const { createAddress, updateAddress } = useAddresses({
    addressableType: "organization",
    addressableId: organizationId,
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (address) {
        await updateAddress.mutateAsync({
          id: address.id,
          ...formData,
        });
      } else {
        await createAddress.mutateAsync({
          ...formData,
          organization_id: organizationId,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
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
            value={formData.label}
            onChange={(e) => handleChange("label", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select 
            value={formData.type} 
            onValueChange={(v) => handleChange("type", v)}
          >
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
          value={formData.postal_code}
          onChange={(e) => handleChange("postal_code", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="street">Logradouro *</Label>
          <Input
            id="street"
            placeholder="Rua, Avenida, etc."
            value={formData.street}
            onChange={(e) => handleChange("street", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="number">Número *</Label>
          <Input
            id="number"
            placeholder="123"
            value={formData.number}
            onChange={(e) => handleChange("number", e.target.value)}
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
            value={formData.complement}
            onChange={(e) => handleChange("complement", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro *</Label>
          <Input
            id="neighborhood"
            placeholder="Bairro"
            value={formData.neighborhood}
            onChange={(e) => handleChange("neighborhood", e.target.value)}
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
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado *</Label>
          <Input
            id="state"
            placeholder="UF"
            value={formData.state}
            onChange={(e) => handleChange("state", e.target.value)}
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
