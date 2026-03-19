-- FitKot — Initial Database Schema
-- Run with: supabase db push (or paste into Supabase SQL Editor)
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('user', 'trainer', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'pending', 'suspended');
CREATE TYPE workout_unit AS ENUM ('reps', 'seconds', 'minutes');

-- ============================================================
-- TABLES
-- ============================================================

-- Users (extends Supabase Auth)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL DEFAULT '',
    role user_role NOT NULL DEFAULT 'user',
    status user_status NOT NULL DEFAULT 'active',
    oauth_provider TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trainer ↔ Client assignments
CREATE TABLE public.trainer_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(trainer_id, client_id)
);

-- Workout Plans (created by trainers)
CREATE TABLE public.workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    exercises JSONB NOT NULL DEFAULT '[]',
    -- exercises: [{ name, sets, reps, unit, notes }]
    version INT NOT NULL DEFAULT 1,
    tags TEXT[] DEFAULT '{}',
    -- e.g. {'geen materiaal', 'kleine ruimte', '<20 min'}
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Plan version history
CREATE TABLE public.plan_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
    version INT NOT NULL,
    exercises JSONB NOT NULL,
    changed_by UUID NOT NULL REFERENCES public.users(id),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Plan ↔ User assignments
CREATE TABLE public.plan_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(plan_id, user_id)
);

-- Workout Logs (submitted by users)
CREATE TABLE public.workout_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
    exercises JSONB NOT NULL DEFAULT '[]',
    -- exercises: [{ name, sets, reps, unit, completed }]
    duration INT NOT NULL CHECK (duration > 0 AND duration <= 480),
    -- duration in minutes, max 8h
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Progress Photos
CREATE TABLE public.progress_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    s3_url TEXT NOT NULL,
    s3_key TEXT NOT NULL,
    file_size INT NOT NULL CHECK (file_size > 0 AND file_size <= 5242880),
    -- max 5MB in bytes
    mime_type TEXT NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png')),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notes (attached to workout logs)
CREATE TABLE public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    workout_log_id UUID REFERENCES public.workout_logs(id) ON DELETE CASCADE,
    text TEXT NOT NULL CHECK (char_length(text) > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Diet Plans (created by trainers for clients)
CREATE TABLE public.diet_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Dieetplan',
    meals JSONB NOT NULL DEFAULT '[]',
    -- meals: [{ name, time, foods: [{ item, calories, protein, carbs, fat }] }]
    calories_target INT NOT NULL DEFAULT 2000,
    protein_target INT DEFAULT NULL,
    carbs_target INT DEFAULT NULL,
    fat_target INT DEFAULT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Meal Logs (user-submitted daily meals)
CREATE TABLE public.meal_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    diet_plan_id UUID REFERENCES public.diet_plans(id) ON DELETE SET NULL,
    food_items JSONB NOT NULL DEFAULT '[]',
    -- food_items: [{ item, calories, protein, carbs, fat }]
    calories INT NOT NULL DEFAULT 0,
    protein NUMERIC(6,1) DEFAULT 0,
    carbs NUMERIC(6,1) DEFAULT 0,
    fat NUMERIC(6,1) DEFAULT 0,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2FA records (temporary, for trainer plan edits)
CREATE TABLE public.two_factor_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_workout_logs_user_date ON public.workout_logs(user_id, date DESC);
CREATE INDEX idx_workout_logs_plan ON public.workout_logs(plan_id);
CREATE INDEX idx_plan_assignments_user ON public.plan_assignments(user_id);
CREATE INDEX idx_plan_assignments_plan ON public.plan_assignments(plan_id);
CREATE INDEX idx_trainer_clients_trainer ON public.trainer_clients(trainer_id);
CREATE INDEX idx_trainer_clients_client ON public.trainer_clients(client_id);
CREATE INDEX idx_progress_photos_user ON public.progress_photos(user_id, uploaded_at DESC);
CREATE INDEX idx_diet_plans_user ON public.diet_plans(user_id);
CREATE INDEX idx_meal_logs_user_date ON public.meal_logs(user_id, date DESC);
CREATE INDEX idx_notes_workout ON public.notes(workout_log_id);
CREATE INDEX idx_two_factor_user ON public.two_factor_codes(user_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_workout_plans_updated_at
    BEFORE UPDATE ON public.workout_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_diet_plans_updated_at
    BEFORE UPDATE ON public.diet_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.two_factor_codes ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: check if trainer is assigned to client
CREATE OR REPLACE FUNCTION public.is_trainer_of(client UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.trainer_clients
        WHERE trainer_id = auth.uid() AND client_id = client
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- USERS ----
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Trainers can view assigned clients"
    ON public.users FOR SELECT
    USING (public.get_user_role() = 'trainer' AND public.is_trainer_of(id));

CREATE POLICY "Admins can view all users"
    ON public.users FOR SELECT
    USING (public.get_user_role() = 'admin');

CREATE POLICY "Admins can update any user"
    ON public.users FOR UPDATE
    USING (public.get_user_role() = 'admin');

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.users WHERE id = auth.uid()));
    -- Users cannot change their own role

-- ---- TRAINER_CLIENTS ----
CREATE POLICY "Trainers see own assignments"
    ON public.trainer_clients FOR SELECT
    USING (trainer_id = auth.uid() OR client_id = auth.uid());

CREATE POLICY "Admins manage trainer assignments"
    ON public.trainer_clients FOR ALL
    USING (public.get_user_role() = 'admin');

-- ---- WORKOUT_PLANS ----
CREATE POLICY "Trainers manage own plans"
    ON public.workout_plans FOR ALL
    USING (trainer_id = auth.uid());

CREATE POLICY "Users view assigned plans"
    ON public.workout_plans FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.plan_assignments pa
            WHERE pa.plan_id = workout_plans.id AND pa.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins view all plans"
    ON public.workout_plans FOR SELECT
    USING (public.get_user_role() = 'admin');

-- ---- PLAN_VERSIONS ----
CREATE POLICY "Plan version visible to plan owner and assigned users"
    ON public.plan_versions FOR SELECT
    USING (
        changed_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.plan_assignments pa
            WHERE pa.plan_id = plan_versions.plan_id AND pa.user_id = auth.uid()
        )
    );

