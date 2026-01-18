import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/providers/AuthProvider";

export interface Comment {
  id: string;
  document_id: string;
  content: string;
  block_id?: string | null;
  selection_start?: number | null;
  selection_end?: number | null;
  parent_comment_id?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  resolved_by?: string | null;
  author?: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

// Note: This hook requires a comments table that doesn't exist yet
// For now, we'll use local state simulation
export function useComments(documentId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  // Simulated comments for now - replace with actual DB when table exists
  const commentsQuery = useQuery({
    queryKey: ["comments", documentId],
    queryFn: async (): Promise<Comment[]> => {
      // When comments table is created, uncomment this:
      // const { data, error } = await supabase
      //   .from("document_comments")
      //   .select("*, author:user_profiles(*)")
      //   .eq("document_id", documentId)
      //   .is("deleted_at", null)
      //   .order("created_at", { ascending: true });
      // if (error) throw error;
      // return data;
      
      // For now, return empty array
      return [];
    },
    enabled: !!documentId,
  });

  const addComment = useMutation({
    mutationFn: async (input: {
      content: string;
      blockId?: string;
      selectionStart?: number;
      selectionEnd?: number;
      parentCommentId?: string;
    }): Promise<Comment> => {
      // When comments table exists:
      // const { data, error } = await supabase
      //   .from("document_comments")
      //   .insert({
      //     document_id: documentId,
      //     content: input.content,
      //     block_id: input.blockId,
      //     selection_start: input.selectionStart,
      //     selection_end: input.selectionEnd,
      //     parent_comment_id: input.parentCommentId,
      //     created_by: user?.id,
      //   })
      //   .select("*, author:user_profiles(*)")
      //   .single();
      // if (error) throw error;
      // return data;

      // Simulated response
      return {
        id: crypto.randomUUID(),
        document_id: documentId,
        content: input.content,
        block_id: input.blockId,
        selection_start: input.selectionStart,
        selection_end: input.selectionEnd,
        parent_comment_id: input.parentCommentId,
        created_by: user?.id || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", documentId] });
    },
  });

  const resolveComment = useMutation({
    mutationFn: async (commentId: string): Promise<void> => {
      // When comments table exists:
      // const { error } = await supabase
      //   .from("document_comments")
      //   .update({
      //     resolved_at: new Date().toISOString(),
      //     resolved_by: user?.id,
      //   })
      //   .eq("id", commentId);
      // if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", documentId] });
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string): Promise<void> => {
      // When comments table exists:
      // const { error } = await supabase
      //   .from("document_comments")
      //   .update({ deleted_at: new Date().toISOString() })
      //   .eq("id", commentId);
      // if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", documentId] });
    },
  });

  // Build thread structure
  const buildThreads = (comments: Comment[]): Comment[] => {
    const rootComments = comments.filter((c) => !c.parent_comment_id);
    return rootComments.map((comment) => ({
      ...comment,
      replies: comments.filter((c) => c.parent_comment_id === comment.id),
    }));
  };

  const threads = buildThreads(commentsQuery.data || []);
  const unresolvedCount = (commentsQuery.data || []).filter(
    (c) => !c.resolved_at && !c.parent_comment_id
  ).length;

  return {
    comments: commentsQuery.data || [],
    threads,
    unresolvedCount,
    isLoading: commentsQuery.isLoading,
    error: commentsQuery.error,
    addComment,
    resolveComment,
    deleteComment,
  };
}
