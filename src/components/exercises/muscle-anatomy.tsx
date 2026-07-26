'use client';

import { motion } from 'framer-motion';
import { MUSCLE_GROUP_MAP } from '@/types/exercise';

interface MuscleAnatomyProps {
  activeMuscles: string[];
  onMuscleClick?: (muscle: string) => void;
  compact?: boolean;
}

const MUSCLE_REGIONS = [
  {
    name: 'Shoulders',
    path: 'M 160 70 Q 165 50 190 50 Q 215 50 220 70 Q 210 85 190 85 Q 170 85 160 70 Z',
  },
  { name: 'Chest', path: 'M 155 95 Q 165 90 190 90 Q 215 90 225 95 Q 220 120 190 125 Q 160 120 155 95 Z' },
  { name: 'Biceps', path: 'M 125 100 Q 130 95 140 95 L 145 130 Q 135 140 125 135 Z' },
  { name: 'Biceps', path: 'M 240 100 Q 235 95 225 95 L 220 130 Q 230 140 240 135 Z' },
  { name: 'Forearms', path: 'M 120 145 Q 125 140 135 140 L 140 195 Q 130 200 120 200 Z' },
  { name: 'Forearms', path: 'M 245 145 Q 240 140 230 140 L 225 195 Q 235 200 245 200 Z' },
  { name: 'Core', path: 'M 155 135 Q 160 125 190 125 Q 220 125 225 135 L 220 180 Q 190 185 160 180 Z' },
  { name: 'Obliques', path: 'M 150 135 Q 155 130 158 132 L 155 182 Q 150 180 148 175 Z' },
  { name: 'Obliques', path: 'M 230 135 Q 225 130 222 132 L 225 182 Q 230 180 232 175 Z' },
  { name: 'Quadriceps', path: 'M 150 195 Q 160 190 175 190 L 175 285 Q 165 290 150 290 Z' },
  { name: 'Quadriceps', path: 'M 230 195 Q 220 190 205 190 L 205 285 Q 215 290 230 290 Z' },
  { name: 'Adductors', path: 'M 175 195 Q 185 192 190 195 L 190 290 Q 185 295 175 295 Z' },
  { name: 'Adductors', path: 'M 205 195 Q 195 192 190 195 L 190 290 L 205 290 Z' },
  { name: 'Calves', path: 'M 165 300 Q 175 295 185 295 L 185 365 Q 175 370 165 370 Z' },
  { name: 'Calves', path: 'M 215 300 Q 205 295 195 295 L 195 365 Q 205 370 215 370 Z' },
];

const BACK_REGIONS = [
  { name: 'Traps', path: 'M 150 50 Q 165 35 190 35 Q 215 35 230 50 L 225 65 Q 190 75 155 65 Z' },
  { name: 'Shoulders', path: 'M 140 70 Q 155 60 170 65 L 175 85 Q 165 95 145 95 Z' },
  { name: 'Shoulders', path: 'M 240 70 Q 225 60 210 65 L 205 85 Q 215 95 235 95 Z' },
  { name: 'Back', path: 'M 155 75 Q 170 70 190 70 Q 210 70 225 75 L 220 175 Q 190 185 160 175 Z' },
  { name: 'Triceps', path: 'M 130 95 Q 138 90 145 95 L 150 145 Q 140 155 130 150 Z' },
  { name: 'Triceps', path: 'M 250 95 Q 242 90 235 95 L 230 145 Q 240 155 250 150 Z' },
  { name: 'Forearms', path: 'M 128 155 Q 135 150 145 155 L 150 200 Q 140 205 130 205 Z' },
  { name: 'Forearms', path: 'M 252 155 Q 245 150 235 155 L 230 200 Q 240 205 250 205 Z' },
  { name: 'Lower Back', path: 'M 160 175 Q 175 168 190 168 Q 205 168 220 175 L 215 195 Q 190 200 165 195 Z' },
  { name: 'Glutes', path: 'M 150 195 Q 170 185 190 185 Q 210 185 230 195 L 235 220 Q 190 230 145 220 Z' },
  { name: 'Hamstrings', path: 'M 155 225 Q 175 218 190 218 Q 205 218 225 225 L 220 295 Q 190 300 160 295 Z' },
  { name: 'Calves', path: 'M 168 300 Q 178 295 188 295 L 188 365 Q 178 370 168 370 Z' },
  { name: 'Calves', path: 'M 212 300 Q 202 295 192 295 L 192 365 Q 202 370 212 370 Z' },
];

export function MuscleAnatomy({ activeMuscles, onMuscleClick, compact = false }: MuscleAnatomyProps) {
  const size = compact ? 160 : 220;
  const viewBox = `0 0 ${size} ${size}`;

  const isActive = (name: string) =>
    activeMuscles.some((m) => {
      const region = MUSCLE_GROUP_MAP[m];
      return region?.label === name || m === name;
    });

  const renderMuscle = (region: { name: string; path: string }, i: number) => {
    const active = isActive(region.name);
    return (
      <motion.path
        key={`${region.name}-${i}`}
        d={region.path}
        initial={false}
        animate={{
          fill: active ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
          stroke: active ? 'hsl(var(--primary-foreground))' : 'hsl(var(--border))',
          strokeWidth: active ? 1.5 : 0.5,
        }}
        transition={{ duration: 0.3 }}
        className="cursor-pointer"
        onClick={() => onMuscleClick?.(region.name)}
      />
    );
  };

  return (
    <div className="flex justify-center gap-4">
      <svg viewBox={viewBox} className={`h-auto ${compact ? 'w-32' : 'w-44'}`}>
        {BACK_REGIONS.map((r, i) => renderMuscle(r, i))}
      </svg>
      <svg viewBox={viewBox} className={`h-auto ${compact ? 'w-32' : 'w-44'}`}>
        {MUSCLE_REGIONS.map((r, i) => renderMuscle(r, i))}
      </svg>
    </div>
  );
}
