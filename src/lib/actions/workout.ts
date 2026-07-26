'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getWorkouts(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getWorkoutById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('workouts').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createWorkout(workout: {
  user_id: string;
  name: string;
  notes?: string;
  started_at?: string;
  completed_at?: string;
  duration_minutes?: number;
  feeling?: number;
  is_template?: boolean;
  source?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('workouts').insert(workout).select().single();
  if (error) throw error;
  return data;
}

export async function updateWorkout(id: string, updates: Record<string, unknown>) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('workouts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWorkout(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('workouts').delete().eq('id', id);
  if (error) throw error;
}

export async function getWorkoutCount(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { count, error } = await supabase
    .from('workouts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (error) throw error;
  return count ?? 0;
}

export async function getRecentWorkouts(userId: string, limit = 5) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getWeeklyVolume(userId: string) {
  const supabase = await createServerSupabaseClient();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', weekAgo.toISOString());
  if (error) throw error;
  return data;
}
