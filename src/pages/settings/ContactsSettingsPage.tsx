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

interface Contact {
  id: string;
  type: "email" | "phone" | "whatsapp" | "telegram" | "linkedin" | "other";
  value: string;
  label?: string;
  is_primary: boolean;
  is_verified: boolean;
}

const contactTypes = [
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Telefone", icon: Phone },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "telegram", label: "Telegram", icon: MessageCircle },
  { value: "linkedin", label: "LinkedIn", icon: MessageCircle },
  { value: "other", label: "Outro", icon: MessageCircle },
];

// Mock data
const mockContacts: Contact[] = [
  {
    id: "1",
    type: "email",
    value: "contato@empresa.com.br",
    label: "Email Principal",
    is_primary: true,
    is_verified: true,
  },
  {
    id: "2",
    type: "phone",
    value: "+55 11 99999-9999",
    label: "Telefone Comercial",
    is_primary: false,
    is_verified: true,
  },
  {
    id: "3",
    type: "whatsapp",
    value: "+55 11 98888-8888",
    label: "WhatsApp Suporte",
    is_primary: false,
    is_verified: false,
  },
];

export function ContactsSettingsPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      setContacts(contacts.filter((c) => c.id !== id));
      toast.success("Contato removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover contato");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPrimary = async (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;

    setContacts(
      contacts.map((c) => ({
        ...c,
        is_primary: c.type === contact.type ? c.id === id : c.is_primary,
      }))
    );
    toast.success("Contato principal atualizado!");
  };

  const getContactIcon = (type: string) => {
    const contactType = contactTypes.find((t) => t.value === type);
    const Icon = contactType?.icon || MessageCircle;
    return <Icon className="w-5 h-5 text-primary" />;
  };

  const getTypeLabel = (type: string) => {
    return contactTypes.find((t) => t.value === type)?.label || type;
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
          <h1 className="text-2xl font-semibold text-heading">Contatos</h1>
          <p className="text-muted-foreground">
            Gerencie os contatos da sua organização.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              onClose={() => {
                setIsDialogOpen(false);
                setEditingContact(null);
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
                        onClick={() => handleSetPrimary(contact.id)}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Definir como principal
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingContact(contact);
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
  contact?: Contact | null;
  onClose: () => void;
}

function ContactForm({ contact, onClose }: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<string>(contact?.type || "email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      toast.success(
        contact ? "Contato atualizado!" : "Contato adicionado!"
      );
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar contato");
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
        <Select value={type} onValueChange={setType}>
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
          defaultValue={contact?.value}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Identificação</Label>
        <Input
          id="label"
          placeholder="Ex: Email Principal, Suporte, etc."
          defaultValue={contact?.label}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {contact ? "Salvar" : "Adicionar"}
        </Button>
      </div>
    </form>
  );
}
