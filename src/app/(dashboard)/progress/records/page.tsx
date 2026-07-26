'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Dumbbell, Zap, Repeat, BarChart3, Plus, Trash2 } from 'lucide-react';
import { usePRStore } from '@/stores/pr-store';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';

const PR_ICONS = {
  max_weight: Dumbbell,
  max_reps: Repeat,
  max_volume: BarChart3,
  estimated_1rm: Zap,
} as const;

const PR_LABELS = {
  max_weight: 'Max Weight',
  max_reps: 'Max Reps',
  max_volume: 'Max Volume',
  estimated_1rm: 'Estimated 1RM',
} as const;

export default function RecordsPage() {
  const manualRecords = usePRStore((s) => s.manualRecords);
  const addManualRecord = usePRStore((s) => s.addManualRecord);
  const deleteRecord = usePRStore((s) => s.deleteRecord);
  const getAutoRecords = usePRStore((s) => s.getAutoRecords);
  const sessions = useWorkoutHistoryStore((s) => s.sessions);

  const allRecords = useMemo(() => {
    const auto = getAutoRecords();
    return [...auto, ...manualRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [manualRecords, getAutoRecords, sessions]);

  const [showForm, setShowForm] = useState(false);
  const [formExName, setFormExName] = useState('');
  const [formType, setFormType] = useState<'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm'>('max_weight');
  const [formValue, setFormValue] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));

  const grouped = useMemo(() => {
    const map = new Map<string, typeof allRecords>();
    for (const r of allRecords) {
      const existing = map.get(r.exerciseName) || [];
      existing.push(r);
      map.set(r.exerciseName, existing);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [allRecords]);

  const handleAdd = () => {
    if (!formExName || !formValue) return;
    addManualRecord({
      exerciseName: formExName,
      type: formType,
      value: parseFloat(formValue),
      date: formDate,
      source: 'manual',
    });
    setFormExName('');
    setFormValue('');
    setShowForm(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Personal Records</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{allRecords.length} records</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
          <Plus size={14} /> Add Record
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-border/50 bg-card p-4 space-y-3">
          <input type="text" value={formExName} onChange={(e) => setFormExName(e.target.value)} className="w-full rounded-xl border border-border/30 bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none" placeholder="Exercise name" />
          <div className="flex gap-3">
            <select value={formType} onChange={(e) => setFormType(e.target.value as any)} className="flex-1 rounded-xl border border-border/30 bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none">
              <option value="max_weight">Max Weight</option>
              <option value="max_reps">Max Reps</option>
              <option value="max_volume">Max Volume</option>
              <option value="estimated_1rm">Estimated 1RM</option>
            </select>
            <input type="number" value={formValue} onChange={(e) => setFormValue(e.target.value)} className="flex-1 rounded-xl border border-border/30 bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none" placeholder="Value" inputMode="decimal" />
          </div>
          <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full rounded-xl border border-border/30 bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none" />
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl bg-muted py-2 text-xs font-medium text-foreground">Cancel</button>
            <button onClick={handleAdd} className="flex-1 rounded-xl bg-primary py-2 text-xs font-medium text-primary-foreground">Save</button>
          </div>
        </motion.div>
      )}

      {allRecords.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <Trophy size={48} className="text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground text-center max-w-xs">Complete workouts to auto-generate personal records, or add them manually.</p>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {grouped.map(([name, records]) => (
            <motion.div key={name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/50 bg-card p-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
                  <Trophy size={18} className="text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {records.slice(0, 4).map((r) => {
                      const RIcon = PR_ICONS[r.type];
                      return (
                        <span key={r.id} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${r.source === 'auto' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <RIcon size={10} />
                          {r.value}{r.type === 'max_weight' || r.type === 'estimated_1rm' ? 'kg' : r.type === 'max_volume' ? 'kg' : ''}
                          <span className="text-muted-foreground/60">{PR_LABELS[r.type]}</span>
                          <span className="text-muted-foreground/40">{new Date(r.date).toLocaleDateString()}</span>
                          {r.source === 'manual' && (
                            <button onClick={() => deleteRecord(r.id)} className="text-muted-foreground/40 hover:text-destructive ml-0.5">
                              <Trash2 size={9} />
                            </button>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      <div className="h-8" />
    </>
  );
}
