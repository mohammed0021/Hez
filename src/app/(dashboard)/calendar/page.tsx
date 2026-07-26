'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, CalendarRange, List, Plus, Settings, X, Timer, RefreshCw } from 'lucide-react';
import { MonthlyView } from '@/components/calendar/monthly-view';
import { WeeklyPlanner } from '@/components/calendar/weekly-planner';
import { DailyAgenda } from '@/components/calendar/daily-agenda';
import { useCalendarStore } from '@/stores/calendar-store';
import { useWorkoutStore } from '@/stores/workout-store';

type ViewMode = 'monthly' | 'weekly' | 'daily';

function getDateKey(date?: Date): string {
  return (date || new Date()).toISOString().slice(0, 10);
}

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>('monthly');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);

  const recurringSchedules = useCalendarStore((s) => s.recurringSchedules);
  const addRecurringSchedule = useCalendarStore((s) => s.addRecurringSchedule);
  const removeRecurringSchedule = useCalendarStore((s) => s.removeRecurringSchedule);
  const trainingCycles = useCalendarStore((s) => s.trainingCycles);
  const addTrainingCycle = useCalendarStore((s) => s.addTrainingCycle);
  const removeTrainingCycle = useCalendarStore((s) => s.removeTrainingCycle);

  const templates = useWorkoutStore((s) => s.templates);
  const savedWorkouts = useWorkoutStore((s) => s.savedWorkouts);
  const allWorkouts = [...templates, ...savedWorkouts];

  const [newSchedule, setNewSchedule] = useState({
    name: '',
    daysOfWeek: [] as number[],
    workoutId: '',
    workoutName: '',
    startDate: '',
    endDate: '',
  });

  const [newCycle, setNewCycle] = useState({
    name: '',
    startDate: '',
    endDate: '',
    color: '#10b981',
    notes: '',
  });

  const todayStr = getDateKey();
  const today = new Date();

  useEffect(() => {
    const dayOfWeek = today.getDay();
    if (recurringSchedules.some((r) => r.active && r.daysOfWeek.includes(dayOfWeek))) {
      const matching = recurringSchedules.filter((r) => r.active && r.daysOfWeek.includes(dayOfWeek));
      for (const sched of matching) {
        if (sched.workoutId && !sched.startDate && !sched.endDate) {
          const existing = useCalendarStore.getState().events;
          if (!existing.some((e) => e.date === todayStr && e.workoutId === sched.workoutId && e.type === 'workout')) {
            useCalendarStore.getState().scheduleWorkout(todayStr, sched.workoutId, sched.workoutName);
          }
        }
      }
    }
  }, []);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setView('daily');
  };

  const handleAddRecurring = () => {
    if (!newSchedule.name || !newSchedule.workoutId || newSchedule.daysOfWeek.length === 0) return;
    addRecurringSchedule({
      name: newSchedule.name,
      daysOfWeek: newSchedule.daysOfWeek,
      workoutId: newSchedule.workoutId,
      workoutName: newSchedule.workoutName,
      active: true,
      startDate: newSchedule.startDate || undefined,
      endDate: newSchedule.endDate || undefined,
    });
    setNewSchedule({ name: '', daysOfWeek: [], workoutId: '', workoutName: '', startDate: '', endDate: '' });
  };

  const handleAddCycle = () => {
    if (!newCycle.name || !newCycle.startDate || !newCycle.endDate) return;
    addTrainingCycle({
      name: newCycle.name,
      startDate: newCycle.startDate,
      endDate: newCycle.endDate,
      color: newCycle.color,
      notes: newCycle.notes,
    });
    setNewCycle({ name: '', startDate: '', endDate: '', color: '#10b981', notes: '' });
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
        <div className="flex gap-1.5">
          <button onClick={() => setShowManageModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors">
            <Settings size={14} /> Manage
          </button>
          <button onClick={() => { setSelectedDate(todayStr); setView('daily'); }}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus size={14} /> Today
          </button>
        </div>
      </div>

      {/* View switcher */}
      <div className="mt-4 flex gap-1 rounded-xl bg-muted p-1">
        {([
          { id: 'monthly' as const, label: 'Month', icon: CalendarDays },
          { id: 'weekly' as const, label: 'Week', icon: CalendarRange },
          { id: 'daily' as const, label: 'Day', icon: List },
        ]).map((v) => {
          const Icon = v.icon;
          return (
            <button key={v.id} onClick={() => { setView(v.id); if (v.id !== 'daily') setSelectedDate(null); }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all ${
                view === v.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <Icon size={14} />
              {v.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          {view === 'monthly' && (
            <motion.div key="monthly" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              className="rounded-2xl border border-border/50 bg-card p-4">
              <MonthlyView onSelectDate={handleSelectDate} />
            </motion.div>
          )}
          {view === 'weekly' && (
            <motion.div key="weekly" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <WeeklyPlanner onSelectDate={handleSelectDate} />
            </motion.div>
          )}
          {view === 'daily' && (
            <motion.div key="daily" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <DailyAgenda
                dateStr={selectedDate || todayStr}
                onDateChange={setSelectedDate}
                onClose={() => setView('monthly')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Manage modal */}
      <AnimatePresence>
        {showManageModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
            onClick={() => setShowManageModal(false)}>
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-card p-5 border border-border/50 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-foreground">Manage Schedules & Cycles</p>
                <button onClick={() => setShowManageModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>

              {/* Recurring Schedules */}
              <div className="mb-5">
                <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <RefreshCw size={12} className="text-primary" /> Recurring Schedules
                </p>

                {recurringSchedules.length > 0 && (
                  <div className="space-y-1 mb-3">
                    {recurringSchedules.map((s) => (
                      <div key={s.id} className="flex items-center gap-2 rounded-xl bg-muted p-2.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">{s.name || s.workoutName}</p>
                          <p className="text-[9px] text-muted-foreground">
                            {s.daysOfWeek.map((d) => daysOfWeek[d]).join(', ')}
                          </p>
                        </div>
                        <button onClick={() => removeRecurringSchedule(s.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <select value={newSchedule.workoutId} onChange={(e) => {
                    const w = allWorkouts.find((w) => w.id === e.target.value);
                    setNewSchedule({ ...newSchedule, workoutId: e.target.value, workoutName: w?.name || '', name: w?.name || '' });
                  }}
                    className="w-full rounded-xl border border-border/30 bg-background px-3 py-2 text-xs text-foreground">
                    <option value="">Select workout...</option>
                    {allWorkouts.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-1.5">
                    {daysOfWeek.map((d, i) => (
                      <button key={i} onClick={() => {
                        const next = newSchedule.daysOfWeek.includes(i)
                          ? newSchedule.daysOfWeek.filter((x) => x !== i)
                          : [...newSchedule.daysOfWeek, i].sort();
                        setNewSchedule({ ...newSchedule, daysOfWeek: next });
                      }}
                        className={`size-8 rounded-lg text-[9px] font-medium transition-colors ${
                          newSchedule.daysOfWeek.includes(i) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                        {d[0]}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleAddRecurring} disabled={!newSchedule.workoutId || newSchedule.daysOfWeek.length === 0}
                    className="w-full rounded-xl bg-primary py-2 text-xs font-medium text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors">
                    Add Recurring Schedule
                  </button>
                </div>
              </div>

              {/* Training Cycles */}
              <div>
                <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Timer size={12} className="text-purple-500" /> Training Cycles
                </p>

                {trainingCycles.length > 0 && (
                  <div className="space-y-1 mb-3">
                    {trainingCycles.map((c) => (
                      <div key={c.id} className="flex items-center gap-2 rounded-xl bg-muted p-2.5">
                        <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">{c.name}</p>
                          <p className="text-[9px] text-muted-foreground">{c.startDate} → {c.endDate}</p>
                        </div>
                        <button onClick={() => removeTrainingCycle(c.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <input value={newCycle.name} onChange={(e) => setNewCycle({ ...newCycle, name: e.target.value })}
                    placeholder="Cycle name (e.g. Strength Block)"
                    className="w-full rounded-xl border border-border/30 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50" />
                  <div className="flex gap-2">
                    <input type="date" value={newCycle.startDate} onChange={(e) => setNewCycle({ ...newCycle, startDate: e.target.value })}
                      className="flex-1 rounded-xl border border-border/30 bg-background px-3 py-2 text-xs text-foreground" />
                    <span className="self-center text-xs text-muted-foreground">→</span>
                    <input type="date" value={newCycle.endDate} onChange={(e) => setNewCycle({ ...newCycle, endDate: e.target.value })}
                      className="flex-1 rounded-xl border border-border/30 bg-background px-3 py-2 text-xs text-foreground" />
                  </div>
                  <div className="flex gap-2">
                    <input value={newCycle.notes} onChange={(e) => setNewCycle({ ...newCycle, notes: e.target.value })}
                      placeholder="Notes (optional)"
                      className="flex-1 rounded-xl border border-border/30 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50" />
                    <input type="color" value={newCycle.color} onChange={(e) => setNewCycle({ ...newCycle, color: e.target.value })}
                      className="size-9 rounded-xl border border-border/30 bg-background cursor-pointer" />
                  </div>
                  <button onClick={handleAddCycle} disabled={!newCycle.name || !newCycle.startDate || !newCycle.endDate}
                    className="w-full rounded-xl bg-purple-500 py-2 text-xs font-medium text-white disabled:opacity-50 hover:bg-purple-600 transition-colors">
                    Add Training Cycle
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
