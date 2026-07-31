'use client';

import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Scale, TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DashboardWidget } from './widget-shell';
import { useWeightStore } from '@/stores/weight-store';
import { calculateBMI } from '@/lib/bmi';
import { useProfileStore } from '@/stores/profile-store';
import { useRouter } from 'next/navigation';

export function WeightWidget() {
  const router = useRouter();
  const t = useTranslations('progress');
  const tDash = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const entries = useWeightStore((s) => s.entries);
  const heightCm = useProfileStore((s) => s.heightCm);
  const recent = entries.slice(0, 7).reverse();

  const latest = recent[recent.length - 1];

  const weeklyChange = useMemo(() => {
    if (entries.length < 2) return null;
    return (entries[0]?.weightKg ?? 0) - (entries[1]?.weightKg ?? 0);
  }, [entries]);

  if (entries.length === 0) {
    return (
      <DashboardWidget title={t('weight')}>
        <div className="mb-1 flex items-center gap-3">
          <Scale size={20} className="text-muted-foreground" />
          <span className="text-muted-foreground text-sm">No entries yet</span>
        </div>
        <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
          Log your weight in Progress to start tracking
        </p>
      </DashboardWidget>
    );
  }

  if (!latest) return null;

  const bmi = calculateBMI(latest.weightKg, heightCm);
  const chartData = recent.map((e) => ({
    day: new Date(e.date).toLocaleDateString(undefined, { weekday: 'short' }),
    kg: e.weightKg,
  }));

  return (
    <DashboardWidget
      title={t('weight')}
      action={
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push('/progress/weight');
          }}
          className="text-primary hover:text-primary/80 text-[10px] font-medium transition-colors"
        >
          {tCommon('view_all')}
        </button>
      }
    >
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale size={20} className="text-muted-foreground" />
          <span className="text-foreground text-2xl font-bold tracking-tight">
            {latest.weightKg.toFixed(1)}
          </span>
          <span className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
            {tCommon('units_kg')}
          </span>
        </div>
        {weeklyChange !== null && (
          <div className="flex items-center gap-1">
            {weeklyChange > 0 ? (
              <TrendingUp size={14} className="text-red-500" />
            ) : weeklyChange < 0 ? (
              <TrendingDown size={14} className="text-green-500" />
            ) : null}
            <span
              className={`text-xs font-medium ${weeklyChange > 0 ? 'text-red-500' : weeklyChange < 0 ? 'text-green-500' : 'text-muted-foreground'}`}
            >
              {weeklyChange > 0 ? '+' : ''}
              {weeklyChange.toFixed(1)} {tCommon('units_kg')}
            </span>
          </div>
        )}
      </div>

      {bmi > 0 && (
        <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium">
          {tDash('bmi')} {bmi.toFixed(1)}
        </p>
      )}

      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="day" hide />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Line
              type="monotone"
              dataKey="kg"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardWidget>
  );
}
