import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface R2ImageProps {
  src: string | null;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
}

// Simple in-memory cache for signed URLs
const urlCache = new Map<string, { url: string; expiresAt: number }>();

async function getSignedUrl(key: string): Promise<string> {
  // Check cache first
  const cached = urlCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const response = await supabase.functions.invoke("r2-storage?action=download-url", {
    body: { key },
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  if (response.error) throw response.error;
  
  const signedUrl = response.data.downloadUrl;
  
  // Cache for 55 minutes (URLs expire in 60 minutes)
  urlCache.set(key, { 
    url: signedUrl, 
    expiresAt: Date.now() + 55 * 60 * 1000 
  });
  
  return signedUrl;
}

/**
 * Component that handles R2 images with presigned URLs
 * If the image URL is an R2 internal URL, it fetches a presigned download URL
 */
export function R2Image({ src, alt = "", className, fallback }: R2ImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!src) {
      setImageSrc(null);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    // Check if it's an R2 internal URL (needs signing)
    const isR2InternalUrl = src.includes('r2.cloudflarestorage.com');
    
    if (isR2InternalUrl) {
      // Extract the key from the URL
      // URL format: https://<account>.r2.cloudflarestorage.com/<bucket>/<key>
      try {
        const urlParts = new URL(src);
        const pathParts = urlParts.pathname.split('/').filter(Boolean);
        // Remove bucket name (first part) to get the key
        const key = pathParts.slice(1).join('/');
        
        if (key) {
          setIsLoading(true);
          setHasError(false);
          
          getSignedUrl(key)
            .then(signedUrl => {
              if (mountedRef.current) {
                setImageSrc(signedUrl);
              }
            })
            .catch(err => {
              console.error('Failed to get signed URL:', err);
              if (mountedRef.current) {
                setHasError(true);
              }
            })
            .finally(() => {
              if (mountedRef.current) {
                setIsLoading(false);
              }
            });
        }
      } catch (err) {
        console.error('Invalid URL:', src, err);
        setHasError(true);
      }
    } else {
      // It's already a public URL, use directly
      setImageSrc(src);
    }
  }, [src]);

  if (isLoading) {
    return (
      <div className={cn("bg-muted animate-pulse", className)} />
    );
  }

  if (hasError || !imageSrc) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
