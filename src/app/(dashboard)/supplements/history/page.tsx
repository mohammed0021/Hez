'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Minus, TrendingUp } from 'lucide-react';
import { useSupplementStore } from '@/stores/supplement-store';

export default function SupplementHistoryPage() {
  const supplements = useSupplementStore((s) => s.supplements);
  const getHistory = useSupplementStore((s) => s.getHistory);
  const [days, setDays] = useState(30);
  const history = getHistory(days);

  const weeklyData = useMemo(() => {
    const data: { label: string; taken: number; total: number }[] = [];
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    for (let i = 0; i < 7; i++) {
      const dateStr = d.toISOString().slice(0, 10);
      const log = history.find((l) => l.date === dateStr);
      const taken = log ? Object.values(log.supplements).filter((v) => v === 'taken').length : 0;
      data.push({
        label: d.toLocaleDateString('en', { weekday: 'short' }),
        taken,
        total: supplements.length,
      });
      d.setDate(d.getDate() + 1);
    }
    return data;
  }, [history, supplements.length]);

  const adherence = useMemo(() => {
    if (history.length === 0) return 0;
    let total = 0;
    let taken = 0;
    for (const log of history) {
      for (const status of Object.values(log.supplements)) {
        total++;
        if (status === 'taken') taken++;
      }
    }
    return total > 0 ? Math.round((taken / total) * 100) : 0;
  }, [history]);

  return (
    <>
      <div>
        <h1 className="text-foreground text-2xl font-bold">Supplement History</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">{history.length} days logged</p>
      </div>

      {/* Adherence */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="from-primary/10 to-primary/5 border-primary/20 mt-5 rounded-2xl border bg-gradient-to-br p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
              Adherence
            </p>
            <p className="text-foreground mt-1 text-3xl font-bold">{adherence}%</p>
          </div>
          <TrendingUp size={28} className="text-primary/40" />
        </div>
      </motion.div>

      {/* Weekly summary */}
      <div className="mt-5">
        <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
          This Week
        </p>
        <div className="flex gap-1.5">
          {weeklyData.map((day, i) => (
            <div key={day.label} className="flex-1 text-center">
              <div className="bg-muted/30 flex h-20 flex-col justify-end overflow-hidden rounded-lg">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.taken / Math.max(day.total, 1)) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className={`w-full rounded-t-sm ${day.taken === day.total ? 'bg-primary' : day.taken > 0 ? 'bg-primary/50' : 'bg-muted'}`}
                />
              </div>
              <p className="text-muted-foreground mt-1 text-[9px]">{day.label}</p>
              <p className="text-muted-foreground/60 text-[8px]">
                {day.taken}/{day.total}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Day range selector */}
      <div className="mt-5 flex gap-2">
        {[7, 14, 30, 60].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`min-h-[44px] rounded-full px-3 py-1 text-[9px] font-medium ${days === d ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            {d}d
          </button>
        ))}
      </div>

      {/* History log */}
      <div className="mt-3 space-y-1">
        {history.map((log, i) => {
          const takenCount = Object.values(log.supplements).filter((v) => v === 'taken').length;
          const totalCount = Object.keys(log.supplements).length;
          const allTaken = takenCount === totalCount && totalCount > 0;
          return (
            <motion.div
              key={log.date}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="hover:bg-muted/50 flex items-center gap-3 rounded-xl px-4 py-3 transition-colors"
            >
              <div
                className={`flex size-8 items-center justify-center rounded-lg ${allTaken ? 'bg-green-500/10' : 'bg-muted'}`}
              >
                {allTaken ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <Minus size={14} className="text-muted-foreground/40" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-xs font-medium">
                  {new Date(log.date).toLocaleDateString('en', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <div className="mt-0.5 flex flex-wrap gap-1">
                  {Object.entries(log.supplements).map(([supId, status]) => {
                    const sup = supplements.find((s) => s.id === supId);
                    return (
                      <span
                        key={supId}
                        className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-medium ${
                          status === 'taken'
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {status === 'taken' ? <Check size={7} /> : <X size={7} />}
                        {sup?.name || supId}
                      </span>
                    );
                  })}
                </div>
              </div>
              <span className="text-muted-foreground/60 text-[9px]">
                {takenCount}/{totalCount}
              </span>
            </motion.div>
          );
        })}
        {history.length === 0 && (
          <p className="text-muted-foreground py-8 text-center text-[10px]">
            No history for this period
          </p>
        )}
      </div>

      <div className="h-8" />
    </>
  );
}
