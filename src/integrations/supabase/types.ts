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
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          room_id: string
          thread_id: string | null
          timestamp_sec: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          room_id: string
          thread_id?: string | null
          timestamp_sec?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          room_id?: string
          thread_id?: string | null
          timestamp_sec?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pins: {
        Row: {
          created_at: string
          id: string
          label: string
          room_id: string
          timestamp_sec: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          room_id: string
          timestamp_sec: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          room_id?: string
          timestamp_sec?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pins_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          room_id: string
          timestamp_sec: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          room_id: string
          timestamp_sec?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          room_id?: string
          timestamp_sec?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      room_participants: {
        Row: {
          id: string
          joined_at: string
          left_at: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          left_at?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          left_at?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          current_time_sec: number | null
          host_id: string
          id: string
          is_playing: boolean | null
          name: string
          updated_at: string
          video_id: string | null
          video_title: string | null
        }
        Insert: {
          created_at?: string
          current_time_sec?: number | null
          host_id: string
          id?: string
          is_playing?: boolean | null
          name: string
          updated_at?: string
          video_id?: string | null
          video_title?: string | null
        }
        Update: {
          created_at?: string
          current_time_sec?: number | null
          host_id?: string
          id?: string
          is_playing?: boolean | null
          name?: string
          updated_at?: string
          video_id?: string | null
          video_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_channels: {
        Row: {
          avatar_color: string | null
          avg_views: number
          category: string
          channel_id: string
          channel_logo: string | null
          channel_name: string
          channel_url: string
          country: string
          engagement: number
          id: string
          language: string
          saved_at: string
          subscribers: number
          user_id: string
          videos: Json | null
        }
        Insert: {
          avatar_color?: string | null
          avg_views?: number
          category: string
          channel_id: string
          channel_logo?: string | null
          channel_name: string
          channel_url: string
          country: string
          engagement?: number
          id?: string
          language: string
          saved_at?: string
          subscribers?: number
          user_id: string
          videos?: Json | null
        }
        Update: {
          avatar_color?: string | null
          avg_views?: number
          category?: string
          channel_id?: string
          channel_logo?: string | null
          channel_name?: string
          channel_url?: string
          country?: string
          engagement?: number
          id?: string
          language?: string
          saved_at?: string
          subscribers?: number
          user_id?: string
          videos?: Json | null
        }
        Relationships: []
      }
      snapaura_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number
          email: string
          full_name: string | null
          id: string
          max_credits: number
          plan: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          email: string
          full_name?: string | null
          id?: string
          max_credits?: number
          plan?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          email?: string
          full_name?: string | null
          id?: string
          max_credits?: number
          plan?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      snapaura_usage_history: {
        Row: {
          created_at: string
          credits_used: number
          feature_type: string
          id: string
          image_url: string | null
          result_url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_used?: number
          feature_type: string
          id?: string
          image_url?: string | null
          result_url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          credits_used?: number
          feature_type?: string
          id?: string
          image_url?: string | null
          result_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_cursor_api_key: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_active_participant: {
        Args: { _room_id: string; _user_id: string }
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
