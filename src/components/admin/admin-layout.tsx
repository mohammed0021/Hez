'use client';

import {
  Shield,
  BarChart3,
  Users,
  Dumbbell,
  TrendingUp,
  Apple,
  Monitor,
  Wifi,
  Zap,
  UserCog,
  MessageSquare,
  Bell,
  Lock,
  Activity,
  FileText,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  badge?: string;
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', icon: BarChart3, href: '/admin' }],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Users', icon: Users, href: '/admin/users' },
      { label: 'Workouts', icon: Dumbbell, href: '/admin/workouts' },
      { label: 'Progress', icon: TrendingUp, href: '/admin/progress' },
      { label: 'Nutrition', icon: Apple, href: '/admin/nutrition' },
      { label: 'Devices', icon: Monitor, href: '/admin/devices' },
      { label: 'PWA', icon: Wifi, href: '/admin/pwa' },
      { label: 'Performance', icon: Zap, href: '/admin/performance' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users', icon: UserCog, href: '/admin/user-management' },
      { label: 'Feedback', icon: MessageSquare, href: '/admin/feedback' },
      { label: 'Notifications', icon: Bell, href: '/admin/notifications' },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      { label: 'Security', icon: Lock, href: '/admin/security' },
      { label: 'System Health', icon: Activity, href: '/admin/health' },
      { label: 'Reports', icon: FileText, href: '/admin/reports' },
    ],
  },
];

function AdminSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'border-border/50 bg-background fixed top-0 left-0 z-40 flex h-screen flex-col border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div
        className={cn(
          'border-border/50 flex h-14 items-center border-b px-4',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg text-[10px] font-bold">
              H
            </div>
            <span className="text-foreground text-sm font-semibold">Admin</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center rounded-lg',
            collapsed ? 'size-8' : 'size-8',
          )}
        >
          {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 scrollbar-thin overflow-y-auto px-2 py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <p className="text-muted-foreground/60 mb-1.5 px-2 text-[10px] font-semibold tracking-widest uppercase">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      collapsed && 'justify-center px-0',
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={16} className="shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={cn('border-border/50 border-t p-3', collapsed && 'flex justify-center')}>
        <Link
          href="/dashboard"
          className={cn(
            'text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg text-xs',
            collapsed ? 'size-8 justify-center' : 'px-2 py-1.5',
          )}
        >
          <Shield size={14} />
          {!collapsed && <span>Back to App</span>}
        </Link>
      </div>
    </aside>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-screen">
      {/* Desktop sidebar */}
      <div className={cn('hidden md:block', collapsed ? 'w-16' : 'w-64')}>
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 z-40 h-screen md:hidden"
          >
            <AdminSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="border-border/50 bg-background/80 sticky top-0 z-20 flex h-14 items-center gap-3 border-b px-4 backdrop-blur-md">
          <button
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-8 items-center justify-center rounded-lg md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={16} />
          </button>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span className="hidden sm:inline">Hêz</span>
            <span className="hidden sm:inline">/</span>
            <span className="text-foreground">Admin</span>
          </div>
          <div className="flex-1" />
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
