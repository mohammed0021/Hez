'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useMeasurementStore, MEASUREMENT_FIELDS } from '@/stores/measurement-store';

export default function MeasurementsPage() {
  const { entries, addEntry, deleteEntry } = useMeasurementStore();
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formNotes, setFormNotes] = useState('');

  const sorted = useMemo(() => [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [entries]);

  const handleAdd = () => {
    const entry: Record<string, string | number | null> = { date: new Date().toISOString().slice(0, 10), notes: formNotes };
    for (const field of MEASUREMENT_FIELDS) {
      entry[field.key] = formValues[field.key] ? parseFloat(formValues[field.key]!) : null;
    }
    addEntry(entry as any);
    setFormValues({});
    setFormNotes('');
    setShowForm(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Body Measurements</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{entries.length} entries</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
          <Plus size={14} /> Log
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-border/50 bg-card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {MEASUREMENT_FIELDS.map((f) => (
              <div key={f.key}>
                <label className="block text-[9px] font-medium text-muted-foreground mb-0.5">{f.label} (cm)</label>
                <input type="number" value={formValues[f.key] || ''} onChange={(e) => setFormValues({ ...formValues, [f.key]: e.target.value })} className="w-full rounded-lg border border-border/30 bg-background px-2.5 py-2 text-xs text-foreground focus:border-primary/40 focus:outline-none" placeholder="--" inputMode="decimal" />
              </div>
            ))}
          </div>
          <input type="text" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} className="w-full rounded-xl border border-border/30 bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none" placeholder="Notes (optional)" />
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl bg-muted py-2 text-xs font-medium text-foreground">Cancel</button>
            <button onClick={handleAdd} className="flex-1 rounded-xl bg-primary py-2 text-xs font-medium text-primary-foreground">Save</button>
          </div>
        </motion.div>
      )}

      {entries.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">No measurements yet. Log your first one!</p>
        </div>
      )}

      {entries.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="mt-5 space-y-4">
          {MEASUREMENT_FIELDS.filter((f) => sorted.some((e) => e[f.key] != null)).map((field) => {
            const data = sorted.filter((e) => e[field.key] != null).map((e) => ({ date: e.date.slice(5), value: e[field.key] as number }));
            const latest = data[data.length - 1];
            const prev = data[data.length - 2];
            const change = latest && prev ? latest.value - prev.value : 0;
            const trend = change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable';
            return (
              <div key={field.key} className="rounded-2xl border border-border/50 bg-card p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{field.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{latest?.value ?? '--'} cm</span>
                    {change !== 0 && (
                      <span className={`flex items-center gap-0.5 text-[10px] ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {trend === 'up' ? <TrendingUp size={10} /> : trend === 'down' ? <TrendingDown size={10} /> : <Minus size={10} />}
                        {Math.abs(change).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                {data.length > 1 && (
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={1.5} dot={{ r: 2 }} />
                        <XAxis dataKey="date" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 8 }} axisLine={false} tickLine={false} width={30} />
                        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6, fontSize: 10 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="mt-1 flex gap-1 text-[8px] text-muted-foreground">
                  <span>Latest: {latest ? new Date(latest.date).toLocaleDateString() : '--'}</span>
                  <span>· {data.length} entries</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* History */}
      <div className="mt-6 space-y-1">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Measurement History</p>
        {entries.map((e, i) => {
          const filled = MEASUREMENT_FIELDS.filter((f) => e[f.key] != null).length;
          return (
            <motion.div key={e.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-colors group">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0">
                <span className="text-xs font-bold text-foreground">{filled}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground">{new Date(e.date).toLocaleDateString()}</p>
                <p className="text-[10px] text-muted-foreground">{filled} measurements logged</p>
              </div>
              <button onClick={() => deleteEntry(e.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive transition-all">
                <Trash2 size={14} />
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="h-8" />
    </>
  );
}
