'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getSettings(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function upsertSettings(settings: {
  user_id: string;
  measurement_system?: string;
  language?: string;
  mode?: string;
  notifications_enabled?: boolean;
  rest_timer_default?: number;
  weekly_goal_workouts?: number;
  weekly_goal_water_ml?: number;
  daily_calorie_goal?: number;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('settings').upsert(settings).select().single();
  if (error) throw error;
  return data;
}

export async function updateSettings(userId: string, updates: Record<string, unknown>) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('settings')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
