'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUiStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { SIDEBAR_ITEMS, SIDEBAR_BOTTOM_ITEMS } from '@/lib/constants';
import {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  NotebookText,
  BarChart3,
  Pill,
  Calendar,
  User,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { signOut } from '@/services/auth';
import type React from 'react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  NotebookText,
  Sparkles,
  BarChart3,
  Pill,
  Calendar,
  User,
  Settings,
};

function SidebarItem({
  item,
  isActive,
  onNavigate,
}: {
  item: { id: string; label: string; icon: string; href: string };
  isActive: boolean;
  onNavigate: (href: string) => void;
}) {
  const Icon = iconMap[item.icon] as React.ComponentType<{ size?: number; className?: string }>;

  return (
    <button
      onClick={() => onNavigate(item.href)}
      className={`group relative flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="bg-primary/10 absolute inset-0 rounded-xl"
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
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => useUiStore.getState().setSidebarOpen(false)}
        />
      )}

      <aside
        className={`border-border/50 bg-background fixed top-0 left-0 z-40 flex h-full w-64 flex-col border-r transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="border-border/50 flex h-14 shrink-0 items-center gap-3 border-b px-5">
          <div className="bg-primary flex size-8 items-center justify-center rounded-xl">
            <span className="text-primary-foreground text-sm font-bold">H</span>
          </div>
          <span className="text-foreground text-lg font-bold">Hêz</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="text-muted-foreground/60 mb-2 px-3 text-[10px] font-semibold tracking-widest uppercase">
            Main
          </p>
          <div className="space-y-0.5">
            {SIDEBAR_ITEMS.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                onNavigate={handleNavigate}
              />
            ))}
          </div>

          <p className="text-muted-foreground/60 mt-6 mb-2 px-3 text-[10px] font-semibold tracking-widest uppercase">
            Account
          </p>
          <div className="space-y-0.5">
            {SIDEBAR_BOTTOM_ITEMS.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </nav>

        <div
          className="border-border/50 shrink-0 border-t px-4"
          style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="flex items-center gap-3 py-3">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-sm font-medium">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">{displayName}</p>
              <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex size-8 items-center justify-center rounded-lg"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
