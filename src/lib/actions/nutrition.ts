'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getNutritionLogs(userId: string, date?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('nutrition_logs')
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

export async function addNutritionLog(entry: {
  user_id: string;
  meal_type: string;
  food_name: string;
  portion_size?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  notes?: string;
  logged_at?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('nutrition_logs').insert(entry).select().single();
  if (error) throw error;
  return data;
}

export async function getTodaysNutrition(userId: string) {
  const today = new Date().toDateString();
  const logs = await getNutritionLogs(userId, today);
  const totals = (logs ?? []).reduce(
    (acc, log) => ({
      calories: acc.calories + (log.calories ?? 0),
      protein: acc.protein + (log.protein_g ?? 0),
      carbs: acc.carbs + (log.carbs_g ?? 0),
      fat: acc.fat + (log.fat_g ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
  return { logs, totals };
}
