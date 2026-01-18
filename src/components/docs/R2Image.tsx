import { useState, useEffect } from "react";
import { useR2Storage } from "@/hooks/useR2Storage";
import { cn } from "@/lib/utils";

interface R2ImageProps {
  src: string | null;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Component that handles R2 images with presigned URLs
 * If the image URL is an R2 internal URL, it fetches a presigned download URL
 */
export function R2Image({ src, alt = "", className, fallback }: R2ImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { getDownloadUrl } = useR2Storage();

  useEffect(() => {
    if (!src) {
      setImageSrc(null);
      return;
    }

    // Check if it's an R2 internal URL (needs signing)
    const isR2InternalUrl = src.includes('r2.cloudflarestorage.com');
    
    if (isR2InternalUrl) {
      // Extract the key from the URL
      // URL format: https://<account>.r2.cloudflarestorage.com/<bucket>/<key>
      const urlParts = new URL(src);
      const pathParts = urlParts.pathname.split('/').filter(Boolean);
      // Remove bucket name (first part) to get the key
      const key = pathParts.slice(1).join('/');
      
      if (key) {
        setIsLoading(true);
        setHasError(false);
        
        getDownloadUrl(key)
          .then(signedUrl => {
            setImageSrc(signedUrl);
          })
          .catch(err => {
            console.error('Failed to get signed URL:', err);
            setHasError(true);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      // It's already a public URL, use directly
      setImageSrc(src);
    }
  }, [src, getDownloadUrl]);

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
