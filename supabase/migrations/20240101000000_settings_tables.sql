-- Settings Tables Migration

CREATE TABLE IF NOT EXISTS public.clinic_settings (
  id uuid default gen_random_uuid() primary key,
  clinic_name text not null default 'DentFlow Klinik',
  clinic_phone text,
  clinic_email text,
  clinic_address text,
  website text,
  tax_number text,
  tax_office text,
  working_days text[] default '{"Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"}'::text[],
  working_hours_start text default '09:00',
  working_hours_end text default '18:00',
  appointment_duration integer default 30,
  primary_color text default '#3b82f6',
  accent_color text default '#8b5cf6',
  currency text default 'TRY',
  timezone text default 'Europe/Istanbul',
  date_format text default 'dd.MM.yyyy',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS public.user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  theme_preference text default 'system',
  language text default 'tr-TR',
  timezone text default 'Europe/Istanbul',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

CREATE TABLE IF NOT EXISTS public.notification_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  email_notifications boolean default true,
  browser_notifications boolean default true,
  appointment_reminders boolean default true,
  payment_reminders boolean default true,
  treatment_alerts boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

CREATE TABLE IF NOT EXISTS public.security_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  two_factor_enabled boolean default false,
  last_password_change timestamp with time zone,
  active_sessions_count integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Enable RLS
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Policies for clinic_settings (Any authenticated user can view, but only Admins could update - for now allow authenticated)
CREATE POLICY "Enable read access for all authenticated users" ON public.clinic_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for all authenticated users" ON public.clinic_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for all authenticated users" ON public.clinic_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies for user_settings
CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for notification_settings
CREATE POLICY "Users can view their own notifications settings" ON public.notification_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications settings" ON public.notification_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notifications settings" ON public.notification_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for security_settings
CREATE POLICY "Users can view their own security settings" ON public.security_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own security settings" ON public.security_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own security settings" ON public.security_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
