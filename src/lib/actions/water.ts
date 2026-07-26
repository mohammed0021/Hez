'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getWaterLogs(userId: string, date?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false });
  if (date) {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    query = query.gte('logged_at', dayStart.toISOString()).lte('logged_at', dayEnd.toISOString());
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function addWaterLog(entry: {
  user_id: string;
  amount_ml: number;
  logged_at?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('water_logs').insert(entry).select().single();
  if (error) throw error;
  return data;
}

export async function getTodaysWater(userId: string) {
  const today = new Date().toDateString();
  const logs = await getWaterLogs(userId, today);
  const totalMl = (logs ?? []).reduce((acc, log) => acc + (log.amount_ml ?? 0), 0);
  return { logs, totalMl };
}
