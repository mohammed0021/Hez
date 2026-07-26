'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dumbbell, Heart, Clock, SearchX } from 'lucide-react';
import { useExerciseStore } from '@/stores/exercise-store';
import exercises from '@/data/exercises';
import { ExerciseCard } from '@/components/exercises/exercise-card';
import { ExerciseSearch } from '@/components/exercises/exercise-search';
import { ExerciseFilters } from '@/components/exercises/exercise-filters';
import { RecentlyUsed } from '@/components/exercises/recently-used';
import { ExerciseMediaViewer } from '@/components/exercises/exercise-media-viewer';

const TABS = [
  { id: 'all', label: 'All Exercises', icon: Dumbbell },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'recent', label: 'Recent', icon: Clock },
] as const;

export function ExerciseLibrary() {
  const searchQuery = useExerciseStore((s) => s.searchQuery);
  const filters = useExerciseStore((s) => s.activeFilters);
  const favorites = useExerciseStore((s) => s.favorites);
  const recentlyUsed = useExerciseStore((s) => s.recentlyUsed);
  const [activeTab, setActiveTab] = useState<string>('all');

  const filtered = useMemo(() => {
    let result = exercises;

    if (activeTab === 'favorites') {
      result = result.filter((e) => favorites.includes(e.id));
    } else if (activeTab === 'recent') {
      const order = new Map(recentlyUsed.map((id, i) => [id, i]));
      result = result.filter((e) => recentlyUsed.includes(e.id));
      result.sort((a, b) => (order.get(a.id) ?? Infinity) - (order.get(b.id) ?? Infinity));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.muscleGroups.some((m) => m.toLowerCase().includes(q)) ||
          e.equipment.some((eq) => eq.toLowerCase().includes(q)) ||
          e.description.toLowerCase().includes(q),
      );
    }

    if (filters.muscleGroups.length > 0) {
      result = result.filter((e) =>
        filters.muscleGroups.some((mg) => e.muscleGroups.includes(mg)),
      );
    }

    if (filters.equipment.length > 0) {
      result = result.filter((e) =>
        filters.equipment.some((eq) => e.equipment.includes(eq)),
      );
    }

    if (filters.difficulties.length > 0) {
      result = result.filter((e) =>
        filters.difficulties.includes(e.difficulty),
      );
    }

    return result;
  }, [searchQuery, filters, favorites, recentlyUsed, activeTab]);

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Exercise Library</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{exercises.length} exercises</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.02 }}
        className="flex gap-2"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon size={14} />
              {tab.label}
              {tab.id === 'favorites' && favorites.length > 0 && (
                <span className="ml-1 text-xs">{favorites.length}</span>
              )}
            </button>
          );
        })}
      </motion.div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <ExerciseSearch />
        </div>
        <ExerciseFilters />
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-3">
          {activeTab === 'all' && <RecentlyUsed />}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card p-12">
              <SearchX size={40} className="text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No exercises match your search</p>
              <button
                onClick={() => useExerciseStore.getState().clearFilters()}
                className="rounded-xl bg-muted px-4 py-2 text-xs text-foreground"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
              {filtered.map((exercise, i) => (
                <ExerciseCard key={exercise.id} exercise={exercise} index={i} />
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-border/50 bg-card p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Browse by Muscle
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {['Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core', 'Full Body'].map((group) => {
                  const active = filters.muscleGroups.includes(group);
                  return (
                    <button
                      key={group}
                      onClick={() =>
                        useExerciseStore
                          .getState()
                          .setMuscleGroupFilter(
                            active
                              ? filters.muscleGroups.filter((g) => g !== group)
                              : [group],
                          )
                      }
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {group}
                    </button>
                  );
                })}
              </div>
            </div>

            <RecentlyUsed />
          </div>
        </div>
      </div>

      <ExerciseMediaViewer />
    </div>
  );
}
