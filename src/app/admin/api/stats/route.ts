import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { AdminStatsWithGrowth } from '@/types/admin';

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );
}

async function checkAdmin(): Promise<boolean> {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  return profile?.role === 'admin';
}

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const supabase = await getSupabase();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

  const [
    { count: totalUsers },
    { count: workoutsToday },
    { count: workoutsThisWeek },
    { count: workoutsThisMonth },
    { count: totalWorkouts },
    { count: todayUsers },
    { count: weekUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('workouts').select('*', { count: 'exact', head: true }).gte('created_at', today),
    supabase
      .from('workouts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo),
    supabase
      .from('workouts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthAgo),
    supabase.from('workouts').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', today),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo),
  ]);

  const stats: AdminStatsWithGrowth = {
    totalUsers: totalUsers ?? 0,
    dailyActiveUsers: workoutsToday ?? 0,
    weeklyActiveUsers: workoutsThisWeek ?? 0,
    monthlyActiveUsers: workoutsThisMonth ?? 0,
    onlineUsers: 0,
    newUsersToday: todayUsers ?? 0,
    newUsersThisWeek: weekUsers ?? 0,
    totalWorkouts: totalWorkouts ?? 0,
    workoutsCompletedToday: workoutsToday ?? 0,
    totalExercisesLogged: 0,
    totalProgramsCreated: 0,
    averageWorkoutDuration: 0,
    averageWeeklyWorkoutsPerUser: 0,
    activeWorkoutStreaks: 0,
    totalProgressPhotos: 0,
    totalStorageUsed: 0,
    totalPushSubscribers: 0,
    userGrowth: 0,
    dauGrowth: 0,
    wauGrowth: 0,
    mauGrowth: 0,
    workoutGrowth: 0,
  };

  return NextResponse.json(stats);
}
