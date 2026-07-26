'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useUiStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { signOut } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, Moon, Sun, Monitor } from 'lucide-react';
import { THEMES } from '@/lib/constants';
import { useThemeStore } from '@/stores/theme-store';

function ThemeItem({ theme }: { theme: { id: string; label: string; color: string } }) {
  const currentTheme = useThemeStore((s) => s.themeId);
  const setThemeId = useThemeStore((s) => s.setThemeId);
  const isActive = currentTheme === theme.id;

  return (
    <button
      onClick={() => {
        setThemeId(theme.id as any);
        useUiStore.getState().setUserMenuOpen(false);
      }}
      className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-muted ${
        isActive ? 'font-medium text-foreground' : 'text-muted-foreground'
      }`}
    >
      <div
        className="size-4 shrink-0 rounded-full border border-border/50"
        style={{ backgroundColor: theme.color }}
      />
      {theme.label}
      {isActive && <span className="ml-auto text-[10px] text-primary">Active</span>}
    </button>
  );
}

export function UserMenu() {
  const router = useRouter();
  const { userMenuOpen, setUserMenuOpen } = useUiStore();
  const user = useAuthStore((s) => s.user);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const displayName = (user?.user_metadata?.name as string) || user?.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    router.replace('/auth/login');
  };

  const modeIcon = mode === 'dark' ? Moon : mode === 'light' ? Sun : Monitor;
  const modeLabel = mode === 'dark' ? 'Dark' : mode === 'light' ? 'Light' : 'System';
  const nextMode = mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark';

  return (
    <div className="relative">
      <button
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
      >
        {displayName.charAt(0).toUpperCase()}
      </button>

      <AnimatePresence>
        {userMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setUserMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-border/50 bg-background shadow-xl"
            >
              <div className="border-b border-border/50 px-4 py-3">
                <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setUserMenuOpen(false); router.push('/profile'); }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
                >
                  <User size={16} /> Profile
                </button>
                <button
                  onClick={() => { setUserMenuOpen(false); router.push('/settings'); }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
                >
                  <Settings size={16} /> Settings
                </button>
              </div>

              <div className="border-t border-border/50 py-1">
                <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Theme</p>
                <div className="max-h-40 overflow-y-auto">
                  {THEMES.map((t) => <ThemeItem key={t.id} theme={t} />)}
                </div>
              </div>

              <div className="border-t border-border/50 py-1">
                <button
                  onClick={() => { setMode(nextMode); }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
                >
                  {modeIcon({ size: 16 })} {modeLabel} mode
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
