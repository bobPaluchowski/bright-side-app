/*
  # Initial Schema Setup for Sobriety Support App

  1. New Tables
    - users
      - Extended user profile data
      - Mentor relationship tracking
      - Onboarding status
    - mentors
      - Mentor profile information
      - Availability and specializations
    - appointments
      - Scheduling system
      - Status tracking
    - chat_messages
      - Real-time messaging support
      - Read status tracking

  2. Security
    - RLS policies for all tables
    - User-specific access controls
    - Mentor-specific permissions
*/

-- Users table with extended profile
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  mentor_id uuid,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mentors table
CREATE TABLE IF NOT EXISTS public.mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  specializations text[] DEFAULT '{}',
  availability_schedule jsonb DEFAULT '{}',
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) NOT NULL,
  mentor_id uuid REFERENCES public.mentors(id) NOT NULL,
  title text NOT NULL,
  date_time timestamptz NOT NULL,
  comments text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES public.users(id) NOT NULL,
  receiver_id uuid REFERENCES public.users(id) NOT NULL,
  content text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  read_status boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Mentors policies
CREATE POLICY "Anyone can read mentors"
  ON public.mentors
  FOR SELECT
  TO authenticated
  USING (true);

-- Appointments policies
CREATE POLICY "Users can read own appointments"
  ON public.appointments
  FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create appointments"
  ON public.appointments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can read their messages"
  ON public.chat_messages
  FOR SELECT
  USING (auth.uid() IN (sender_id, receiver_id));

CREATE POLICY "Users can send messages"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);