CREATE POLICY "Trainers insert plan versions"
    ON public.plan_versions FOR INSERT
    WITH CHECK (changed_by = auth.uid() AND public.get_user_role() = 'trainer');

-- ---- PLAN_ASSIGNMENTS ----
CREATE POLICY "Trainers manage own plan assignments"
    ON public.plan_assignments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans wp
            WHERE wp.id = plan_assignments.plan_id AND wp.trainer_id = auth.uid()
        )
    );

CREATE POLICY "Users see own assignments"
    ON public.plan_assignments FOR SELECT
    USING (user_id = auth.uid());

-- ---- WORKOUT_LOGS ----
CREATE POLICY "Users manage own logs"
    ON public.workout_logs FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Trainers view assigned client logs"
    ON public.workout_logs FOR SELECT
    USING (public.get_user_role() = 'trainer' AND public.is_trainer_of(user_id));

CREATE POLICY "Admins view all logs"
    ON public.workout_logs FOR SELECT
    USING (public.get_user_role() = 'admin');

-- ---- PROGRESS_PHOTOS ----
CREATE POLICY "Users manage own photos"
    ON public.progress_photos FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Trainers view assigned client photos"
    ON public.progress_photos FOR SELECT
    USING (public.get_user_role() = 'trainer' AND public.is_trainer_of(user_id));

-- ---- NOTES ----
CREATE POLICY "Users manage own notes"
    ON public.notes FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Trainers view assigned client notes"
    ON public.notes FOR SELECT
    USING (public.get_user_role() = 'trainer' AND public.is_trainer_of(user_id));

-- ---- DIET_PLANS ----
CREATE POLICY "Trainers manage diet plans they created"
    ON public.diet_plans FOR ALL
    USING (trainer_id = auth.uid());

CREATE POLICY "Users view own diet plans"
    ON public.diet_plans FOR SELECT
    USING (user_id = auth.uid());

-- ---- MEAL_LOGS ----
CREATE POLICY "Users manage own meal logs"
    ON public.meal_logs FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Trainers view assigned client meals"
    ON public.meal_logs FOR SELECT
    USING (public.get_user_role() = 'trainer' AND public.is_trainer_of(user_id));

-- ---- TWO_FACTOR_CODES ----
CREATE POLICY "Users manage own 2FA codes"
    ON public.two_factor_codes FOR ALL
    USING (user_id = auth.uid());

-- ============================================================
-- REALTIME (for trainer live feed — M5)
-- ============================================================
-- Enable realtime on workout_logs so trainers get instant updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.workout_logs;

-- ============================================================
-- SEED DATA (for development/testing)
-- ============================================================

-- Note: In production, users are created via Supabase Auth.
-- This seed data is for local development with `supabase start`.
-- You'll need to create auth users first, then insert into public.users.
-- Example (run after creating auth users):

-- INSERT INTO public.users (id, email, name, role, status, oauth_provider) VALUES
--   ('uuid-of-stan', 'stan@student.be', 'Studerende Stan', 'user', 'active', 'google'),
--   ('uuid-of-sofia', 'sofia@trainer.be', 'Sofia Martens', 'trainer', 'active', 'google'),
--   ('uuid-of-admin', 'admin@fitkot.be', 'FitKot Admin', 'admin', 'active', 'google');

-- INSERT INTO public.trainer_clients (trainer_id, client_id) VALUES
--   ('uuid-of-sofia', 'uuid-of-stan');
