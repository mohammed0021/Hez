import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  time: string;
  stock: number;
  refillThreshold: number;
  color: string;
  isDefault: boolean;
}

export type TakenStatus = 'taken' | 'missed' | 'skipped';

export interface SupplementLog {
  date: string;
  supplements: Record<string, TakenStatus>;
}

export interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

const DEFAULT_SUPPLEMENTS: Supplement[] = [
  {
    id: 's1',
    name: 'Creatine Monohydrate',
    dosage: '5g',
    time: 'Morning',
    stock: 60,
    refillThreshold: 10,
    color: 'bg-blue-500',
    isDefault: true,
  },
  {
    id: 's2',
    name: 'Whey Protein',
    dosage: '1 scoop',
    time: 'Post-workout',
    stock: 30,
    refillThreshold: 5,
    color: 'bg-green-500',
    isDefault: true,
  },
  {
    id: 's3',
    name: 'Omega-3',
    dosage: '2 capsules',
    time: 'With meals',
    stock: 60,
    refillThreshold: 10,
    color: 'bg-amber-500',
    isDefault: true,
  },
  {
    id: 's4',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    time: 'Morning',
    stock: 90,
    refillThreshold: 15,
    color: 'bg-purple-500',
    isDefault: true,
  },
  {
    id: 's5',
    name: 'Magnesium',
    dosage: '400mg',
    time: 'Before bed',
    stock: 60,
    refillThreshold: 10,
    color: 'bg-rose-500',
    isDefault: true,
  },
  {
    id: 's6',
    name: 'Electrolytes',
    dosage: '1 tablet',
    time: 'During workout',
    stock: 30,
    refillThreshold: 5,
    color: 'bg-cyan-500',
    isDefault: true,
  },
];

function uid() {
  return Math.random().toString(36).substring(2, 10);
}

function getDateKey(date?: Date): string {
  return (date || new Date()).toISOString().slice(0, 10);
}

function getDaysBetween(a: string, b: string): number {
  const da = new Date(a);
  const db = new Date(b);
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

interface SupplementState {
  supplements: Supplement[];
  logs: SupplementLog[];
  reminder: ReminderSettings;

  addSupplement: (s: Omit<Supplement, 'id' | 'isDefault'>) => void;
  updateSupplement: (id: string, updates: Partial<Supplement>) => void;
  deleteSupplement: (id: string) => void;

  markTaken: (supplementId: string, date?: string) => void;
  markMissed: (supplementId: string, date?: string) => void;
  unmark: (supplementId: string, date?: string) => void;

  setReminder: (settings: Partial<ReminderSettings>) => void;

  getTodayLog: () => Record<string, TakenStatus>;
  getStreak: () => number;
  getMissedThisWeek: () => { supplements: string[]; date: string }[];
  getHistory: (days?: number) => SupplementLog[];
  getStockStatus: () => { supplement: Supplement; percent: number }[];
}

export const useSupplementStore = create<SupplementState>()(
  persist(
    (set, get) => ({
      supplements: DEFAULT_SUPPLEMENTS,
      logs: [],
      reminder: { enabled: true, hour: 8, minute: 0 },

      addSupplement: (s) => {
        const sup: Supplement = { ...s, id: uid(), isDefault: false };
        set((state) => ({ supplements: [...state.supplements, sup] }));
      },

      updateSupplement: (id, updates) =>
        set((state) => ({
          supplements: state.supplements.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),

      deleteSupplement: (id) =>
        set((state) => ({
          supplements: state.supplements.filter((s) => s.id !== id),
        })),

      markTaken: (supplementId, date) => {
        const d = date || getDateKey();
        set((state) => {
          const existing = state.logs.find((l) => l.date === d);
          const updatedSupps: Record<string, TakenStatus> = existing
            ? { ...existing.supplements }
            : {};
          updatedSupps[supplementId] = 'taken';
          const newLog: SupplementLog = { date: d, supplements: updatedSupps };
          const logs = existing
            ? state.logs.map((l) => (l.date === d ? newLog : l))
            : [...state.logs, newLog];
          return { logs };
        });
      },

      markMissed: (supplementId, date) => {
        const d = date || getDateKey();
        set((state) => {
          const existing = state.logs.find((l) => l.date === d);
          const updatedSupps: Record<string, TakenStatus> = existing
            ? { ...existing.supplements }
            : {};
          updatedSupps[supplementId] = 'missed';
          const newLog: SupplementLog = { date: d, supplements: updatedSupps };
          const logs = existing
            ? state.logs.map((l) => (l.date === d ? newLog : l))
            : [...state.logs, newLog];
          return { logs };
        });
      },

      unmark: (supplementId, date) => {
        const d = date || getDateKey();
        set((state) => ({
          logs: state.logs.map((l) => {
            if (l.date !== d) return l;
            const supps = { ...l.supplements };
            delete supps[supplementId];
            return { ...l, supplements: supps };
          }),
        }));
      },

      setReminder: (settings) => set((state) => ({ reminder: { ...state.reminder, ...settings } })),

      getTodayLog: () => {
        const d = getDateKey();
        const log = get().logs.find((l) => l.date === d);
        return log?.supplements || {};
      },

      getStreak: () => {
        const logs = get().logs;
        if (logs.length === 0) return 0;
        const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
        let streak = 0;
        for (let i = 0; i < sorted.length; i++) {
          const log = sorted[i];
          if (!log) break;
          // Check if all supplements were taken
          const allTaken = Object.values(log.supplements).every((s) => s === 'taken');
          if (!allTaken) break;
          if (i === 0) {
            streak++;
            continue;
          }
          const prev = sorted[i - 1]!;
          const diff = getDaysBetween(log.date, prev.date);
          if (diff === 1) streak++;
          else break;
        }
        return streak;
      },

      getMissedThisWeek: () => {
        const missed: { supplements: string[]; date: string }[] = [];
        const d = new Date();
        d.setDate(d.getDate() - d.getDay());
        for (let i = 0; i < 7; i++) {
          const dateStr = d.toISOString().slice(0, 10);
          const log = get().logs.find((l) => l.date === dateStr);
          if (log) {
            const missedSup = Object.entries(log.supplements)
              .filter(([, status]) => status === 'missed')
              .map(([id]) => {
                const sup = get().supplements.find((s) => s.id === id);
                return sup?.name || id;
              });
            if (missedSup.length > 0) missed.push({ supplements: missedSup, date: dateStr });
          }
          d.setDate(d.getDate() + 1);
        }
        return missed;
      },

      getHistory: (days = 30) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);
        return get()
          .logs.filter(
            (l) =>
              l.date >= start.toISOString().slice(0, 10) &&
              l.date <= end.toISOString().slice(0, 10),
          )
          .sort((a, b) => b.date.localeCompare(a.date));
      },

      getStockStatus: () => {
        return get().supplements.map((s) => ({
          supplement: s,
          percent: s.stock > 0 ? Math.round((s.stock / (s.stock + s.refillThreshold)) * 100) : 0,
        }));
      },
    }),
    {
      name: 'hez-supplement-store',
      partialize: (s) => ({ supplements: s.supplements, logs: s.logs, reminder: s.reminder }),
    },
  ),
);
