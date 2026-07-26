'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useWeightStore } from '@/stores/weight-store';

export default function WeightTrackerPage() {
  const { entries, addEntry, deleteEntry } = useWeightStore();
  const [showForm, setShowForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [notes, setNotes] = useState('');

  const chartData = useMemo(() => {
    const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.map((e) => ({ date: e.date.slice(5), weight: e.weightKg }));
  }, [entries]);

  const latest = entries[0];
  const prev = entries[1];
  const change = latest && prev ? (latest.weightKg - prev.weightKg) : 0;
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
          <h1 className="text-2xl font-bold text-foreground">Weight Tracker</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{entries.length} entries</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
          <Plus size={14} /> Log Weight
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-border/50 bg-card p-4 space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Weight (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-xl border border-border/30 bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none" placeholder="0" autoFocus inputMode="decimal" />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Body Fat % (opt)</label>
              <input type="number" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} className="w-full rounded-xl border border-border/30 bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none" placeholder="--" inputMode="decimal" />
            </div>
          </div>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-xl border border-border/30 bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none" placeholder="Notes (optional)" />
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl bg-muted py-2 text-xs font-medium text-foreground">Cancel</button>
            <button onClick={handleAdd} className="flex-1 rounded-xl bg-primary py-2 text-xs font-medium text-primary-foreground">Save</button>
          </div>
        </motion.div>
      )}

      {/* Current stats */}
      {latest && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Current</p>
          <div className="mt-1 flex items-end gap-3">
            <span className="text-4xl font-bold text-foreground">{latest.weightKg}</span>
            <span className="text-sm text-muted-foreground mb-1">kg</span>
            <div className={`flex items-center gap-1 text-xs font-medium mb-1 ${trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-muted-foreground'}`}>
              {trend === 'up' ? <TrendingUp size={14} /> : trend === 'down' ? <TrendingDown size={14} /> : <Minus size={14} />}
              {Math.abs(change).toFixed(1)} kg
            </div>
          </div>
          {latest.bodyFatPercent && <p className="text-xs text-muted-foreground mt-0.5">Body Fat: {latest.bodyFatPercent}%</p>}
          <p className="text-[10px] text-muted-foreground/60 mt-1">{new Date(latest.date).toLocaleDateString()}</p>
        </motion.div>
      )}

      {/* Chart */}
      {chartData.length > 1 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-5">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: 'hsl(var(--primary))' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* History */}
      <div className="mt-5 space-y-1">
        {entries.map((e, i) => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-colors group">
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0">
              <span className="text-sm font-bold text-foreground">{e.weightKg}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()}</p>
              {e.notes && <p className="text-[10px] text-muted-foreground/60 truncate">{e.notes}</p>}
            </div>
            {e.bodyFatPercent && <span className="text-[10px] text-muted-foreground">{e.bodyFatPercent}%</span>}
            <button onClick={() => deleteEntry(e.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive transition-all">
              <Trash2 size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="h-8" />
    </>
  );
}
