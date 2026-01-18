import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Verify superadmin role
    const { data: hasRole } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'superadmin'
    });

    if (!hasRole) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: superadmin role required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'get-config': {
        // Return current R2 configuration status (not actual secrets)
        const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID');
        const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY');
        const endpoint = Deno.env.get('R2_ENDPOINT');
        const bucketName = Deno.env.get('R2_BUCKET_NAME');
        const accountId = Deno.env.get('R2_ACCOUNT_ID');
        const publicUrl = Deno.env.get('R2_PUBLIC_URL');

        return new Response(
          JSON.stringify({
            configured: !!(accessKeyId && secretAccessKey && endpoint && bucketName),
            hasAccessKeyId: !!accessKeyId,
            hasSecretAccessKey: !!secretAccessKey,
            hasEndpoint: !!endpoint,
            hasBucketName: !!bucketName,
            hasAccountId: !!accountId,
            hasPublicUrl: !!publicUrl,
            // Return masked values for display
            endpoint: endpoint ? endpoint.replace(/^(https?:\/\/[^\/]+).*$/, '$1/...') : null,
            bucketName: bucketName || null,
            publicUrl: publicUrl || null,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'save-config': {
        // Save R2 configuration to system.settings (for UI display purposes)
        // Note: Actual secrets are stored in Edge Function secrets
        const body = await req.json();
        const { endpoint, bucketName, publicUrl, accountId } = body;

        // Save non-sensitive config to system.settings
        const { data, error } = await supabase.rpc('admin_upsert_setting', {
          p_key: 'r2_storage_config',
          p_value: {
            endpoint,
            bucketName,
            publicUrl,
            accountId,
            updatedAt: new Date().toISOString(),
            updatedBy: user.id,
          },
          p_is_public: false,
        });

        if (error) {
          console.error('Error saving R2 config:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to save configuration' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Configuration saved. Note: Secrets (Access Key ID, Secret Access Key) must be configured in Supabase Dashboard > Edge Functions > Secrets.',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'test-connection': {
        // Test R2 connection
        const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID');
        const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY');
        const endpoint = Deno.env.get('R2_ENDPOINT');
        const bucketName = Deno.env.get('R2_BUCKET_NAME');

        if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName) {
          const missing = [];
          if (!accessKeyId) missing.push('R2_ACCESS_KEY_ID');
          if (!secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY');
          if (!endpoint) missing.push('R2_ENDPOINT');
          if (!bucketName) missing.push('R2_BUCKET_NAME');
          
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Missing required secrets: ${missing.join(', ')}`,
              missing,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Try to list bucket (HEAD request)
        try {
          const testKey = `_test/${Date.now()}.txt`;
          const testContent = 'R2 connection test';
          
          // Simple PUT request to test connectivity
          const uploadUrl = new URL(`${endpoint}/${bucketName}/${testKey}`);
          
          // AWS Signature V4 - simplified for test
          const now = new Date();
          const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z";
          const dateStamp = amzDate.slice(0, 8);
          const region = "auto";
          const service = "s3";
          
          // Create signing key
          const encoder = new TextEncoder();
          const kDate = await hmacSha256(encoder.encode("AWS4" + secretAccessKey), dateStamp);
          const kRegion = await hmacSha256(kDate, region);
          const kService = await hmacSha256(kRegion, service);
          const signingKey = await hmacSha256(kService, "aws4_request");
          
          const payloadHash = await sha256(testContent);
          const host = uploadUrl.host;
          
          const canonicalRequest = [
            "PUT",
            uploadUrl.pathname,
            "",
            `content-type:text/plain`,
            `host:${host}`,
            `x-amz-content-sha256:${payloadHash}`,
            `x-amz-date:${amzDate}`,
            "",
            "content-type;host;x-amz-content-sha256;x-amz-date",
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
          
          const signature = toHex(await hmacSha256(signingKey, stringToSign));
          const authHeader = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=content-type;host;x-amz-content-sha256;x-amz-date, Signature=${signature}`;
          
          const response = await fetch(uploadUrl.toString(), {
            method: 'PUT',
            headers: {
              'Content-Type': 'text/plain',
              'x-amz-content-sha256': payloadHash,
              'x-amz-date': amzDate,
              'Authorization': authHeader,
            },
            body: testContent,
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('R2 test failed:', response.status, errorText);
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: `Connection failed: ${response.status} - ${errorText}`,
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          // Clean up test file
          const deleteUrl = new URL(`${endpoint}/${bucketName}/${testKey}`);
          const deleteAmzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z";
          const deleteDateStamp = deleteAmzDate.slice(0, 8);
          
          const deleteKDate = await hmacSha256(encoder.encode("AWS4" + secretAccessKey), deleteDateStamp);
          const deleteKRegion = await hmacSha256(deleteKDate, region);
          const deleteKService = await hmacSha256(deleteKRegion, service);
          const deleteSigningKey = await hmacSha256(deleteKService, "aws4_request");
          
          const emptyHash = await sha256("");
          const deleteCanonicalRequest = [
            "DELETE",
            deleteUrl.pathname,
            "",
            `host:${deleteUrl.host}`,
            `x-amz-content-sha256:${emptyHash}`,
            `x-amz-date:${deleteAmzDate}`,
            "",
            "host;x-amz-content-sha256;x-amz-date",
            emptyHash,
          ].join("\n");
          
          const deleteCanonicalHash = await sha256(deleteCanonicalRequest);
          const deleteCredentialScope = `${deleteDateStamp}/${region}/${service}/aws4_request`;
          const deleteStringToSign = [
            "AWS4-HMAC-SHA256",
            deleteAmzDate,
            deleteCredentialScope,
            deleteCanonicalHash,
          ].join("\n");
          
          const deleteSignature = toHex(await hmacSha256(deleteSigningKey, deleteStringToSign));
          const deleteAuthHeader = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${deleteCredentialScope}, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=${deleteSignature}`;
          
          await fetch(deleteUrl.toString(), {
            method: 'DELETE',
            headers: {
              'x-amz-content-sha256': emptyHash,
              'x-amz-date': deleteAmzDate,
              'Authorization': deleteAuthHeader,
            },
          });
          
          return new Response(
            JSON.stringify({ 
              success: true,
              message: 'R2 connection successful! Test file created and deleted.',
              bucket: bucketName,
              endpoint: endpoint.replace(/^(https?:\/\/[^\/]+).*$/, '$1/...'),
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (fetchError) {
          console.error('R2 connection test error:', fetchError);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: fetchError instanceof Error ? fetchError.message : 'Connection failed',
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use: get-config, save-config, test-connection' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: unknown) {
    console.error('Admin storage error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

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
