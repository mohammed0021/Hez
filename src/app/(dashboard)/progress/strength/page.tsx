'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Dumbbell, ChevronRight, ChevronDown } from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';

export default function StrengthTrendsPage() {
  const sessions = useWorkoutHistoryStore((s) => s.sessions);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const exerciseData = useMemo(() => {
    const map = new Map<
      string,
      { date: string; maxWeight: number; maxReps: number; volume: number }[]
    >();

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
        change:
          ((data[data.length - 1]!.maxWeight - data[0]!.maxWeight) / data[0]!.maxWeight) * 100,
      }))
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  }, [sessions]);

  const selected = exerciseData.find((e) => e.name === selectedExercise);

  return (
    <>
      <div>
        <h1 className="text-foreground text-2xl font-bold">Strength Trends</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          {exerciseData.length} exercises tracked
        </p>
      </div>

      {exerciseData.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <Dumbbell size={48} className="text-muted-foreground/20" />
          <p className="text-muted-foreground max-w-xs text-center text-sm">
            Complete workouts to see your strength trends.
          </p>
        </div>
      )}

      {/* Selected Exercise Chart */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-border/50 bg-card mt-5 rounded-2xl border p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-foreground text-sm font-semibold">{selected.name}</h3>
            <button
              onClick={() => setSelectedExercise(null)}
              className="text-muted-foreground hover:text-foreground text-[10px]"
            >
              Close
            </button>
          </div>
          {selected.data.length > 1 && (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selected.data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    strokeOpacity={0.4}
                  />
                  <XAxis
                    dataKey="date"
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
                  <Line
                    type="monotone"
                    dataKey="maxWeight"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Max Weight (kg)"
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="hsl(var(--primary))"
                    strokeWidth={1}
                    dot={false}
                    strokeOpacity={0.3}
                    name="Volume (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="text-muted-foreground mt-2 flex gap-3 text-[10px]">
            <span>Start: {selected.first.maxWeight}kg</span>
            <span>Current: {selected.latest.maxWeight}kg</span>
            <span className={selected.change > 0 ? 'text-green-500' : 'text-red-500'}>
              {selected.change > 0 ? '+' : ''}
              {selected.change.toFixed(1)}%
            </span>
          </div>
        </motion.div>
      )}

      {/* Exercise List */}
      <div className="mt-5 space-y-1">
        {exerciseData.map((ex, i) => (
          <motion.div
            key={ex.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
          >
            <button
              onClick={() => setSelectedExercise(selectedExercise === ex.name ? null : ex.name)}
              className="hover:bg-muted/50 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
            >
              <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                {ex.change > 2 ? (
                  <TrendingUp className="size-4 text-green-500" />
                ) : ex.change < -2 ? (
                  <TrendingDown className="size-4 text-red-500" />
                ) : (
                  <Minus className="size-4 text-yellow-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-medium">{ex.name}</p>
                <p className="text-muted-foreground text-[10px]">
                  {ex.first.maxWeight}kg → {ex.latest.maxWeight}kg · {ex.data.length} sessions
                </p>
              </div>
              <span
                className={`text-[10px] font-medium ${ex.change > 2 ? 'text-green-500' : ex.change < -2 ? 'text-red-500' : 'text-yellow-500'}`}
              >
                {ex.change > 0 ? '+' : ''}
                {ex.change.toFixed(1)}%
              </span>
              {selectedExercise === ex.name ? (
                <ChevronDown className="text-muted-foreground size-4" />
              ) : (
                <ChevronRight className="text-muted-foreground size-4" />
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="h-8" />
    </>
  );
}
