'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Dumbbell, Plus, GripVertical, Moon, X } from 'lucide-react';
import { useCalendarStore } from '@/stores/calendar-store';
import { useWorkoutStore } from '@/stores/workout-store';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDateKey(date?: Date): string {
  return (date || new Date()).toISOString().slice(0, 10);
}

function getWeekRange(date: Date) {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

export function WeeklyPlanner({ onSelectDate }: { onSelectDate?: (date: string) => void }) {
  const [baseDate, setBaseDate] = useState(() => {
    const now = new Date();
    now.setDate(now.getDate() - now.getDay());
    return now;
  });

  const events = useCalendarStore((s) => s.events);
  const scheduleWorkout = useCalendarStore((s) => s.scheduleWorkout);
  const addRestDay = useCalendarStore((s) => s.addRestDay);
  const removeEvent = useCalendarStore((s) => s.removeEvent);
  const templates = useWorkoutStore((s) => s.templates);
  const savedWorkouts = useWorkoutStore((s) => s.savedWorkouts);

  const [dragOverDay, setDragOverDay] = useState<string | null>(null);
  const [showWorkoutPicker, setShowWorkoutPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState<string | null>(null);

  const { start, end } = getWeekRange(baseDate);

  const prevWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - 7);
    setBaseDate(d);
  };

  const nextWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + 7);
    setBaseDate(d);
  };

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const todayStr = getDateKey();

  const getEventsForDay = (date: Date) => {
    const dateStr = getDateKey(date);
    return events.filter((e) => e.date === dateStr);
  };

  const handleDragStart = (e: React.DragEvent, templateId: string, name: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ templateId, name }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverDay(dateStr);
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDrop = useCallback((e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    setDragOverDay(null);
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      scheduleWorkout(dateStr, data.templateId, data.name);
    } catch {
      // Invalid drag data
    }
  }, [scheduleWorkout]);

  const handleScheduleWorkout = (dateStr: string, templateId: string, name: string) => {
    scheduleWorkout(dateStr, templateId, name);
    setShowWorkoutPicker(false);
    setPickerDate(null);
  };

  const allWorkouts = [...templates.map((t) => ({ id: t.id, name: t.name, isTemplate: true })), ...savedWorkouts.map((w) => ({ id: w.id, name: w.name, isTemplate: false }))];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevWeek} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-semibold text-foreground">
          {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <button onClick={nextWeek} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Workout template sidebar (draggable) */}
      {allWorkouts.length > 0 && (
        <div className="mb-4">
          <p className="mb-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Drag workouts to schedule</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {allWorkouts.slice(0, 10).map((w) => (
              <div
                key={w.id}
                draggable
                onDragStart={(e) => handleDragStart(e, w.id, w.name)}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-muted px-2.5 py-1.5 text-[10px] text-foreground cursor-grab active:cursor-grabbing hover:bg-muted/80 transition-colors select-none"
              >
                <GripVertical size={10} className="text-muted-foreground" />
                <Dumbbell size={10} className="text-primary" />
                <span className="truncate max-w-[80px]">{w.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date) => {
          const dateStr = getDateKey(date);
          const dayEvents = getEventsForDay(date);
          const isToday = dateStr === todayStr;
          const isDragOver = dragOverDay === dateStr;
          const dayNum = date.getDate();
          const dayName = weekDays[date.getDay()];

          return (
            <div
              key={dateStr}
              onDragOver={(e) => handleDragOver(e, dateStr)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, dateStr)}
              onClick={() => onSelectDate?.(dateStr)}
              className={`rounded-xl border min-h-[120px] p-1.5 transition-all cursor-pointer ${
                isToday
                  ? 'border-primary/40 bg-primary/5'
                  : isDragOver
                    ? 'border-primary bg-primary/10 scale-[1.02]'
                    : 'border-border/50 bg-card hover:border-border'
              }`}
            >
              <div className={`text-center text-[10px] font-medium mb-1 ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                <span className="block">{dayName}</span>
                <span className={`block mt-0.5 ${isToday ? 'flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto' : ''}`}>
                  {dayNum}
                </span>
              </div>

              <div className="space-y-0.5">
                {dayEvents.map((ev) => (
                  <div key={ev.id}
                    className={`group relative flex items-center gap-1 rounded-md px-1 py-0.5 text-[8px] leading-tight ${
                      ev.status === 'completed' ? 'bg-green-500/15 text-green-700' :
                      ev.status === 'missed' ? 'bg-red-500/15 text-red-700' :
                      ev.type === 'rest' ? 'bg-blue-500/10 text-blue-700' :
                      'bg-primary/10 text-primary'
                    }`}>
                    {ev.type === 'rest' ? <Moon size={6} /> : <Dumbbell size={6} />}
                    <span className="truncate flex-1">{ev.workoutName || ev.type}</span>
                    <button onClick={(e) => { e.stopPropagation(); removeEvent(ev.id); }}
                      className="hidden group-hover:flex absolute -top-1 -right-1 size-3.5 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                      <X size={6} />
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={(e) => { e.stopPropagation(); setPickerDate(dateStr); setShowWorkoutPicker(true); }}
                className="mt-1 flex w-full items-center justify-center gap-0.5 rounded-md py-0.5 text-[8px] text-muted-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                <Plus size={8} /> Add
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick action buttons below week */}
      <div className="mt-3 flex gap-2">
        <button onClick={() => { const d = getDateKey(new Date()); addRestDay(d); }}
          className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-[10px] text-foreground hover:bg-muted/80 transition-colors">
          <Moon size={12} /> Add Rest Day (Today)
        </button>
        <button onClick={() => { const d = getDateKey(new Date()); setPickerDate(d); setShowWorkoutPicker(true); }}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[10px] text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus size={12} /> Schedule (Today)
        </button>
      </div>

      {/* Workout picker overlay */}
      {showWorkoutPicker && pickerDate && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
          onClick={() => { setShowWorkoutPicker(false); setPickerDate(null); }}>
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-card p-5 border border-border/50 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">Schedule Workout</p>
              <button onClick={() => { setShowWorkoutPicker(false); setPickerDate(null); }}
                className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">Choose a workout for {pickerDate}</p>
            {allWorkouts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No workouts or templates yet. Create one first!</p>
            ) : (
              <div className="space-y-1">
                {allWorkouts.map((w) => (
                  <button key={w.id} onClick={() => handleScheduleWorkout(pickerDate, w.id, w.name)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-muted transition-colors">
                    <Dumbbell size={14} className="text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{w.name}</p>
                      <p className="text-[10px] text-muted-foreground">{w.isTemplate ? 'Template' : 'Saved Workout'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
