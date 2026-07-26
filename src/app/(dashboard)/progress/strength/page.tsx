'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Dumbbell, ChevronRight, ChevronDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';

export default function StrengthTrendsPage() {
  const sessions = useWorkoutHistoryStore((s) => s.sessions);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const exerciseData = useMemo(() => {
    const map = new Map<string, { date: string; maxWeight: number; maxReps: number; volume: number }[]>();

    for (const session of sessions) {
      for (const block of session.blocks) {
        for (const ex of block.exercises) {
          if (ex.sets.length === 0) continue;
          let maxWeight = 0;
          let maxReps = 0;
          let volume = 0;
          for (const s of ex.sets) {
            if (!s.completed) continue;
            const w = s.actualWeightKg || s.targetWeightKg;
            const r = s.actualReps || s.targetReps;
            if (w > maxWeight) maxWeight = w;
            if (r > maxReps) maxReps = r;
            volume += w * r;
          }
          if (maxWeight === 0) continue;
          const existing = map.get(ex.exerciseName) || [];
          existing.push({ date: session.completedAt, maxWeight, maxReps, volume });
          map.set(ex.exerciseName, existing);
        }
      }
    }

    for (const [, data] of map) {
      data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        data,
        latest: data[data.length - 1]!,
        first: data[0]!,
        change: ((data[data.length - 1]!.maxWeight - data[0]!.maxWeight) / data[0]!.maxWeight) * 100,
      }))
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  }, [sessions]);

  const selected = exerciseData.find((e) => e.name === selectedExercise);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Strength Trends</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{exerciseData.length} exercises tracked</p>
      </div>

      {exerciseData.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <Dumbbell size={48} className="text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground text-center max-w-xs">Complete workouts to see your strength trends.</p>
        </div>
      )}

      {/* Selected Exercise Chart */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl border border-border/50 bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">{selected.name}</h3>
            <button onClick={() => setSelectedExercise(null)} className="text-[10px] text-muted-foreground hover:text-foreground">Close</button>
          </div>
          {selected.data.length > 1 && (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selected.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(v: unknown) => { const d = new Date(v as string); return `${d.getMonth() + 1}/${d.getDate()}`; }}
                    axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                    labelFormatter={(v: unknown) => { const d = new Date(v as string); return d.toLocaleDateString(); }} />
                  <Line type="monotone" dataKey="maxWeight" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name="Max Weight (kg)" />
                  <Line type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={1} dot={false} strokeOpacity={0.3} name="Volume (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-2 flex gap-3 text-[10px] text-muted-foreground">
            <span>Start: {selected.first.maxWeight}kg</span>
            <span>Current: {selected.latest.maxWeight}kg</span>
            <span className={selected.change > 0 ? 'text-green-500' : 'text-red-500'}>
              {selected.change > 0 ? '+' : ''}{selected.change.toFixed(1)}%
            </span>
          </div>
        </motion.div>
      )}

      {/* Exercise List */}
      <div className="mt-5 space-y-1">
        {exerciseData.map((ex, i) => (
          <motion.div key={ex.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
            <button onClick={() => setSelectedExercise(selectedExercise === ex.name ? null : ex.name)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-colors text-left">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0">
                {ex.change > 2 ? <TrendingUp size={16} className="text-green-500" /> : ex.change < -2 ? <TrendingDown size={16} className="text-red-500" /> : <Minus size={16} className="text-yellow-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{ex.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {ex.first.maxWeight}kg → {ex.latest.maxWeight}kg · {ex.data.length} sessions
                </p>
              </div>
              <span className={`text-[10px] font-medium ${ex.change > 2 ? 'text-green-500' : ex.change < -2 ? 'text-red-500' : 'text-yellow-500'}`}>
                {ex.change > 0 ? '+' : ''}{ex.change.toFixed(1)}%
              </span>
              {selectedExercise === ex.name ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="h-8" />
    </>
  );
}
