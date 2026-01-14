import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256(key: ArrayBuffer, data: ArrayBuffer): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return await crypto.subtle.sign("HMAC", cryptoKey, data);
}

async function sha256Hex(data: string | ArrayBuffer): Promise<string> {
  const buffer = typeof data === 'string' ? new TextEncoder().encode(data).buffer : data;
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  return bytesToHex(new Uint8Array(hash));
}

async function getSignatureKey(key: string, dateStamp: string, region: string, service: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const kDate = await hmacSha256(enc.encode("AWS4" + key).buffer, enc.encode(dateStamp).buffer);
  const kRegion = await hmacSha256(kDate, enc.encode(region).buffer);
  const kService = await hmacSha256(kRegion, enc.encode(service).buffer);
  const kSigning = await hmacSha256(kService, enc.encode("aws4_request").buffer);
  return kSigning;
}

async function signRequest(
  method: string,
  url: URL,
  headers: Record<string, string>,
  body: string | Uint8Array,
  accessKeyId: string,
  secretAccessKey: string,
  region: string = 'auto',
  service: string = 's3'
): Promise<Record<string, string>> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  const bodyString = typeof body === 'string' ? body : new TextDecoder().decode(body);
  const payloadHash = await sha256Hex(bodyString);
  
  const signedHeaders: Record<string, string> = {
    ...headers,
    'host': url.host,
    'x-amz-date': amzDate,
    'x-amz-content-sha256': payloadHash,
  };

  const sortedHeaderKeys = Object.keys(signedHeaders).sort();
  const canonicalHeaders = sortedHeaderKeys.map(k => `${k.toLowerCase()}:${signedHeaders[k]}\n`).join('');
  const signedHeadersStr = sortedHeaderKeys.map(k => k.toLowerCase()).join(';');

  const canonicalRequest = [
    method,
    url.pathname,
    url.search.replace('?', ''),
    canonicalHeaders,
    signedHeadersStr,
    payloadHash,
  ].join('\n');

  const canonicalRequestHash = await sha256Hex(canonicalRequest);
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    canonicalRequestHash,
  ].join('\n');

  const signingKey = await getSignatureKey(secretAccessKey, dateStamp, region, service);
  const signatureBuffer = await hmacSha256(signingKey, new TextEncoder().encode(stringToSign).buffer);
  const signature = bytesToHex(new Uint8Array(signatureBuffer));

  return {
    ...signedHeaders,
    'Authorization': `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeadersStr}, Signature=${signature}`,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY');
    const endpoint = Deno.env.get('R2_ENDPOINT');
    const bucketName = Deno.env.get('R2_BUCKET_NAME');

    console.log('R2 Configuration:', {
      accessKeyId: accessKeyId ? '✓ Set' : '✗ Missing',
      secretAccessKey: secretAccessKey ? '✓ Set' : '✗ Missing',
      endpoint: endpoint || 'Not set',
      bucketName: bucketName || 'Not set',
    });

    if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing R2 credentials',
          config: {
            accessKeyId: !!accessKeyId,
            secretAccessKey: !!secretAccessKey,
            endpoint: !!endpoint,
            bucketName: !!bucketName,
          }
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar arquivo de teste
    const testKey = `test/connection-test-${Date.now()}.txt`;
    const testContent = `R2 Connection Test - ${new Date().toISOString()}`;
    const testBody = new TextEncoder().encode(testContent);
    
    console.log(`Uploading test file: ${testKey}`);
    
    const uploadUrl = new URL(`/${bucketName}/${testKey}`, endpoint);
    const uploadHeaders = await signRequest(
      'PUT',
      uploadUrl,
      { 'content-type': 'text/plain' },
      testBody,
      accessKeyId,
      secretAccessKey
    );

    const uploadResponse = await fetch(uploadUrl.toString(), {
      method: 'PUT',
      headers: uploadHeaders,
      body: testBody,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Upload failed:', uploadResponse.status, errorText);
      throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
    }

    console.log('Test file uploaded successfully');

    // Verificar se o arquivo existe
    const headUrl = new URL(`/${bucketName}/${testKey}`, endpoint);
    const headHeaders = await signRequest(
      'HEAD',
      headUrl,
      {},
      '',
      accessKeyId,
      secretAccessKey
    );

    const headResponse = await fetch(headUrl.toString(), {
      method: 'HEAD',
      headers: headHeaders,
    });

    const fileExists = headResponse.ok;
    const fileSize = headResponse.headers.get('content-length');

    console.log('File verified:', { exists: fileExists, size: fileSize });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'R2 connection successful!',
        test: {
          bucket: bucketName,
          uploadedFile: testKey,
          fileExists: fileExists,
          fileSize: fileSize,
          content: testContent,
          endpoint: endpoint,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('R2 Test Error:', errorMessage);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
