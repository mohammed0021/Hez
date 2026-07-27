'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number | null | undefined;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: string;
  index?: number;
  format?: 'number' | 'duration' | 'percent' | 'storage';
}

function normalizeValue(value: string | number | null | undefined): string | number {
  if (value === null || value === undefined) return 0;
  return value;
}

export function KpiCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color,
  index = 0,
  format = 'number',
}: KpiCardProps) {
  const isPositive = (change ?? 0) >= 0;
  const formattedValue = formatValue(normalizeValue(value), format);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="group border-border/50 bg-card hover:border-border relative overflow-hidden rounded-2xl border p-4 transition-all hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-muted-foreground/70 text-[11px] font-medium tracking-wider uppercase">
            {title}
          </p>
          <p className="text-foreground text-2xl font-bold tabular-nums">{formattedValue}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  'flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                  isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500',
                )}
              >
                {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span>{Math.abs(change)}%</span>
              </div>
              {changeLabel && (
                <span className="text-muted-foreground/60 text-[10px]">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-xl',
            color === 'emerald' && 'bg-emerald-500/10 text-emerald-500',
            color === 'blue' && 'bg-blue-500/10 text-blue-500',
            color === 'purple' && 'bg-purple-500/10 text-purple-500',
            color === 'amber' && 'bg-amber-500/10 text-amber-500',
            color === 'rose' && 'bg-rose-500/10 text-rose-500',
            color === 'cyan' && 'bg-cyan-500/10 text-cyan-500',
            color === 'indigo' && 'bg-indigo-500/10 text-indigo-500',
            color === 'orange' && 'bg-orange-500/10 text-orange-500',
            color === 'pink' && 'bg-pink-500/10 text-pink-500',
            color === 'teal' && 'bg-teal-500/10 text-teal-500',
            color === 'slate' && 'bg-muted text-muted-foreground',
          )}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function formatValue(value: string | number, format: string): string {
  if (typeof value === 'string') return value;
  const num = value;
  if (isNaN(num)) return String(value);

  switch (format) {
    case 'duration': {
      const mins = Math.round(num);
      if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
      return `${mins}m`;
    }
    case 'percent':
      return `${(num * 100).toFixed(1)}%`;
    case 'storage':
      if (num >= 1024) return `${(num / 1024).toFixed(1)} GB`;
      return `${num.toFixed(1)} MB`;
    default:
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toLocaleString();
  }
}
