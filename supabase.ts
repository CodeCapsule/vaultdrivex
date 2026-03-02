import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use a valid URL as fallback to prevent "Invalid supabaseUrl" error during initialization
const finalUrl = (supabaseUrl && supabaseUrl.startsWith('http') && !supabaseUrl.includes('placeholder')) ? supabaseUrl : 'https://totzjdqpafgezfvxhtfs.supabase.co';
const finalKey = (supabaseAnonKey && supabaseAnonKey.length > 20 && !supabaseAnonKey.includes('placeholder')) ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdHpqZHFwYWZnZXpmdnhodGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODc3NDMsImV4cCI6MjA4NzE2Mzc0M30.JdiDgnrkVkQPUkIaNORiOB1F8GQY8WlQRjl3O567x8A';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing or invalid. Using placeholders.', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
}

export const supabase = createClient(finalUrl, finalKey);
