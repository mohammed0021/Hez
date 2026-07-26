'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarStore } from '@/stores/calendar-store';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';
import { useWeightStore } from '@/stores/weight-store';
import { useMeasurementStore } from '@/stores/measurement-store';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDateKey(date?: Date): string {
  return (date || new Date()).toISOString().slice(0, 10);
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-primary',
  completed: 'bg-green-500',
  missed: 'bg-red-500',
  skipped: 'bg-amber-500',
};

function useCalendarDays(month: number, year: number) {
  return useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => `b-${i}`);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { blanks, days, firstDay, daysInMonth };
  }, [month, year]);
}

export function MonthlyView({
  onSelectDate,
}: {
  onSelectDate?: (date: string) => void;
}) {
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());

  const events = useCalendarStore((s) => s.events);
  const recurringSchedules = useCalendarStore((s) => s.recurringSchedules);
  const trainingCycles = useCalendarStore((s) => s.trainingCycles);
  const generateEventsFromRecurring = useCalendarStore((s) => s.generateEventsFromRecurring);

  const historySessions = useWorkoutHistoryStore((s) => s.sessions);
  const weightEntries = useWeightStore((s) => s.entries);
  const measurementEntries = useMeasurementStore((s) => s.entries);

  const { blanks, days } = useCalendarDays(month, year);

  const todayStr = getDateKey();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const generateRecurring = () => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    generateEventsFromRecurring(getDateKey(start), getDateKey(end));
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
          type: 'workout',
          status: 'completed',
          workoutName: ws.name,
          completedWorkoutId: ws.id,
        });
      }
    }
    for (const w of weightToday) {
      if (!merged.some((m) => m.type === 'weight_log' && m.notes?.includes(w.id))) {
        merged.push({
          id: `w-${w.id}`,
          date: dateStr,
          type: 'weight_log',
          status: 'completed',
          notes: `${w.weightKg}kg`,
        });
      }
    }
    for (const m of measurementToday) {
      if (!merged.some((em) => em.type === 'measurement' && em.notes?.includes(m.id))) {
        merged.push({
          id: `m-${m.id}`,
          date: dateStr,
          type: 'measurement',
          status: 'completed',
        });
      }
    }
    return { dateStr, events: merged };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-semibold text-foreground">{monthNames[month]} {year}</p>
        <button onClick={nextMonth} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Training cycle bar */}
      {trainingCycles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {trainingCycles.map((cycle) => {
            const cycleStart = parseDate(cycle.startDate);
            const cycleEnd = parseDate(cycle.endDate);
            const inView = cycleStart.getFullYear() === year ||
              cycleEnd.getFullYear() === year ||
              (cycleStart < new Date(year, month + 1, 0) && cycleEnd > new Date(year, month, 1));
            if (!inView) return null;
            return (
              <div key={cycle.id} className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-medium"
                style={{ backgroundColor: cycle.color + '20', color: cycle.color }}>
                <div className="size-1.5 rounded-full" style={{ backgroundColor: cycle.color }} />
                {cycle.name}
              </div>
            );
          })}
        </div>
      )}

      {/* Recurring generate button */}
      {recurringSchedules.some((r) => r.active) && (
        <button onClick={generateRecurring}
          className="mb-3 w-full rounded-lg bg-muted py-1.5 text-[10px] font-medium text-muted-foreground hover:bg-muted/80 transition-colors">
          Generate recurring workouts for this month
        </button>
      )}

      <div className="grid grid-cols-7 gap-px">
        {weekDays.map((d) => (
          <div key={d} className="py-1 text-center text-[10px] font-medium text-muted-foreground">{d[0]}</div>
        ))}
        {blanks.map((k) => <div key={k} />)}
        {days.map((d) => {
          const { dateStr, events: dayEvents } = getEventsForDay(d);
          const isToday = dateStr === todayStr;
          const cycle = trainingCycles.find((c) => dateStr >= c.startDate && dateStr <= c.endDate);

          return (
            <button
              key={d}
              onClick={() => onSelectDate?.(dateStr)}
              className={`relative flex flex-col items-center rounded-lg py-1 text-xs transition-colors min-h-[52px] ${
                isToday ? 'bg-primary/15 font-semibold ring-1 ring-primary/30' : 'hover:bg-muted'
              }`}
              style={cycle && !isToday ? { backgroundColor: cycle.color + '08' } : undefined}
            >
              <span className={`${isToday ? 'flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]' : ''}`}>
                {d}
              </span>
              <div className="mt-0.5 flex flex-wrap justify-center gap-px px-0.5">
                {dayEvents.slice(0, 4).map((ev, i) => (
                  <div key={i} className={`size-1 rounded-full ${STATUS_COLORS[ev.status] || 'bg-muted-foreground'}`}
                    title={`${ev.type}: ${ev.workoutName || ev.notes || ev.status}`} />
                ))}
                {dayEvents.length > 4 && (
                  <span className="text-[6px] text-muted-foreground">+{dayEvents.length - 4}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y!, m! - 1, d!);
}
