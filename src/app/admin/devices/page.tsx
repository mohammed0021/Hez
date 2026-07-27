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

import { useAnalyticsStore } from '@/stores/admin-store';
import { Section, LoadingSkeleton, ErrorState } from '../shared';
import type { DeviceAnalytics } from '@/types/admin';

const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

export default function DeviceAnalyticsPage() {
  const { data, isLoading, error, fetch } = useAnalyticsStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (isLoading) return <LoadingSkeleton count={4} />;
  if (error) return <ErrorState message={error} onRetry={fetch} />;

  const da: Partial<DeviceAnalytics> = data?.deviceAnalytics || {};

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Device Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Track device, browser, and OS distribution
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Section title="By Device">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={da.byDevice}
                  dataKey="count"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(props: unknown) => {
                    const p = props as { payload?: Record<string, string>; percent?: number };
                    return `${p.payload?.device ?? ''} ${((p.percent ?? 0) * 100).toFixed(0)}%`;
                  }}
                >
                  {da.byDevice?.map((_, i: number) => (
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

        <Section title="By Browser">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={da.byBrowser}
                  dataKey="count"
                  nameKey="browser"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(props: unknown) => {
                    const p = props as { payload?: Record<string, string>; percent?: number };
                    return `${p.payload?.browser ?? ''} ${((p.percent ?? 0) * 100).toFixed(0)}%`;
                  }}
                >
                  {da.byBrowser?.map((_, i: number) => (
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

        <Section title="By OS">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={da.byOS}
                  dataKey="count"
                  nameKey="os"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(props: unknown) => {
                    const p = props as { payload?: Record<string, string>; percent?: number };
                    return `${p.payload?.os ?? ''} ${((p.percent ?? 0) * 100).toFixed(0)}%`;
                  }}
                >
                  {da.byOS?.map((_, i: number) => (
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

      <div className="mt-6">
        <Section title="Device Comparison">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={da.byDevice}>
                <XAxis
                  dataKey="device"
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
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>
    </div>
  );
}
