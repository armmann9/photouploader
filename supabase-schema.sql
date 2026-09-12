-- ==========================================================
-- EventLens AI - Production Database & Storage Setup Schema
-- Run this script in your Supabase SQL Editor (supabase.com)
-- ==========================================================

-- 1. Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  location TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'Other',
  photo_count INT DEFAULT 0,
  pin_code TEXT,
  is_public BOOLEAN DEFAULT true,
  photographer_name TEXT,
  photographer_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Photos Table with Face Descriptors
CREATE TABLE IF NOT EXISTS public.photos (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  title TEXT,
  width INT,
  height INT,
  size_bytes BIGINT,
  tags TEXT[] DEFAULT '{}',
  faces JSONB DEFAULT '[]', -- Stores 128-dimensional face descriptor embeddings
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create helper function for incrementing event photo count
CREATE OR REPLACE FUNCTION public.increment_event_photo_count(event_id_input TEXT, count_add INT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.events
  SET photo_count = COALESCE(photo_count, 0) + count_add
  WHERE id = event_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- 5. Allow Public Read & Insert for Guests & Photographers
CREATE POLICY "Allow public read on events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public insert on events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on events" ON public.events FOR UPDATE USING (true);

CREATE POLICY "Allow public read on photos" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Allow public insert on photos" ON public.photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on photos" ON public.photos FOR UPDATE USING (true);

-- 6. Setup Supabase Storage Bucket for High-Res Event Photos
-- Insert 'event-photos' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-photos', 'event-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket access policies
CREATE POLICY "Public Access for Event Photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'event-photos');

CREATE POLICY "Allow Uploads to Event Photos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'event-photos');
