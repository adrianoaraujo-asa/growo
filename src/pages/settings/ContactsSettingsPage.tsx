import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Loader2,
  CheckCircle2
} from "lucide-react";
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
import { useContacts } from "@/hooks/useContacts";
import { useCurrentOrganization } from "@/hooks/useCurrentOrganization";
import { Skeleton } from "@/components/ui/skeleton";
import type { Database } from "@/integrations/supabase/types";

type ContactType = Database["public"]["Enums"]["contact_type"];

const contactTypes: { value: ContactType; label: string; icon: React.ElementType }[] = [
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Telefone", icon: Phone },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "telegram", label: "Telegram", icon: MessageCircle },
  { value: "linkedin", label: "LinkedIn", icon: MessageCircle },
  { value: "other", label: "Outro", icon: MessageCircle },
];

export function ContactsSettingsPage() {
  const { data: organization, isLoading: orgLoading } = useCurrentOrganization();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  const {
    contacts,
    isLoading: contactsLoading,
    deleteContact,
    setPrimaryContact,
  } = useContacts({
    contactableType: "organization",
    contactableId: organization?.id || "",
  });

  const isLoading = orgLoading || contactsLoading;
  const editingContact = editingContactId 
    ? contacts.find(c => c.id === editingContactId) 
    : null;

  const handleDelete = async (id: string) => {
    await deleteContact.mutateAsync(id);
  };

  const handleSetPrimary = async (id: string, type: ContactType) => {
    await setPrimaryContact.mutateAsync({ id, type });
  };

  const getContactIcon = (type: string) => {
    const contactType = contactTypes.find((t) => t.value === type);
    const Icon = contactType?.icon || MessageCircle;
    return <Icon className="w-5 h-5 text-primary" />;
  };

  const getTypeLabel = (type: string) => {
    return contactTypes.find((t) => t.value === type)?.label || type;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
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
          <h1 className="text-2xl font-semibold text-heading">Contatos</h1>
          <p className="text-muted-foreground">
            Gerencie os contatos da organização <strong>{organization.name}</strong>.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingContactId(null);
        }}>
          <DialogTrigger asChild>
            <Button className="btn-3d">
              <Plus className="w-4 h-4 mr-2" />
              Novo Contato
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingContact ? "Editar Contato" : "Novo Contato"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do contato.
              </DialogDescription>
            </DialogHeader>
            <ContactForm
              contact={editingContact}
              organizationId={organization.id}
              onClose={() => {
                setIsDialogOpen(false);
                setEditingContactId(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {contacts.length === 0 ? (
        <Card className="card-3d">
          <CardContent className="py-12 text-center">
            <Phone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum contato cadastrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Adicione o primeiro contato da sua organização.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Contato
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="card-3d">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {getContactIcon(contact.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">
                          {contact.label || getTypeLabel(contact.type)}
                        </h3>
                        <Badge variant="secondary">
                          {getTypeLabel(contact.type)}
                        </Badge>
                        {contact.is_primary && (
                          <Badge variant="default" className="bg-primary">
                            <Star className="w-3 h-3 mr-1" />
                            Principal
                          </Badge>
                        )}
                        {contact.is_verified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {contact.value}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!contact.is_primary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetPrimary(contact.id, contact.type)}
                        disabled={setPrimaryContact.isPending}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Definir como principal
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingContactId(contact.id);
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
                          <AlertDialogTitle>Remover contato?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O contato será
                            permanentemente removido.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(contact.id)}
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

interface ContactFormProps {
  contact?: Database["public"]["Tables"]["contacts"]["Row"] | null;
  organizationId: string;
  onClose: () => void;
}

function ContactForm({ contact, organizationId, onClose }: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<ContactType>(contact?.type || "email");
  const [value, setValue] = useState(contact?.value || "");
  const [label, setLabel] = useState(contact?.label || "");

  const { createContact, updateContact } = useContacts({
    contactableType: "organization",
    contactableId: organizationId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (contact) {
        await updateContact.mutateAsync({
          id: contact.id,
          type,
          value,
          label: label || null,
        });
      } else {
        await createContact.mutateAsync({
          type,
          value,
          label: label || null,
          organization_id: organizationId,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case "email":
        return "email@empresa.com.br";
      case "phone":
      case "whatsapp":
        return "+55 11 99999-9999";
      case "telegram":
        return "@usuario";
      case "linkedin":
        return "https://linkedin.com/company/...";
      default:
        return "Valor do contato";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Tipo *</Label>
        <Select value={type} onValueChange={(v) => setType(v as ContactType)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {contactTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Valor *</Label>
        <Input
          id="value"
          placeholder={getPlaceholder()}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Identificação</Label>
        <Input
          id="label"
          placeholder="Ex: Email Principal, Suporte, etc."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || !value}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {contact ? "Salvar" : "Adicionar"}
        </Button>
      </div>
    </form>
  );
}
