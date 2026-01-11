
import { createClient } from '@supabase/supabase-js';
import { MetricLog } from '../types';

// Get Supabase credentials from Vite environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safety check: Log error if credentials are missing
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    '❌ SUPABASE CONFIGURATION ERROR:\n' +
    (!SUPABASE_URL ? '  - VITE_SUPABASE_URL is not set!\n' : '') +
    (!SUPABASE_ANON_KEY ? '  - VITE_SUPABASE_ANON_KEY is not set!\n' : '') +
    'Please ensure you have set these environment variables in your deployment platform (e.g., Vercel).\n' +
    'For local development, create a .env.local file with:\n' +
    '  VITE_SUPABASE_URL=your_supabase_url\n' +
    '  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key'
  );
}

// Create Supabase client with fallback to prevent crashes
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-key'
);

export async function fetchLogs() {
  const { data, error } = await supabase
    .from('keto_logs')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function saveLog(log: Omit<MetricLog, 'id'>) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from('keto_logs')
    .insert([{
      user_id: userData.user.id,
      date: log.date,
      weight: log.weight,
      well_being: log.wellBeing,
      sleep_quality: log.sleepQuality,
      progress_note: log.progressNote
    }])
    .select();

  if (error) throw error;
  return data[0];
}

export async function getProfile() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user.id)
    .single();

  if (error) throw error;
  return data;
}
