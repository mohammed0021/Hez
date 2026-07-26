'use client';

import { usePathname } from 'next/navigation';
import { Menu, Search } from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';
import { NotificationCenter } from './notification-center';
import { UserMenu } from './user-menu';
import { APP_NAME, SIDEBAR_ITEMS } from '@/lib/constants';

const pageTitles: Record<string, string> = {};
for (const item of SIDEBAR_ITEMS) pageTitles[item.href] = item.label;
for (const item of [{ id: 'profile', label: 'Profile', icon: 'User', href: '/profile' }, { id: 'settings', label: 'Settings', icon: 'Settings', href: '/settings' }]) {
  pageTitles[item.href] = item.label;
}

export function TopHeader() {
  const pathname = usePathname();
  const { toggleSidebar, setCommandPaletteOpen } = useUiStore();
  const title = pageTitles[pathname] || APP_NAME;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur-xl px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted md:hidden"
        >
          <Menu size={18} />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden items-center gap-2 rounded-xl bg-muted px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/80 sm:flex"
        >
          <Search size={14} />
          <span>Search...</span>
          <kbd className="rounded-md border border-border/50 bg-background px-1 py-0.5 text-[9px] font-medium">⌘K</kbd>
        </button>
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted sm:hidden"
        >
          <Search size={18} />
        </button>
        <NotificationCenter />
        <UserMenu />
      </div>
    </header>
  );
}
