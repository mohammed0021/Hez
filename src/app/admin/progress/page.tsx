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
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { TrendingDown, Activity, Award } from 'lucide-react';
import { KpiCard } from '@/components/admin/kpi-card';
import { useAnalyticsStore } from '@/stores/admin-store';
import type { ProgressAnalytics } from '@/types/admin';

export default function ProgressAnalyticsPage() {
  const { data, isLoading, error, fetch } = useAnalyticsStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetch} />;

  const pa: Partial<ProgressAnalytics> = data?.progressAnalytics || {};

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Progress Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Track user progress, weight changes, and goal completion
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Avg Weight Change"
          value={`${pa.averageWeightChange > 0 ? '+' : ''}${pa.averageWeightChange?.toFixed(1) || '0.0'} kg`}
          icon={<TrendingDown size={16} />}
          color="emerald"
          index={0}
        />
        <KpiCard
          title="Avg BMI Change"
          value={pa.averageBmiChange?.toFixed(1) || '0.0'}
          icon={<Activity size={16} />}
          color="blue"
          index={1}
        />
        <KpiCard
          title="Avg Strength Increase"
          value={`${pa.averageStrengthIncrease || 0}%`}
          icon={<Activity size={16} />}
          color="purple"
          index={2}
        />
        <KpiCard
          title="Goal Completion Rate"
          value={pa.goalCompletionRate}
          icon={<Award size={16} />}
          color="amber"
          format="percent"
          index={3}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="30-Day Trends">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pa.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="weight"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Weight (kg)"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bmi"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="BMI"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="strength"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  name="Strength"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Most Common Goals">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pa.mostCommonGoals} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  type="category"
                  dataKey="goal"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-border/50 bg-card rounded-2xl border p-6"
    >
      <h3 className="text-foreground mb-4 text-sm font-semibold">{title}</h3>
      {children}
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="bg-muted mb-8 h-8 w-48 animate-pulse rounded-lg" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
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
      <button
        onClick={onRetry}
        className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-xs font-medium"
      >
        Retry
      </button>
    </div>
  );
}
