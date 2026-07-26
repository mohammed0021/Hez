'use client';

import { NotebookText, Users, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const programs = [
  { id: '1', name: 'Beginner Full Body', weeks: 4, daysPerWeek: 3, difficulty: 'Beginner', enrolled: 128 },
  { id: '2', name: 'Push Pull Legs', weeks: 8, daysPerWeek: 6, difficulty: 'Intermediate', enrolled: 342 },
  { id: '3', name: 'Upper Lower Split', weeks: 6, daysPerWeek: 4, difficulty: 'Intermediate', enrolled: 215 },
  { id: '4', name: 'Strength Foundation', weeks: 12, daysPerWeek: 4, difficulty: 'Advanced', enrolled: 89 },
];

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-green-500/10 text-green-500',
  Intermediate: 'bg-blue-500/10 text-blue-500',
  Advanced: 'bg-orange-500/10 text-orange-500',
};

export default function ProgramsPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-foreground">Programs</h2>
      <p className="mt-1 text-sm text-muted-foreground">Choose a structured program to follow</p>

      <div className="mt-6 space-y-3">
        {programs.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex w-full items-center gap-4 rounded-2xl bg-card p-4 border border-border/50 text-left"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <NotebookText size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{p.name}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${difficultyColors[p.difficulty] || ''}`}>
                  {p.difficulty}
                </span>
                <span className="flex items-center gap-1"><Clock size={12} /> {p.weeks} weeks</span>
                <span className="flex items-center gap-1"><Users size={12} /> {p.enrolled}</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>
    </>
  );
}
