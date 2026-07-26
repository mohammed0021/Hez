'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Apple, Beef, Wheat, CircleDot, Fence, Bell, BellOff } from 'lucide-react';
import { useNutritionGoalsStore } from '@/stores/nutrition-goals-store';
import { canNotify, notify } from '@/lib/notification-service';

export default function GoalsPage() {
  const goals = useNutritionGoalsStore((s) => s.goals);
  const setGoals = useNutritionGoalsStore((s) => s.setGoals);
  const hydration = useNutritionGoalsStore((s) => s.hydration);
  const setHydration = useNutritionGoalsStore((s) => s.setHydration);

  const [form, setForm] = useState({ ...goals });
  const [hydForm, setHydForm] = useState({ ...hydration });

  const handleSave = () => {
    setGoals(form);
    setHydration(hydForm);
  };

  const requestNotifyPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    requestNotifyPermission();
  }, [requestNotifyPermission]);

  useEffect(() => {
    if (!hydForm.enabled) return;
    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= hydForm.startHour && hour < hydForm.endHour) {
        if (canNotify()) {
          notify('Hydration Reminder', { body: `Time to drink ${hydForm.amountMl}ml of water!`, tag: 'hydration' });
        } else if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Hydration Reminder', { body: `Time to drink ${hydForm.amountMl}ml of water!`, icon: '/icons/icon-192x192.png' });
        }
      }
    }, hydForm.intervalMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [hydForm.enabled, hydForm.intervalMinutes, hydForm.startHour, hydForm.endHour, hydForm.amountMl]);

  const macros = [
    { key: 'calories' as const, label: 'Calories', icon: Apple, color: 'text-primary', unit: 'kcal', step: 50 },
    { key: 'protein' as const, label: 'Protein', icon: Beef, color: 'text-blue-500', unit: 'g', step: 5 },
    { key: 'carbs' as const, label: 'Carbs', icon: Wheat, color: 'text-amber-500', unit: 'g', step: 5 },
    { key: 'fat' as const, label: 'Fat', icon: CircleDot, color: 'text-rose-500', unit: 'g', step: 5 },
    { key: 'fiber' as const, label: 'Fiber', icon: Fence, color: 'text-green-500', unit: 'g', step: 1 },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nutrition Goals</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Set your daily targets</p>
        </div>
        <button onClick={handleSave} className="rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">Save</button>
      </div>

      <div className="mt-5 space-y-2">
        {macros.map((m) => {
          const Icon = m.icon;
          return (
            <motion.div key={m.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4">
              <Icon size={18} className={m.color} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{m.label}</p>
                <p className="text-[10px] text-muted-foreground">Daily target</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setForm({ ...form, [m.key]: Math.max(0, form[m.key] - m.step) })}
                  className="size-8 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80">−</button>
                <span className="w-16 text-center text-lg font-bold text-foreground tabular-nums">{form[m.key]}</span>
                <button onClick={() => setForm({ ...form, [m.key]: form[m.key] + m.step })}
                  className="size-8 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80">+</button>
              </div>
              <span className="text-xs text-muted-foreground w-8">{m.unit}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Hydration Goals */}
      <h2 className="mt-8 mb-3 text-sm font-semibold text-foreground">Hydration</h2>

      <div className="space-y-3">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4">
          <Droplets size={18} className="text-blue-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Daily Water Goal</p>
            <p className="text-[10px] text-muted-foreground">Target intake</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setHydForm({ ...hydForm, amountMl: Math.max(100, hydForm.amountMl - 100) })}
              className="size-8 rounded-lg bg-muted text-sm font-medium text-foreground">−</button>
            <span className="w-20 text-center text-lg font-bold text-foreground tabular-nums">{hydForm.amountMl}</span>
            <button onClick={() => setHydForm({ ...hydForm, amountMl: hydForm.amountMl + 100 })}
              className="size-8 rounded-lg bg-muted text-sm font-medium text-foreground">+</button>
          </div>
          <span className="text-xs text-muted-foreground w-8">ml</span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4">
          {hydForm.enabled ? <Bell size={18} className="text-primary" /> : <BellOff size={18} className="text-muted-foreground" />}
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Hydration Reminders</p>
            <p className="text-[10px] text-muted-foreground">Every {hydForm.intervalMinutes} minutes</p>
          </div>
          <button onClick={() => setHydForm({ ...hydForm, enabled: !hydForm.enabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hydForm.enabled ? 'bg-primary' : 'bg-muted'}`}>
            <span className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${hydForm.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </motion.div>

        {hydForm.enabled && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4">
              <span className="text-xs text-foreground flex-1">Reminder interval</span>
              <select value={hydForm.intervalMinutes} onChange={(e) => setHydForm({ ...hydForm, intervalMinutes: parseInt(e.target.value) })}
                className="rounded-xl border border-border/30 bg-background px-3 py-2 text-xs text-foreground">
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4">
              <span className="text-xs text-foreground flex-1">Active hours</span>
              <div className="flex gap-2">
                <select value={hydForm.startHour} onChange={(e) => setHydForm({ ...hydForm, startHour: parseInt(e.target.value) })}
                  className="rounded-xl border border-border/30 bg-background px-3 py-2 text-xs text-foreground">
                  {Array.from({ length: 12 }, (_, i) => i + 7).map((h) => (
                    <option key={h} value={h}>{h}:00</option>
                  ))}
                </select>
                <span className="text-xs text-muted-foreground self-center">to</span>
                <select value={hydForm.endHour} onChange={(e) => setHydForm({ ...hydForm, endHour: parseInt(e.target.value) })}
                  className="rounded-xl border border-border/30 bg-background px-3 py-2 text-xs text-foreground">
                  {Array.from({ length: 12 }, (_, i) => i + 12).map((h) => (
                    <option key={h} value={h}>{h}:00</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="h-8" />
    </>
  );
}
