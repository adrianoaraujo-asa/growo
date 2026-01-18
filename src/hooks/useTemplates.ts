import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/providers/AuthProvider";
import type { Json } from "@/integrations/supabase/types";

export interface Template {
  id: string;
  title: string;
  content: Json | null;
  icon: string | null;
  description?: string;
  category?: string;
  workspace_id: string;
  created_at: string;
}

export function useTemplates(workspaceId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  const templatesQuery = useQuery({
    queryKey: ["templates", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("is_template", true)
        .is("deleted_at", null)
        .order("title");

      if (error) throw error;
      return data as Template[];
    },
    enabled: !!workspaceId,
  });

  const createTemplate = useMutation({
    mutationFn: async (input: {
      title: string;
      content?: Json;
      icon?: string;
    }) => {
      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: input.title,
          workspace_id: workspaceId,
          content: input.content || ([{ type: "paragraph", content: [] }] as unknown as Json),
          icon: input.icon || "📋",
          is_template: true,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Template;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", workspaceId] });
    },
  });

  const createFromTemplate = useMutation({
    mutationFn: async ({
      templateId,
      title,
      folderId,
    }: {
      templateId: string;
      title?: string;
      folderId?: string | null;
    }) => {
      const template = templatesQuery.data?.find((t) => t.id === templateId);
      if (!template) throw new Error("Template not found");

      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: title || template.title,
          workspace_id: workspaceId,
          content: template.content,
          icon: template.icon,
          folder_id: folderId || null,
          is_template: false,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", workspaceId] });
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("documents")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", workspaceId] });
    },
  });

  return {
    templates: templatesQuery.data || [],
    isLoading: templatesQuery.isLoading,
    error: templatesQuery.error,
    createTemplate,
    createFromTemplate,
    deleteTemplate,
  };
}

// Built-in templates
export const builtInTemplates = [
  {
    id: "blank",
    title: "Página em branco",
    icon: "📄",
    content: [{ type: "paragraph", content: [] }],
  },
  {
    id: "meeting-notes",
    title: "Notas de Reunião",
    icon: "📝",
    content: [
      { type: "heading", props: { level: 1 }, content: [{ type: "text", text: "Notas de Reunião" }] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "📅 Data" }] },
      { type: "paragraph", content: [] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "👥 Participantes" }] },
      { type: "bulletListItem", content: [] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "📋 Pauta" }] },
      { type: "bulletListItem", content: [] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "✅ Ações" }] },
      { type: "checkListItem", content: [] },
    ],
  },
  {
    id: "project-brief",
    title: "Briefing de Projeto",
    icon: "🎯",
    content: [
      { type: "heading", props: { level: 1 }, content: [{ type: "text", text: "Briefing do Projeto" }] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "Visão Geral" }] },
      { type: "paragraph", content: [{ type: "text", text: "Descreva o objetivo principal do projeto..." }] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "Objetivos" }] },
      { type: "bulletListItem", content: [] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "Cronograma" }] },
      { type: "paragraph", content: [] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "Recursos" }] },
      { type: "bulletListItem", content: [] },
    ],
  },
  {
    id: "weekly-review",
    title: "Revisão Semanal",
    icon: "📊",
    content: [
      { type: "heading", props: { level: 1 }, content: [{ type: "text", text: "Revisão Semanal" }] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "🎉 Conquistas" }] },
      { type: "bulletListItem", content: [] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "🚧 Desafios" }] },
      { type: "bulletListItem", content: [] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "📅 Próxima Semana" }] },
      { type: "checkListItem", content: [] },
    ],
  },
  {
    id: "documentation",
    title: "Documentação Técnica",
    icon: "📚",
    content: [
      { type: "heading", props: { level: 1 }, content: [{ type: "text", text: "Documentação" }] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "Introdução" }] },
      { type: "paragraph", content: [] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "Requisitos" }] },
      { type: "bulletListItem", content: [] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "Instalação" }] },
      { type: "codeBlock", props: { language: "bash" }, content: [] },
      { type: "heading", props: { level: 2 }, content: [{ type: "text", text: "Uso" }] },
      { type: "paragraph", content: [] },
    ],
  },
];
