
import { createClient } from '@supabase/supabase-js';
import { MetricLog } from '../types';

const SUPABASE_URL = 'https://naniumtzpccvfipljsyy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbml1bXR6cGNjdmZpcGxqc3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NDQ2NjgsImV4cCI6MjA4MzUyMDY2OH0.U6BwlL-t81HsazGZjIl1Yr6SnNYHt6emVzG5u8fYCgs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
