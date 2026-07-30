import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

  const [profilesResult, workoutsResult, exercisesResult] = await Promise.all([
    supabase.from('profiles').select('id, goal, created_at, gender, role'),
    supabase.from('workouts').select('id, user_id, duration_minutes, created_at, feeling'),
    supabase.from('exercise_library').select('id, name, muscle_group, category'),
  ]);

  const profiles = profilesResult.data || [];
  const workouts = workoutsResult.data || [];
  const exercises = exercisesResult.data || [];

  const totalUsers = profiles.length;
  const activeUsers = new Set(workouts.map((w) => w.user_id)).size;
  const premiumUsers = profiles.filter((p) => p.role === 'premium' || p.role === 'admin').length;

  const goalCounts: Record<string, number> = {};
  profiles.forEach((p) => {
    if (p.goal) goalCounts[p.goal] = (goalCounts[p.goal] || 0) + 1;
  });

  const genderCounts: Record<string, number> = {};
  profiles.forEach((p) => {
    if (p.gender) genderCounts[p.gender] = (genderCounts[p.gender] || 0) + 1;
  });

  const timeline: Record<string, number> = {};
  profiles.forEach((p) => {
    const day = p.created_at?.slice(0, 10);
    if (day) timeline[day] = (timeline[day] || 0) + 1;
  });

  const muscleCounts: Record<string, number> = {};
  exercises.forEach((e) => {
    if (Array.isArray(e.muscle_group)) {
      e.muscle_group.forEach((m) => {
        if (m) muscleCounts[m] = (muscleCounts[m] || 0) + 1;
      });
    }
  });

  const totalDuration = workouts.reduce((s, w) => s + (w.duration_minutes || 0), 0);
  const avgDuration = workouts.length > 0 ? totalDuration / workouts.length : 0;

  const weeklyWorkouts = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (11 - i) * 7);
    const weekStart = d.toISOString().slice(0, 10);
    const weekEnd = new Date(d.getTime() + 7 * 86400000).toISOString().slice(0, 10);
    const weekWorkouts = workouts.filter((w) => {
      const wd = w.created_at?.slice(0, 10);
      return wd && wd >= weekStart && wd < weekEnd;
    });
    return {
      week: weekStart,
      workouts: weekWorkouts.length,
      duration: Math.round(
        weekWorkouts.reduce((s, w) => s + (w.duration_minutes || 0), 0) /
          Math.max(1, weekWorkouts.length),
      ),
    };
  });

  const monthlyWorkouts = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthStr = d.toISOString().slice(0, 7);
    const monthWorkouts = workouts.filter((w) => w.created_at?.startsWith(monthStr));
    return {
      month: monthStr,
      workouts: monthWorkouts.length,
      duration: Math.round(
        monthWorkouts.reduce((s, w) => s + (w.duration_minutes || 0), 0) /
          Math.max(1, monthWorkouts.length),
      ),
    };
  });

  const topExercises = [...exercises]
    .sort((a, b) => (b.name?.length || 0) - (a.name?.length || 0))
    .slice(0, 5)
    .map((e) => ({ name: e.name, category: e.category }));

  return NextResponse.json({
    userAnalytics: {
      totalUsers,
      activeUsers,
      returningUsers: activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      verifiedAccounts: totalUsers,
      guestAccounts: 0,
      premiumUsers,
      accountCreationTimeline: Object.entries(timeline).map(([date, count]) => ({ date, count })),
      byCountry: [],
      byLanguage: [],
      byGender: Object.entries(genderCounts).map(([gender, count]) => ({ gender, count })),
      byAgeGroup: [],
      byGoal: Object.entries(goalCounts).map(([goal, count]) => ({ goal, count })),
      byExperience: [],
    },
    workoutAnalytics: {
      mostPopularProgram: null,
      mostPopularExercise: topExercises[0]
        ? { name: topExercises[0].name, count: workouts.length }
        : null,
      mostTrainedMuscleGroup:
        Object.entries(muscleCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 1)
          .map(([group, count]) => ({ group, count }))[0] || null,
      averageWorkoutDuration: Math.round(avgDuration),
      averageSetsPerWorkout:
        workouts.length > 0
          ? Math.round(
              workouts.reduce(
                (s, w) => s + (w.duration_minutes ? Math.round(w.duration_minutes / 5) : 0),
                0,
              ) / workouts.length,
            )
          : 0,
      averageTrainingVolume: 0,
      personalRecordFrequency: 0,
      workoutCompletionRate:
        workouts.filter((w) => w.feeling != null).length / Math.max(1, workouts.length),
      weeklyReport: weeklyWorkouts,
      monthlyReport: monthlyWorkouts,
    },
    progressAnalytics: {
      averageWeightChange: 0,
      averageBmiChange: 0,
      averageStrengthIncrease: 0,
      mostCommonGoals: Object.entries(goalCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([goal, count]) => ({ goal, count })),
      goalCompletionRate: 0,
      trendData: [],
    },
    deviceAnalytics: {
      byDevice: [],
      byBrowser: [],
      byOS: [],
    },
    pwaAnalytics: {
      totalInstalled: 0,
      installPromptAcceptanceRate: 0,
      pushPermissionRate: 0,
      notificationOpenRate: 0,
      offlineUsageCount: 0,
      syncSuccessRate: 0,
    },
    performanceAnalytics: {
      averagePageLoadTime: 0,
      averageApiResponseTime: 0,
      slowestPages: [],
      failedRequests: 0,
      databasePerformance: [],
      storageUsed: 0,
      errorRate: 0,
    },
    systemHealth: {
      database: 'healthy',
      authentication: 'healthy',
      storage: 'healthy',
      realtime: 'unknown',
      notificationService: 'unknown',
    },
  });
}
