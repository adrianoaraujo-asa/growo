import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadOptions {
  documentId?: string;
  folder?: string;
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

export function useR2Storage() {
  const getUploadUrl = async (
    filename: string,
    contentType: string,
    options?: UploadOptions
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const folder = options?.folder || "uploads";
    const timestamp = Date.now();
    const key = `${folder}/${timestamp}-${filename}`;

    const response = await supabase.functions.invoke("r2-storage", {
      body: { key, contentType, documentId: options?.documentId },
      headers: { Authorization: `Bearer ${session.access_token}` },
      method: "POST",
    });

    if (response.error) throw response.error;
    return response.data;
  };

  const uploadFile = async (
    file: File,
    options?: UploadOptions
  ): Promise<UploadResult> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    try {
      // For small files (< 5MB), use direct upload
      if (file.size < 5 * 1024 * 1024) {
        const folder = options?.folder || "uploads";
        const timestamp = Date.now();
        const key = `${folder}/${timestamp}-${file.name}`;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("key", key);

        const response = await supabase.functions.invoke("r2-storage?action=upload", {
          body: formData,
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (response.error) throw response.error;
        return response.data;
      }

      // For larger files, use presigned URL
      const { uploadUrl, key, publicUrl } = await getUploadUrl(
        file.name,
        file.type,
        options
      );

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      return {
        key,
        url: publicUrl,
        size: file.size,
        contentType: file.type,
      };
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erro ao fazer upload do arquivo");
      throw error;
    }
  };

  const getDownloadUrl = async (key: string): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const response = await supabase.functions.invoke("r2-storage?action=download-url", {
      body: { key },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (response.error) throw response.error;
    return response.data.downloadUrl;
  };

  const deleteFile = async (key: string): Promise<void> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const response = await supabase.functions.invoke("r2-storage?action=delete", {
      body: { key },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (response.error) throw response.error;
  };

  return {
    uploadFile,
    getUploadUrl,
    getDownloadUrl,
    deleteFile,
  };
}
