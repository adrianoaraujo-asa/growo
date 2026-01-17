export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          addressable_id: string
          addressable_type: string
          city: string | null
          complement: string | null
          country: string | null
          created_at: string
          deleted_at: string | null
          id: string
          is_primary: boolean | null
          label: string | null
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          neighborhood: string | null
          number: string | null
          organization_id: string | null
          postal_code: string | null
          state: string | null
          street: string | null
          type: Database["public"]["Enums"]["address_type"] | null
          updated_at: string
        }
        Insert: {
          addressable_id: string
          addressable_type: string
          city?: string | null
          complement?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_primary?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          neighborhood?: string | null
          number?: string | null
          organization_id?: string | null
          postal_code?: string | null
          state?: string | null
          street?: string | null
          type?: Database["public"]["Enums"]["address_type"] | null
          updated_at?: string
        }
        Update: {
          addressable_id?: string
          addressable_type?: string
          city?: string | null
          complement?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_primary?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          neighborhood?: string | null
          number?: string | null
          organization_id?: string | null
          postal_code?: string | null
          state?: string | null
          street?: string | null
          type?: Database["public"]["Enums"]["address_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      avatars: {
        Row: {
          avatar_id: string
          avatar_type: Database["public"]["Enums"]["avatar_type"]
          created_at: string
          deleted_at: string | null
          file_name: string | null
          file_path: string
          file_size: number | null
          id: string
          is_current: boolean | null
          metadata: Json | null
          mime_type: string | null
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_id: string
          avatar_type: Database["public"]["Enums"]["avatar_type"]
          created_at?: string
          deleted_at?: string | null
          file_name?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          is_current?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_id?: string
          avatar_type?: Database["public"]["Enums"]["avatar_type"]
          created_at?: string
          deleted_at?: string | null
          file_name?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          is_current?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "avatars_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          contactable_id: string
          contactable_type: string
          created_at: string
          deleted_at: string | null
          id: string
          is_primary: boolean | null
          is_verified: boolean | null
          label: string | null
          metadata: Json | null
          organization_id: string | null
          type: Database["public"]["Enums"]["contact_type"]
          updated_at: string
          value: string
          verified_at: string | null
        }
        Insert: {
          contactable_id: string
          contactable_type: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          label?: string | null
          metadata?: Json | null
          organization_id?: string | null
          type: Database["public"]["Enums"]["contact_type"]
          updated_at?: string
          value: string
          verified_at?: string | null
        }
        Update: {
          contactable_id?: string
          contactable_type?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          label?: string | null
          metadata?: Json | null
          organization_id?: string | null
          type?: Database["public"]["Enums"]["contact_type"]
          updated_at?: string
          value?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_domains: {
        Row: {
          created_at: string
          deleted_at: string | null
          domain: string
          id: string
          is_primary: boolean | null
          is_verified: boolean | null
          organization_id: string
          sso_config: Json | null
          sso_enabled: boolean | null
          sso_provider: string | null
          updated_at: string
          verification_method: string | null
          verification_token: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          domain: string
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          organization_id: string
          sso_config?: Json | null
          sso_enabled?: boolean | null
          sso_provider?: string | null
          updated_at?: string
          verification_method?: string | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          domain?: string
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          organization_id?: string
          sso_config?: Json | null
          sso_enabled?: boolean | null
          sso_provider?: string | null
          updated_at?: string
          verification_method?: string | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_domains_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["invitation_status"] | null
          token: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          organization_id: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["invitation_status"] | null
          token: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["invitation_status"] | null
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_users: {
        Row: {
          created_at: string
          deleted_at: string | null
          department: string | null
          id: string
          invited_by: string | null
          is_primary: boolean | null
          joined_at: string | null
          organization_id: string
          permissions: Json | null
          role: Database["public"]["Enums"]["app_role"]
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          department?: string | null
          id?: string
          invited_by?: string | null
          is_primary?: boolean | null
          joined_at?: string | null
          organization_id: string
          permissions?: Json | null
          role?: Database["public"]["Enums"]["app_role"]
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          department?: string | null
          id?: string
          invited_by?: string | null
          is_primary?: boolean | null
          joined_at?: string | null
          organization_id?: string
          permissions?: Json | null
          role?: Database["public"]["Enums"]["app_role"]
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string | null
          currency: string | null
          deleted_at: string | null
          description: string | null
          document_number: string | null
          document_type: Database["public"]["Enums"]["document_type"] | null
          id: string
          industry: string | null
          legal_name: string | null
          locale: string | null
          logo_url: string | null
          metadata: Json | null
          name: string
          settings: Json | null
          size: string | null
          slug: string
          status: Database["public"]["Enums"]["organization_status"] | null
          timezone: string | null
          trial_ends_at: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deleted_at?: string | null
          description?: string | null
          document_number?: string | null
          document_type?: Database["public"]["Enums"]["document_type"] | null
          id?: string
          industry?: string | null
          legal_name?: string | null
          locale?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name: string
          settings?: Json | null
          size?: string | null
          slug: string
          status?: Database["public"]["Enums"]["organization_status"] | null
          timezone?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deleted_at?: string | null
          description?: string | null
          document_number?: string | null
          document_type?: Database["public"]["Enums"]["document_type"] | null
          id?: string
          industry?: string | null
          legal_name?: string | null
          locale?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          settings?: Json | null
          size?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["organization_status"] | null
          timezone?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          deleted_at: string | null
          display_name: string | null
          email_verified_at: string | null
          first_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          last_login_at: string | null
          last_name: string | null
          locale: string | null
          metadata: Json | null
          onboarding_completed_at: string | null
          phone_verified_at: string | null
          preferences: Json | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          deleted_at?: string | null
          display_name?: string | null
          email_verified_at?: string | null
          first_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id: string
          last_login_at?: string | null
          last_name?: string | null
          locale?: string | null
          metadata?: Json | null
          onboarding_completed_at?: string | null
          phone_verified_at?: string | null
          preferences?: Json | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          deleted_at?: string | null
          display_name?: string | null
          email_verified_at?: string | null
          first_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          last_login_at?: string | null
          last_name?: string | null
          locale?: string | null
          metadata?: Json | null
          onboarding_completed_at?: string | null
          phone_verified_at?: string | null
          preferences?: Json | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_billing_plans: {
        Row: {
          currency: string | null
          description: string | null
          features: Json | null
          id: string | null
          limits: Json | null
          name: string | null
          price_monthly: number | null
          price_yearly: number | null
          slug: string | null
          sort_order: number | null
          trial_days: number | null
        }
        Insert: {
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string | null
          limits?: Json | null
          name?: string | null
          price_monthly?: number | null
          price_yearly?: number | null
          slug?: string | null
          sort_order?: number | null
          trial_days?: number | null
        }
        Update: {
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string | null
          limits?: Json | null
          name?: string | null
          price_monthly?: number | null
          price_yearly?: number | null
          slug?: string | null
          sort_order?: number | null
          trial_days?: number | null
        }
        Relationships: []
      }
      public_landing_settings: {
        Row: {
          key: string | null
          value: Json | null
        }
        Insert: {
          key?: string | null
          value?: Json | null
        }
        Update: {
          key?: string | null
          value?: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_organization: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_belongs_to_org: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      address_type:
        | "billing"
        | "shipping"
        | "headquarters"
        | "branch"
        | "home"
        | "work"
        | "other"
      app_role:
        | "superadmin"
        | "owner"
        | "admin"
        | "manager"
        | "member"
        | "viewer"
      avatar_type: "user" | "organization" | "customer" | "professional"
      contact_type:
        | "email"
        | "phone"
        | "whatsapp"
        | "telegram"
        | "linkedin"
        | "other"
      document_type: "cpf" | "cnpj" | "passport" | "rg" | "other"
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
      invitation_status: "pending" | "accepted" | "expired" | "cancelled"
      organization_status: "active" | "inactive" | "suspended" | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      address_type: [
        "billing",
        "shipping",
        "headquarters",
        "branch",
        "home",
        "work",
        "other",
      ],
      app_role: ["superadmin", "owner", "admin", "manager", "member", "viewer"],
      avatar_type: ["user", "organization", "customer", "professional"],
      contact_type: [
        "email",
        "phone",
        "whatsapp",
        "telegram",
        "linkedin",
        "other",
      ],
      document_type: ["cpf", "cnpj", "passport", "rg", "other"],
      gender_type: ["male", "female", "other", "prefer_not_to_say"],
      invitation_status: ["pending", "accepted", "expired", "cancelled"],
      organization_status: ["active", "inactive", "suspended", "pending"],
    },
  },
} as const
