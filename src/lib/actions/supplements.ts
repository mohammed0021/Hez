'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getSupplementLogs(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('supplement_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addSupplementLog(entry: {
  user_id: string;
  supplement_name: string;
  dosage?: string;
  logged_at?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('supplement_logs').insert(entry).select().single();
  if (error) throw error;
  return data;
}

export async function getSupplementReminders(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('supplement_reminders')
    .select('*')
    .eq('user_id', userId)
    .order('time_of_day');
  if (error) throw error;
  return data ?? [];
}

export async function addSupplementReminder(entry: {
  user_id: string;
  supplement_name: string;
  dosage?: string;
  time_of_day: string;
  days_of_week?: number[];
  enabled?: boolean;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('supplement_reminders')
    .insert(entry)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSupplementReminder(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('supplement_reminders').delete().eq('id', id);
  if (error) throw error;
}
