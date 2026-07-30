// Hand-written to match supabase/migrations/0001_init.sql.
// Regenerate with `supabase gen types typescript` once the project is linked,
// keeping this file's shape (Database.public.Tables.<table>.{Row,Insert,Update}).

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          company_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          company_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string | null;
          created_at?: string;
        };
      };
      calculators: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string;
          description: string | null;
          base_price: number;
          currency: string;
          estimate_spread_percent: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug: string;
          description?: string | null;
          base_price?: number;
          currency?: string;
          estimate_spread_percent?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          base_price?: number;
          currency?: string;
          estimate_spread_percent?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          calculator_id: string;
          label: string;
          type: "number_slider" | "single_choice" | "checkbox";
          config: Record<string, unknown>;
          position: number;
          required: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          calculator_id: string;
          label: string;
          type: "number_slider" | "single_choice" | "checkbox";
          config?: Record<string, unknown>;
          position?: number;
          required?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          calculator_id?: string;
          label?: string;
          type?: "number_slider" | "single_choice" | "checkbox";
          config?: Record<string, unknown>;
          position?: number;
          required?: boolean;
          created_at?: string;
        };
      };
      options: {
        Row: {
          id: string;
          question_id: string;
          label: string;
          price_delta: number;
          price_multiplier: number;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          label: string;
          price_delta?: number;
          price_multiplier?: number;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          label?: string;
          price_delta?: number;
          price_multiplier?: number;
          position?: number;
          created_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          calculator_id: string;
          name: string;
          email: string;
          phone: string | null;
          answers: Record<string, unknown>;
          estimated_min: number;
          estimated_max: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          calculator_id: string;
          name: string;
          email: string;
          phone?: string | null;
          answers?: Record<string, unknown>;
          estimated_min: number;
          estimated_max: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          calculator_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          answers?: Record<string, unknown>;
          estimated_min?: number;
          estimated_max?: number;
          created_at?: string;
        };
      };
    };
  };
}
