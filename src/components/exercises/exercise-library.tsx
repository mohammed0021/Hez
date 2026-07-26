'use client';

import { useMemo, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useState } from 'react';
import { Dumbbell, Heart, Clock, SearchX } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useExerciseStore } from '@/stores/exercise-store';
import exercises from '@/data/exercises';
import { ExerciseCard } from '@/components/exercises/exercise-card';
import { ExerciseSearch } from '@/components/exercises/exercise-search';
import { ExerciseFilters } from '@/components/exercises/exercise-filters';

const RecentlyUsed = dynamic(
  () => import('@/components/exercises/recently-used').then((m) => ({ default: m.RecentlyUsed })),
  { ssr: false },
);
const ExerciseMediaViewer = dynamic(
  () =>
    import('@/components/exercises/exercise-media-viewer').then((m) => ({
      default: m.ExerciseMediaViewer,
    })),
  { ssr: false },
);

const TABS = [
  { id: 'all', label: 'All Exercises', icon: Dumbbell },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'recent', label: 'Recent', icon: Clock },
] as const;

const CARD_HEIGHT = 280;
const COLUMN_COUNT = 3;

export function ExerciseLibrary() {
  const searchQuery = useExerciseStore((s) => s.searchQuery);
  const filters = useExerciseStore((s) => s.activeFilters);
  const favorites = useExerciseStore((s) => s.favorites);
  const recentlyUsed = useExerciseStore((s) => s.recentlyUsed);
  const [activeTab, setActiveTab] = useState<string>('all');
  const parentRef = useRef<HTMLDivElement>(null);

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
      result = result.filter((e) => filters.muscleGroups.some((mg) => e.muscleGroups.includes(mg)));
    }

    if (filters.equipment.length > 0) {
      result = result.filter((e) => filters.equipment.some((eq) => e.equipment.includes(eq)));
    }

    if (filters.difficulties.length > 0) {
      result = result.filter((e) => filters.difficulties.includes(e.difficulty));
    }

    return result;
  }, [searchQuery, filters, favorites, recentlyUsed, activeTab]);

  const rowCount = Math.ceil(filtered.length / COLUMN_COUNT);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_HEIGHT,
    overscan: 3,
  });

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      virtualizer.scrollToIndex(0);
    },
    [virtualizer],
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Exercise Library</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{exercises.length} exercises</p>
        </div>
      </div>

      <div className="flex gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
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
      </div>

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
            <div className="border-border/50 bg-card flex flex-col items-center gap-3 rounded-2xl border p-12">
              <SearchX size={40} className="text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm">No exercises match your search</p>
              <button
                onClick={() => useExerciseStore.getState().clearFilters()}
                className="bg-muted text-foreground rounded-xl px-4 py-2 text-xs"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div
              ref={parentRef}
              className="overflow-auto"
              style={{ maxHeight: `${Math.min(rowCount * CARD_HEIGHT, 1600)}px` }}
            >
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const rowIndex = virtualRow.index;
                  const rowItems = filtered.slice(
                    rowIndex * COLUMN_COUNT,
                    (rowIndex + 1) * COLUMN_COUNT,
                  );
                  return (
                    <div
                      key={rowIndex}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
                        {rowItems.map((exercise) => (
                          <ExerciseCard key={exercise.id} exercise={exercise} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="border-border/50 bg-card rounded-2xl border p-4">
              <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                Browse by Muscle
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {['Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core', 'Full Body'].map(
                  (group) => {
                    const active = filters.muscleGroups.includes(group);
                    return (
                      <button
                        key={group}
                        onClick={() =>
                          useExerciseStore
                            .getState()
                            .setMuscleGroupFilter(
                              active ? filters.muscleGroups.filter((g) => g !== group) : [group],
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
                  },
                )}
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
