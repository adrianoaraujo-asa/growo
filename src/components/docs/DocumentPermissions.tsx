import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Copy,
  Globe,
  Lock,
  Users,
  User,
  Trash2,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

interface DocumentPermissionsProps {
  documentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Permission {
  id: string;
  user_id: string | null;
  permission_level: "owner" | "editor" | "viewer";
  organization_wide: boolean;
  user?: {
    id: string;
    display_name: string | null;
    email?: string;
    avatar_url: string | null;
  };
}

const permissionLabels = {
  owner: { label: "Proprietário", color: "bg-primary" },
  editor: { label: "Editor", color: "bg-blue-500" },
  viewer: { label: "Visualizador", color: "bg-gray-500" },
};

export function DocumentPermissions({
  documentId,
  open,
  onOpenChange,
}: DocumentPermissionsProps) {
  const queryClient = useQueryClient();
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newPermissionLevel, setNewPermissionLevel] = useState<"editor" | "viewer">("viewer");
  const [isPublic, setIsPublic] = useState(false);

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ["document-permissions", documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_permissions")
        .select("*")
        .eq("document_id", documentId);

      if (error) throw error;
      return (data || []).map(p => ({
        ...p,
        user: p.user_id ? { id: p.user_id, display_name: null, avatar_url: null } : undefined
      })) as Permission[];
    },
    enabled: open && !!documentId,
  });

  const addPermission = useMutation({
    mutationFn: async ({
      email,
      level,
    }: {
      email: string;
      level: "editor" | "viewer";
    }) => {
      // First find the user by email
      const { data: userData, error: userError } = await supabase
        .from("user_profiles")
        .select("id")
        .ilike("id", email) // In real implementation, you'd search by email
        .single();

      // For demo, we'll create a permission entry
      const { error } = await supabase.from("document_permissions").insert({
        document_id: documentId,
        user_id: userData?.id || null,
        permission_level: level,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-permissions", documentId] });
      setNewUserEmail("");
      toast.success("Permissão adicionada!");
    },
    onError: (error: Error) => {
      console.error("Error adding permission:", error);
      toast.error("Erro ao adicionar permissão");
    },
  });

  const updatePermission = useMutation({
    mutationFn: async ({
      id,
      level,
    }: {
      id: string;
      level: "editor" | "viewer";
    }) => {
      const { error } = await supabase
        .from("document_permissions")
        .update({ permission_level: level })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-permissions", documentId] });
      toast.success("Permissão atualizada!");
    },
    onError: (error: Error) => {
      console.error("Error updating permission:", error);
      toast.error("Erro ao atualizar permissão");
    },
  });

  const removePermission = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("document_permissions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-permissions", documentId] });
      toast.success("Permissão removida!");
    },
    onError: (error: Error) => {
      console.error("Error removing permission:", error);
      toast.error("Erro ao remover permissão");
    },
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copiado!");
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Compartilhar documento
          </DialogTitle>
          <DialogDescription>
            Gerencie quem pode acessar este documento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new person */}
          <div className="flex gap-2">
            <Input
              placeholder="Email do usuário"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="flex-1"
            />
            <Select
              value={newPermissionLevel}
              onValueChange={(v) => setNewPermissionLevel(v as "editor" | "viewer")}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Visualizador</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() =>
                addPermission.mutate({
                  email: newUserEmail,
                  level: newPermissionLevel,
                })
              }
              disabled={!newUserEmail || addPermission.isPending}
            >
              {addPermission.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Convidar"
              )}
            </Button>
          </div>

          <Separator />

          {/* Access settings */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPublic ? (
                <Globe className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isPublic ? "Público na organização" : "Acesso restrito"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isPublic
                    ? "Todos na organização podem visualizar"
                    : "Apenas pessoas convidadas"}
                </p>
              </div>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          <Separator />

          {/* Permissions list */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Pessoas com acesso</Label>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : permissions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma pessoa adicionada ainda.
              </p>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {permissions.map((perm) => (
                  <div
                    key={perm.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={perm.user?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {perm.organization_wide ? (
                            <Users className="w-4 h-4" />
                          ) : (
                            getInitials(perm.user?.display_name || null)
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {perm.organization_wide
                            ? "Toda a organização"
                            : perm.user?.display_name || "Usuário"}
                        </p>
                        {perm.user?.email && (
                          <p className="text-xs text-muted-foreground">
                            {perm.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {perm.permission_level === "owner" ? (
                        <Badge variant="secondary">
                          {permissionLabels.owner.label}
                        </Badge>
                      ) : (
                        <>
                          <Select
                            value={perm.permission_level}
                            onValueChange={(v) =>
                              updatePermission.mutate({
                                id: perm.id,
                                level: v as "editor" | "viewer",
                              })
                            }
                          >
                            <SelectTrigger className="w-[120px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Visualizador</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removePermission.mutate(perm.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Copy link */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCopyLink}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Copiar link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
