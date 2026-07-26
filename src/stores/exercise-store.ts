import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExerciseFilter, Difficulty, ExerciseCategory } from '@/types/exercise';

interface ExerciseState {
  searchQuery: string;
  activeFilters: ExerciseFilter;
  selectedExerciseId: string | null;
  favorites: string[];
  recentlyUsed: string[];
  mediaViewerOpen: boolean;
  mediaViewerIndex: number;

  setSearchQuery: (query: string) => void;
  setMuscleGroupFilter: (groups: string[]) => void;
  setEquipmentFilter: (equipment: string[]) => void;
  setDifficultyFilter: (difficulties: Difficulty[]) => void;
  setCategoryFilter: (category: ExerciseCategory | null) => void;
  clearFilters: () => void;
  selectExercise: (id: string | null) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addRecentlyUsed: (id: string) => void;
  openMediaViewer: (index: number) => void;
  closeMediaViewer: () => void;
}

const defaultFilter: ExerciseFilter = {
  query: '',
  muscleGroups: [],
  equipment: [],
  difficulties: [],
  category: null,
};

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      searchQuery: '',
      activeFilters: { ...defaultFilter },
      selectedExerciseId: null,
      favorites: [],
      recentlyUsed: [],
      mediaViewerOpen: false,
      mediaViewerIndex: 0,

      setSearchQuery: (query) => set({ searchQuery: query }),

      setMuscleGroupFilter: (groups) =>
        set((s) => ({ activeFilters: { ...s.activeFilters, muscleGroups: groups } })),

      setEquipmentFilter: (equipment) =>
        set((s) => ({ activeFilters: { ...s.activeFilters, equipment } })),

      setDifficultyFilter: (difficulties) =>
        set((s) => ({ activeFilters: { ...s.activeFilters, difficulties } })),

      setCategoryFilter: (category) =>
        set((s) => ({ activeFilters: { ...s.activeFilters, category } })),

      clearFilters: () => set({ activeFilters: { ...defaultFilter }, searchQuery: '' }),

      selectExercise: (id) => set({ selectedExerciseId: id }),

      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),

      isFavorite: (id) => get().favorites.includes(id),

      addRecentlyUsed: (id) =>
        set((s) => ({
          recentlyUsed: [id, ...s.recentlyUsed.filter((r) => r !== id)].slice(0, 20),
        })),

      openMediaViewer: (index) => set({ mediaViewerOpen: true, mediaViewerIndex: index }),
      closeMediaViewer: () => set({ mediaViewerOpen: false }),
    }),
    {
      name: 'hez-exercise-store',
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyUsed: state.recentlyUsed,
      }),
    },
  ),
);
