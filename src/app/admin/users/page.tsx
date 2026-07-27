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
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { Users, UserCheck, UserX, Mail, UserCog } from 'lucide-react';
import { KpiCard } from '@/components/admin/kpi-card';
import { useAnalyticsStore } from '@/stores/admin-store';
import type { UserAnalytics } from '@/types/admin';
import { Section, LoadingSkeleton, ErrorState } from '../shared';

const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

export default function UserAnalyticsPage() {
  const { data, isLoading, error, fetch } = useAnalyticsStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetch} />;

  const ua: Partial<UserAnalytics> = data?.userAnalytics || {};

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">User Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Detailed user statistics and demographics
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Users"
          value={ua.totalUsers}
          icon={<Users size={16} />}
          color="emerald"
          index={0}
        />
        <KpiCard
          title="Active Users"
          value={ua.activeUsers}
          icon={<UserCheck size={16} />}
          color="blue"
          index={1}
        />
        <KpiCard
          title="Returning Users"
          value={ua.returningUsers}
          icon={<UserCog size={16} />}
          color="purple"
          index={2}
        />
        <KpiCard
          title="Inactive Users"
          value={ua.inactiveUsers}
          icon={<UserX size={16} />}
          color="rose"
          index={3}
        />
        <KpiCard
          title="Verified Accounts"
          value={ua.verifiedAccounts}
          icon={<Mail size={16} />}
          color="cyan"
          index={4}
        />
        <KpiCard
          title="Guest Accounts"
          value={ua.guestAccounts}
          icon={<UserCog size={16} />}
          color="amber"
          index={5}
        />
        <KpiCard
          title="Premium Users"
          value={ua.premiumUsers}
          icon={<UserCog size={16} />}
          color="indigo"
          index={6}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Account creation timeline */}
        <Section title="Account Creation Timeline">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ua.accountCreationTimeline?.slice(-30) || []}>
                <defs>
                  <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
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
                  dataKey="count"
                  stroke="#10b981"
                  fill="url(#accGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* Gender distribution */}
        <Section title="Gender Distribution">
          <div className="flex h-64 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ua.byGender}
                  dataKey="count"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {ua.byGender?.map((_, i: number) => (
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
            <div className="absolute flex flex-col items-center">
              <span className="text-foreground text-2xl font-bold">{ua.totalUsers}</span>
              <span className="text-muted-foreground text-[10px]">Total</span>
            </div>
          </div>
        </Section>

        {/* Users by Goal */}
        <Section title="Training Goals">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ua.byGoal} layout="vertical">
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

        {/* Users by Language */}
        <Section title="Languages">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ua.byLanguage}
                  dataKey="count"
                  nameKey="language"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(props: unknown) => {
                    const p = props as { payload?: Record<string, string>; percent?: number };
                    return `${p.payload?.language ?? ''} ${((p.percent ?? 0) * 100).toFixed(0)}%`;
                  }}
                >
                  {ua.byLanguage?.map((_, i: number) => (
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

        {/* Age Groups */}
        <Section title="Age Groups">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ua.byAgeGroup}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="group"
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
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* Experience Levels */}
        <Section title="Experience Levels">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ua.byExperience}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(props: unknown) => {
                    const p = props as { payload?: Record<string, string>; percent?: number };
                    return `${p.payload?.level ?? ''} ${((p.percent ?? 0) * 100).toFixed(0)}%`;
                  }}
                >
                  {ua.byExperience?.map((_, i: number) => (
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


