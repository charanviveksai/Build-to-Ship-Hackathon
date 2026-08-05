-- LockMe AI PostgreSQL Database Schema & Row Level Security (RLS) Setup

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_image TEXT,
    master_pin_hash VARCHAR(255),
    biometrics_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own user record" 
    ON public.users FOR SELECT 
    USING (auth.uid() = id OR id = auth.uid());

CREATE POLICY "Users can update own user record" 
    ON public.users FOR UPDATE 
    USING (auth.uid() = id);

-- 3. PROTECTED APPS TABLE
CREATE TABLE IF NOT EXISTS public.protected_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    app_name VARCHAR(255) NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    icon_name VARCHAR(100) DEFAULT 'Shield',
    lock_enabled BOOLEAN DEFAULT TRUE,
    lock_type VARCHAR(50) DEFAULT 'PIN', -- 'PIN', 'Password', 'Face', 'Biometric'
    pin_hash VARCHAR(255),
    password_hash VARCHAR(255),
    face_enabled BOOLEAN DEFAULT TRUE,
    biometric_enabled BOOLEAN DEFAULT TRUE,
    attempts_count INT DEFAULT 0,
    last_unlocked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_protected_apps_user_id ON public.protected_apps(user_id);

-- Enable RLS for protected_apps
ALTER TABLE public.protected_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own protected apps" 
    ON public.protected_apps FOR ALL 
    USING (auth.uid() = user_id);

-- 4. FACE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.face_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    embedding JSONB NOT NULL, -- Stored facial vector descriptor
    image_url TEXT,
    device_name VARCHAR(255),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_face_profiles_user_id ON public.face_profiles(user_id);

ALTER TABLE public.face_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own face profiles" 
    ON public.face_profiles FOR ALL 
    USING (auth.uid() = user_id);

-- 5. UNLOCK LOGS TABLE
CREATE TABLE IF NOT EXISTS public.unlock_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    app_id UUID REFERENCES public.protected_apps(id) ON DELETE SET NULL,
    app_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'SUCCESS', 'FAILED_PIN', 'FAILED_FACE', 'INTRUDER_DETECTED'
    confidence NUMERIC(5, 2) DEFAULT 0.00, -- Face match %
    threat_level VARCHAR(50) DEFAULT 'Low', -- 'Low', 'Medium', 'High', 'Critical'
    device_name VARCHAR(255) DEFAULT 'Current Device',
    location VARCHAR(255) DEFAULT 'Unknown',
    image_url TEXT, -- Captured face screenshot URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_unlock_logs_user_id ON public.unlock_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_unlock_logs_created_at ON public.unlock_logs(created_at DESC);

ALTER TABLE public.unlock_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own unlock logs" 
    ON public.unlock_logs FOR ALL 
    USING (auth.uid() = user_id);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- 'info', 'warning', 'alert', 'threat'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notifications" 
    ON public.notifications FOR ALL 
    USING (auth.uid() = user_id);

-- 7. AI REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.ai_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    report TEXT NOT NULL,
    risk_score INT NOT NULL DEFAULT 0, -- 0 to 100
    threat_level VARCHAR(50) DEFAULT 'Low',
    recommendation TEXT,
    analyzed_attempts INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_reports_user_id ON public.ai_reports(user_id);

ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own AI reports" 
    ON public.ai_reports FOR ALL 
    USING (auth.uid() = user_id);

-- Storage bucket definition for captured intruder screenshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('intruder-snapshots', 'intruder-snapshots', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Intruder snapshots access policy" 
ON storage.objects FOR ALL 
USING (bucket_id = 'intruder-snapshots');
