'use client';

import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Wifi, Download, Bell, Eye, WifiOff, RefreshCw } from 'lucide-react';
import { KpiCard } from '@/components/admin/kpi-card';
import { useAnalyticsStore } from '@/stores/admin-store';
import { Section, LoadingSkeleton, ErrorState } from '../shared';
import type { PwaAnalytics } from '@/types/admin';

export default function PwaAnalyticsPage() {
  const { data, isLoading, error, fetch } = useAnalyticsStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (isLoading) return <LoadingSkeleton count={6} />;
  if (error) return <ErrorState message={error} onRetry={fetch} />;

  const pa: Partial<PwaAnalytics> = data?.pwaAnalytics || {};

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">PWA Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Progressive Web App installation and engagement metrics
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          title="Installed PWAs"
          value={pa.totalInstalled}
          icon={<Download size={16} />}
          color="emerald"
          index={0}
        />
        <KpiCard
          title="Install Acceptance"
          value={pa.installPromptAcceptanceRate}
          icon={<Wifi size={16} />}
          color="blue"
          format="percent"
          index={1}
        />
        <KpiCard
          title="Push Permission Rate"
          value={pa.pushPermissionRate}
          icon={<Bell size={16} />}
          color="purple"
          format="percent"
          index={2}
        />
        <KpiCard
          title="Notification Open Rate"
          value={pa.notificationOpenRate}
          icon={<Eye size={16} />}
          color="amber"
          format="percent"
          index={3}
        />
        <KpiCard
          title="Offline Usage"
          value={pa.offlineUsageCount}
          icon={<WifiOff size={16} />}
          color="rose"
          index={4}
        />
        <KpiCard
          title="Sync Success Rate"
          value={pa.syncSuccessRate}
          icon={<RefreshCw size={16} />}
          color="cyan"
          format="percent"
          index={5}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="Installation Funnel">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    stage: 'Prompt Shown',
                    count: Math.round((pa.installPromptAcceptanceRate || 0.35) * 1000),
                  },
                  {
                    stage: 'Accepted',
                    count: Math.round((pa.installPromptAcceptanceRate || 0.35) * 350),
                  },
                  { stage: 'Installed', count: pa.totalInstalled || 0 },
                ]}
              >
                <XAxis
                  dataKey="stage"
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

        <Section title="Engagement Metrics">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { metric: 'Push Permission', value: (pa.pushPermissionRate || 0) * 100 },
                  { metric: 'Notification Open', value: (pa.notificationOpenRate || 0) * 100 },
                  { metric: 'Sync Success', value: (pa.syncSuccessRate || 0) * 100 },
                  { metric: 'Install Accept', value: (pa.installPromptAcceptanceRate || 0) * 100 },
                ]}
              >
                <XAxis
                  dataKey="metric"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(v: number) => `${Number(v).toFixed(1)}%`}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>
    </div>
  );
}
