'use client';

import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Home, Dumbbell, BarChart3, User, Sparkles } from 'lucide-react';
import type React from 'react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Home,
  Dumbbell,
  Sparkles,
  BarChart3,
  User,
};

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) return null;

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <nav className="safe-bottom fixed right-0 bottom-0 left-0 z-50">
      <div className="border-border/50 bg-background/95 mx-auto max-w-lg border-t backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-1">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] as React.ComponentType<{
              size?: number;
              className?: string;
            }>;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.href)}
                className="relative flex flex-1 flex-col items-center gap-0.5 py-2"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="bg-primary/10 absolute inset-0 mx-4 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={22}
                  className={`relative z-10 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span
                  className={`relative z-10 text-[10px] font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
