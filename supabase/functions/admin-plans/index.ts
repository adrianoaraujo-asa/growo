import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import postgres from "https://deno.land/x/postgresjs@v3.4.5/mod.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Database connection
  const dbUrl = Deno.env.get("SUPABASE_DB_URL");
  if (!dbUrl) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const sql = postgres(dbUrl);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Get user token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      await sql.end();
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create client with user token to verify identity
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      await sql.end();
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is superadmin using direct SQL
    const roleCheck = await sql`
      SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = ${user.id} AND role = 'superadmin'
      ) as is_superadmin
    `;

    if (!roleCheck[0]?.is_superadmin) {
      await sql.end();
      return new Response(JSON.stringify({ error: "Forbidden: Superadmin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const method = req.method;

    // Handle different HTTP methods
    switch (method) {
      case "GET": {
        // List all plans from billing schema
        const plans = await sql`
          SELECT * FROM billing.plans 
          WHERE deleted_at IS NULL 
          ORDER BY sort_order ASC
        `;
        await sql.end();
        return new Response(JSON.stringify(plans), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "POST": {
        // Create new plan
        const body = await req.json();
        const result = await sql`
          INSERT INTO billing.plans (
            name, slug, description, features, limits,
            price_monthly, price_yearly, currency, trial_days,
            is_active, is_public, sort_order
          ) VALUES (
            ${body.name}, ${body.slug}, ${body.description || null}, 
            ${JSON.stringify(body.features || [])}, ${JSON.stringify(body.limits || {})},
            ${body.price_monthly || 0}, ${body.price_yearly || 0}, 
            ${body.currency || 'BRL'}, ${body.trial_days || 0},
            ${body.is_active ?? true}, ${body.is_public ?? true}, ${body.sort_order || 0}
          )
          RETURNING *
        `;
        await sql.end();
        return new Response(JSON.stringify(result[0]), {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "PATCH": {
        // Update plan
        const id = url.searchParams.get("id");
        if (!id) {
          await sql.end();
          return new Response(JSON.stringify({ error: "Plan ID required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const body = await req.json();
        
        // Build dynamic update
        const updates: string[] = [];
        const values: unknown[] = [];
        
        if (body.name !== undefined) updates.push(`name = $${updates.length + 1}`), values.push(body.name);
        if (body.slug !== undefined) updates.push(`slug = $${updates.length + 1}`), values.push(body.slug);
        if (body.description !== undefined) updates.push(`description = $${updates.length + 1}`), values.push(body.description);
        if (body.features !== undefined) updates.push(`features = $${updates.length + 1}`), values.push(JSON.stringify(body.features));
        if (body.limits !== undefined) updates.push(`limits = $${updates.length + 1}`), values.push(JSON.stringify(body.limits));
        if (body.price_monthly !== undefined) updates.push(`price_monthly = $${updates.length + 1}`), values.push(body.price_monthly);
        if (body.price_yearly !== undefined) updates.push(`price_yearly = $${updates.length + 1}`), values.push(body.price_yearly);
        if (body.currency !== undefined) updates.push(`currency = $${updates.length + 1}`), values.push(body.currency);
        if (body.trial_days !== undefined) updates.push(`trial_days = $${updates.length + 1}`), values.push(body.trial_days);
        if (body.is_active !== undefined) updates.push(`is_active = $${updates.length + 1}`), values.push(body.is_active);
        if (body.is_public !== undefined) updates.push(`is_public = $${updates.length + 1}`), values.push(body.is_public);
        if (body.sort_order !== undefined) updates.push(`sort_order = $${updates.length + 1}`), values.push(body.sort_order);
        if (body.deleted_at !== undefined) updates.push(`deleted_at = $${updates.length + 1}`), values.push(body.deleted_at);
        
        updates.push(`updated_at = NOW()`);

        const result = await sql`
          UPDATE billing.plans 
          SET name = ${body.name ?? sql`name`},
              slug = ${body.slug ?? sql`slug`},
              description = ${body.description ?? sql`description`},
              features = ${body.features ? JSON.stringify(body.features) : sql`features`},
              limits = ${body.limits ? JSON.stringify(body.limits) : sql`limits`},
              price_monthly = ${body.price_monthly ?? sql`price_monthly`},
              price_yearly = ${body.price_yearly ?? sql`price_yearly`},
              currency = ${body.currency ?? sql`currency`},
              trial_days = ${body.trial_days ?? sql`trial_days`},
              is_active = ${body.is_active ?? sql`is_active`},
              is_public = ${body.is_public ?? sql`is_public`},
              sort_order = ${body.sort_order ?? sql`sort_order`},
              deleted_at = ${body.deleted_at ?? sql`deleted_at`},
              updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
        
        await sql.end();
        return new Response(JSON.stringify(result[0]), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "DELETE": {
        // Soft delete plan
        const id = url.searchParams.get("id");
        if (!id) {
          await sql.end();
          return new Response(JSON.stringify({ error: "Plan ID required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        await sql`
          UPDATE billing.plans 
          SET deleted_at = NOW(), updated_at = NOW()
          WHERE id = ${id}
        `;
        
        await sql.end();
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        await sql.end();
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (err) {
    await sql.end();
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
