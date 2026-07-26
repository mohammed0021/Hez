'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getWeightLogs(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addWeightLog(entry: {
  user_id: string;
  weight_kg: number;
  notes?: string;
  logged_at?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('weight_logs').insert(entry).select().single();
  if (error) throw error;
  return data;
}

export async function deleteWeightLog(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('weight_logs').delete().eq('id', id);
  if (error) throw error;
}
