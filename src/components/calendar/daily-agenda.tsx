'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Moon,
  Weight,
  Ruler,
  StickyNote,
  CheckCircle2,
  XCircle,
  Play,
  Plus,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCalendarStore } from '@/stores/calendar-store';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';
import { useWeightStore } from '@/stores/weight-store';
import { useMeasurementStore } from '@/stores/measurement-store';
import { useWorkoutStore } from '@/stores/workout-store';
import Link from 'next/link';

function getDateKey(date?: Date): string {
  return (date || new Date()).toISOString().slice(0, 10);
}

export function DailyAgenda({
  dateStr,
  onDateChange,
  onClose,
}: {
  dateStr: string;
  onDateChange?: (date: string) => void;
  onClose?: () => void;
}) {
  const t = useTranslations('calendar');
  const tc = useTranslations('common');
  const events = useCalendarStore((s) => s.events);
  const markWorkout = useCalendarStore((s) => s.markWorkout);
  const removeEvent = useCalendarStore((s) => s.removeEvent);
  const scheduleWorkout = useCalendarStore((s) => s.scheduleWorkout);
  const addRestDay = useCalendarStore((s) => s.addRestDay);
  const trainingCycles = useCalendarStore((s) => s.trainingCycles);

  const historySessions = useWorkoutHistoryStore((s) => s.sessions);
  const templates = useWorkoutStore((s) => s.templates);
  const savedWorkouts = useWorkoutStore((s) => s.savedWorkouts);
  const weightEntries = useWeightStore((s) => s.entries);
  const measurementEntries = useMeasurementStore((s) => s.entries);

  const d = new Date(dateStr + 'T12:00:00');
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
  const monthNames = [
    t('january'),
    t('february'),
    t('march'),
    t('april'),
    t('may'),
    t('june'),
    t('july'),
    t('august'),
    t('september'),
    t('october'),
    t('november'),
    t('december'),
  ];
  const monthName = monthNames[d.getMonth()];
  const dayNum = d.getDate();
  const yearNum = d.getFullYear();

  const dayEvents = useMemo(() => {
    const calEvents = events.filter((e) => e.date === dateStr);
    const completedToday = historySessions.filter((s) => s.completedAt?.startsWith(dateStr));
    const weightToday = weightEntries.filter((e) => e.date === dateStr);
    const measurementToday = measurementEntries.filter((e) => e.date === dateStr);

    const merged = [...calEvents];
    for (const ws of completedToday) {
      if (!merged.some((m) => m.completedWorkoutId === ws.id)) {
        merged.push({
          id: `hist-${ws.id}`,
          date: dateStr,
          type: 'workout' as const,
          status: 'completed' as const,
          workoutName: ws.name,
          completedWorkoutId: ws.id,
          notes: t('volume_note', { volume: ws.volume.toLocaleString() }),
        });
      }
    }
    for (const w of weightToday) {
      if (!merged.some((m) => m.type === 'weight_log')) {
        merged.push({
          id: `w-${w.id}`,
          date: dateStr,
          type: 'weight_log' as const,
          status: 'completed' as const,
          notes: `${w.weightKg}kg${w.bodyFatPercent ? ` · ${w.bodyFatPercent}% BF` : ''}`,
        });
      }
    }
    for (const m of measurementToday) {
      if (!merged.some((em) => em.type === 'measurement')) {
        merged.push({
          id: `ms-${m.id}`,
          date: dateStr,
          type: 'measurement' as const,
          status: 'completed' as const,
        });
      }
    }
    return merged;
  }, [dateStr, events, historySessions, weightEntries, measurementEntries, t]);

  const activeCycle = trainingCycles.find((c) => dateStr >= c.startDate && dateStr <= c.endDate);
  const allWorkouts = [
    ...templates.map((t) => ({ id: t.id, name: t.name })),
    ...savedWorkouts.map((w) => ({ id: w.id, name: w.name })),
  ];

  const prevDay = () => {
    const prev = new Date(d);
    prev.setDate(prev.getDate() - 1);
    onDateChange?.(getDateKey(prev));
  };

  const nextDay = () => {
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    onDateChange?.(getDateKey(next));
  };

  const isToday = dateStr === getDateKey();

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
        >
          {tc('back')}
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={prevDay}
            className="text-muted-foreground hover:bg-muted flex size-7 items-center justify-center rounded-lg transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <div className="text-center">
            <p className="text-foreground text-sm font-semibold">{dayName}</p>
            <p className="text-muted-foreground text-[10px]">
              {monthName} {dayNum}, {yearNum}
              {isToday ? ` · ${tc('today')}` : ''}
            </p>
          </div>
          <button
            onClick={nextDay}
            className="text-muted-foreground hover:bg-muted flex size-7 items-center justify-center rounded-lg transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="w-10" />
      </div>

      {/* Active cycle */}
      {activeCycle && (
        <div
          className="mb-3 rounded-xl px-3 py-2 text-xs"
          style={{
            backgroundColor: activeCycle.color + '15',
            color: activeCycle.color,
            borderColor: activeCycle.color + '30',
            borderWidth: 1,
          }}
        >
          {activeCycle.name} — {activeCycle.notes || t('training_cycle')}
        </div>
      )}

      {/* Events list */}
      {dayEvents.length === 0 && allWorkouts.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
          <Dumbbell size={32} className="mb-2 opacity-20" />
          <p className="text-xs font-medium">{t('nothing_scheduled')}</p>
          <p className="mt-0.5 text-[10px]">{t('tap_to_add_event')}</p>
        </div>
      ) : dayEvents.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-8">
          <p className="text-xs font-medium">{t('nothing_scheduled_day')}</p>
          <p className="mt-0.5 text-[10px]">{t('schedule_or_rest')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {dayEvents.map((ev, i) => (
            <EventCard
              key={ev.id}
              event={ev}
              index={i}
              onMark={(status) => {
                if (ev.type === 'workout' && !ev.id.startsWith('hist-')) {
                  markWorkout(ev.id, status);
                }
              }}
              onRemove={() => {
                if (
                  !ev.id.startsWith('hist-') &&
                  !ev.id.startsWith('w-') &&
                  !ev.id.startsWith('ms-') &&
                  !ev.id.startsWith('m-')
                ) {
                  removeEvent(ev.id);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-4 space-y-1.5">
        <p className="text-muted-foreground px-1 text-[10px] font-medium">{t('quick_actions')}</p>

        {allWorkouts.map((w) => {
          const alreadyScheduled = dayEvents.some(
            (e) => e.workoutId === w.id && e.type === 'workout',
          );
          return !alreadyScheduled ? (
            <button
              key={w.id}
              onClick={() => scheduleWorkout(dateStr, w.id, w.name)}
              className="border-border/50 text-muted-foreground hover:bg-muted/50 flex w-full items-center gap-3 rounded-xl border border-dashed px-3 py-2 text-left text-xs transition-colors"
            >
              <Plus size={12} className="text-primary" />
              <span>{t('schedule_workout', { name: w.name })}</span>
            </button>
          ) : null;
        })}

        <button
          onClick={() => addRestDay(dateStr)}
          className="border-border/50 text-muted-foreground hover:bg-muted/50 flex w-full items-center gap-3 rounded-xl border border-dashed px-3 py-2 text-left text-xs transition-colors"
        >
          <Moon size={12} className="text-blue-500" />
          <span>{t('mark_rest_day')}</span>
        </button>

        <Link
          href={`/progress/weight`}
          className="border-border/50 text-muted-foreground hover:bg-muted/50 flex w-full items-center gap-3 rounded-xl border border-dashed px-3 py-2 text-left text-xs transition-colors"
        >
          <Weight size={12} className="text-green-500" />
          <span>{t('log_weight')}</span>
        </Link>

        <Link
          href={`/progress/measurements`}
          className="border-border/50 text-muted-foreground hover:bg-muted/50 flex w-full items-center gap-3 rounded-xl border border-dashed px-3 py-2 text-left text-xs transition-colors"
        >
          <Ruler size={12} className="text-purple-500" />
          <span>{t('log_measurements')}</span>
        </Link>
      </div>
    </div>
  );
}

function EventCard({
  event: ev,
  index,
  onMark,
  onRemove,
}: {
  event: {
    id: string;
    type: string;
    status: string;
    workoutName?: string;
    workoutId?: string;
    notes?: string;
    completedWorkoutId?: string;
  };
  index: number;
  onMark: (status: 'completed' | 'missed' | 'skipped') => void;
  onRemove: () => void;
}) {
  const t = useTranslations('calendar');
  const tc = useTranslations('common');
  const isWorkout = ev.type === 'workout';
  const isCompleted = ev.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-2xl border p-3.5 ${
        isCompleted
          ? 'border-green-500/30 bg-green-500/5'
          : ev.status === 'missed'
            ? 'border-red-500/30 bg-red-500/5'
            : ev.type === 'rest'
              ? 'border-blue-500/30 bg-blue-500/5'
              : 'border-border/50 bg-card'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
            isCompleted
              ? 'bg-green-500 text-white'
              : ev.status === 'missed'
                ? 'bg-red-500 text-white'
                : ev.type === 'rest'
                  ? 'bg-blue-500/10 text-blue-500'
                  : ev.type === 'weight_log'
                    ? 'bg-green-500/10 text-green-500'
                    : ev.type === 'measurement'
                      ? 'bg-purple-500/10 text-purple-500'
                      : 'bg-primary/10 text-primary'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 size={18} />
          ) : ev.status === 'missed' ? (
            <XCircle size={18} />
          ) : ev.type === 'rest' ? (
            <Moon size={18} />
          ) : ev.type === 'weight_log' ? (
            <Weight size={18} />
          ) : ev.type === 'measurement' ? (
            <Ruler size={18} />
          ) : ev.type === 'note' ? (
            <StickyNote size={18} />
          ) : (
            <Dumbbell size={18} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-foreground text-sm font-semibold">
              {ev.workoutName || ev.type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </p>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                isCompleted
                  ? 'bg-green-500/10 text-green-600'
                  : ev.status === 'missed'
                    ? 'bg-red-500/10 text-red-600'
                    : ev.status === 'scheduled'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
              }`}
            >
              {ev.status}
            </span>
          </div>
          {ev.notes && <p className="text-muted-foreground mt-0.5 text-[10px]">{ev.notes}</p>}
        </div>
      </div>

      {/* Actions for scheduled workouts */}
      {isWorkout && ev.status === 'scheduled' && !ev.id.startsWith('hist-') && (
        <div className="mt-3 flex gap-1.5">
          <button
            onClick={() => onMark('completed')}
            className="flex items-center gap-1 rounded-lg bg-green-500/10 px-2.5 py-1.5 text-[10px] font-medium text-green-600 transition-colors hover:bg-green-500/20"
          >
            <CheckCircle2 size={12} /> {t('complete')}
          </button>
          <button
            onClick={() => onMark('missed')}
            className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1.5 text-[10px] font-medium text-red-600 transition-colors hover:bg-red-500/20"
          >
            <XCircle size={12} /> {t('missed')}
          </button>
          <Link
            href={`/workouts/${ev.workoutId}/edit`}
            className="bg-muted text-foreground hover:bg-muted/80 ml-auto flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-colors"
          >
            <Play size={12} /> {tc('start')}
          </Link>
        </div>
      )}

      {/* For completed workouts, show link */}
      {isCompleted && ev.completedWorkoutId && (
        <div className="mt-2">
          <Link
            href={`/workouts/${ev.completedWorkoutId}`}
            className="text-primary text-[10px] hover:underline"
          >
            {t('view_completed_workout')}
          </Link>
        </div>
      )}

      {/* Rest day actions */}
      {ev.type === 'rest' && !ev.id.startsWith('hist-') && (
        <button
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive mt-2 text-[10px] transition-colors"
        >
          {t('remove_rest_day')}
        </button>
      )}
    </motion.div>
  );
}
