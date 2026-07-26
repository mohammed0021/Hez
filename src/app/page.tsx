'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase-client';

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'logo' | 'text' | 'done'>('logo');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 30;
        return next >= 100 ? 100 : next;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 40) setPhase('text');
    if (progress >= 100) {
      setPhase('done');
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        const onboarded = localStorage.getItem('hez-onboarded') === 'true';
        if (session) {
          router.replace(onboarded ? '/dashboard' : '/onboarding');
        } else {
          router.replace('/auth/login');
        }
      });
    }
  }, [progress, router]);

  return (
    <div className="flex min-h-screen-safe flex-col items-center justify-center bg-background px-6">
      <AnimatePresence mode="wait">
        {phase === 'logo' && (
          <motion.div
            key="logo"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="flex size-24 items-center justify-center rounded-[2rem] bg-primary shadow-glow-lg">
              <span className="text-5xl font-bold text-primary-foreground">H</span>
            </div>
          </motion.div>
        )}

        {phase === 'text' && (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="flex size-24 items-center justify-center rounded-[2rem] bg-primary shadow-glow-lg">
              <span className="text-5xl font-bold text-primary-foreground">H</span>
            </div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-3xl font-bold text-foreground"
            >
              Hêz
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-1 text-sm text-muted-foreground"
            >
              Your fitness journey starts here
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-16 left-8 right-8 mx-auto max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="h-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
