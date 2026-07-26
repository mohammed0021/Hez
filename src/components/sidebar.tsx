'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUiStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { SIDEBAR_ITEMS, SIDEBAR_BOTTOM_ITEMS } from '@/lib/constants';
import { LayoutDashboard, Dumbbell, BookOpen, NotebookText, BarChart3, Apple, Pill, Calendar, User, Settings, LogOut } from 'lucide-react';
import { signOut } from '@/services/auth';
import type React from 'react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard, Dumbbell, BookOpen, NotebookText, BarChart3, Apple, Pill, Calendar, User, Settings,
};

function SidebarItem({ item, isActive, onNavigate }: {
  item: { id: string; label: string; icon: string; href: string };
  isActive: boolean;
  onNavigate: (href: string) => void;
}) {
  const Icon = iconMap[item.icon] as React.ComponentType<{ size?: number; className?: string }>;

  return (
    <button
      onClick={() => onNavigate(item.href)}
      className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl bg-primary/10"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-3">
        <Icon size={18} />
        {item.label}
      </span>
    </button>
  );
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const user = useAuthStore((s) => s.user);
  const displayName = (user?.user_metadata?.name as string) || user?.email?.split('@')[0] || 'User';

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => useUiStore.getState().setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border/50 bg-background transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-3 border-b border-border/50 px-5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary">
            <span className="text-sm font-bold text-primary-foreground">H</span>
          </div>
          <span className="text-lg font-bold text-foreground">Hêz</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Main
          </p>
          <div className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={pathname === item.href}
                onNavigate={handleNavigate}
              />
            ))}
          </div>

          <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Account
          </p>
          <div className="space-y-1">
            {SIDEBAR_BOTTOM_ITEMS.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={pathname === item.href}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </nav>

        {/* User footer */}
        <div className="border-t border-border/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
