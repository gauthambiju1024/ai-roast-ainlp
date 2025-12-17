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
      agent_evaluation: {
        Row: {
          agent_participant: string
          agent_personality: string
          battle_id: string
          created_at: string | null
          ethical_violation: boolean
          fun_factor: number
          id: string
          intensity: Database["public"]["Enums"]["intensity_level"]
          mode: Database["public"]["Enums"]["battle_mode"]
          originality: number
          persona_match: number
          relevance: number
          session_id: string
        }
        Insert: {
          agent_participant: string
          agent_personality: string
          battle_id: string
          created_at?: string | null
          ethical_violation: boolean
          fun_factor: number
          id?: string
          intensity: Database["public"]["Enums"]["intensity_level"]
          mode: Database["public"]["Enums"]["battle_mode"]
          originality: number
          persona_match: number
          relevance: number
          session_id: string
        }
        Update: {
          agent_participant?: string
          agent_personality?: string
          battle_id?: string
          created_at?: string | null
          ethical_violation?: boolean
          fun_factor?: number
          id?: string
          intensity?: Database["public"]["Enums"]["intensity_level"]
          mode?: Database["public"]["Enums"]["battle_mode"]
          originality?: number
          persona_match?: number
          relevance?: number
          session_id?: string
        }
        Relationships: []
      }
      battle_training_data: {
        Row: {
          a_humor: number | null
          a_originality: number | null
          a_punch: number | null
          a_relevance: number | null
          a_text: string
          agent_a_personality: string | null
          agent_b_personality: string | null
          b_humor: number | null
          b_originality: number | null
          b_punch: number | null
          b_relevance: number | null
          b_text: string
          battle_id: string
          created_at: string | null
          human_a_humor: number | null
          human_a_originality: number | null
          human_a_punch: number | null
          human_a_relevance: number | null
          human_b_humor: number | null
          human_b_originality: number | null
          human_b_punch: number | null
          human_b_relevance: number | null
          human_feedback_text: string | null
          human_overall_a: number | null
          human_overall_b: number | null
          intensity: Database["public"]["Enums"]["intensity_level"]
          margin: number | null
          message_limit: number
          mode: Database["public"]["Enums"]["battle_mode"]
          overall_a: number | null
          overall_b: number | null
          session_id: string
          thread_text: string
          time_limit_seconds: number
          winner: Database["public"]["Enums"]["battle_winner"] | null
        }
        Insert: {
          a_humor?: number | null
          a_originality?: number | null
          a_punch?: number | null
          a_relevance?: number | null
          a_text: string
          agent_a_personality?: string | null
          agent_b_personality?: string | null
          b_humor?: number | null
          b_originality?: number | null
          b_punch?: number | null
          b_relevance?: number | null
          b_text: string
          battle_id?: string
          created_at?: string | null
          human_a_humor?: number | null
          human_a_originality?: number | null
          human_a_punch?: number | null
          human_a_relevance?: number | null
          human_b_humor?: number | null
          human_b_originality?: number | null
          human_b_punch?: number | null
          human_b_relevance?: number | null
          human_feedback_text?: string | null
          human_overall_a?: number | null
          human_overall_b?: number | null
          intensity: Database["public"]["Enums"]["intensity_level"]
          margin?: number | null
          message_limit: number
          mode: Database["public"]["Enums"]["battle_mode"]
          overall_a?: number | null
          overall_b?: number | null
          session_id: string
          thread_text: string
          time_limit_seconds: number
          winner?: Database["public"]["Enums"]["battle_winner"] | null
        }
        Update: {
          a_humor?: number | null
          a_originality?: number | null
          a_punch?: number | null
          a_relevance?: number | null
          a_text?: string
          agent_a_personality?: string | null
          agent_b_personality?: string | null
          b_humor?: number | null
          b_originality?: number | null
          b_punch?: number | null
          b_relevance?: number | null
          b_text?: string
          battle_id?: string
          created_at?: string | null
          human_a_humor?: number | null
          human_a_originality?: number | null
          human_a_punch?: number | null
          human_a_relevance?: number | null
          human_b_humor?: number | null
          human_b_originality?: number | null
          human_b_punch?: number | null
          human_b_relevance?: number | null
          human_feedback_text?: string | null
          human_overall_a?: number | null
          human_overall_b?: number | null
          intensity?: Database["public"]["Enums"]["intensity_level"]
          margin?: number | null
          message_limit?: number
          mode?: Database["public"]["Enums"]["battle_mode"]
          overall_a?: number | null
          overall_b?: number | null
          session_id?: string
          thread_text?: string
          time_limit_seconds?: number
          winner?: Database["public"]["Enums"]["battle_winner"] | null
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
      battle_mode: "human_vs_ai" | "ai_vs_ai"
      battle_winner: "A" | "B" | "TIE"
      intensity_level: "mild" | "spicy"
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
      battle_mode: ["human_vs_ai", "ai_vs_ai"],
      battle_winner: ["A", "B", "TIE"],
      intensity_level: ["mild", "spicy"],
    },
  },
} as const
