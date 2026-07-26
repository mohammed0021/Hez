'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle, Dumbbell,
  BarChart3, Activity, ChevronRight, ChevronDown, Target,
  Trophy, Scale, CalendarDays, Download,
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';
import { analyzeProgressiveOverload } from '@/lib/progressive-overload';
import { VolumeHeatmap } from '@/components/progress/volume-heatmap';
import { ConsistencyCalendar } from '@/components/progress/consistency-calendar';
import { exportProgressReport } from '@/components/progress/export-pdf';

export default function AnalyticsPage() {
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
    return Array.from(map.entries()).map(([date, d]) => ({ date, volume: d.volume, sessions: d.sessions }));
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
        <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Smart analysis, heatmaps & consistency</p>
        <div className="mt-12 flex flex-col items-center gap-4">
          <BarChart3 size={48} className="text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Complete a workout to see analytics.
          </p>
        </div>
      </>
    );
  }

  return (
    <div id="analytics-content">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {analysis.totalSessions} sessions · {analysis.totalVolume.toLocaleString()} kg total volume
          </p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/80">
          <Download size={14} /> Export PDF
        </button>
      </div>

      {/* Weekly Volume Chart */}
      <Section title="Weekly Volume" icon={BarChart3} delay={0.04}>
        {analysis.weeklyVolumeHistory.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.weeklyVolumeHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(v: unknown) => { const d = new Date(v as string); return `${d.getMonth() + 1}/${d.getDate()}`; }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                  labelFormatter={(v: unknown) => { const d = new Date(v as string); return d.toLocaleDateString(); }} />
                <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-8">No volume data yet</p>
        )}
      </Section>

      {/* Volume Heatmap */}
      <Section title="Volume Heatmap (90 days)" icon={CalendarDays} delay={0.08}>
        <VolumeHeatmap data={heatmapData} startDate={startDate} endDate={endDate} />
      </Section>

      {/* Consistency Calendar */}
      <Section title="Consistency Calendar" icon={CalendarDays} delay={0.1}>
        <ConsistencyCalendar dates={workoutDates} year={calendarYear} month={calendarMonth} />
      </Section>

      {/* Next Session Recommendations */}
      {analysis.nextSession.length > 0 && (
        <Section title="Next Session Recommendations" icon={Target} delay={0.12}>
          <div className="space-y-2">
            {analysis.nextSession.map((rec, i) => (
              <motion.div key={rec.exerciseName} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="rounded-xl border border-border/40 bg-card/60 p-3">
                <div className="flex items-center gap-3">
                  <Dumbbell size={14} className="text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{rec.exerciseName}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {rec.suggestedWeight > 0 ? `${rec.suggestedWeight}kg × ${rec.suggestedReps} reps` : `${rec.suggestedReps} reps`}
                      {rec.suggestedRpe ? ` @ RPE ${rec.suggestedRpe}` : ''}
                    </p>
                  </div>
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground/60 leading-relaxed">{rec.notes}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Exercise Trends */}
      <Section title="Exercise Trends" icon={Activity} delay={0.16}>
        <div className="space-y-1">
          {analysis.exercises.slice(0, 10).map((ex, i) => {
            const isExpanded = expandedExercise === ex.exerciseName;
            const last = ex.sessions[ex.sessions.length - 1];
            return (
              <motion.div key={ex.exerciseName} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                <button onClick={() => setExpandedExercise(isExpanded ? null : ex.exerciseName)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-colors text-left">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted shrink-0">
                    {ex.trend === 'up' ? <TrendingUp size={14} className="text-green-500" /> : ex.trend === 'down' ? <TrendingDown size={14} className="text-red-500" /> : <Minus size={14} className="text-yellow-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{ex.exerciseName}</p>
                    <p className="text-[10px] text-muted-foreground">{ex.sessions.length} sessions · {last ? `${last.maxWeight}kg max` : 'no data'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {ex.plateauDetected && <AlertTriangle size={12} className="text-amber-500" />}
                    <span className={`text-[10px] font-medium ${ex.trend === 'up' ? 'text-green-500' : ex.trend === 'down' ? 'text-red-500' : 'text-yellow-500'}`}>
                      {ex.trend === 'up' ? '+' : ''}{ex.trendPercentage}%
                    </span>
                    {isExpanded ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
                  </div>
                </button>
                {isExpanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mx-3 mb-2 rounded-xl border border-border/30 bg-card/40 p-3 space-y-2">
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{ex.recommendation.reason}</p>
                    {ex.plateauDetected && (
                      <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-2.5 py-1.5">
                        <AlertTriangle size={12} className="text-amber-500 shrink-0" />
                        <p className="text-[10px] text-amber-600">Plateau detected — no progress in {ex.plateauSessions} sessions.</p>
                      </div>
                    )}
                    <div className="pt-1">
                      <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider mb-1.5">Session History</p>
                      <div className="space-y-1">
                        {ex.sessions.slice(-5).reverse().map((s, si) => (
                          <div key={si} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span className="w-16 shrink-0">{new Date(s.date).toLocaleDateString()}</span>
                            <span className="font-medium text-foreground">{s.maxWeight}kg</span>
                            <span>×{s.totalReps} reps</span>
                            <span>{s.setsCompleted}/{s.totalSets} sets</span>
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
        <Section title="Muscle Volume (This Week)" icon={Scale} delay={0.2}>
          <div className="space-y-3">
            {analysis.muscleVolumes.slice(0, 8).map((mv, i) => {
              const maxVol = Math.max(...analysis.muscleVolumes.map((m) => m.currentWeekVolume), 1);
              const pct = (mv.currentWeekVolume / maxVol) * 100;
              return (
                <div key={mv.muscleGroup}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{mv.muscleGroup}</span>
                      {mv.trend === 'up' ? <TrendingUp size={10} className="text-green-500" /> : mv.trend === 'down' ? <TrendingDown size={10} className="text-red-500" /> : null}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{mv.currentWeekVolume.toLocaleString()} kg</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(pct, 2)}%` }} transition={{ delay: i * 0.04, duration: 0.5 }}
                      className="h-full rounded-full bg-primary" />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Plateaus */}
      {analysis.plateaus.length > 0 && (
        <Section title="Plateaus Detected" icon={AlertTriangle} delay={0.24}>
          <div className="space-y-2">
            {analysis.plateaus.map((p, i) => (
              <motion.div key={p.exerciseName} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-center gap-3">
                <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{p.exerciseName}</p>
                  <p className="text-[10px] text-muted-foreground">{p.plateauSessions} sessions without progress · {p.recommendation.reason}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Monthly Trends */}
      {analysis.monthlyTrends.length > 0 && (
        <Section title="Monthly Strength Trends" icon={Trophy} delay={0.28}>
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[9px] text-muted-foreground uppercase tracking-wider">
                  <th className="pb-2 pr-3 font-medium">Exercise</th><th className="pb-2 pr-3 font-medium">Month</th><th className="pb-2 pr-3 font-medium">Avg Weight</th><th className="pb-2 font-medium">Sessions</th>
                </tr>
              </thead>
              <tbody>
                {analysis.monthlyTrends.map((mt, i) => (
                  <tr key={i} className="border-t border-border/20">
                    <td className="py-2 pr-3 text-foreground font-medium">{mt.exerciseName}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{mt.month}</td>
                    <td className="py-2 pr-3 text-foreground">{mt.avgMaxWeight} kg</td>
                    <td className="py-2 text-muted-foreground">{mt.sessions}</td>
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

function Section({ title, icon: Icon, delay, children }: { title: string; icon: React.ComponentType<{ size?: number; className?: string }>; delay: number; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-primary" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}
