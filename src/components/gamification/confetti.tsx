'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  shape: 'circle' | 'square' | 'star';
}

const COLORS = [
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
];

function generateParticles(): Particle[] {
  return Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? COLORS[0] ?? '#10b981',
    size: 4 + Math.random() * 8,
    rotation: Math.random() * 360,
    shape: (['circle', 'square', 'star'] as const)[Math.floor(Math.random() * 3)] ?? 'circle',
  }));
}

export function Confetti({ active, onComplete }: { active: boolean; onComplete?: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [duration] = useState(() => 2 + Math.random() * 1.5);

  useEffect(() => {
    if (!active) return;
    const items = generateParticles();
    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 3000);
    Promise.resolve().then(() => setParticles(items));
    return () => clearTimeout(timer);
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: 0, opacity: 1 }}
              animate={{
                y: '110vh',
                rotate: p.rotation * 3,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration, ease: 'easeIn' }}
              className="absolute"
              style={{ left: 0, top: 0 }}
            >
              <div
                className={
                  p.shape === 'circle' ? 'rounded-full' : p.shape === 'square' ? 'rounded-sm' : ''
                }
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'star' ? '2px' : '2px',
                  clipPath:
                    p.shape === 'star'
                      ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                      : undefined,
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
