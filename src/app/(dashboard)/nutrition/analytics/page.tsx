'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Flame } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { useNutritionStore } from '@/stores/nutrition-store';
import { useWaterStore } from '@/stores/water-store';
import { useNutritionGoalsStore } from '@/stores/nutrition-goals-store';

export default function NutritionAnalyticsPage() {
  const logs = useNutritionStore((s) => s.logs);
  const goals = useNutritionGoalsStore((s) => s.goals);
  const waterLog = useWaterStore((s) => s.dailyLog);

  const dailyData = useMemo(() => {
    const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
    return sorted.slice(-14).map((log) => ({
      date: log.date.slice(5),
      calories: log.totalCalories,
      protein: log.totalProtein,
      carbs: log.totalCarbs,
      fat: log.totalFat,
      fiber: log.totalFiber,
    }));
  }, [logs]);

  const weeklyAvg = useMemo(() => {
    if (dailyData.length === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, water: 0 };
    const last7 = dailyData.slice(-7);
    const avg = (key: 'calories' | 'protein' | 'carbs' | 'fat' | 'fiber') =>
      Math.round(last7.reduce((s, d) => s + d[key], 0) / last7.length);
    return {
      calories: avg('calories'),
      protein: avg('protein'),
      carbs: avg('carbs'),
      fat: avg('fat'),
      fiber: avg('fiber'),
      water: 0,
    };
  }, [dailyData]);

  const weekWater = useMemo(() => {
    const data: { day: string; ml: number }[] = [];
    const d = new Date();
    d.setDate(d.getDate() - 6);
    for (let i = 0; i < 7; i++) {
      const dateStr = d.toISOString().slice(0, 10);
      data.push({ day: d.toLocaleDateString('en', { weekday: 'short' }), ml: waterLog[dateStr] || 0 });
      d.setDate(d.getDate() + 1);
    }
    return data;
  }, [waterLog]);

  const adherence = useMemo(() => {
    if (dailyData.length === 0) return 0;
    const withinRange = dailyData.filter((d) => goals.calories > 0 && d.calories >= goals.calories * 0.8 && d.calories <= goals.calories * 1.2).length;
    return Math.round((withinRange / dailyData.length) * 100);
  }, [dailyData, goals.calories]);

  const hasData = dailyData.length > 0;

  return (
    <>
      <h1 className="text-2xl font-bold text-foreground">Nutrition Analytics</h1>
      <p className="mt-0.5 text-sm text-muted-foreground">{dailyData.length} days tracked</p>

      {!hasData && (
        <div className="mt-12 text-center">
          <BarChart3 size={48} className="mx-auto text-muted-foreground/20" />
          <p className="mt-3 text-sm text-muted-foreground">Start logging meals to see analytics.</p>
        </div>
      )}

      {hasData && (
        <>
          {/* Summary Cards */}
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <SummaryCard label="Avg Calories" value={weeklyAvg.calories} suffix="kcal" icon={Flame} />
            <SummaryCard label="Adherence" value={adherence} suffix="%" icon={TrendingUp} color={adherence > 80 ? 'text-green-500' : adherence > 60 ? 'text-yellow-500' : 'text-red-500'} />
            <SummaryCard label="Avg Protein" value={weeklyAvg.protein} suffix="g" icon={BarChart3} color="text-blue-500" />
            <SummaryCard label="Avg Carbs" value={weeklyAvg.carbs} suffix="g" icon={BarChart3} color="text-amber-500" />
            <SummaryCard label="Avg Fat" value={weeklyAvg.fat} suffix="g" icon={BarChart3} color="text-rose-500" />
            <SummaryCard label="Avg Fiber" value={weeklyAvg.fiber} suffix="g" icon={BarChart3} color="text-green-500" />
          </div>

          {/* Calories Chart */}
          <Section title="Daily Calories (14 days)">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          {/* Macro Progression */}
          <Section title="Macro Trends">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey="protein" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Protein" />
                  <Line type="monotone" dataKey="carbs" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Carbs" />
                  <Line type="monotone" dataKey="fat" stroke="#f43f5e" strokeWidth={1.5} dot={false} name="Fat" />
                  <Line type="monotone" dataKey="fiber" stroke="#10b981" strokeWidth={1.5} dot={false} name="Fiber" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Section>

          {/* Water Chart */}
          <Section title="Water (7 days)">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekWater}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="ml" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </>
      )}

      <div className="h-8" />
    </>
  );
}

function SummaryCard({ label, value, suffix, icon: Icon, color = 'text-primary' }: { label: string; value: number; suffix: string; icon: React.ComponentType<{ size?: number; className?: string }>; color?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border/40 bg-card p-3">
      <div className="flex items-center gap-2">
        <Icon size={14} className={color} />
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
      <p className="mt-1 text-lg font-bold text-foreground">{value}<span className="text-xs font-normal text-muted-foreground ml-0.5">{suffix}</span></p>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
      <h2 className="text-sm font-semibold text-foreground mb-3">{title}</h2>
      {children}
    </motion.section>
  );
}
