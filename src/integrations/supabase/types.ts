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
      cases: {
        Row: {
          created_at: string | null
          deposit_limits_credit_debit: string | null
          deposit_limits_crypto: string | null
          deposit_limits_skins: string | null
          game: string | null
          id: number
          image_url: string | null
          min_price: number | null
          name: string
          odds_disclosed: boolean | null
          operator_id: number | null
          overall_min_deposit: number | null
          prize_value_max: number | null
          prize_value_min: number | null
          withdrawal_fee_crypto: number | null
          withdrawal_fee_fiat: number | null
          withdrawal_fee_skins: number | null
          withdrawal_time_crypto: string | null
          withdrawal_time_fiat: string | null
          withdrawal_time_skins: string | null
        }
        Insert: {
          created_at?: string | null
          deposit_limits_credit_debit?: string | null
          deposit_limits_crypto?: string | null
          deposit_limits_skins?: string | null
          game?: string | null
          id?: number
          image_url?: string | null
          min_price?: number | null
          name: string
          odds_disclosed?: boolean | null
          operator_id?: number | null
          overall_min_deposit?: number | null
          prize_value_max?: number | null
          prize_value_min?: number | null
          withdrawal_fee_crypto?: number | null
          withdrawal_fee_fiat?: number | null
          withdrawal_fee_skins?: number | null
          withdrawal_time_crypto?: string | null
          withdrawal_time_fiat?: string | null
          withdrawal_time_skins?: string | null
        }
        Update: {
          created_at?: string | null
          deposit_limits_credit_debit?: string | null
          deposit_limits_crypto?: string | null
          deposit_limits_skins?: string | null
          game?: string | null
          id?: number
          image_url?: string | null
          min_price?: number | null
          name?: string
          odds_disclosed?: boolean | null
          operator_id?: number | null
          overall_min_deposit?: number | null
          prize_value_max?: number | null
          prize_value_min?: number | null
          withdrawal_fee_crypto?: number | null
          withdrawal_fee_fiat?: number | null
          withdrawal_fee_skins?: number | null
          withdrawal_time_crypto?: string | null
          withdrawal_time_fiat?: string | null
          withdrawal_time_skins?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      "cases.gg": {
        Row: {
          all_items: Json | null
          box_image: string | null
          box_name: string | null
          box_price: number | null
          box_url: string | null
          category: string | null
          data_source: string | null
          ev_to_price_ratio: number | null
          expected_value_percent: number | null
          floor_rate_percent: number | null
          id: number
          jackpot_items: Json | null
          last_updated: string | null
          standard_deviation_percent: number | null
          tags: Json | null
          unwanted_items: Json | null
          volatility_bucket: string | null
        }
        Insert: {
          all_items?: Json | null
          box_image?: string | null
          box_name?: string | null
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Update: {
          all_items?: Json | null
          box_image?: string | null
          box_name?: string | null
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id?: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Relationships: []
      }
      content_sections: {
        Row: {
          content: string | null
          heading: string | null
          id: number
          operator_id: number | null
          section_key: string | null
        }
        Insert: {
          content?: string | null
          heading?: string | null
          id?: number
          operator_id?: number | null
          section_key?: string | null
        }
        Update: {
          content?: string | null
          heading?: string | null
          id?: number
          operator_id?: number | null
          section_key?: string | null
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
      hypedrop: {
        Row: {
          all_items: Json | null
          box_image: string | null
          box_name: string | null
          box_price: number | null
          box_url: string | null
          category: string | null
          data_source: string | null
          ev_to_price_ratio: number | null
          expected_value_percent: number | null
          floor_rate_percent: number | null
          id: number
          jackpot_items: Json | null
          last_updated: string | null
          standard_deviation_percent: number | null
          tags: Json | null
          unwanted_items: Json | null
          volatility_bucket: string | null
        }
        Insert: {
          all_items?: Json | null
          box_image?: string | null
          box_name?: string | null
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Update: {
          all_items?: Json | null
          box_image?: string | null
          box_name?: string | null
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id?: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Relationships: []
      }
      luxdrop: {
        Row: {
          all_items: Json | null
          box_image: string | null
          box_name: string | null
          box_price: number | null
          box_url: string | null
          category: string | null
          data_source: string | null
          ev_to_price_ratio: number | null
          expected_value_percent: number | null
          floor_rate_percent: number | null
          id: number
          jackpot_items: Json | null
          last_updated: string | null
          standard_deviation_percent: number | null
          tags: Json | null
          unwanted_items: Json | null
          volatility_bucket: string | null
        }
        Insert: {
          all_items?: Json | null
          box_image?: string | null
          box_name?: string | null
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Update: {
          all_items?: Json | null
          box_image?: string | null
          box_name?: string | null
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id?: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          id: number
          operator_id: number | null
          type: string | null
          url: string
        }
        Insert: {
          id?: number
          operator_id?: number | null
          type?: string | null
          url: string
        }
        Update: {
          id?: number
          operator_id?: number | null
          type?: string | null
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
      mystery_boxes: {
        Row: {
          case_id: number | null
          category: string | null
          id: number
          type: string | null
        }
        Insert: {
          case_id?: number | null
          category?: string | null
          id?: number
          type?: string | null
        }
        Update: {
          case_id?: number | null
          category?: string | null
          id?: number
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mystery_boxes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      operators: {
        Row: {
          categories: string[] | null
          cons: string[] | null
          created_at: string | null
          gaming_modes: string[] | null
          id: number
          launch_year: number | null
          logo_url: string | null
          name: string
          offering_rating: number | null
          other_features: string[] | null
          overall_rating: number | null
          payment_methods: string[] | null
          payments_rating: number | null
          payout_methods: string[] | null
          promo_code: string | null
          pros: string[] | null
          shipping_regions: string[] | null
          shipping_time: string | null
          support_rating: number | null
          tracking_link: string | null
          trust_rating: number | null
          updated_at: string | null
          ux_rating: number | null
          value_rating: number | null
          verdict: string | null
          welcome_offer: string | null
        }
        Insert: {
          categories?: string[] | null
          cons?: string[] | null
          created_at?: string | null
          gaming_modes?: string[] | null
          id?: number
          launch_year?: number | null
          logo_url?: string | null
          name: string
          offering_rating?: number | null
          other_features?: string[] | null
          overall_rating?: number | null
          payment_methods?: string[] | null
          payments_rating?: number | null
          payout_methods?: string[] | null
          promo_code?: string | null
          pros?: string[] | null
          shipping_regions?: string[] | null
          shipping_time?: string | null
          support_rating?: number | null
          tracking_link?: string | null
          trust_rating?: number | null
          updated_at?: string | null
          ux_rating?: number | null
          value_rating?: number | null
          verdict?: string | null
          welcome_offer?: string | null
        }
        Update: {
          categories?: string[] | null
          cons?: string[] | null
          created_at?: string | null
          gaming_modes?: string[] | null
          id?: number
          launch_year?: number | null
          logo_url?: string | null
          name?: string
          offering_rating?: number | null
          other_features?: string[] | null
          overall_rating?: number | null
          payment_methods?: string[] | null
          payments_rating?: number | null
          payout_methods?: string[] | null
          promo_code?: string | null
          pros?: string[] | null
          shipping_regions?: string[] | null
          shipping_time?: string | null
          support_rating?: number | null
          tracking_link?: string | null
          trust_rating?: number | null
          updated_at?: string | null
          ux_rating?: number | null
          value_rating?: number | null
          verdict?: string | null
          welcome_offer?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string | null
          entity_id: number
          entity_type: string | null
          id: number
          rating: number | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          entity_id: number
          entity_type?: string | null
          id?: number
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          entity_id?: number
          entity_type?: string | null
          id?: number
          rating?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      rillabox: {
        Row: {
          all_items: Json | null
          box_image: string | null
          box_name: string | null
          box_price: number | null
          box_url: string | null
          category: string | null
          data_source: string | null
          ev_to_price_ratio: number | null
          expected_value_percent: number | null
          floor_rate_percent: number | null
          id: number
          jackpot_items: Json | null
          last_updated: string | null
          standard_deviation_percent: number | null
          tags: Json | null
          unwanted_items: Json | null
          volatility_bucket: string | null
        }
        Insert: {
          all_items?: Json | null
          box_image?: string | null
          box_name?: string | null
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Update: {
          all_items?: Json | null
          box_image?: string | null
          box_name?: string | null
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id?: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Relationships: []
      }
      seo_metadata: {
        Row: {
          created_at: string | null
          id: number
          meta_description: string | null
          meta_title: string | null
          schema_data: Json | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          meta_description?: string | null
          meta_title?: string | null
          schema_data?: Json | null
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: number
          meta_description?: string | null
          meta_title?: string | null
          schema_data?: Json | null
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
