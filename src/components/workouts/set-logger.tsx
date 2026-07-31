'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface SetLoggerProps {
  defaultWeight: number;
  defaultReps: number;
  defaultRpe: number | null;
  setNumber: number;
  totalSets: number;
  onComplete: (weight: number, reps: number, rpe: number | null) => void;
  onSkip: () => void;
}

const RPE_OPTIONS = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

export function SetLogger({
  defaultWeight,
  defaultReps,
  defaultRpe,
  setNumber,
  totalSets,
  onComplete,
  onSkip,
}: SetLoggerProps) {
  const t = useTranslations('workouts');
  const c = useTranslations('common');
  const [weight, setWeight] = useState(defaultWeight || '');
  const [reps, setReps] = useState(defaultReps || '');
  const [rpe, setRpe] = useState<number | null>(defaultRpe);

  const handleComplete = () => {
    const w = parseFloat(weight as string) || 0;
    const r = parseInt(reps as string) || 0;
    onComplete(w, r, rpe);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={`set-${setNumber}`}
      className="space-y-6"
    >
      <div className="text-center">
        <p className="text-muted-foreground text-xs">
          {t('set_of', { number: setNumber, total: totalSets })}
        </p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-muted-foreground mb-1.5 block text-center text-[10px] font-medium tracking-wider uppercase">
            {t('weight')} (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border-border/30 bg-card text-foreground focus:border-primary/40 w-full [appearance:textfield] rounded-2xl border px-4 py-4 text-center text-2xl font-bold focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="0"
            autoFocus
            inputMode="decimal"
          />
        </div>
        <div className="flex-1">
          <label className="text-muted-foreground mb-1.5 block text-center text-[10px] font-medium tracking-wider uppercase">
            {t('reps')}
          </label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="border-border/30 bg-card text-foreground focus:border-primary/40 w-full [appearance:textfield] rounded-2xl border px-4 py-4 text-center text-2xl font-bold focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="0"
            inputMode="numeric"
          />
        </div>
      </div>

      <div>
        <label className="text-muted-foreground mb-2 block text-center text-[10px] font-medium tracking-wider uppercase">
          RPE ({c('optional')})
        </label>
        <div className="flex flex-wrap justify-center gap-1.5">
          {RPE_OPTIONS.map((v) => (
            <button
              key={v}
              onClick={() => setRpe(rpe === v ? null : v)}
              className={`size-9 rounded-xl text-xs font-bold transition-all ${
                rpe === v
                  ? 'bg-primary text-primary-foreground scale-110'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onSkip}
          className="bg-muted text-muted-foreground flex-1 rounded-xl py-3.5 text-sm font-medium transition-transform active:scale-95"
        >
          {t('skip')}
        </button>
        <button
          onClick={handleComplete}
          className="bg-primary text-primary-foreground shadow-primary/25 flex-1 rounded-xl py-3.5 text-sm font-medium shadow-lg transition-transform active:scale-95"
        >
          {t('complete_set')}
        </button>
      </div>
    </motion.div>
  );
}
