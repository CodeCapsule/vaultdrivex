-- ============================================
-- VaultDrive: Supabase Database Migration
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================

-- 1. FILES TABLE (metadata for uploaded files)
CREATE TABLE IF NOT EXISTS files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size BIGINT NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT '',
  download_url TEXT NOT NULL DEFAULT '',
  storage_path TEXT NOT NULL DEFAULT '',
  provider TEXT DEFAULT 'supabase',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own files" ON files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own files" ON files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own files" ON files FOR DELETE USING (auth.uid() = user_id);

-- 2. FOLDERS TABLE
CREATE TABLE IF NOT EXISTS folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own folders" ON folders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own folders" ON folders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own folders" ON folders FOR DELETE USING (auth.uid() = user_id);

-- 3. NOTES TABLE
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);

-- 4. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Member',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own team_members" ON team_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own team_members" ON team_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own team_members" ON team_members FOR DELETE USING (auth.uid() = user_id);

-- 5. STORAGE BUCKET (create 'vaultdrive' bucket if not exists)
INSERT INTO storage.buckets (id, name, public) VALUES ('vaultdrive', 'vaultdrive', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the vaultdrive bucket
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'vaultdrive');
CREATE POLICY "Auth users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vaultdrive' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE USING (bucket_id = 'vaultdrive' AND auth.uid()::text = (storage.foldername(name))[1]);
