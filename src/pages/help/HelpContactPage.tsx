import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { 
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Bug,
  CreditCard,
  Sparkles,
  Building2,
} from "lucide-react";

const categories = [
  { id: "general", label: "Dúvida Geral", icon: HelpCircle },
  { id: "technical", label: "Problema Técnico", icon: Bug },
  { id: "billing", label: "Financeiro / Cobrança", icon: CreditCard },
  { id: "feature", label: "Sugestão de Funcionalidade", icon: Sparkles },
  { id: "enterprise", label: "Plano Enterprise", icon: Building2 },
];

const priorities = [
  { id: "low", label: "Baixa", description: "Posso esperar alguns dias" },
  { id: "medium", label: "Média", description: "Preciso de resposta em 24h" },
  { id: "high", label: "Alta", description: "Afeta meu trabalho" },
  { id: "urgent", label: "Urgente", description: "Sistema indisponível" },
];

export default function HelpContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState({
    category: "",
    priority: "medium",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Ticket enviado com sucesso!");
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Suporte"
          description="Entre em contato com nossa equipe"
        />
        
        <Card className="card-3d max-w-2xl mx-auto">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Ticket Enviado!</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Recebemos sua mensagem e responderemos em breve. Você receberá uma notificação por email quando tivermos novidades.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6 inline-block">
              <p className="text-sm text-muted-foreground">Número do ticket</p>
              <p className="font-mono font-semibold">#TICKET-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button asChild variant="outline">
                <Link to="/help">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar à Central de Ajuda
                </Link>
              </Button>
              <Button onClick={() => setIsSubmitted(false)}>
                Enviar Outro Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suporte"
        description="Entre em contato com nossa equipe"
        action={
          <Button asChild variant="outline">
            <Link to="/help">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Form */}
        <Card className="card-3d lg:col-span-2">
          <CardHeader>
            <CardTitle>Abrir Ticket de Suporte</CardTitle>
            <CardDescription>
              Descreva seu problema ou dúvida e responderemos o mais rápido possível
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select 
                    value={form.category} 
                    onValueChange={(v) => setForm(prev => ({ ...prev, category: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <SelectItem key={cat.id} value={cat.id}>
                            <span className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {cat.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Prioridade *</Label>
                  <Select 
                    value={form.priority} 
                    onValueChange={(v) => setForm(prev => ({ ...prev, priority: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.id} value={priority.id}>
                          <div>
                            <span>{priority.label}</span>
                            <span className="text-muted-foreground text-xs ml-2">
                              - {priority.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assunto *</Label>
                <Input 
                  placeholder="Descreva brevemente o problema"
                  value={form.subject}
                  onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Mensagem *</Label>
                <Textarea 
                  placeholder="Descreva o problema com o máximo de detalhes possível. Inclua passos para reproduzir, mensagens de erro, etc."
                  rows={8}
                  value={form.message}
                  onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-4 bg-info/10 rounded-lg text-sm">
                <AlertCircle className="h-5 w-5 text-info shrink-0" />
                <p className="text-info">
                  <strong>Dica:</strong> Quanto mais detalhes você fornecer, mais rápido poderemos ajudar. 
                  Inclua capturas de tela se possível.
                </p>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar Ticket
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info Sidebar */}
        <div className="space-y-4">
          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="text-lg">Outras Formas de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:suporte@growo.app" className="text-sm text-primary hover:underline">
                    suporte@growo.app
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <MessageCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">Chat ao Vivo</p>
                  <p className="text-sm text-muted-foreground">
                    Disponível em horário comercial
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <Phone className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">
                    +55 (11) 4000-0000
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horário de Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Segunda a Sexta</span>
                <span className="font-medium">09:00 - 18:00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sábado</span>
                <span className="font-medium">09:00 - 13:00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Domingo</span>
                <span className="font-medium text-muted-foreground">Fechado</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  Fuso horário: Brasília (GMT-3)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-3d bg-gradient-to-br from-warning/10 to-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Sparkles className="h-6 w-6 text-warning" />
                <div>
                  <h4 className="font-semibold">Plano Enterprise?</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clientes Enterprise têm acesso a suporte prioritário 24/7 com SLA garantido.
                  </p>
                  <Button variant="link" className="px-0 mt-2 text-warning">
                    Saiba mais →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
