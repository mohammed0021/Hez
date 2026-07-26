'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { canNotify, notify } from '@/lib/notification-service';

function playBeep() {
  try {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    )();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    setTimeout(() => ctx.close(), 500);
  } catch {
    // Audio not available
  }
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function RestTimer({
  endTime,
  onExpire,
  onSkip,
}: {
  endTime: string | null;
  onExpire: () => void;
  onSkip: () => void;
}) {
  const [remaining, setRemaining] = useState(0);
  const expiredRef = useRef(false);
  const hadEndTimeRef = useRef(false);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (!endTime) {
      if (hadEndTimeRef.current) {
        hadEndTimeRef.current = false;
        setRemaining(0);
        expiredRef.current = false;
      }
      return;
    }

    hadEndTimeRef.current = true;
    expiredRef.current = false;

    const tick = () => {
      const ms = new Date(endTime).getTime() - Date.now();
      if (ms <= 0) {
        if (!expiredRef.current) {
          expiredRef.current = true;
          playBeep();
          if (canNotify()) {
            notify('Rest Over!', { body: 'Time for your next set', tag: 'rest_timer_alert' });
          } else if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Rest Over!', {
              body: 'Time for your next set',
              icon: '/icons/icon-192x192.png',
            });
          }
          onExpire();
        }
        setRemaining(0);
        return;
      }
      setRemaining(ms);
    };

    tick();
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  if (!endTime || remaining <= 0) return null;

  const seconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = 1 - remaining / (30 * 1000); // arbitrary max for display

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center gap-3 py-8"
    >
      <div className="relative flex size-28 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            strokeDasharray={`${Math.min(progress, 1) * 276} 276`}
            strokeLinecap="round"
            className="transition-all duration-100"
          />
        </svg>
        <span className="text-foreground text-4xl font-bold tabular-nums">
          {minutes}:{secs.toString().padStart(2, '0')}
        </span>
      </div>
      <p className="text-muted-foreground text-sm">Rest</p>
      <button
        onClick={onSkip}
        className="bg-primary text-primary-foreground rounded-xl px-6 py-2 text-sm font-medium transition-transform active:scale-95"
      >
        Skip Rest
      </button>
    </motion.div>
  );
}
