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

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="border-border/50 bg-background/95 mx-auto max-w-lg border-t backdrop-blur-xl">
        <div className="flex items-center justify-around py-1">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] as React.ComponentType<{
              size?: number;
              className?: string;
            }>;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className="relative flex min-h-[48px] min-w-[48px] flex-1 flex-col items-center justify-center px-2 py-1"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="bg-primary/10 absolute inset-0 mx-2 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={24}
                  className={`relative z-10 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span
                  className={`relative z-10 mt-0.5 text-[10px] leading-none font-medium transition-colors ${
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
