'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getPersonalRecords(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('personal_records')
    .select('*, exercise_library!inner(name)')
    .eq('user_id', userId)
    .order('achieved_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addPersonalRecord(record: {
  user_id: string;
  exercise_id: string;
  record_type: string;
  value: number;
  achieved_at?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('personal_records')
    .upsert(record, { onConflict: 'user_id,exercise_id,record_type' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getHealthCheck() {
  const supabase = await createServerSupabaseClient();
  const results: Record<string, string> = {};

  try {
    const { data } = await supabase.from('profiles').select('id').limit(1);
    results.database = data ? 'healthy' : 'degraded';
  } catch {
    results.database = 'unhealthy';
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    results.authentication = user ? 'healthy' : 'degraded';
  } catch {
    results.authentication = 'unhealthy';
  }

  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    results.storage = Array.isArray(buckets) ? 'healthy' : 'degraded';
  } catch {
    results.storage = 'unhealthy';
  }

  return results;
}
