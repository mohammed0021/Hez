'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { DashboardWidget } from './widget-shell';
import { useSupplementStore } from '@/stores/supplement-store';

export function SupplementWidget() {
  const supplements = useSupplementStore((s) => s.supplements);
  const todayLog = useSupplementStore((s) => s.getTodayLog());
  const markTaken = useSupplementStore((s) => s.markTaken);

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
        <div className="space-y-2">
          {supplements.map((s) => {
            const isTaken = todayLog[s.id] === 'taken';
            return (
              <button
                key={s.id}
                onClick={() => markTaken(s.id)}
                className="flex w-full items-center gap-3 text-left"
              >
                {isTaken ? (
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                ) : (
                  <Circle size={16} className="text-muted-foreground/40 shrink-0" />
                )}
                <span
                  className={`flex-1 text-sm ${isTaken ? 'text-foreground' : 'text-muted-foreground'}`}
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
