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
          current_password: string | null
          email: string
          id: string
          last_password_reset: string | null
          password_reset_count: number | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_password?: string | null
          email: string
          id?: string
          last_password_reset?: string | null
          password_reset_count?: number | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_password?: string | null
          email?: string
          id?: string
          last_password_reset?: string | null
          password_reset_count?: number | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      casesgg: {
        Row: {
          all_items: Json | null
          box_image: string | null
          box_name: string
          box_price: number
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
          box_name: string
          box_price: number
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
          box_name?: string
          box_price?: number
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
      categories: {
        Row: {
          author: string | null
          author_avatar_url: string | null
          author_name: string | null
          avg_price: number | null
          content_updated_at: string | null
          created_at: string
          description_rich: string | null
          display_order: number | null
          featured_box_description: string | null
          featured_box_id: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          is_featured: boolean | null
          logo_url: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          price_max: number | null
          price_min: number | null
          published: boolean | null
          published_at: string | null
          reading_time: number | null
          scheduled_publish_at: string | null
          slug: string
          total_boxes: number | null
          updated_at: string
        }
        Insert: {
          author?: string | null
          author_avatar_url?: string | null
          author_name?: string | null
          avg_price?: number | null
          content_updated_at?: string | null
          created_at?: string
          description_rich?: string | null
          display_order?: number | null
          featured_box_description?: string | null
          featured_box_id?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          price_max?: number | null
          price_min?: number | null
          published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          scheduled_publish_at?: string | null
          slug: string
          total_boxes?: number | null
          updated_at?: string
        }
        Update: {
          author?: string | null
          author_avatar_url?: string | null
          author_name?: string | null
          avg_price?: number | null
          content_updated_at?: string | null
          created_at?: string
          description_rich?: string | null
          display_order?: number | null
          featured_box_description?: string | null
          featured_box_id?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          price_max?: number | null
          price_min?: number | null
          published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          scheduled_publish_at?: string | null
          slug?: string
          total_boxes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_featured_box_id_fkey"
            columns: ["featured_box_id"]
            isOneToOne: false
            referencedRelation: "provider_box_category_overrides"
            referencedColumns: ["id"]
          },
        ]
      }
      category_content_blocks: {
        Row: {
          block_data: Json
          block_type: string
          category_id: string
          created_at: string
          id: string
          is_visible: boolean | null
          order_number: number
          updated_at: string
        }
        Insert: {
          block_data?: Json
          block_type: string
          category_id: string
          created_at?: string
          id?: string
          is_visible?: boolean | null
          order_number?: number
          updated_at?: string
        }
        Update: {
          block_data?: Json
          block_type?: string
          category_id?: string
          created_at?: string
          id?: string
          is_visible?: boolean | null
          order_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_content_blocks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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
      hypedrop: {
        Row: {
          all_items: Json | null
          box_image: string | null
          box_name: string
          box_price: number
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
          box_name: string
          box_price: number
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
          box_name?: string
          box_price?: number
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
          box_name: string
          box_price: number
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
          box_name: string
          box_price: number
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
          box_name?: string
          box_price?: number
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
      mystery_box_categories: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          mystery_box_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          mystery_box_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          mystery_box_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mystery_box_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mystery_box_categories_mystery_box_id_fkey"
            columns: ["mystery_box_id"]
            isOneToOne: false
            referencedRelation: "mystery_boxes"
            referencedColumns: ["id"]
          },
        ]
      }
      mystery_boxes: {
        Row: {
          box_type: string | null
          created_at: string
          expected_value: number | null
          game: string | null
          highlights: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          min_price: number | null
          name: string
          odds_disclosed: string | null
          operator_id: string | null
          popularity_score: number | null
          price: number
          profit_rate: number | null
          provably_fair: boolean | null
          rarity_mix: Json | null
          release_date: string | null
          site_name: string | null
          slug: string
          stats: Json | null
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          box_type?: string | null
          created_at?: string
          expected_value?: number | null
          game?: string | null
          highlights?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_price?: number | null
          name: string
          odds_disclosed?: string | null
          operator_id?: string | null
          popularity_score?: number | null
          price: number
          profit_rate?: number | null
          provably_fair?: boolean | null
          rarity_mix?: Json | null
          release_date?: string | null
          site_name?: string | null
          slug: string
          stats?: Json | null
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          box_type?: string | null
          created_at?: string
          expected_value?: number | null
          game?: string | null
          highlights?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_price?: number | null
          name?: string
          odds_disclosed?: string | null
          operator_id?: string | null
          popularity_score?: number | null
          price?: number
          profit_rate?: number | null
          provably_fair?: boolean | null
          rarity_mix?: Json | null
          release_date?: string | null
          site_name?: string | null
          slug?: string
          stats?: Json | null
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "mystery_boxes_operator_id_fkey"
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
      operator_payment_methods: {
        Row: {
          created_at: string
          fee_fixed: number | null
          fee_percentage: number | null
          id: string
          is_available: boolean | null
          maximum_amount: number | null
          method_type: string
          minimum_amount: number | null
          operator_id: string | null
          payment_method_id: string | null
          processing_time: string | null
        }
        Insert: {
          created_at?: string
          fee_fixed?: number | null
          fee_percentage?: number | null
          id?: string
          is_available?: boolean | null
          maximum_amount?: number | null
          method_type?: string
          minimum_amount?: number | null
          operator_id?: string | null
          payment_method_id?: string | null
          processing_time?: string | null
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
          operator_id?: string | null
          payment_method_id?: string | null
          processing_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operator_payment_methods_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_payment_methods_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
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
          search_vector: unknown
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
          search_vector?: unknown
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
          search_vector?: unknown
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
      payment_methods: {
        Row: {
          created_at: string
          description_rich: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_rich?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_rich?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      provider_box_category_overrides: {
        Row: {
          box_id: number
          category_id: string
          created_at: string | null
          id: string
          provider: string
          updated_at: string | null
        }
        Insert: {
          box_id: number
          category_id: string
          created_at?: string | null
          id?: string
          provider: string
          updated_at?: string | null
        }
        Update: {
          box_id?: number
          category_id?: string
          created_at?: string | null
          id?: string
          provider?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_box_category_overrides_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      published_category_content: {
        Row: {
          category_id: string
          content_data: Json
          created_at: string
          id: string
          seo_data: Json
          slug: string
          updated_at: string
        }
        Insert: {
          category_id: string
          content_data?: Json
          created_at?: string
          id?: string
          seo_data?: Json
          slug: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          content_data?: Json
          created_at?: string
          id?: string
          seo_data?: Json
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "published_category_content_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      published_operator_content: {
        Row: {
          content_data: Json
          created_at: string
          id: string
          operator_id: string
          seo_data: Json
          slug: string
          updated_at: string
        }
        Insert: {
          content_data?: Json
          created_at?: string
          id?: string
          operator_id: string
          seo_data?: Json
          slug: string
          updated_at?: string
        }
        Update: {
          content_data?: Json
          created_at?: string
          id?: string
          operator_id?: string
          seo_data?: Json
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "published_operator_content_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          content: string
          created_at: string
          helpful_votes: Json | null
          id: string
          operator_id: string
          operator_response: Json | null
          photos: string[] | null
          rating: number
          status: string | null
          subscores: Json | null
          title: string | null
          updated_at: string
          user_id: string | null
          username: string | null
          verification_status: string | null
        }
        Insert: {
          content: string
          created_at?: string
          helpful_votes?: Json | null
          id?: string
          operator_id: string
          operator_response?: Json | null
          photos?: string[] | null
          rating: number
          status?: string | null
          subscores?: Json | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
          verification_status?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          helpful_votes?: Json | null
          id?: string
          operator_id?: string
          operator_response?: Json | null
          photos?: string[] | null
          rating?: number
          status?: string | null
          subscores?: Json | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
          verification_status?: string | null
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
      rillabox: {
        Row: {
          all_items: Json | null
          box_image: string | null
          box_name: string
          box_price: number
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
          box_name: string
          box_price: number
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
          box_name?: string
          box_price?: number
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
      is_admin: { Args: never; Returns: boolean }
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
