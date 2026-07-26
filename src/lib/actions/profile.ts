'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getProfile(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function upsertProfile(profile: {
  id: string;
  display_name: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  goal?: string;
  height_cm?: number;
  date_of_birth?: string;
  gender?: string;
  onboarding_completed?: boolean;
  timezone?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('profiles').upsert(profile).select().single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
