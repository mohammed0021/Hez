'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Dumbbell, Plus, GripVertical, Moon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCalendarStore } from '@/stores/calendar-store';
import { useWorkoutStore } from '@/stores/workout-store';

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
  const t = useTranslations('calendar');
  const tc = useTranslations('common');
  const tw = useTranslations('workouts');
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

  const weekDays = [
    t('sunday'),
    t('monday'),
    t('tuesday'),
    t('wednesday'),
    t('thursday'),
    t('friday'),
    t('saturday'),
  ];

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

  const handleDrop = useCallback(
    (e: React.DragEvent, dateStr: string) => {
      e.preventDefault();
      setDragOverDay(null);
      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        scheduleWorkout(dateStr, data.templateId, data.name);
      } catch {
        // Invalid drag data
      }
    },
    [scheduleWorkout],
  );

  const handleScheduleWorkout = (dateStr: string, templateId: string, name: string) => {
    scheduleWorkout(dateStr, templateId, name);
    setShowWorkoutPicker(false);
    setPickerDate(null);
  };

  const allWorkouts = [
    ...templates.map((t) => ({ id: t.id, name: t.name, isTemplate: true })),
    ...savedWorkouts.map((w) => ({ id: w.id, name: w.name, isTemplate: false })),
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={prevWeek}
          className="text-muted-foreground hover:bg-muted flex size-8 items-center justify-center rounded-lg transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-foreground text-sm font-semibold">
          {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} —{' '}
          {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <button
          onClick={nextWeek}
          className="text-muted-foreground hover:bg-muted flex size-8 items-center justify-center rounded-lg transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Workout template sidebar (draggable) */}
      {allWorkouts.length > 0 && (
        <div className="mb-4">
          <p className="text-muted-foreground mb-1.5 text-[10px] font-medium tracking-wider uppercase">
            {t('drag_workouts')}
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {allWorkouts.slice(0, 10).map((w) => (
              <div
                key={w.id}
                draggable
                onDragStart={(e) => handleDragStart(e, w.id, w.name)}
                className="bg-muted text-foreground hover:bg-muted/80 flex shrink-0 cursor-grab items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[10px] transition-colors select-none active:cursor-grabbing"
              >
                <GripVertical size={10} className="text-muted-foreground" />
                <Dumbbell size={10} className="text-primary" />
                <span className="max-w-[80px] truncate">{w.name}</span>
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
              className={`min-h-[120px] cursor-pointer rounded-xl border p-1.5 transition-all ${
                isToday
                  ? 'border-primary/40 bg-primary/5'
                  : isDragOver
                    ? 'border-primary bg-primary/10 scale-[1.02]'
                    : 'border-border/50 bg-card hover:border-border'
              }`}
            >
              <div
                className={`mb-1 text-center text-[10px] font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <span className="block">{dayName}</span>
                <span
                  className={`mt-0.5 block ${isToday ? 'bg-primary text-primary-foreground mx-auto flex size-5 items-center justify-center rounded-full' : ''}`}
                >
                  {dayNum}
                </span>
              </div>

              <div className="space-y-0.5">
                {dayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={`group relative flex items-center gap-1 rounded-md px-1 py-0.5 text-[8px] leading-tight ${
                      ev.status === 'completed'
                        ? 'bg-green-500/15 text-green-700'
                        : ev.status === 'missed'
                          ? 'bg-red-500/15 text-red-700'
                          : ev.type === 'rest'
                            ? 'bg-blue-500/10 text-blue-700'
                            : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {ev.type === 'rest' ? <Moon size={6} /> : <Dumbbell size={6} />}
                    <span className="flex-1 truncate">{ev.workoutName || ev.type}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEvent(ev.id);
                      }}
                      className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 hidden size-3.5 items-center justify-center rounded-full group-hover:flex"
                    >
                      <X size={6} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPickerDate(dateStr);
                  setShowWorkoutPicker(true);
                }}
                className="text-muted-foreground hover:bg-muted mt-1 flex w-full items-center justify-center gap-0.5 rounded-md py-0.5 text-[8px] opacity-0 transition-colors group-hover:opacity-100"
              >
                <Plus size={8} /> {tc('add')}
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick action buttons below week */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => {
            const d = getDateKey(new Date());
            addRestDay(d);
          }}
          className="bg-muted text-foreground hover:bg-muted/80 flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] transition-colors"
        >
          <Moon size={12} /> {t('add_rest_day_today')}
        </button>
        <button
          onClick={() => {
            const d = getDateKey(new Date());
            setPickerDate(d);
            setShowWorkoutPicker(true);
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] transition-colors"
        >
          <Plus size={12} /> {t('schedule_today')}
        </button>
      </div>

      {/* Workout picker overlay */}
      {showWorkoutPicker && pickerDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => {
            setShowWorkoutPicker(false);
            setPickerDate(null);
          }}
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border-border/50 max-h-[70vh] w-full max-w-md overflow-y-auto rounded-2xl border p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-foreground text-sm font-semibold">{t('schedule_workout_title')}</p>
              <button
                onClick={() => {
                  setShowWorkoutPicker(false);
                  setPickerDate(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-muted-foreground mb-3 text-[10px]">
              {t('choose_workout_for', { date: pickerDate })}
            </p>
            {allWorkouts.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-xs">
                {t('no_workouts_templates')}
              </p>
            ) : (
              <div className="space-y-1">
                {allWorkouts.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleScheduleWorkout(pickerDate, w.id, w.name)}
                    className="hover:bg-muted flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                  >
                    <Dumbbell size={14} className="text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-medium">{w.name}</p>
                      <p className="text-muted-foreground text-[10px]">
                        {w.isTemplate ? tw('template') : tw('saved_workout')}
                      </p>
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
