import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProgressPhoto {
  id: string;
  date: string;
  title: string;
  dataUrl: string;
  tags: string[];
}

interface PhotoState {
  photos: ProgressPhoto[];
  addPhoto: (photo: Omit<ProgressPhoto, 'id'>) => void;
  deletePhoto: (id: string) => void;
  updatePhoto: (id: string, updates: Partial<ProgressPhoto>) => void;
  clear: () => void;
}

function uid() {
  return Math.random().toString(36).substring(2, 10);
}

export const usePhotoStore = create<PhotoState>()(
  persist(
    (set) => ({
      photos: [],
      addPhoto: (photo) =>
        set((s) => ({
          photos: [...s.photos, { ...photo, id: uid() }].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        })),
      deletePhoto: (id) => set((s) => ({ photos: s.photos.filter((p) => p.id !== id) })),
      updatePhoto: (id, updates) =>
        set((s) => ({
          photos: s.photos.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      clear: () => set({ photos: [] }),
    }),
    { name: 'hez-photo-store', partialize: (s) => ({ photos: s.photos }) },
  ),
);
