'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { Dumbbell, Clock, Target, Trophy, TrendingUp } from 'lucide-react';
import { KpiCard } from '@/components/admin/kpi-card';
import { useAnalyticsStore } from '@/stores/admin-store';
import type { WorkoutAnalytics } from '@/types/admin';
import { Section, LoadingSkeleton, ErrorState } from '../shared';

export default function WorkoutAnalyticsPage() {
  const { data, isLoading, error, fetch } = useAnalyticsStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetch} />;

  const wa: Partial<WorkoutAnalytics> = data?.workoutAnalytics || {};

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Workout Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Track workout trends, popular exercises, and performance metrics
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Avg Duration"
          value={wa.averageWorkoutDuration}
          icon={<Clock size={16} />}
          color="emerald"
          format="duration"
          index={0}
        />
        <KpiCard
          title="Avg Sets/Workout"
          value={wa.averageSetsPerWorkout}
          icon={<Target size={16} />}
          color="blue"
          index={1}
        />
        <KpiCard
          title="Avg Volume"
          value={wa.averageTrainingVolume}
          icon={<Dumbbell size={16} />}
          color="purple"
          index={2}
        />
        <KpiCard
          title="PR Frequency"
          value={wa.personalRecordFrequency}
          icon={<Trophy size={16} />}
          color="amber"
          format="percent"
          index={3}
        />
        <KpiCard
          title="Completion Rate"
          value={wa.workoutCompletionRate}
          icon={<TrendingUp size={16} />}
          color="cyan"
          format="percent"
          index={4}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <InfoCard
          title="Most Popular Program"
          value={wa.mostPopularProgram?.name || 'N/A'}
          subtitle={`${wa.mostPopularProgram?.count || 0} users`}
        />
        <InfoCard
          title="Most Popular Exercise"
          value={wa.mostPopularExercise?.name || 'N/A'}
          subtitle={`${wa.mostPopularExercise?.count || 0} users`}
        />
        <InfoCard
          title="Most Trained Muscle"
          value={wa.mostTrainedMuscleGroup?.group || 'N/A'}
          subtitle={`${wa.mostTrainedMuscleGroup?.count || 0} exercises`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="Weekly Workout Trends">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={wa.weeklyReport}>
                <defs>
                  <linearGradient id="wowGradient" x1="0" y1="0" x2="0" y2="1">
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
                />
                <Area
                  type="monotone"
                  dataKey="workouts"
                  stroke="#10b981"
                  fill="url(#wowGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Monthly Workout Report">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wa.monthlyReport}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="workouts" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>
    </div>
  );
}

function InfoCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-border/50 bg-card rounded-2xl border p-5"
    >
      <p className="text-muted-foreground/70 text-[11px] font-medium tracking-wider uppercase">
        {title}
      </p>
      <p className="text-foreground mt-1.5 text-lg font-bold">{value}</p>
      <p className="text-muted-foreground/60 mt-0.5 text-xs">{subtitle}</p>
    </motion.div>
  );
}


