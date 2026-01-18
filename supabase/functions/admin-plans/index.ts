import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Get user token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
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
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create admin client with service role for RPC calls
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is superadmin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "superadmin")
      .maybeSingle();

    if (roleError) {
      console.error("Role check error:", roleError);
      return new Response(JSON.stringify({ error: "Failed to verify permissions" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: Superadmin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const method = req.method;

    // Handle different HTTP methods using RPC functions
    switch (method) {
      case "GET": {
        // List all plans using RPC function
        const { data, error } = await supabaseAdmin.rpc("admin_list_plans");
        
        if (error) {
          console.error("List plans error:", error);
          throw error;
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "POST": {
        // Create new plan using RPC function
        const body = await req.json();
        const { data, error } = await supabaseAdmin.rpc("admin_create_plan", {
          p_name: body.name,
          p_slug: body.slug,
          p_description: body.description || null,
          p_features: body.features || [],
          p_limits: body.limits || {},
          p_price_monthly: body.price_monthly || 0,
          p_price_yearly: body.price_yearly || 0,
          p_currency: body.currency || "BRL",
          p_trial_days: body.trial_days || 0,
          p_is_active: body.is_active ?? true,
          p_is_public: body.is_public ?? true,
          p_sort_order: body.sort_order || 0,
        });

        if (error) {
          console.error("Create plan error:", error);
          throw error;
        }
        
        return new Response(JSON.stringify(data), {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "PATCH": {
        // Update plan using RPC function
        const id = url.searchParams.get("id");
        if (!id) {
          return new Response(JSON.stringify({ error: "Plan ID required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const body = await req.json();
        const { data, error } = await supabaseAdmin.rpc("admin_update_plan", {
          p_id: id,
          p_name: body.name ?? null,
          p_slug: body.slug ?? null,
          p_description: body.description ?? null,
          p_features: body.features ?? null,
          p_limits: body.limits ?? null,
          p_price_monthly: body.price_monthly ?? null,
          p_price_yearly: body.price_yearly ?? null,
          p_currency: body.currency ?? null,
          p_trial_days: body.trial_days ?? null,
          p_is_active: body.is_active ?? null,
          p_is_public: body.is_public ?? null,
          p_sort_order: body.sort_order ?? null,
        });

        if (error) {
          console.error("Update plan error:", error);
          throw error;
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "DELETE": {
        // Soft delete plan using RPC function
        const id = url.searchParams.get("id");
        if (!id) {
          return new Response(JSON.stringify({ error: "Plan ID required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data, error } = await supabaseAdmin.rpc("admin_delete_plan", {
          p_id: id,
        });

        if (error) {
          console.error("Delete plan error:", error);
          throw error;
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
