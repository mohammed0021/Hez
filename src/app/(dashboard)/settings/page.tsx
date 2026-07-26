'use client';

import { motion } from 'framer-motion';
import { useThemeStore } from '@/stores/theme-store';
import { THEMES, LANGUAGES } from '@/lib/constants';
import { ChevronRight, Bell } from 'lucide-react';
import Link from 'next/link';

const settingSections = [
  { id: 'general', label: 'General', items: [
    { id: 'language', label: 'Language', value: 'English' },
    { id: 'measurement', label: 'Measurement', value: 'Metric (kg, cm)' },
    { id: 'timezone', label: 'Timezone', value: '(UTC+00:00)' },
  ]},
  { id: 'workout', label: 'Workout', items: [
    { id: 'rest-timer', label: 'Rest Timer Default', value: '90 seconds' },
    { id: 'auto-rest', label: 'Auto-start Rest Timer', value: 'On' },
    { id: 'sound', label: 'Sound Effects', value: 'On' },
  ]},
  { id: 'goals', label: 'Goals', items: [
    { id: 'weekly-workouts', label: 'Weekly Workout Goal', value: '4 sessions' },
    { id: 'daily-water', label: 'Daily Water Goal', value: '2,000 ml' },
    { id: 'daily-calories', label: 'Daily Calorie Goal', value: '2,200 kcal' },
  ]},
];

export default function SettingsPage() {
  const { themeId, setThemeId } = useThemeStore();

  return (
    <>
      <h2 className="text-2xl font-bold text-foreground">Settings</h2>

      <div className="mt-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-1">Theme</p>
          <div className="flex gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setThemeId(t.id as any)}
                className={`relative flex size-10 items-center justify-center rounded-xl transition-all ${
                  themeId === t.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : ''
                }`}
                style={{ backgroundColor: t.color }}
                title={t.label}
              >
                {themeId === t.id && <span className="text-xs text-white font-bold">✓</span>}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-1">Language</p>
          <div className="space-y-1">
            {LANGUAGES.map((lang) => (
              <button key={lang.code} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-muted">
                <span className="text-sm text-foreground">{lang.nativeLabel}</span>
                {lang.code === 'en' && <span className="text-[10px] text-primary font-medium">Active</span>}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-1">Notifications</p>
          <Link href="/settings/notifications"
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-muted">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Notification Preferences</span>
            </div>
            <ChevronRight size={14} className="text-muted-foreground/50" />
          </Link>
        </motion.div>

        {settingSections.map((section, i) => (
          <motion.div key={section.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-1">{section.label}</p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button key={item.id} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-muted">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.value}</span>
                    <ChevronRight size={14} className="text-muted-foreground/50" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
