'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase-client';

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const phase: 'logo' | 'text' | 'done' =
    progress >= 100 ? 'done' : progress >= 40 ? 'text' : 'logo';

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
    if (progress >= 100) {
      const hasLocale = localStorage.getItem('hez-locale');
      if (!hasLocale) {
        router.replace('/welcome');
        return;
      }
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
    <div className="min-h-screen-safe bg-background flex flex-col items-center justify-center px-6">
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
            <div className="bg-primary shadow-glow-lg flex size-24 items-center justify-center rounded-[2rem]">
              <Image
                src="/icons/icon-192x192.png"
                alt="Hêz"
                width={72}
                height={72}
                className="size-[72px]"
                priority
              />
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
            <div className="bg-primary shadow-glow-lg flex size-24 items-center justify-center rounded-[2rem]">
              <Image
                src="/icons/icon-192x192.png"
                alt="Hêz"
                width={72}
                height={72}
                className="size-[72px]"
                priority
              />
            </div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-foreground mt-6 text-3xl font-bold"
            >
              Hêz
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mt-1 text-sm"
            >
              Your fitness journey starts here
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed right-8 bottom-16 left-8 mx-auto max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-muted h-1 overflow-hidden rounded-full">
          <motion.div
            className="bg-primary h-full rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
