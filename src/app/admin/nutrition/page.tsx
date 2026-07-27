'use client';

import { useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Apple, Flame, Droplets } from 'lucide-react';
import { KpiCard } from '@/components/admin/kpi-card';
import { useAnalyticsStore } from '@/stores/admin-store';
import { Section, LoadingSkeleton, ErrorState } from '../shared';
import type { NutritionAnalytics } from '@/types/admin';

const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function NutritionAnalyticsPage() {
  const { data, isLoading, error, fetch } = useAnalyticsStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (isLoading) return <LoadingSkeleton count={3} />;
  if (error) return <ErrorState message={error} onRetry={fetch} />;

  const na: Partial<NutritionAnalytics> = data?.nutritionAnalytics || {};

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Nutrition Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Track nutrition trends and supplement usage
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Avg Daily Calories"
          value={na.averageDailyCalories}
          icon={<Flame size={16} />}
          color="amber"
          index={0}
        />
        <KpiCard
          title="Avg Protein Intake"
          value={`${na.averageProteinIntake || 0}g`}
          icon={<Apple size={16} />}
          color="emerald"
          index={1}
        />
        <KpiCard
          title="Avg Water Intake"
          value={`${na.averageWaterIntake || 0}ml`}
          icon={<Droplets size={16} />}
          color="blue"
          index={2}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="Most Used Supplements">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={na.mostUsedSupplements} layout="vertical">
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Supplement Distribution">
          <div className="flex h-72 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={na.mostUsedSupplements}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(props: { name?: string; percent?: number }) =>
                    `${props.name ?? ''} ${((props.percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {na.mostUsedSupplements?.map((_, i: number) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>
    </div>
  );
}
