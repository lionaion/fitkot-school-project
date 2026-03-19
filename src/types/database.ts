// Auto-generated types placeholder
// Run: npx supabase gen types typescript --local > src/types/database.ts
// to regenerate from your local Supabase instance.

export type UserRole = "user" | "trainer" | "admin";
export type UserStatus = "active" | "pending" | "suspended";
export type WorkoutUnit = "reps" | "seconds" | "minutes";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: UserRole;
          status: UserStatus;
          oauth_provider: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string;
          role?: UserRole;
          status?: UserStatus;
          oauth_provider?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: UserRole;
          status?: UserStatus;
          oauth_provider?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      trainer_clients: {
        Row: {
          id: string;
          trainer_id: string;
          client_id: string;
          assigned_at: string;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          client_id: string;
          assigned_at?: string;
        };
        Update: {
          trainer_id?: string;
          client_id?: string;
        };
      };
      workout_plans: {
        Row: {
          id: string;
          trainer_id: string;
          title: string;
          description: string;
          exercises: Exercise[];
          version: number;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          title: string;
          description?: string;
          exercises?: Exercise[];
          version?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          exercises?: Exercise[];
          version?: number;
          tags?: string[];
          updated_at?: string;
        };
      };
      plan_versions: {
        Row: {
          id: string;
          plan_id: string;
          version: number;
          exercises: Exercise[];
          changed_by: string;
          changed_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          version: number;
          exercises: Exercise[];
          changed_by: string;
          changed_at?: string;
        };
        Update: Record<string, never>;
      };
      plan_assignments: {
        Row: {
          id: string;
          plan_id: string;
          user_id: string;
          assigned_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          user_id: string;
          assigned_at?: string;
        };
        Update: Record<string, never>;
      };
      workout_logs: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string | null;
          exercises: LogExercise[];
          duration: number;
          date: string;
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id?: string | null;
          exercises?: LogExercise[];
          duration: number;
          date?: string;
          notes?: string;
          created_at?: string;
        };
        Update: {
          exercises?: LogExercise[];
          duration?: number;
          date?: string;
          notes?: string;
        };
      };
      progress_photos: {
        Row: {
          id: string;
          user_id: string;
          s3_url: string;
          s3_key: string;
          file_size: number;
          mime_type: string;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          s3_url: string;
          s3_key: string;
          file_size: number;
          mime_type: string;
          uploaded_at?: string;
        };
        Update: Record<string, never>;
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          workout_log_id: string | null;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_log_id?: string | null;
          text: string;
          created_at?: string;
        };
        Update: {
          text?: string;
        };
      };
      diet_plans: {
        Row: {
          id: string;
          trainer_id: string;
          user_id: string;
          title: string;
          meals: Meal[];
          calories_target: number;
          protein_target: number | null;
          carbs_target: number | null;
          fat_target: number | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          user_id: string;
          title?: string;
          meals?: Meal[];
          calories_target?: number;
          protein_target?: number | null;
          carbs_target?: number | null;
          fat_target?: number | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          meals?: Meal[];
          calories_target?: number;
          protein_target?: number | null;
          carbs_target?: number | null;
          fat_target?: number | null;
          active?: boolean;
          updated_at?: string;
        };
      };
      meal_logs: {
        Row: {
          id: string;
          user_id: string;
          diet_plan_id: string | null;
          food_items: FoodItem[];
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          diet_plan_id?: string | null;
          food_items?: FoodItem[];
          calories?: number;
          protein?: number;
          carbs?: number;
          fat?: number;
          date?: string;
          created_at?: string;
        };
        Update: {
          food_items?: FoodItem[];
          calories?: number;
          protein?: number;
          carbs?: number;
          fat?: number;
        };
      };
      two_factor_codes: {
        Row: {
          id: string;
          user_id: string;
          code: string;
          attempts: number;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          code: string;
          attempts?: number;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          attempts?: number;
        };
      };
    };
    Enums: {
      user_role: UserRole;
      user_status: UserStatus;
      workout_unit: WorkoutUnit;
    };
  };
}

// JSON field types
export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  unit: WorkoutUnit;
  notes?: string;
}

export interface LogExercise extends Exercise {
  completed: boolean;
}

export interface Meal {
  name: string;
  time: string;
  foods: FoodItem[];
}

export interface FoodItem {
  item: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
