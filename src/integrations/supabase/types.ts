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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blogs: {
        Row: {
          body: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          published_at: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          source?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string | null
          description: string | null
          end_date: string | null
          field: string | null
          id: string
          institution: string
          published: boolean
          sort_order: number
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          degree?: string | null
          description?: string | null
          end_date?: string | null
          field?: string | null
          id?: string
          institution: string
          published?: boolean
          sort_order?: number
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          degree?: string | null
          description?: string | null
          end_date?: string | null
          field?: string | null
          id?: string
          institution?: string
          published?: boolean
          sort_order?: number
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      experience: {
        Row: {
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          highlights: string[]
          id: string
          location: string | null
          published: boolean
          role: string
          sort_order: number
          start_date: string | null
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          highlights?: string[]
          id?: string
          location?: string | null
          published?: boolean
          role: string
          sort_order?: number
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          highlights?: string[]
          id?: string
          location?: string | null
          published?: boolean
          role?: string
          sort_order?: number
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          company: string | null
          created_at: string
          design_process: string | null
          duration: string | null
          featured: boolean
          gallery: Json
          id: string
          learnings: string | null
          links: Json
          metrics: Json
          outcome: string | null
          overview: string | null
          problem_statement: string | null
          published: boolean
          research: string | null
          role: string | null
          short_description: string | null
          slug: string
          solution: string | null
          sort_order: number
          tags: string[]
          thumbnail_url: string | null
          timeline: string | null
          title: string
          tools: string[]
          updated_at: string
        }
        Insert: {
          category?: string | null
          company?: string | null
          created_at?: string
          design_process?: string | null
          duration?: string | null
          featured?: boolean
          gallery?: Json
          id?: string
          learnings?: string | null
          links?: Json
          metrics?: Json
          outcome?: string | null
          overview?: string | null
          problem_statement?: string | null
          published?: boolean
          research?: string | null
          role?: string | null
          short_description?: string | null
          slug: string
          solution?: string | null
          sort_order?: number
          tags?: string[]
          thumbnail_url?: string | null
          timeline?: string | null
          title: string
          tools?: string[]
          updated_at?: string
        }
        Update: {
          category?: string | null
          company?: string | null
          created_at?: string
          design_process?: string | null
          duration?: string | null
          featured?: boolean
          gallery?: Json
          id?: string
          learnings?: string | null
          links?: Json
          metrics?: Json
          outcome?: string | null
          overview?: string | null
          problem_statement?: string | null
          published?: boolean
          research?: string | null
          role?: string | null
          short_description?: string | null
          slug?: string
          solution?: string | null
          sort_order?: number
          tags?: string[]
          thumbnail_url?: string | null
          timeline?: string | null
          title?: string
          tools?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          description: string | null
          id: string
          keywords: string[]
          og_image_url: string | null
          route: string
          title: string | null
          updated_at: string
        }
        Insert: {
          description?: string | null
          id?: string
          keywords?: string[]
          og_image_url?: string | null
          route: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          description?: string | null
          id?: string
          keywords?: string[]
          og_image_url?: string | null
          route?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          bio: string | null
          email: string | null
          id: number
          location: string | null
          name: string | null
          profile_image_url: string | null
          resume_url: string | null
          socials: Json
          tagline: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          email?: string | null
          id?: number
          location?: string | null
          name?: string | null
          profile_image_url?: string | null
          resume_url?: string | null
          socials?: Json
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          email?: string | null
          id?: number
          location?: string | null
          name?: string | null
          profile_image_url?: string | null
          resume_url?: string | null
          socials?: Json
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string
          group_name: string
          id: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          group_name: string
          id?: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          group_name?: string
          id?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          avatar_url: string | null
          company: string | null
          created_at: string
          id: string
          published: boolean
          quote: string
          role: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          author: string
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          published?: boolean
          quote: string
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          author?: string
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          published?: boolean
          quote?: string
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
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
      app_role: ["admin", "editor"],
    },
  },
} as const
