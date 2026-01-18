import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AWS Signature V4 utilities
async function hmacSha256(key: Uint8Array, message: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key.buffer as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(message)
  );
  return new Uint8Array(signature);
}

async function sha256(message: string | Uint8Array): Promise<string> {
  const data = typeof message === "string" ? new TextEncoder().encode(message) : message;
  const hashBuffer = await crypto.subtle.digest("SHA-256", data.buffer as ArrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getSigningKey(
  secretKey: string,
  dateStamp: string,
  region: string,
  service: string
): Promise<Uint8Array> {
  const kDate = await hmacSha256(new TextEncoder().encode("AWS4" + secretKey), dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  return await hmacSha256(kService, "aws4_request");
}

async function signRequest(
  method: string,
  url: URL,
  headers: Record<string, string>,
  body: string | Uint8Array,
  accessKeyId: string,
  secretAccessKey: string,
  region = "auto",
  service = "s3"
): Promise<Record<string, string>> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = await sha256(body);
  
  const signedHeaders: Record<string, string> = {
    ...headers,
    host: url.host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };

  const sortedHeaderKeys = Object.keys(signedHeaders).sort();
  const canonicalHeaders = sortedHeaderKeys
    .map((k) => `${k.toLowerCase()}:${signedHeaders[k].trim()}`)
    .join("\n");
  const signedHeadersStr = sortedHeaderKeys.map((k) => k.toLowerCase()).join(";");

  const canonicalRequest = [
    method,
    url.pathname,
    url.searchParams.toString(),
    canonicalHeaders + "\n",
    signedHeadersStr,
    payloadHash,
  ].join("\n");

  const canonicalRequestHash = await sha256(canonicalRequest);
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    canonicalRequestHash,
  ].join("\n");

  const signingKey = await getSigningKey(secretAccessKey, dateStamp, region, service);
  const signature = toHex(await hmacSha256(signingKey, stringToSign));

  const authHeader = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeadersStr}, Signature=${signature}`;

  return {
    ...signedHeaders,
    Authorization: authHeader,
  };
}

async function generatePresignedUrl(
  method: string,
  bucket: string,
  key: string,
  expiresIn: number,
  accessKeyId: string,
  secretAccessKey: string,
  endpoint: string
): Promise<string> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);
  const region = "auto";
  const service = "s3";

  const url = new URL(`${endpoint}/${bucket}/${key}`);
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

  url.searchParams.set("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
  url.searchParams.set("X-Amz-Credential", `${accessKeyId}/${credentialScope}`);
  url.searchParams.set("X-Amz-Date", amzDate);
  url.searchParams.set("X-Amz-Expires", expiresIn.toString());
  url.searchParams.set("X-Amz-SignedHeaders", "host");

  const canonicalRequest = [
    method,
    `/${bucket}/${key}`,
    url.searchParams.toString(),
    `host:${url.host}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const canonicalRequestHash = await sha256(canonicalRequest);
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    canonicalRequestHash,
  ].join("\n");

  const signingKey = await getSigningKey(secretAccessKey, dateStamp, region, service);
  const signature = toHex(await hmacSha256(signingKey, stringToSign));

  url.searchParams.set("X-Amz-Signature", signature);

  return url.toString();
}

interface R2Config {
  access_key_id: string;
  secret_access_key: string;
  endpoint: string;
  bucket_name: string;
  public_url?: string;
  organization_id?: string;
}

interface StorageConfigRow {
  id: string;
  provider: string;
  organization_id: string | null;
  account_id: string | null;
  bucket_name: string;
  endpoint: string;
  public_url: string | null;
  access_key_id: string;
  secret_access_key: string;
  is_active: boolean;
}

