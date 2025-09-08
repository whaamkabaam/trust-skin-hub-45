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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_sections: {
        Row: {
          created_at: string
          heading: string
          id: string
          operator_id: string
          order_number: number | null
          rich_text_content: string | null
          section_key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          heading: string
          id?: string
          operator_id: string
          order_number?: number | null
          rich_text_content?: string | null
          section_key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          heading?: string
          id?: string
          operator_id?: string
          order_number?: number | null
          rich_text_content?: string | null
          section_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_sections_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          id: string
          operator_id: string | null
          order_number: number | null
          type: string
          updated_at: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          operator_id?: string | null
          order_number?: number | null
          type: string
          updated_at?: string
          url: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          operator_id?: string | null
          order_number?: number | null
          type?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_bonuses: {
        Row: {
          bonus_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          operator_id: string
          order_number: number | null
          terms: string | null
          title: string
          updated_at: string
          value: string | null
        }
        Insert: {
          bonus_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          operator_id: string
          order_number?: number | null
          terms?: string | null
          title: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          bonus_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          operator_id?: string
          order_number?: number | null
          terms?: string | null
          title?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operator_bonuses_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_featured: boolean | null
          operator_id: string
          order_number: number | null
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean | null
          operator_id: string
          order_number?: number | null
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean | null
          operator_id?: string
          order_number?: number | null
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_faqs_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_features: {
        Row: {
          created_at: string
          description: string | null
          feature_name: string
          feature_type: string
          id: string
          is_highlighted: boolean | null
          operator_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          feature_name: string
          feature_type: string
          id?: string
          is_highlighted?: boolean | null
          operator_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          feature_name?: string
          feature_type?: string
          id?: string
          is_highlighted?: boolean | null
          operator_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_features_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_payments: {
        Row: {
          created_at: string
          fee_fixed: number | null
          fee_percentage: number | null
          id: string
          is_available: boolean | null
          maximum_amount: number | null
          method_type: string
          minimum_amount: number | null
          operator_id: string
          payment_method: string
          processing_time: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          fee_fixed?: number | null
          fee_percentage?: number | null
          id?: string
          is_available?: boolean | null
          maximum_amount?: number | null
          method_type: string
          minimum_amount?: number | null
          operator_id: string
          payment_method: string
          processing_time?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          fee_fixed?: number | null
          fee_percentage?: number | null
          id?: string
          is_available?: boolean | null
          maximum_amount?: number | null
          method_type?: string
          minimum_amount?: number | null
          operator_id?: string
          payment_method?: string
          processing_time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_payments_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_security: {
        Row: {
          audit_info: string | null
          complaints_platform: string | null
          compliance_certifications: string[] | null
          created_at: string
          data_protection_info: string | null
          id: string
          license_info: string | null
          operator_id: string
          provably_fair: boolean | null
          provably_fair_description: string | null
          responsible_gaming_info: string | null
          ssl_enabled: boolean | null
          ssl_provider: string | null
          updated_at: string
        }
        Insert: {
          audit_info?: string | null
          complaints_platform?: string | null
          compliance_certifications?: string[] | null
          created_at?: string
          data_protection_info?: string | null
          id?: string
          license_info?: string | null
          operator_id: string
          provably_fair?: boolean | null
          provably_fair_description?: string | null
          responsible_gaming_info?: string | null
          ssl_enabled?: boolean | null
          ssl_provider?: string | null
          updated_at?: string
        }
        Update: {
          audit_info?: string | null
          complaints_platform?: string | null
          compliance_certifications?: string[] | null
          created_at?: string
          data_protection_info?: string | null
          id?: string
          license_info?: string | null
          operator_id?: string
          provably_fair?: boolean | null
          provably_fair_description?: string | null
          responsible_gaming_info?: string | null
          ssl_enabled?: boolean | null
          ssl_provider?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_security_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      operators: {
        Row: {
          bonus_terms: string | null
          categories: string[] | null
          community_links: Json | null
          company_background: string | null
          cons: string[] | null
          created_at: string
          draft_data: Json | null
          fairness_info: string | null
          hero_image_url: string | null
          id: string
          kyc_required: boolean | null
          last_auto_saved_at: string | null
          launch_year: number | null
          logo_url: string | null
          name: string
          performance_metrics: Json | null
          prize_info: Json | null
          promo_code: string | null
          pros: string[] | null
          publish_status: string | null
          published: boolean | null
          published_at: string | null
          ratings: Json | null
          scheduled_publish_at: string | null
          search_vector: unknown | null
          shipping_info: Json | null
          site_type: string | null
          slug: string
          support_channels: string[] | null
          supported_countries: string[] | null
          tracking_link: string | null
          updated_at: string
          verdict: string | null
          verification_status: string | null
          withdrawal_time_crypto: string | null
          withdrawal_time_fiat: string | null
          withdrawal_time_skins: string | null
        }
        Insert: {
          bonus_terms?: string | null
          categories?: string[] | null
          community_links?: Json | null
          company_background?: string | null
          cons?: string[] | null
          created_at?: string
          draft_data?: Json | null
          fairness_info?: string | null
          hero_image_url?: string | null
          id?: string
          kyc_required?: boolean | null
          last_auto_saved_at?: string | null
          launch_year?: number | null
          logo_url?: string | null
          name: string
          performance_metrics?: Json | null
          prize_info?: Json | null
          promo_code?: string | null
          pros?: string[] | null
          publish_status?: string | null
          published?: boolean | null
          published_at?: string | null
          ratings?: Json | null
          scheduled_publish_at?: string | null
          search_vector?: unknown | null
          shipping_info?: Json | null
          site_type?: string | null
          slug: string
          support_channels?: string[] | null
          supported_countries?: string[] | null
          tracking_link?: string | null
          updated_at?: string
          verdict?: string | null
          verification_status?: string | null
          withdrawal_time_crypto?: string | null
          withdrawal_time_fiat?: string | null
          withdrawal_time_skins?: string | null
        }
        Update: {
          bonus_terms?: string | null
          categories?: string[] | null
          community_links?: Json | null
          company_background?: string | null
          cons?: string[] | null
          created_at?: string
          draft_data?: Json | null
          fairness_info?: string | null
          hero_image_url?: string | null
          id?: string
          kyc_required?: boolean | null
          last_auto_saved_at?: string | null
          launch_year?: number | null
          logo_url?: string | null
          name?: string
          performance_metrics?: Json | null
          prize_info?: Json | null
          promo_code?: string | null
          pros?: string[] | null
          publish_status?: string | null
          published?: boolean | null
          published_at?: string | null
          ratings?: Json | null
          scheduled_publish_at?: string | null
          search_vector?: unknown | null
          shipping_info?: Json | null
          site_type?: string | null
          slug?: string
          support_channels?: string[] | null
          supported_countries?: string[] | null
          tracking_link?: string | null
          updated_at?: string
          verdict?: string | null
          verification_status?: string | null
          withdrawal_time_crypto?: string | null
          withdrawal_time_fiat?: string | null
          withdrawal_time_skins?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string
          created_at: string
          id: string
          operator_id: string
          rating: number
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          operator_id: string
          rating: number
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          operator_id?: string
          rating?: number
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_metadata: {
        Row: {
          created_at: string
          id: string
          meta_description: string | null
          meta_title: string | null
          operator_id: string
          schema_data: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          operator_id: string
          schema_data?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          operator_id?: string
          schema_data?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_metadata_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: true
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
