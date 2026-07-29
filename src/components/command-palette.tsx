'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  LayoutDashboard,
  Dumbbell,
  NotebookText,
  BarChart3,
  Apple,
  Pill,
  Calendar,
  User,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';
import { SEARCH_RESULTS } from '@/lib/constants';
import type { SearchResult } from '@/types';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard,
  Dumbbell,
  NotebookText,
  Sparkles,
  BarChart3,
  Apple,
  Pill,
  Calendar,
  User,
  Settings,
};

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUiStore();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape') setCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    setCommandPaletteOpen(false);
  }, [pathname, setCommandPaletteOpen]);

  useEffect(() => {
    if (!commandPaletteOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery('');

    setActiveIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [commandPaletteOpen]);

  const results = query
    ? SEARCH_RESULTS.filter(
        (r) =>
          r.label.toLowerCase().includes(query.toLowerCase()) ||
          (r.description?.toLowerCase().includes(query.toLowerCase()) ?? false),
      )
    : SEARCH_RESULTS;

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setCommandPaletteOpen(false);
      router.push(result.href);
    },
    [router, setCommandPaletteOpen],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && results[activeIndex]) handleSelect(results[activeIndex]);
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-[12vh]"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="border-border/50 bg-background w-full max-w-xl overflow-hidden rounded-2xl border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-border/50 flex items-center gap-3 border-b px-4 py-3">
              <Search size={18} className="text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
              />
              <kbd className="border-border/50 bg-muted text-muted-foreground hidden rounded-md border px-1.5 py-0.5 text-[10px] sm:inline">
                ESC
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              {results.map((result, i) => {
                const Icon = iconMap[result.icon || 'LayoutDashboard'] || LayoutDashboard;
                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      i === activeIndex ? 'bg-primary/10' : 'hover:bg-muted/50'
                    }`}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <Icon size={18} className="text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-medium">{result.label}</p>
                      {result.description && (
                        <p className="text-muted-foreground truncate text-xs">
                          {result.description}
                        </p>
                      )}
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground/50 shrink-0" />
                  </button>
                );
              })}
              {results.length === 0 && (
                <p className="text-muted-foreground px-4 py-8 text-center text-sm">
                  No results found
                </p>
              )}
            </div>
            <div className="border-border/50 text-muted-foreground hidden items-center gap-4 border-t px-4 py-2 text-[10px] sm:flex">
              <span>
                <kbd className="border-border/50 bg-muted rounded border px-1">↑↓</kbd> Navigate
              </span>
              <span>
                <kbd className="border-border/50 bg-muted rounded border px-1">↵</kbd> Open
              </span>
              <span>
                <kbd className="border-border/50 bg-muted rounded border px-1">⌘K</kbd> Toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
