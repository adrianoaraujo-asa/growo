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
    const supabaseAdmin = createClient(
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

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify superadmin role
    const { data: hasRole } = await supabaseAdmin.rpc('has_role', {
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
        // Get current R2 configuration from database
        const { data: config, error } = await supabaseAdmin.rpc('get_storage_config', {
          p_organization_id: null // Global config
        });

        if (error) {
          console.error('Error getting config:', error);
        }

        const configRow = config?.[0];

        return new Response(
          JSON.stringify({
            configured: !!configRow,
            hasConfig: !!configRow,
            config: configRow ? {
              accountId: configRow.account_id || '',
              bucketName: configRow.bucket_name || '',
              endpoint: configRow.endpoint || '',
              publicUrl: configRow.public_url || '',
              // Mask sensitive data for display
              accessKeyId: configRow.access_key_id ? '••••' + configRow.access_key_id.slice(-4) : '',
              hasSecretKey: !!configRow.secret_access_key,
            } : null,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'save-config': {
        // Save R2 configuration to database
        const body = await req.json();
        const { accountId, bucketName, endpoint, publicUrl, accessKeyId, secretAccessKey } = body;

        if (!bucketName || !endpoint || !accessKeyId || !secretAccessKey) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields: bucketName, endpoint, accessKeyId, secretAccessKey' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabaseAdmin.rpc('upsert_storage_config', {
          p_user_id: user.id,
          p_organization_id: null, // Global config
          p_account_id: accountId || null,
          p_bucket_name: bucketName,
          p_endpoint: endpoint,
          p_public_url: publicUrl || null,
          p_access_key_id: accessKeyId,
          p_secret_access_key: secretAccessKey,
        });

        if (error) {
          console.error('Error saving config:', error);
          return new Response(
            JSON.stringify({ error: error.message || 'Failed to save configuration' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            id: data,
            message: 'Configuração salva com sucesso!',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'test-connection': {
        // Get config from database
        const { data: config, error: configError } = await supabaseAdmin.rpc('get_storage_config', {
          p_organization_id: null
        });

        if (configError || !config?.[0]) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Configuração R2 não encontrada. Configure primeiro.',
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const cfg = config[0];
        const { access_key_id: accessKeyId, secret_access_key: secretAccessKey, endpoint, bucket_name: bucketName } = cfg;

        if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Configuração incompleta. Preencha todos os campos obrigatórios.',
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Test R2 connection
        try {
          const testKey = `_test/${Date.now()}.txt`;
          const testContent = 'R2 connection test';
          
          const uploadUrl = new URL(`${endpoint}/${bucketName}/${testKey}`);
          
          // AWS Signature V4
          const now = new Date();
          const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z";
          const dateStamp = amzDate.slice(0, 8);
          const region = "auto";
          const service = "s3";
          
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
                error: `Falha na conexão: ${response.status} - ${errorText.substring(0, 200)}`,
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
              message: 'Conexão R2 estabelecida com sucesso! Arquivo de teste criado e deletado.',
              bucket: bucketName,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (fetchError) {
          console.error('R2 connection test error:', fetchError);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: fetchError instanceof Error ? fetchError.message : 'Falha na conexão',
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
