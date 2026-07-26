'use client';

import { ChevronRight, Dumbbell, Target, Calendar, Award, Bell, Shield, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';

const menuItems = [
  { id: 'goals', label: 'Fitness Goals', icon: Target, href: '/settings' },
  { id: 'workout-settings', label: 'Workout Preferences', icon: Dumbbell, href: '/settings' },
  { id: 'schedule', label: 'Schedule & Reminders', icon: Calendar, href: '/settings' },
  { id: 'achievements', label: 'Achievements', icon: Award, href: '/settings' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/settings' },
  { id: 'privacy', label: 'Privacy', icon: Shield, href: '/settings' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, href: '/settings' },
];

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const displayName = (user?.user_metadata?.name as string) || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center py-6"
      >
        <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">{displayName}</h2>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
        <button className="mt-3 text-sm font-medium text-primary">Edit Profile</button>
      </motion.div>

      <div className="mt-2 space-y-1">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"
            >
              <Icon size={18} className="text-muted-foreground" />
              <span className="flex-1 text-sm text-foreground">{item.label}</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
