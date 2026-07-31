import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CalendarEventStatus = 'scheduled' | 'completed' | 'missed' | 'skipped';
export type CalendarEventType = 'workout' | 'rest' | 'weight_log' | 'measurement' | 'note';

export interface CalendarEvent {
  id: string;
  date: string;
  type: CalendarEventType;
  status: CalendarEventStatus;
  workoutId?: string;
  workoutName?: string;
  notes?: string;
  completedWorkoutId?: string;
  cycleId?: string;
}

export interface RecurringSchedule {
  id: string;
  name: string;
  daysOfWeek: number[];
  workoutId: string;
  workoutName: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
}

export interface TrainingCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  notes?: string;
}

function uid() {
  return Math.random().toString(36).substring(2, 10);
}

function getDateKey(date?: Date): string {
  return (date || new Date()).toISOString().slice(0, 10);
}

function getDayOfWeek(date?: Date): number {
  return (date || new Date()).getDay();
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y!, m! - 1, d!);
}

interface CalendarState {
  events: CalendarEvent[];
  recurringSchedules: RecurringSchedule[];
  trainingCycles: TrainingCycle[];

  addEvent: (event: Omit<CalendarEvent, 'id'>) => string;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  removeEvent: (id: string) => void;
  getEventsForDate: (date: string) => CalendarEvent[];
  getEventsForRange: (start: string, end: string) => CalendarEvent[];

  scheduleWorkout: (date: string, workoutId: string, workoutName: string) => void;
  markWorkout: (eventId: string, status: CalendarEventStatus, completedWorkoutId?: string) => void;
  addRestDay: (date: string, notes?: string) => void;
  addNote: (date: string, notes: string) => void;

  addRecurringSchedule: (schedule: Omit<RecurringSchedule, 'id'>) => string;
  updateRecurringSchedule: (id: string, updates: Partial<RecurringSchedule>) => void;
  removeRecurringSchedule: (id: string) => void;
  generateEventsFromRecurring: (startDate: string, endDate: string) => void;

  addTrainingCycle: (cycle: Omit<TrainingCycle, 'id'>) => string;
  updateTrainingCycle: (id: string, updates: Partial<TrainingCycle>) => void;
  removeTrainingCycle: (id: string) => void;
  getActiveCycle: (date: string) => TrainingCycle | undefined;

  clear: () => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: [],
      recurringSchedules: [],
      trainingCycles: [],

      addEvent: (event) => {
        const id = uid();
        set((s) => ({ events: [...s.events, { ...event, id }] }));
        return id;
      },

      updateEvent: (id, updates) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),

      removeEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

      getEventsForDate: (date) => get().events.filter((e) => e.date === date),

      getEventsForRange: (start, end) =>
        get().events.filter((e) => e.date >= start && e.date <= end),

      scheduleWorkout: (date, workoutId, workoutName) => {
        const id = uid();
        set((s) => ({
          events: [
            ...s.events,
            { id, date, type: 'workout', status: 'scheduled', workoutId, workoutName },
          ],
        }));
      },

      markWorkout: (eventId, status, completedWorkoutId) =>
        set((s) => ({
          events: s.events.map((e) =>
            e.id === eventId ? { ...e, status, completedWorkoutId } : e,
          ),
        })),

      addRestDay: (date, notes) => {
        const id = uid();
        set((s) => ({
          events: [...s.events, { id, date, type: 'rest', status: 'scheduled', notes }],
        }));
      },

      addNote: (date, notes) => {
        const id = uid();
        set((s) => ({
          events: [...s.events, { id, date, type: 'note', status: 'scheduled', notes }],
        }));
      },

      addRecurringSchedule: (schedule) => {
        const id = uid();
        set((s) => ({ recurringSchedules: [...s.recurringSchedules, { ...schedule, id }] }));
        return id;
      },

      updateRecurringSchedule: (id, updates) =>
        set((s) => ({
          recurringSchedules: s.recurringSchedules.map((r) =>
            r.id === id ? { ...r, ...updates } : r,
          ),
        })),

      removeRecurringSchedule: (id) =>
        set((s) => ({
          recurringSchedules: s.recurringSchedules.filter((r) => r.id !== id),
        })),

      generateEventsFromRecurring: (startDate, endDate) => {
        const { recurringSchedules, events } = get();
        const existingKeys = new Set(events.map((e) => `${e.date}-${e.workoutId || ''}`));

        const newEvents: CalendarEvent[] = [];
        const start = parseDate(startDate);
        const end = parseDate(endDate);

        for (const schedule of recurringSchedules) {
          if (!schedule.active) continue;
          const current = new Date(start);
          while (current <= end) {
            const dateStr = getDateKey(current);
            const day = getDayOfWeek(current);
            if (schedule.daysOfWeek.includes(day)) {
              const key = `${dateStr}-${schedule.workoutId}`;
              if (
                !existingKeys.has(key) &&
                (!schedule.startDate || dateStr >= schedule.startDate) &&
                (!schedule.endDate || dateStr <= schedule.endDate)
              ) {
                newEvents.push({
                  id: uid(),
                  date: dateStr,
                  type: 'workout',
                  status: 'scheduled',
                  workoutId: schedule.workoutId,
                  workoutName: schedule.workoutName,
                });
              }
            }
            current.setDate(current.getDate() + 1);
          }
        }

        if (newEvents.length > 0) {
          set((s) => ({ events: [...s.events, ...newEvents] }));
        }
      },

      addTrainingCycle: (cycle) => {
        const id = uid();
        set((s) => ({ trainingCycles: [...s.trainingCycles, { ...cycle, id }] }));
        return id;
      },

      updateTrainingCycle: (id, updates) =>
        set((s) => ({
          trainingCycles: s.trainingCycles.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      removeTrainingCycle: (id) =>
        set((s) => ({
          trainingCycles: s.trainingCycles.filter((c) => c.id !== id),
        })),

      getActiveCycle: (date) =>
        get().trainingCycles.find((c) => date >= c.startDate && date <= c.endDate),

      clear: () => set({ events: [], recurringSchedules: [], trainingCycles: [] }),
    }),
    {
      name: 'hez-calendar-store',
      partialize: (s) => ({
        events: s.events,
        recurringSchedules: s.recurringSchedules,
        trainingCycles: s.trainingCycles,
      }),
    },
  ),
);
