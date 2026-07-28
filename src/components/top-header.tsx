'use client';

import { usePathname } from 'next/navigation';
import { Menu, Search } from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';
import { NotificationCenter } from './notification-center';
import { UserMenu } from './user-menu';
import { APP_NAME, SIDEBAR_ITEMS } from '@/lib/constants';

const pageTitles: Record<string, string> = {};
for (const item of SIDEBAR_ITEMS) pageTitles[item.href] = item.label;
for (const item of [
  { id: 'profile', label: 'Profile', icon: 'User', href: '/profile' },
  { id: 'settings', label: 'Settings', icon: 'Settings', href: '/settings' },
]) {
  pageTitles[item.href] = item.label;
}

export function TopHeader() {
  const pathname = usePathname();
  const { toggleSidebar, setCommandPaletteOpen } = useUiStore();
  const title = pageTitles[pathname] || APP_NAME;

  return (
    <header
      className="border-border/50 bg-background/95 sticky top-0 z-20 border-b backdrop-blur-xl"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="text-muted-foreground hover:bg-muted flex size-9 items-center justify-center rounded-xl transition-colors md:hidden"
          >
            <Menu size={18} />
          </button>
          <h1 className="text-foreground text-lg font-semibold">{title}</h1>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="bg-muted text-muted-foreground hover:bg-muted/80 hidden items-center gap-2 rounded-xl px-3 py-1.5 text-xs transition-colors sm:flex"
          >
            <Search size={14} />
            <span>Search...</span>
            <kbd className="border-border/50 bg-background rounded-md border px-1 py-0.5 text-[9px] font-medium">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="text-muted-foreground hover:bg-muted flex size-9 items-center justify-center rounded-xl transition-colors sm:hidden"
          >
            <Search size={18} />
          </button>
          <NotificationCenter />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
