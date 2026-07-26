'use client';

import { Calendar, Clock, Dumbbell } from 'lucide-react';
import { DashboardWidget } from './widget-shell';

export function UpcomingWorkoutWidget() {
  return (
    <DashboardWidget className="border-dashed bg-gradient-to-br from-primary/5 to-transparent">
      <div className="flex items-start gap-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <Calendar size={18} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Next: Push Day</p>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar size={11} /> Tomorrow</span>
            <span className="flex items-center gap-1"><Clock size={11} /> 07:00</span>
          </div>
          <div className="mt-2 flex gap-1.5">
            {['OHP', 'Incline', 'Lateral'].map((ex) => (
              <span key={ex} className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                {ex}
              </span>
            ))}
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
              +3 more
            </span>
          </div>
        </div>
        <button className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Dumbbell size={16} />
        </button>
      </div>
    </DashboardWidget>
  );
}
