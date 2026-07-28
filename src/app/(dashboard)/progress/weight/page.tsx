'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useWeightStore } from '@/stores/weight-store';

export default function WeightTrackerPage() {
  const { entries, addEntry, deleteEntry } = useWeightStore();
  const [showForm, setShowForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [notes, setNotes] = useState('');

  const chartData = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    return sorted.map((e) => ({ date: e.date.slice(5), weight: e.weightKg }));
  }, [entries]);

  const latest = entries[0];
  const prev = entries[1];
  const change = latest && prev ? latest.weightKg - prev.weightKg : 0;
  const trend = change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable';

  const handleAdd = () => {
    const w = parseFloat(weight);
    if (!w || isNaN(w)) return;
    addEntry({
      date: new Date().toISOString().slice(0, 10),
      weightKg: w,
      bodyFatPercent: bodyFat ? parseFloat(bodyFat) : null,
      notes,
    });
    setWeight('');
    setBodyFat('');
    setNotes('');
    setShowForm(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Weight Tracker</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{entries.length} entries</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
        >
          <Plus className="size-4" /> Log Weight
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-border/50 bg-card mt-4 space-y-3 rounded-2xl border p-4"
        >
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-muted-foreground mb-1 block text-[10px] font-medium">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
                placeholder="0"
                autoFocus
                inputMode="decimal"
              />
            </div>
            <div className="flex-1">
              <label className="text-muted-foreground mb-1 block text-[10px] font-medium">
                Body Fat % (opt)
              </label>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
                placeholder="--"
                inputMode="decimal"
              />
            </div>
          </div>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
            placeholder="Notes (optional)"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="bg-muted text-foreground min-h-[44px] flex-1 rounded-xl py-2 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="bg-primary text-primary-foreground min-h-[44px] flex-1 rounded-xl py-2 text-xs font-medium"
            >
              Save
            </button>
          </div>
        </motion.div>
      )}

      {/* Current stats */}
      {latest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="from-primary/10 to-primary/5 border-primary/20 mt-5 rounded-2xl border bg-gradient-to-br p-4"
        >
          <p className="text-primary text-[10px] font-semibold tracking-widest uppercase">
            Current
          </p>
          <div className="mt-1 flex items-end gap-3">
            <span className="text-foreground text-4xl font-bold">{latest.weightKg}</span>
            <span className="text-muted-foreground mb-1 text-sm">kg</span>
            <div
              className={`mb-1 flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-muted-foreground'}`}
            >
              {trend === 'up' ? (
                <TrendingUp className="size-4" />
              ) : trend === 'down' ? (
                <TrendingDown className="size-4" />
              ) : (
                <Minus className="size-4" />
              )}
              {Math.abs(change).toFixed(1)} kg
            </div>
          </div>
          {latest.bodyFatPercent && (
            <p className="text-muted-foreground mt-0.5 text-xs">
              Body Fat: {latest.bodyFatPercent}%
            </p>
          )}
          <p className="text-muted-foreground/60 mt-1 text-[10px]">
            {new Date(latest.date).toLocaleDateString()}
          </p>
        </motion.div>
      )}

      {/* Chart */}
      {chartData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-5"
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  strokeOpacity={0.4}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={['dataMin - 2', 'dataMax + 2']}
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
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'hsl(var(--primary))' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* History */}
      <div className="mt-5 space-y-1">
        {entries.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="hover:bg-muted/50 group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
          >
            <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
              <span className="text-foreground text-sm font-bold">{e.weightKg}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-xs">
                {new Date(e.date).toLocaleDateString()}
              </p>
              {e.notes && (
                <p className="text-muted-foreground/60 truncate text-[10px]">{e.notes}</p>
              )}
            </div>
            {e.bodyFatPercent && (
              <span className="text-muted-foreground text-[10px]">{e.bodyFatPercent}%</span>
            )}
            <button
              onClick={() => deleteEntry(e.id)}
              className="text-muted-foreground/40 hover:text-destructive opacity-0 transition-all group-hover:opacity-100"
            >
              <Trash2 className="size-4" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="h-8" />
    </>
  );
}
