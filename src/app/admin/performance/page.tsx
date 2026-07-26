'use client';

import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Clock, AlertTriangle, Database, AlertCircle } from 'lucide-react';
import { KpiCard } from '@/components/admin/kpi-card';
import { useAnalyticsStore } from '@/stores/admin-store';
import { Section, LoadingSkeleton, ErrorState } from '../shared';
import type { PerformanceAnalytics } from '@/types/admin';

export default function PerformanceAnalyticsPage() {
  const { data, isLoading, error, fetch } = useAnalyticsStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (isLoading) return <LoadingSkeleton count={4} />;
  if (error) return <ErrorState message={error} onRetry={fetch} />;

  const pa: Partial<PerformanceAnalytics> = data?.performanceAnalytics || {};

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Performance Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Application performance monitoring and metrics
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Avg Page Load"
          value={`${pa.averagePageLoadTime?.toFixed(1) || '0'}s`}
          icon={<Zap size={16} />}
          color="emerald"
          index={0}
        />
        <KpiCard
          title="Avg API Response"
          value={`${(pa.averageApiResponseTime || 0) * 1000}ms`}
          icon={<Clock size={16} />}
          color="blue"
          index={1}
        />
        <KpiCard
          title="Failed Requests"
          value={pa.failedRequests}
          icon={<AlertTriangle size={16} />}
          color="rose"
          index={2}
        />
        <KpiCard
          title="Error Rate"
          value={pa.errorRate}
          icon={<AlertCircle size={16} />}
          color="amber"
          format="percent"
          index={3}
        />
        <KpiCard
          title="Storage Used"
          value={pa.storageUsed}
          icon={<Database size={16} />}
          color="purple"
          format="storage"
          index={4}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="Slowest Pages">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pa.slowestPages} layout="vertical">
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => `${v}s`}
                />
                <YAxis
                  type="category"
                  dataKey="path"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(v: number) => `${Number(v).toFixed(1)}s`}
                />
                <Bar dataKey="loadTime" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Database Performance">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pa.databasePerformance} layout="vertical">
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => `${v}s`}
                />
                <YAxis
                  type="category"
                  dataKey="query"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={150}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(v: number) => `${Number(v).toFixed(2)}s`}
                />
                <Bar dataKey="avgTime" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>
    </div>
  );
}
