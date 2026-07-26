'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getMeasurements(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('body_measurements')
    .select('*')
    .eq('user_id', userId)
    .order('measured_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addMeasurement(entry: {
  user_id: string;
  measured_at: string;
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  arms_cm?: number;
  thighs_cm?: number;
  calves_cm?: number;
  shoulders_cm?: number;
  neck_cm?: number;
  body_fat_percentage?: number;
  notes?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('body_measurements').insert(entry).select().single();
  if (error) throw error;
  return data;
}

export async function deleteMeasurement(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('body_measurements').delete().eq('id', id);
  if (error) throw error;
}

export async function updateMeasurement(id: string, updates: Record<string, unknown>) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('body_measurements')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
