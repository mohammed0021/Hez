'use client';

import { useMemo } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { DashboardWidget } from './widget-shell';
import { useSupplementStore } from '@/stores/supplement-store';

export function SupplementWidget() {
  const supplements = useSupplementStore((s) => s.supplements);
  const logs = useSupplementStore((s) => s.logs);
  const markTaken = useSupplementStore((s) => s.markTaken);

  const todayLog = useMemo(() => {
    const d = new Date().toISOString().slice(0, 10);
    const log = logs.find((l) => l.date === d);
    return log?.supplements || {};
  }, [logs]);

  const taken = supplements.filter((s) => todayLog[s.id] === 'taken').length;

  return (
    <DashboardWidget
      title="Supplements"
      action={
        <span className="text-primary">
          {taken}/{supplements.length} taken
        </span>
      }
    >
      {supplements.length === 0 ? (
        <p className="text-muted-foreground/60 py-4 text-center text-xs">
          No supplements configured
        </p>
      ) : (
        <div className="space-y-3">
          {supplements.map((s) => {
            const isTaken = todayLog[s.id] === 'taken';
            return (
              <button
                key={s.id}
                onClick={() => markTaken(s.id)}
                className="flex min-h-[44px] w-full items-center gap-3 py-2 text-left"
              >
                {isTaken ? (
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                ) : (
                  <Circle size={16} className="text-muted-foreground/40 shrink-0" />
                )}
                <span
                  className={`flex-1 truncate text-sm ${isTaken ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {s.name}
                </span>
                <span className="text-muted-foreground/60 text-[10px]">{s.dosage}</span>
              </button>
            );
          })}
        </div>
      )}
    </DashboardWidget>
  );
}
