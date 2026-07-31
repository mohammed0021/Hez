'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Dumbbell,
  BarChart3,
  Activity,
  ChevronRight,
  ChevronDown,
  Target,
  Trophy,
  Scale,
  CalendarDays,
  Download,
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';
import { analyzeProgressiveOverload } from '@/lib/progressive-overload';
import { VolumeHeatmap } from '@/components/progress/volume-heatmap';
import { ConsistencyCalendar } from '@/components/progress/consistency-calendar';
import { exportProgressReport } from '@/components/progress/export-pdf';
import { useTranslations } from 'next-intl';

export default function AnalyticsPage() {
  const t = useTranslations();
  const sessions = useWorkoutHistoryStore((s) => s.sessions);
  const analysis = useMemo(() => analyzeProgressiveOverload(sessions), [sessions]);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  const hasData = sessions.length > 0;

  const workoutDates = useMemo(() => sessions.map((s) => s.completedAt.slice(0, 10)), [sessions]);

  const heatmapData = useMemo(() => {
    const map = new Map<string, { volume: number; sessions: number }>();
    for (const s of sessions) {
      const date = s.completedAt.slice(0, 10);
      const existing = map.get(date) || { volume: 0, sessions: 0 };
      existing.volume += s.volume;
      existing.sessions += 1;
      map.set(date, existing);
    }
    return Array.from(map.entries()).map(([date, d]) => ({
      date,
      volume: d.volume,
      sessions: d.sessions,
    }));
  }, [sessions]);

  const now = new Date();
  const calendarYear = now.getFullYear();
  const calendarMonth = now.getMonth();

  const startDate = useMemo(() => {
    if (sessions.length === 0) return new Date().toISOString().slice(0, 10);
    const d = new Date(sessions[sessions.length - 1]!.completedAt);
    d.setDate(d.getDate() - 90);
    return d.toISOString().slice(0, 10);
  }, [sessions]);

  const endDate = useMemo(() => {
    if (sessions.length === 0) return new Date().toISOString().slice(0, 10);
    return sessions[0]!.completedAt.slice(0, 10);
  }, [sessions]);

  const handleExport = useCallback(() => {
    exportProgressReport('analytics-content');
  }, []);

  if (!hasData) {
    return (
      <>
        <h1 className="text-foreground text-2xl font-bold">{t('progress.analytics_dashboard')}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('progress.analytics_empty_subtitle')}
        </p>
        <div className="mt-12 flex flex-col items-center gap-4">
          <BarChart3 size={48} className="text-muted-foreground/20" />
          <p className="text-muted-foreground max-w-xs text-center text-sm">
            {t('progress.analytics_empty')}
          </p>
        </div>
      </>
    );
  }

  return (
    <div id="analytics-content">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            {t('progress.analytics_dashboard')}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {t('progress.analytics_summary', {
              sessions: analysis.totalSessions,
              volume: analysis.totalVolume.toLocaleString(),
            })}
          </p>
        </div>
        <button
          onClick={handleExport}
          className="bg-muted text-foreground hover:bg-muted/80 flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
        >
          <Download className="size-4" /> {t('common.export')} PDF
        </button>
      </div>

      {/* Weekly Volume Chart */}
      <Section title={t('progress.weekly_volume')} icon={BarChart3} delay={0.04}>
        {analysis.weeklyVolumeHistory.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.weeklyVolumeHistory}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  strokeOpacity={0.4}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(v: unknown) => {
                    const d = new Date(v as string);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelFormatter={(v: unknown) => {
                    const d = new Date(v as string);
                    return d.toLocaleDateString();
                  }}
                />
                <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-muted-foreground py-8 text-center text-xs">
            {t('progress.no_volume_data')}
          </p>
        )}
      </Section>

      {/* Volume Heatmap */}
      <Section title={t('progress.volume_heatmap_90d')} icon={CalendarDays} delay={0.08}>
        <VolumeHeatmap data={heatmapData} startDate={startDate} endDate={endDate} />
      </Section>

      {/* Consistency Calendar */}
      <Section title={t('progress.consistency_calendar')} icon={CalendarDays} delay={0.1}>
        <ConsistencyCalendar dates={workoutDates} year={calendarYear} month={calendarMonth} />
      </Section>

      {/* Next Session Recommendations */}
      {analysis.nextSession.length > 0 && (
        <Section title={t('progress.next_session_recommendations')} icon={Target} delay={0.12}>
          <div className="space-y-2">
            {analysis.nextSession.map((rec, i) => (
              <motion.div
                key={rec.exerciseName}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-border/40 bg-card/60 rounded-xl border p-3"
              >
                <div className="flex items-center gap-3">
                  <Dumbbell className="text-primary size-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground text-sm font-medium">{rec.exerciseName}</p>
                    <p className="text-muted-foreground mt-0.5 text-[10px]">
                      {rec.suggestedWeight > 0
                        ? `${rec.suggestedWeight}kg × ${rec.suggestedReps} ${t('workouts.reps')}`
                        : `${rec.suggestedReps} ${t('workouts.reps')}`}
                      {rec.suggestedRpe ? ` @ RPE ${rec.suggestedRpe}` : ''}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground/60 mt-1.5 text-[10px] leading-relaxed">
                  {rec.notes}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Exercise Trends */}
      <Section title={t('progress.exercise_trends')} icon={Activity} delay={0.16}>
        <div className="space-y-1">
          {analysis.exercises.slice(0, 10).map((ex, i) => {
            const isExpanded = expandedExercise === ex.exerciseName;
            const last = ex.sessions[ex.sessions.length - 1];
            return (
              <motion.div
                key={ex.exerciseName}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <button
                  onClick={() => setExpandedExercise(isExpanded ? null : ex.exerciseName)}
                  className="hover:bg-muted/50 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                >
                  <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-lg">
                    {ex.trend === 'up' ? (
                      <TrendingUp className="size-4 text-green-500" />
                    ) : ex.trend === 'down' ? (
                      <TrendingDown className="size-4 text-red-500" />
                    ) : (
                      <Minus className="size-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground text-sm font-medium">{ex.exerciseName}</p>
                    <p className="text-muted-foreground text-[10px]">
                      {t('progress.sessions_count', { count: ex.sessions.length })} ·{' '}
                      {last ? `${last.maxWeight}kg max` : t('common.no_data')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {ex.plateauDetected && <AlertTriangle className="size-4 text-amber-500" />}
                    <span
                      className={`text-[10px] font-medium ${ex.trend === 'up' ? 'text-green-500' : ex.trend === 'down' ? 'text-red-500' : 'text-yellow-500'}`}
                    >
                      {ex.trend === 'up' ? '+' : ''}
                      {ex.trendPercentage}%
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="text-muted-foreground size-4" />
                    ) : (
                      <ChevronRight className="text-muted-foreground size-4" />
                    )}
                  </div>
                </button>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-border/30 bg-card/40 mx-3 mb-2 space-y-2 rounded-xl border p-3"
                  >
                    <p className="text-muted-foreground text-[10px] leading-relaxed">
                      {ex.recommendation.reason}
                    </p>
                    {ex.plateauDetected && (
                      <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-2.5 py-1.5">
                        <AlertTriangle className="size-4 shrink-0 text-amber-500" />
                        <p className="text-[10px] text-amber-600">
                          {t('progress.plateau_message', { count: ex.plateauSessions })}
                        </p>
                      </div>
                    )}
                    <div className="pt-1">
                      <p className="text-muted-foreground/60 mb-1.5 text-[10px] font-medium tracking-wider uppercase">
                        {t('progress.session_history')}
                      </p>
                      <div className="space-y-1">
                        {ex.sessions
                          .slice(-5)
                          .reverse()
                          .map((s, si) => (
                            <div
                              key={si}
                              className="text-muted-foreground flex items-center gap-2 text-[10px]"
                            >
                              <span className="w-16 shrink-0">
                                {new Date(s.date).toLocaleDateString()}
                              </span>
                              <span className="text-foreground font-medium">{s.maxWeight}kg</span>
                              <span>
                                ×{s.totalReps} {t('workouts.reps')}
                              </span>
                              <span>
                                {s.setsCompleted}/{s.totalSets} {t('workouts.sets')}
                              </span>
                              {s.avgRpe != null && <span>@{s.avgRpe.toFixed(1)} RPE</span>}
                            </div>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Muscle Group Volume */}
      {analysis.muscleVolumes.length > 0 && (
        <Section title={t('progress.muscle_volume_week')} icon={Scale} delay={0.2}>
          <div className="space-y-3">
            {analysis.muscleVolumes.slice(0, 8).map((mv, i) => {
              const maxVol = Math.max(...analysis.muscleVolumes.map((m) => m.currentWeekVolume), 1);
              const pct = (mv.currentWeekVolume / maxVol) * 100;
              return (
                <div key={mv.muscleGroup}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-xs font-medium">{mv.muscleGroup}</span>
                      {mv.trend === 'up' ? (
                        <TrendingUp className="size-4 text-green-500" />
                      ) : mv.trend === 'down' ? (
                        <TrendingDown className="size-4 text-red-500" />
                      ) : null}
                    </div>
                    <span className="text-muted-foreground text-[10px]">
                      {mv.currentWeekVolume.toLocaleString()} kg
                    </span>
                  </div>
                  <div className="bg-muted h-2 overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(pct, 2)}%` }}
                      transition={{ delay: i * 0.04, duration: 0.5 }}
                      className="bg-primary h-full rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Plateaus */}
      {analysis.plateaus.length > 0 && (
        <Section title={t('progress.plateaus_detected')} icon={AlertTriangle} delay={0.24}>
          <div className="space-y-2">
            {analysis.plateaus.map((p, i) => (
              <motion.div
                key={p.exerciseName}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3"
              >
                <AlertTriangle className="size-4 shrink-0 text-amber-500" />
                <div>
                  <p className="text-foreground text-sm font-medium">{p.exerciseName}</p>
                  <p className="text-muted-foreground text-[10px]">
                    {t('progress.plateau_sessions', { count: p.plateauSessions })} ·{' '}
                    {p.recommendation.reason}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Monthly Trends */}
      {analysis.monthlyTrends.length > 0 && (
        <Section title={t('progress.monthly_strength_trends')} icon={Trophy} delay={0.28}>
          <div className="scrollbar-none overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
                  <th className="pr-3 pb-2 font-medium">{t('progress.table_exercise')}</th>
                  <th className="pr-3 pb-2 font-medium">{t('progress.table_month')}</th>
                  <th className="pr-3 pb-2 font-medium">{t('progress.table_avg_weight')}</th>
                  <th className="pb-2 font-medium">{t('progress.table_sessions')}</th>
                </tr>
              </thead>
              <tbody>
                {analysis.monthlyTrends.map((mt, i) => (
                  <tr key={i} className="border-border/20 border-t">
                    <td className="text-foreground py-2 pr-3 font-medium">{mt.exerciseName}</td>
                    <td className="text-muted-foreground py-2 pr-3">{mt.month}</td>
                    <td className="text-foreground py-2 pr-3">{mt.avgMaxWeight} kg</td>
                    <td className="text-muted-foreground py-2">{mt.sessions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      <div className="h-8" />
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  delay,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mt-6"
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className="text-primary size-4" />
        <h2 className="text-foreground text-sm font-semibold">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}
