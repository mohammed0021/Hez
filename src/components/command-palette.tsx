'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, LayoutDashboard, Dumbbell, NotebookText, BarChart3, Apple, Pill, Calendar, User, Settings } from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';
import { SEARCH_RESULTS } from '@/lib/constants';
import type { SearchResult } from '@/types';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard, Dumbbell, NotebookText, BarChart3, Apple, Pill, Calendar, User, Settings,
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
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setActiveIndex(0);
    }
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
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
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
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
              <Search size={18} className="text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden rounded-md border border-border/50 bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">ESC</kbd>
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
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{result.label}</p>
                      {result.description && (
                        <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                      )}
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-muted-foreground/50" />
                  </button>
                );
              })}
              {results.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">No results found</p>
              )}
            </div>
            <div className="hidden border-t border-border/50 px-4 py-2 text-[10px] text-muted-foreground sm:flex items-center gap-4">
              <span><kbd className="rounded border border-border/50 bg-muted px-1">↑↓</kbd> Navigate</span>
              <span><kbd className="rounded border border-border/50 bg-muted px-1">↵</kbd> Open</span>
              <span><kbd className="rounded border border-border/50 bg-muted px-1">⌘K</kbd> Toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
