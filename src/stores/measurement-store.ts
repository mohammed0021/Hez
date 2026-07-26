import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MeasurementEntry {
  id: string;
  date: string;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  leftArm: number | null;
  rightArm: number | null;
  leftThigh: number | null;
  rightThigh: number | null;
  leftCalf: number | null;
  rightCalf: number | null;
  shoulders: number | null;
  neck: number | null;
  notes: string;
}

export const MEASUREMENT_FIELDS: { key: keyof MeasurementEntry; label: string }[] = [
  { key: 'chest', label: 'Chest' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'leftArm', label: 'Left Arm' },
  { key: 'rightArm', label: 'Right Arm' },
  { key: 'leftThigh', label: 'Left Thigh' },
  { key: 'rightThigh', label: 'Right Thigh' },
  { key: 'leftCalf', label: 'Left Calf' },
  { key: 'rightCalf', label: 'Right Calf' },
  { key: 'shoulders', label: 'Shoulders' },
  { key: 'neck', label: 'Neck' },
];

interface MeasurementState {
  entries: MeasurementEntry[];
  addEntry: (entry: Omit<MeasurementEntry, 'id'>) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, entries: Partial<MeasurementEntry>) => void;
  clear: () => void;
}

function uid() {
  return Math.random().toString(36).substring(2, 10);
}

export const useMeasurementStore = create<MeasurementState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((s) => ({
          entries: [...s.entries, { ...entry, id: uid() }].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        })),
      deleteEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      updateEntry: (id, updates) =>
        set((s) => ({
          entries: s.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      clear: () => set({ entries: [] }),
    }),
    { name: 'hez-measurement-store', partialize: (s) => ({ entries: s.entries }) },
  ),
);
