'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getAdminStats() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: totalUsers },
    { count: totalWorkouts },
    { count: activeToday },
    { count: totalNutrition },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('workouts').select('*', { count: 'exact', head: true }),
    supabase
      .from('workouts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    supabase.from('nutrition_logs').select('*', { count: 'exact', head: true }),
  ]);

  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    totalUsers: totalUsers ?? 0,
    totalWorkouts: totalWorkouts ?? 0,
    activeToday: activeToday ?? 0,
    totalNutrition: totalNutrition ?? 0,
    recentUsers: recentUsers ?? [],
  };
}

export async function getAdminUsers(page = 1, perPage = 20) {
  const supabase = await createServerSupabaseClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { users: data ?? [], total: count ?? 0, page, perPage };
}

export async function getAdminWorkoutAnalytics() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('workouts')
    .select('created_at, duration_minutes, feeling')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAdminFeedback() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*, profiles:user_id(display_name, username)')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
