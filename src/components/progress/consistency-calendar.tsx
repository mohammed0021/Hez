'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

export function ConsistencyCalendar({
  dates,
  year,
  month,
}: {
  dates: string[];
  year: number;
  month: number;
}) {
  const t = useTranslations('calendar');
  const grid = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: { date: string | null; active: boolean; isToday: boolean }[] = [];

    // Fill leading empty cells
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({ date: null, active: false, isToday: false });
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: dateStr, active: dates.includes(dateStr), isToday: dateStr === todayStr });
    }

    return days;
  }, [dates, year, month]);

  const monthKeys = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  return (
    <div>
      <p className="text-foreground mb-2 text-xs font-medium">
        {t(monthKeys[month]!)} {year}
      </p>
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
          <div key={d} className="text-muted-foreground text-center text-[8px] font-medium">
            {d}
          </div>
        ))}
        {grid.map((day, i) => (
          <div
            key={i}
            className={`flex aspect-square items-center justify-center rounded-sm text-[9px] ${
              !day.date
                ? ''
                : day.active
                  ? 'bg-primary text-primary-foreground font-medium'
                  : day.isToday
                    ? 'border-border bg-muted/50 text-muted-foreground border'
                    : 'bg-muted/20 text-muted-foreground'
            }`}
          >
            {day.date ? new Date(day.date).getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  );
}
