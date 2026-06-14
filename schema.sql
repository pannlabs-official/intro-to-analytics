-- schema.sql
-- Run this in the Supabase SQL Editor to set up your database for the Data Analytics Course

-- 1. Create the user_progress table
CREATE TABLE user_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  completed_chapters integer[] DEFAULT '{}'::integer[],
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Users can only read their own progress
CREATE POLICY "Users can view own progress" 
ON user_progress FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only insert their own progress
CREATE POLICY "Users can insert own progress" 
ON user_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own progress
CREATE POLICY "Users can update own progress" 
ON user_progress FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 4. Create an automatic trigger to set updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_progress_updated_at
BEFORE UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 5. Create a trigger to automatically insert a progress row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_progress (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
