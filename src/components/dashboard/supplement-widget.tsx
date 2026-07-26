'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { DashboardWidget } from './widget-shell';

const supplements = [
  { name: 'Whey Protein', taken: true, dosage: '1 scoop' },
  { name: 'Creatine', taken: true, dosage: '5g' },
  { name: 'Vitamin D3', taken: false, dosage: '2000 IU' },
  { name: 'Omega-3', taken: false, dosage: '2 caps' },
];

export function SupplementWidget() {
  const taken = supplements.filter((s) => s.taken).length;

  return (
    <DashboardWidget
      title="Supplements"
      action={<span className="text-primary">{taken}/{supplements.length} taken</span>}
    >
      <div className="space-y-2">
        {supplements.map((s) => (
          <div key={s.name} className="flex items-center gap-3">
            {s.taken ? (
              <CheckCircle2 size={16} className="shrink-0 text-primary" />
            ) : (
              <Circle size={16} className="shrink-0 text-muted-foreground/40" />
            )}
            <span className={`flex-1 text-sm ${s.taken ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s.name}
            </span>
            <span className="text-[10px] text-muted-foreground/60">{s.dosage}</span>
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
}
