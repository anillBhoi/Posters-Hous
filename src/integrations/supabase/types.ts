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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'user' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'user' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'user' | 'admin'
          avatar_url?: string | null
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          updated_at?: string
        }
      }
      posters: {
        Row: {
          id: string
          title: string
          slug: string
          artist: string
          description: string | null
          category_id: string | null
          image_url: string
          images: string[]
          tags: string[]
          is_featured: boolean
          is_new: boolean
          status: 'active' | 'inactive' | 'draft'
          stock_quantity: number
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          artist: string
          description?: string | null
          category_id?: string | null
          image_url: string
          images?: string[]
          tags?: string[]
          is_featured?: boolean
          is_new?: boolean
          status?: 'active' | 'inactive' | 'draft'
          stock_quantity?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          slug?: string
          artist?: string
          description?: string | null
          category_id?: string | null
          image_url?: string
          images?: string[]
          tags?: string[]
          is_featured?: boolean
          is_new?: boolean
          status?: 'active' | 'inactive' | 'draft'
          stock_quantity?: number
          views_count?: number
          updated_at?: string
        }
      }
      poster_sizes: {
        Row: {
          id: string
          poster_id: string
          name: string
          dimensions: string
          price: string
          stock_quantity: number
          is_available: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          poster_id: string
          name: string
          dimensions: string
          price: string
          stock_quantity?: number
          is_available?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          poster_id?: string
          name?: string
          dimensions?: string
          price?: string
          stock_quantity?: number
          is_available?: boolean
          display_order?: number
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          email: string
          full_name: string
          phone: string
          shipping_address: Json
          billing_address: Json | null
          subtotal: string
          tax_amount: string
          shipping_amount: string
          discount_amount: string
          coupon_id: string | null
          total_amount: string
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method: 'card' | 'upi' | 'wallet' | 'netbanking' | 'cod' | null
          payment_id: string | null
          tracking_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          user_id?: string | null
          email: string
          full_name: string
          phone: string
          shipping_address: Json
          billing_address?: Json | null
          subtotal: string
          tax_amount?: string
          shipping_amount?: string
          discount_amount?: string
          coupon_id?: string | null
          total_amount: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: 'card' | 'upi' | 'wallet' | 'netbanking' | 'cod' | null
          payment_id?: string | null
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          order_number?: string
          user_id?: string | null
          email?: string
          full_name?: string
          phone?: string
          shipping_address?: Json
          billing_address?: Json | null
          subtotal?: string
          tax_amount?: string
          shipping_amount?: string
          discount_amount?: string
          coupon_id?: string | null
          total_amount?: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_id?: string | null
          tracking_number?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          poster_id: string | null
          poster_title: string
          poster_image_url: string | null
          size_name: string
          size_dimensions: string
          price: string
          quantity: number
          subtotal: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          poster_id?: string | null
          poster_title: string
          poster_image_url?: string | null
          size_name: string
          size_dimensions: string
          price: string
          quantity: number
          subtotal: string
          created_at?: string
        }
        Update: {
          order_id?: string
          poster_id?: string | null
          poster_title?: string
          poster_image_url?: string | null
          size_name?: string
          size_dimensions?: string
          price?: string
          quantity?: number
          subtotal?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          type: 'percentage' | 'fixed'
          value: string
          min_purchase_amount: string
          max_discount_amount: string | null
          usage_limit: number | null
          used_count: number
          is_active: boolean
          valid_from: string | null
          valid_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          type: 'percentage' | 'fixed'
          value: string
          min_purchase_amount?: string
          max_discount_amount?: string | null
          usage_limit?: number | null
          used_count?: number
          is_active?: boolean
          valid_from?: string | null
          valid_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          code?: string
          description?: string | null
          type?: 'percentage' | 'fixed'
          value?: string
          min_purchase_amount?: string
          max_discount_amount?: string | null
          usage_limit?: number | null
          used_count?: number
          is_active?: boolean
          valid_from?: string | null
          valid_until?: string | null
          updated_at?: string
        }
      }
      banners: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          link_url: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          link_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          image_url?: string
          link_url?: string | null
          display_order?: number
          is_active?: boolean
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          phone: string
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          postal_code: string
          country?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          full_name?: string
          phone?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          is_default?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "user" | "admin"
      order_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      payment_method: "card" | "upi" | "wallet" | "netbanking" | "cod"
      coupon_type: "percentage" | "fixed"
      poster_status: "active" | "inactive" | "draft"
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
