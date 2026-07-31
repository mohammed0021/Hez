'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { NotebookText, ArrowLeft, Users, Clock, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

const PROGRAMS = [
  {
    id: '1',
    name: 'Beginner Full Body',
    weeks: 4,
    daysPerWeek: 3,
    difficulty: 'Beginner',
    enrolled: 128,
    description:
      'A perfect starting point for anyone new to fitness. Build foundational strength with full-body workouts.',
  },
  {
    id: '2',
    name: 'Push Pull Legs',
    weeks: 8,
    daysPerWeek: 6,
    difficulty: 'Intermediate',
    enrolled: 342,
    description:
      'The classic PPL split for balanced muscle development. Hit each muscle group twice per week.',
  },
  {
    id: '3',
    name: 'Upper Lower Split',
    weeks: 6,
    daysPerWeek: 4,
    difficulty: 'Intermediate',
    enrolled: 215,
    description: 'Alternate between upper and lower body days for focused intensity and recovery.',
  },
  {
    id: '4',
    name: 'Strength Foundation',
    weeks: 12,
    daysPerWeek: 4,
    difficulty: 'Advanced',
    enrolled: 89,
    description:
      'Progressive overload program focused on the big lifts: squat, bench, deadlift, and overhead press.',
  },
];

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-green-500/10 text-green-500',
  Intermediate: 'bg-blue-500/10 text-blue-500',
  Advanced: 'bg-orange-500/10 text-orange-500',
};

export default function ProgramDetailPage() {
  const t = useTranslations('programs');
  const tc = useTranslations('common');
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const program = PROGRAMS.find((p) => p.id === id);

  if (!program) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <NotebookText size={48} className="text-muted-foreground/30" />
        <p className="text-muted-foreground text-sm">{t('not_found')}</p>
        <Button variant="outline" onClick={() => router.push('/programs')}>
          {t('back_to_programs')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => router.back()}
        className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        {tc('back')}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 flex size-14 items-center justify-center rounded-2xl">
            <NotebookText size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-foreground text-2xl font-bold">{program.name}</h1>
            <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${difficultyColors[program.difficulty] || ''}`}
              >
                {program.difficulty}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {t('weeks', { count: program.weeks })}
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} /> {t('enrolled', { count: program.enrolled })}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card border-border/50 rounded-2xl border p-5">
          <p className="text-foreground text-sm leading-relaxed">{program.description}</p>
        </div>

        <div className="bg-card border-border/50 rounded-2xl border p-5">
          <p className="text-muted-foreground/60 mb-3 text-[10px] font-medium tracking-wider uppercase">
            {t('details')}
          </p>
          <div className="space-y-3">
            {[
              { label: t('duration'), value: t('weeks', { count: program.weeks }) },
              { label: t('days_per_week'), value: `${program.daysPerWeek}` },
              { label: t('difficulty'), value: program.difficulty },
              { label: t('total_workouts'), value: `${program.weeks * program.daysPerWeek}` },
            ].map((d) => (
              <div key={d.label} className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{d.label}</span>
                <span className="text-foreground text-sm font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <Button size="lg" className="w-full" onClick={() => router.push('/programs')}>
          {t('enroll_in_program')}
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </motion.div>
    </>
  );
}
