'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

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

export function SetLogger({ defaultWeight, defaultReps, defaultRpe, setNumber, totalSets, onComplete, onSkip }: SetLoggerProps) {
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
        <p className="text-xs text-muted-foreground">Set {setNumber} of {totalSets}</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-[10px] font-medium text-muted-foreground mb-1.5 text-center uppercase tracking-wider">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-2xl border border-border/30 bg-card px-4 py-4 text-center text-2xl font-bold text-foreground focus:border-primary/40 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0"
            autoFocus
            inputMode="decimal"
          />
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-medium text-muted-foreground mb-1.5 text-center uppercase tracking-wider">
            Reps
          </label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full rounded-2xl border border-border/30 bg-card px-4 py-4 text-center text-2xl font-bold text-foreground focus:border-primary/40 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0"
            inputMode="numeric"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-medium text-muted-foreground mb-2 text-center uppercase tracking-wider">
          RPE (optional)
        </label>
        <div className="flex justify-center gap-1.5 flex-wrap">
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
          className="flex-1 rounded-xl bg-muted py-3.5 text-sm font-medium text-muted-foreground active:scale-95 transition-transform"
        >
          Skip
        </button>
        <button
          onClick={handleComplete}
          className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-medium text-primary-foreground active:scale-95 transition-transform shadow-lg shadow-primary/25"
        >
          Complete Set
        </button>
      </div>
    </motion.div>
  );
}
