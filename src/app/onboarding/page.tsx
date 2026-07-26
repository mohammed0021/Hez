'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dumbbell, Target, Sparkles } from 'lucide-react';

const slides = [
  {
    id: 'track',
    icon: Dumbbell,
    title: 'Track Every Rep',
    description: 'Log your workouts with ease. Track sets, reps, weights, and progress over time.',
    color: 'from-primary to-emerald-600',
  },
  {
    id: 'goals',
    icon: Target,
    title: 'Crush Your Goals',
    description: 'Set personalized fitness goals and let Hêz keep you accountable every step of the way.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'discover',
    icon: Sparkles,
    title: 'Discover Your Strength',
    description: 'Hêz means strength. Unlock your potential with intelligent workout recommendations.',
    color: 'from-purple-500 to-purple-600',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slide = slides[current]!;
  const Icon = slide.icon;
  const isLast = current === slides.length - 1;

  const goNext = () => {
    if (isLast) {
      localStorage.setItem('hez-onboarded', 'true');
      router.replace('/complete-profile');
    } else {
      setDirection(1);
      setCurrent((c) => c + 1);
    }
  };

  const goBack = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
    }
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="flex min-h-screen-safe flex-col bg-background">
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-primary' : 'w-1 bg-muted'
              }`}
            />
          ))}
        </div>
        {!isLast && (
          <button
            onClick={() => {
              localStorage.setItem('hez-onboarded', 'true');
              router.replace('/auth/login');
            }}
            className="text-sm font-medium text-muted-foreground"
          >
            Skip
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex h-full flex-col items-center justify-center"
          >
            <div className={`mb-8 flex size-32 items-center justify-center rounded-[2.5rem] bg-gradient-to-br ${slide.color} shadow-xl`}>
              <Icon size={48} className="text-white" />
            </div>
            <h2 className="text-center text-2xl font-bold text-foreground">{slide.title}</h2>
            <p className="mt-3 max-w-xs text-center text-sm text-muted-foreground leading-relaxed">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-10 space-y-3">
        <Button size="lg" className="w-full" onClick={goNext}>
          {isLast ? 'Get Started' : 'Continue'}
        </Button>
        {current > 0 && (
          <Button variant="ghost" className="w-full" onClick={goBack}>
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
