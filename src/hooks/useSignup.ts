import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSignupStore } from "@/stores/signupStore";

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: signupData, updateData } = useSignupStore();

  // Step 1: Create user account with email/password
  const createAccount = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/signup/verify`,
        },
      });

      if (error) {
        // Handle specific errors
        if (error.message.includes("already registered") || error.message.includes("User already registered")) {
          return { 
            error: { message: "Este email já está cadastrado. Faça login." },
            needsVerification: false 
          };
        }
        return { error, needsVerification: false };
      }

      // Supabase returns user with identities = [] when email already exists (fake signup)
      // This is Supabase's default behavior to prevent email enumeration
      if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
        return { 
          error: { message: "Este email já está cadastrado. Faça login." },
          needsVerification: false 
        };
      }

      // Check if user needs email verification
      const needsVerification = !data.user?.email_confirmed_at;

      updateData({ email, password });

      return { error: null, needsVerification, user: data.user };
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP code
  const verifyOtp = async (email: string, token: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        return { error };
      }

      updateData({ emailVerified: true });

      return { error: null, session: data.session };
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP code
  const resendOtp = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/signup/verify`,
        },
      });

      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Generate slug from company name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
      .substring(0, 50); // Limit length
  };

  // Finalize signup: Create organization and update profile
  const finalizeSignup = async () => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return { error: { message: "Usuário não autenticado. Por favor, faça login novamente." } };
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({
          first_name: signupData.firstName,
          last_name: signupData.lastName,
          display_name: `${signupData.firstName} ${signupData.lastName}`.trim(),
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        // Profile might not exist yet if trigger didn't fire, try insert
        const { error: insertError } = await supabase
          .from("user_profiles")
          .insert({
            id: user.id,
            first_name: signupData.firstName,
            last_name: signupData.lastName,
            display_name: `${signupData.firstName} ${signupData.lastName}`.trim(),
            onboarding_completed_at: new Date().toISOString(),
          });

        if (insertError && !insertError.message.includes("duplicate")) {
          return { error: { message: "Erro ao criar perfil: " + insertError.message } };
        }
      }

      // Create contact for phone if provided
      if (signupData.phone) {
        await supabase.from("contacts").insert({
          contactable_id: user.id,
          contactable_type: "user",
          type: "phone",
          value: signupData.phone.replace(/\D/g, ""),
          is_primary: true,
        });
      }

      // Determine document type
      const docNumber = signupData.documentNumber?.replace(/\D/g, "") || "";
      const documentType = docNumber.length === 11 ? "cpf" : docNumber.length === 14 ? "cnpj" : null;

      // Generate unique slug
      const baseSlug = generateSlug(signupData.companyName || "organization");
      const timestamp = Date.now().toString(36);
      const slug = `${baseSlug}-${timestamp}`;

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: signupData.companyName,
          slug,
          document_number: docNumber || null,
          document_type: documentType,
          size: signupData.companySize || null,
          industry: signupData.industry || null,
          created_by: user.id,
          status: "active",
        })
        .select()
        .single();

      if (orgError) {
        console.error("Organization creation error:", orgError);
        return { error: { message: "Erro ao criar organização: " + orgError.message } };
      }

      // Link user to organization as owner
      const { error: linkError } = await supabase
        .from("organization_users")
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: "owner",
          is_primary: true,
          joined_at: new Date().toISOString(),
        });

      if (linkError) {
        console.error("Organization link error:", linkError);
        return { error: { message: "Erro ao vincular usuário à organização: " + linkError.message } };
      }

      return { error: null, organization: org };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createAccount,
    verifyOtp,
    resendOtp,
    finalizeSignup,
  };
}
