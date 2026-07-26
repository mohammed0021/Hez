'use client';

import { Dumbbell, Plus, Clock, Bookmark, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useWorkoutStore } from '@/stores/workout-store';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';
import { starterTemplates } from '@/data/workout-templates';

export default function WorkoutsPage() {
  const savedWorkouts = useWorkoutStore((s) => s.savedWorkouts);
  const userTemplates = useWorkoutStore((s) => s.templates);
  const startWorkout = useActiveWorkoutStore((s) => s.startWorkout);
  const allTemplates = [...starterTemplates, ...userTemplates];

  const allWorkouts = [...savedWorkouts].reverse();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workouts</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{allWorkouts.length} saved workouts</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/workouts/templates"
            className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/80"
          >
            <Bookmark size={14} /> Templates
          </Link>
          <Link
            href="/workouts/new"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
          >
            <Plus size={14} /> New
          </Link>
        </div>
      </div>

      {/* Quick start from template */}
      {allTemplates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 }}
          className="mt-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4"
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-2">Quick Start</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {allTemplates.slice(0, 5).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  startWorkout(t);
                  window.location.href = '/workouts/active';
                }}
                className="shrink-0 rounded-xl bg-card/80 border border-border/50 px-4 py-3 text-left hover:bg-card transition-colors"
              >
                <p className="text-sm font-medium text-foreground whitespace-nowrap">{t.name}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">~{t.estimatedDuration} min</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Saved workouts */}
      <h2 className="mt-7 mb-3 text-sm font-semibold text-foreground">Saved Workouts</h2>
      <div className="space-y-2">
        {allWorkouts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card p-10">
            <Dumbbell size={36} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No saved workouts yet</p>
            <Link
              href="/workouts/new"
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
            >
              <Plus size={14} /> Create your first workout
            </Link>
          </div>
        ) : (
          allWorkouts.map((w, i) => {
            const totalSets = w.blocks.reduce((s, b) => s + b.exercises.reduce((se, e) => se + e.sets.length, 0), 0);
            return (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/workouts/${w.id}`}
                    className="flex items-center gap-4 rounded-2xl bg-card p-4 border border-border/50"
                  >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                      <Dumbbell size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{w.name}</p>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock size={12} /> ~{w.estimatedDuration} min</span>
                        <span>{w.blocks.length} blocks</span>
                        <span>{totalSets} sets</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        startWorkout(w);
                        window.location.href = '/workouts/active';
                      }}
                      className="flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-[10px] font-medium text-primary-foreground"
                    >
                      <Zap size={12} /> Start
                    </button>
                  </Link>
                </motion.div>
            );
          })
        )}
      </div>
    </>
  );
}
