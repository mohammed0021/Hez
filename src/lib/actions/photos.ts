'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getProgressPhotos(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('progress_photos')
    .select('*')
    .eq('user_id', userId)
    .order('taken_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addProgressPhoto(entry: {
  user_id: string;
  photo_urls: Record<string, unknown>;
  category?: string;
  taken_at?: string;
  notes?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('progress_photos').insert(entry).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProgressPhoto(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('progress_photos').delete().eq('id', id);
  if (error) throw error;
}
