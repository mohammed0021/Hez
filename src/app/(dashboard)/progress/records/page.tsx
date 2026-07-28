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
    return [...auto, ...manualRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [manualRecords, getAutoRecords, sessions]);

  const [showForm, setShowForm] = useState(false);
  const [formExName, setFormExName] = useState('');
  const [formType, setFormType] = useState<
    'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm'
  >('max_weight');
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
          <h1 className="text-foreground text-2xl font-bold">Personal Records</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{allRecords.length} records</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
        >
          <Plus className="size-4" /> Add Record
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-border/50 bg-card mt-4 space-y-3 rounded-2xl border p-4"
        >
          <input
            type="text"
            value={formExName}
            onChange={(e) => setFormExName(e.target.value)}
            className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
            placeholder="Exercise name"
          />
          <div className="flex gap-3">
            <select
              value={formType}
              onChange={(e) =>
                setFormType(
                  e.target.value as 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm',
                )
              }
              className="border-border/30 bg-background text-foreground focus:border-primary/40 flex-1 rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
            >
              <option value="max_weight">Max Weight</option>
              <option value="max_reps">Max Reps</option>
              <option value="max_volume">Max Volume</option>
              <option value="estimated_1rm">Estimated 1RM</option>
            </select>
            <input
              type="number"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              className="border-border/30 bg-background text-foreground focus:border-primary/40 flex-1 rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
              placeholder="Value"
              inputMode="decimal"
            />
          </div>
          <input
            type="date"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
            className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
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

      {allRecords.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <Trophy size={48} className="text-muted-foreground/20" />
          <p className="text-muted-foreground max-w-xs text-center text-sm">
            Complete workouts to auto-generate personal records, or add them manually.
          </p>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {grouped.map(([name, records]) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-border/50 bg-card rounded-2xl border p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
                <Trophy className="size-4 text-amber-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-semibold">{name}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {records.slice(0, 4).map((r) => {
                    const RIcon = PR_ICONS[r.type];
                    return (
                      <span
                        key={r.id}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${r.source === 'auto' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
                      >
                        <RIcon className="size-4" />
                        {r.value}
                        {r.type === 'max_weight' || r.type === 'estimated_1rm'
                          ? 'kg'
                          : r.type === 'max_volume'
                            ? 'kg'
                            : ''}
                        <span className="text-muted-foreground/60">{PR_LABELS[r.type]}</span>
                        <span className="text-muted-foreground/40">
                          {new Date(r.date).toLocaleDateString()}
                        </span>
                        {r.source === 'manual' && (
                          <button
                            onClick={() => deleteRecord(r.id)}
                            className="text-muted-foreground/40 hover:text-destructive ml-0.5"
                          >
                            <Trash2 className="size-4" />
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
