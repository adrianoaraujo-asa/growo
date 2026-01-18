import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { BillingPlan } from "@/types/landing";

interface PlanFormData {
  name: string;
  slug: string;
  description: string;
  features: string[];
  price_monthly: number;
  price_yearly: number;
  currency: string;
  trial_days: number;
  is_active: boolean;
  is_public: boolean;
  sort_order: number;
}

const defaultFormData: PlanFormData = {
  name: "",
  slug: "",
  description: "",
  features: [],
  price_monthly: 0,
  price_yearly: 0,
  currency: "BRL",
  trial_days: 14,
  is_active: true,
  is_public: true,
  sort_order: 0,
};

const SUPABASE_URL = "https://ujkxdoypfazesiyjqdub.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqa3hkb3lwZmF6ZXNpeWpxZHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjM0NjcsImV4cCI6MjA4MzkzOTQ2N30.VoL7GY0_MMLV-7H0GHM_EKBxzvqqP_6sqlesOZO0WVc";

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || "";
}

async function fetchPlans(): Promise<BillingPlan[]> {
  const token = await getAccessToken();
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/plans?deleted_at=is.null&order=sort_order.asc`,
    {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Profile": "billing"
      }
    }
  );
  if (!response.ok) throw new Error("Failed to fetch plans");
  return response.json();
}

export default function PlansAdminPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<BillingPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<BillingPlan | null>(null);
  const [formData, setFormData] = useState<PlanFormData>(defaultFormData);
  const [featuresText, setFeaturesText] = useState("");

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["admin-billing-plans"],
    queryFn: fetchPlans,
  });

  const createMutation = useMutation({
    mutationFn: async (data: PlanFormData) => {
      const token = await getAccessToken();
      const response = await fetch(`${SUPABASE_URL}/rest/v1/plans`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Content-Profile": "billing"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(await response.text());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-billing-plans"] });
      queryClient.invalidateQueries({ queryKey: ["billing-plans-public"] });
      toast({ title: "Plano criado com sucesso!" });
      closeDialog();
    },
    onError: (error) => {
      toast({ title: "Erro ao criar plano", description: String(error), variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PlanFormData> }) => {
      const token = await getAccessToken();
      const response = await fetch(`${SUPABASE_URL}/rest/v1/plans?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Content-Profile": "billing"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(await response.text());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-billing-plans"] });
      queryClient.invalidateQueries({ queryKey: ["billing-plans-public"] });
      toast({ title: "Plano atualizado com sucesso!" });
      closeDialog();
    },
    onError: (error) => {
      toast({ title: "Erro ao atualizar plano", description: String(error), variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessToken();
      const response = await fetch(`${SUPABASE_URL}/rest/v1/plans?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Content-Profile": "billing"
        },
        body: JSON.stringify({ deleted_at: new Date().toISOString() })
      });
      if (!response.ok) throw new Error(await response.text());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-billing-plans"] });
      queryClient.invalidateQueries({ queryKey: ["billing-plans-public"] });
      toast({ title: "Plano excluído com sucesso!" });
      setIsDeleteDialogOpen(false);
      setDeletingPlan(null);
    },
    onError: (error) => {
      toast({ title: "Erro ao excluir plano", description: String(error), variant: "destructive" });
    },
  });

  const openCreateDialog = () => {
    setEditingPlan(null);
    setFormData(defaultFormData);
    setFeaturesText("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (plan: BillingPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      slug: plan.slug,
      description: plan.description || "",
      features: plan.features || [],
      price_monthly: plan.price_monthly,
      price_yearly: plan.price_yearly,
      currency: plan.currency,
      trial_days: plan.trial_days,
      is_active: plan.is_active,
      is_public: plan.is_public,
      sort_order: plan.sort_order,
    });
    setFeaturesText((plan.features || []).join("\n"));
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPlan(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresText.split("\n").map(f => f.trim()).filter(f => f.length > 0);
    const submitData = { ...formData, features };

    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Planos de Assinatura</h1>
          <p className="text-muted-foreground">Gerencie os planos disponíveis.</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      <div className="bg-card border rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum plano cadastrado.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Preço Mensal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell className="text-muted-foreground">{plan.slug}</TableCell>
                  <TableCell>{formatCurrency(plan.price_monthly, plan.currency)}</TableCell>
                  <TableCell>
                    {plan.is_active ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Ativo</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Inativo</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(plan)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingPlan(plan); setIsDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Editar Plano" : "Novo Plano"}</DialogTitle>
            <DialogDescription>Preencha as informações do plano.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: formData.slug || generateSlug(e.target.value) })} required />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Preço Mensal</Label>
                <Input type="number" step="0.01" value={formData.price_monthly} onChange={(e) => setFormData({ ...formData, price_monthly: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Preço Anual</Label>
                <Input type="number" step="0.01" value={formData.price_yearly} onChange={(e) => setFormData({ ...formData, price_yearly: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Trial (dias)</Label>
                <Input type="number" value={formData.trial_days} onChange={(e) => setFormData({ ...formData, trial_days: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Features (uma por linha)</Label>
              <Textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={4} />
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                <Label>Ativo</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_public} onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })} />
                <Label>Público</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingPlan ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir plano?</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir "{deletingPlan?.name}"?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive" onClick={() => deletingPlan && deleteMutation.mutate(deletingPlan.id)}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
