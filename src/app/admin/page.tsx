'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Dumbbell,
  Activity,
  UserPlus,
  Camera,
  Database,
  Bell,
  Clock,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { KpiCard } from '@/components/admin/kpi-card';
import { useAnalyticsStore } from '@/stores/admin-store';
import type { WorkoutAnalytics } from '@/types/admin';

export default function AdminDashboardPage() {
  const { data, stats, isLoading, error, fetch, fetchStats } = useAnalyticsStore();

  useEffect(() => {
    fetch();
    fetchStats();
  }, [fetch, fetchStats]);

  if (error)
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          fetch();
          fetchStats();
        }}
      />
    );
  if (isLoading && !stats && !data) return <LoadingSkeleton />;

  const weeklyData: WorkoutAnalytics['weeklyReport'] = data?.workoutAnalytics?.weeklyReport || [];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">Real-time overview of your application</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <KpiCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          change={stats?.userGrowth ?? 0}
          changeLabel="vs last month"
          icon={<Users size={16} />}
          color="emerald"
          index={0}
        />
        <KpiCard
          title="Daily Active Users"
          value={stats?.dailyActiveUsers ?? 0}
          change={stats?.dauGrowth ?? 0}
          changeLabel="vs yesterday"
          icon={<Activity size={16} />}
          color="blue"
          index={1}
        />
        <KpiCard
          title="Weekly Active Users"
          value={stats?.weeklyActiveUsers ?? 0}
          change={stats?.wauGrowth ?? 0}
          changeLabel="vs last week"
          icon={<Users size={16} />}
          color="purple"
          index={2}
        />
        <KpiCard
          title="Monthly Active Users"
          value={stats?.monthlyActiveUsers ?? 0}
          change={stats?.mauGrowth ?? 0}
          changeLabel="vs last month"
          icon={<Activity size={16} />}
          color="amber"
          index={3}
        />
        <KpiCard
          title="Online Now"
          value={stats?.onlineUsers ?? 0}
          change={0}
          icon={<Activity size={16} />}
          color="rose"
          index={4}
        />
        <KpiCard
          title="New Users Today"
          value={stats?.newUsersToday ?? 0}
          change={0}
          icon={<UserPlus size={16} />}
          color="cyan"
          index={5}
        />
        <KpiCard
          title="New Users This Week"
          value={stats?.newUsersThisWeek ?? 0}
          change={0}
          icon={<UserPlus size={16} />}
          color="indigo"
          index={6}
        />
        <KpiCard
          title="Total Workouts"
          value={stats?.totalWorkouts ?? 0}
          change={stats?.workoutGrowth ?? 0}
          changeLabel="all time"
          icon={<Dumbbell size={16} />}
          color="orange"
          index={7}
        />
        <KpiCard
          title="Workouts Today"
          value={stats?.workoutsCompletedToday ?? 0}
          change={0}
          icon={<Dumbbell size={16} />}
          color="pink"
          index={8}
        />
        <KpiCard
          title="Total Exercises"
          value={stats?.totalExercisesLogged ?? 0}
          change={0}
          icon={<Activity size={16} />}
          color="teal"
          index={9}
        />
        <KpiCard
          title="Programs Created"
          value={stats?.totalProgramsCreated ?? 0}
          change={0}
          icon={<Activity size={16} />}
          color="slate"
          index={10}
        />
        <KpiCard
          title="Avg Workout Duration"
          value={stats?.averageWorkoutDuration ?? 0}
          change={0}
          icon={<Clock size={16} />}
          color="blue"
          format="duration"
          index={11}
        />
        <KpiCard
          title="Avg Weekly Workouts"
          value={stats?.averageWeeklyWorkoutsPerUser ?? 0}
          change={0}
          icon={<TrendingUp size={16} />}
          color="purple"
          index={12}
        />
        <KpiCard
          title="Active Streaks"
          value={stats?.activeWorkoutStreaks ?? 0}
          change={0}
          icon={<Trophy size={16} />}
          color="amber"
          index={13}
        />
        <KpiCard
          title="Progress Photos"
          value={stats?.totalProgressPhotos ?? 0}
          change={0}
          icon={<Camera size={16} />}
          color="rose"
          index={14}
        />
        <KpiCard
          title="Storage Used"
          value={stats?.totalStorageUsed ?? 0}
          change={0}
          icon={<Database size={16} />}
          color="cyan"
          format="storage"
          index={15}
        />
        <KpiCard
          title="Push Subscribers"
          value={stats?.totalPushSubscribers ?? 0}
          change={0}
          icon={<Bell size={16} />}
          color="indigo"
          index={16}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-border/50 bg-card rounded-2xl border p-6"
        >
          <h3 className="text-foreground mb-4 text-sm font-semibold">Weekly Workout Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="workoutGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="workouts"
                  stroke="#10b981"
                  fill="url(#workoutGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border-border/50 bg-card rounded-2xl border p-6"
        >
          <h3 className="text-foreground mb-4 text-sm font-semibold">Average Duration (min)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="duration" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="bg-muted mb-8 h-8 w-48 animate-pulse rounded-lg" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 18 }, (_, i) => (
          <div key={i} className="bg-muted h-28 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-3 p-4">
      <p className="text-sm text-red-500">{message}</p>
      <p className="text-muted-foreground text-xs">Data may still load from server</p>
      <button
        onClick={onRetry}
        className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-xs font-medium"
      >
        Retry
      </button>
    </div>
  );
}
