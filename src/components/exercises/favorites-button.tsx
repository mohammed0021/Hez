'use client';

import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useExerciseStore } from '@/stores/exercise-store';

export function FavoritesButton({ exerciseId, size = 20 }: { exerciseId: string; size?: number }) {
  const toggleFavorite = useExerciseStore((s) => s.toggleFavorite);
  const isFavorite = useExerciseStore((s) => s.isFavorite(exerciseId));
  const fav = isFavorite;

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={() => toggleFavorite(exerciseId)}
      className={`flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
        fav ? 'bg-red-500/10 text-red-500' : 'bg-muted text-muted-foreground hover:bg-muted/80'
      }`}
    >
      <Heart size={size} className={fav ? 'fill-red-500' : ''} />
      {fav ? 'Favorited' : 'Favorite'}
    </motion.button>
  );
}