// deno-lint-ignore no-explicit-any
async function getR2Config(supabase: any, organizationId?: string): Promise<R2Config | null> {
  // First try org-specific config, then fall back to global
  const { data, error } = await supabase.rpc('get_storage_config', {
    p_organization_id: organizationId || null
  }) as { data: StorageConfigRow[] | null; error: Error | null };

  if (error) {
    console.error('Error getting R2 config:', error);
    return null;
  }

  const config = data?.[0];
  if (!config) {
    // Fall back to global if org-specific not found
    if (organizationId) {
      const { data: globalData } = await supabase.rpc('get_storage_config', {
        p_organization_id: null
      }) as { data: StorageConfigRow[] | null; error: Error | null };
      const globalConfig = globalData?.[0];
      if (globalConfig) {
        return {
          access_key_id: globalConfig.access_key_id,
          secret_access_key: globalConfig.secret_access_key,
          endpoint: globalConfig.endpoint,
          bucket_name: globalConfig.bucket_name,
          public_url: globalConfig.public_url || undefined,
        };
      }
    }
    return null;
  }

  return {
    access_key_id: config.access_key_id,
    secret_access_key: config.secret_access_key,
    endpoint: config.endpoint,
    bucket_name: config.bucket_name,
    public_url: config.public_url || undefined,
    organization_id: config.organization_id || undefined,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's organization (optional, for org-specific storage)
    const { data: orgId } = await supabase.rpc('get_user_organization', {
      _user_id: user.id
    });

    // Get R2 credentials from database
    const r2Config = await getR2Config(supabase, orgId);

    if (!r2Config) {
      console.error('No R2 configuration found');
      return new Response(
        JSON.stringify({ error: 'R2 storage not configured. Please configure storage in admin settings.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { access_key_id: accessKeyId, secret_access_key: secretAccessKey, endpoint, bucket_name: bucketName, public_url: publicUrl } = r2Config;

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'upload-url': {
        // Generate presigned URL for upload
        const { key, contentType } = await req.json();
        
        if (!key || !contentType) {
          return new Response(
            JSON.stringify({ error: 'Missing key or contentType' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const presignedUrl = await generatePresignedUrl(
          'PUT',
          bucketName,
          key,
          3600, // 1 hour expiry
          accessKeyId,
          secretAccessKey,
          endpoint
        );

        return new Response(
          JSON.stringify({ 
            uploadUrl: presignedUrl,
            key,
            publicUrl: publicUrl ? `${publicUrl}/${key}` : `${endpoint}/${bucketName}/${key}`
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'download-url': {
        // Generate presigned URL for download
        const { key } = await req.json();
        
        if (!key) {
          return new Response(
            JSON.stringify({ error: 'Missing key' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const presignedUrl = await generatePresignedUrl(
          'GET',
          bucketName,
          key,
          3600, // 1 hour expiry
          accessKeyId,
          secretAccessKey,
          endpoint
        );

        return new Response(
          JSON.stringify({ downloadUrl: presignedUrl }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        // Delete file from R2
        const { key } = await req.json();
        
        if (!key) {
          return new Response(
            JSON.stringify({ error: 'Missing key' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const deleteUrl = new URL(`${endpoint}/${bucketName}/${key}`);
        const signedHeaders = await signRequest(
          'DELETE',
          deleteUrl,
          {},
          '',
          accessKeyId,
          secretAccessKey
        );

        const deleteResponse = await fetch(deleteUrl.toString(), {
          method: 'DELETE',
          headers: signedHeaders,
        });

        if (!deleteResponse.ok && deleteResponse.status !== 204) {
          throw new Error(`Failed to delete file: ${deleteResponse.status}`);
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'upload': {
        // Direct upload (for smaller files)
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const key = formData.get('key') as string;

        if (!file || !key) {
          return new Response(
            JSON.stringify({ error: 'Missing file or key' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const fileBuffer = await file.arrayBuffer();
        const uploadUrl = new URL(`${endpoint}/${bucketName}/${key}`);
        
        const signedHeaders = await signRequest(
          'PUT',
          uploadUrl,
          { 'Content-Type': file.type },
          new Uint8Array(fileBuffer),
          accessKeyId,
          secretAccessKey
        );

        const uploadResponse = await fetch(uploadUrl.toString(), {
          method: 'PUT',
          headers: signedHeaders,
          body: new Uint8Array(fileBuffer),
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.status}`);
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            key,
            url: publicUrl ? `${publicUrl}/${key}` : `${endpoint}/${bucketName}/${key}`,
            size: file.size,
            contentType: file.type,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use: upload-url, download-url, delete, or upload' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: unknown) {
    console.error('R2 Storage error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
