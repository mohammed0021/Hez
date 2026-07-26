'use client';

import { useMemo } from 'react';

interface DayData {
  date: string;
  volume: number;
  sessions: number;
}

export function VolumeHeatmap({ data, startDate, endDate }: { data: DayData[]; startDate: string; endDate: string }) {
  const weeks = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days: { date: string; day: number; volume: number }[] = [];

    const d = new Date(start);
    while (d <= end) {
      const dateStr = d.toISOString().slice(0, 10);
      const entry = data.find((x) => x.date === dateStr);
      days.push({ date: dateStr, day: d.getDay(), volume: entry?.volume || 0 });
      d.setDate(d.getDate() + 1);
    }

    // Group into weeks
    const weeks: { date: string; days: { date: string; day: number; volume: number }[] }[] = [];
    let currentWeek: { date: string; day: number; volume: number }[] = [];
    for (const day of days) {
      currentWeek.push(day);
      if (day.day === 6) {
        weeks.push({ date: day.date, days: currentWeek });
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) weeks.push({ date: currentWeek[currentWeek.length - 1]!.date, days: currentWeek });
    return weeks;
  }, [data, startDate, endDate]);

  const maxVolume = Math.max(...data.map((d) => d.volume), 1);

  return (
    <div className="overflow-x-auto scrollbar-none">
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 pr-2 pt-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <span key={d} className="text-[8px] text-muted-foreground h-[14px] leading-[14px]">{d}</span>
          ))}
        </div>
        <div className="flex gap-1">
          {weeks.map((week) => (
            <div key={week.date} className="flex flex-col gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map((dow) => {
                const day = week.days.find((d) => d.day === dow);
                if (!day) return <div key={dow} className="size-[14px]" />;
                const intensity = Math.min(day.volume / maxVolume, 1);
                const bg = day.volume === 0
                  ? 'bg-muted/30'
                  : intensity > 0.75
                    ? 'bg-primary'
                    : intensity > 0.4
                      ? 'bg-primary/70'
                      : 'bg-primary/40';
                return (
                  <div
                    key={dow}
                    className={`size-[14px] rounded-sm ${bg}`}
                    title={`${day.date}: ${day.volume.toLocaleString()} kg`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2 justify-end text-[8px] text-muted-foreground">
        <span>Less</span>
        <div className="size-[10px] rounded-sm bg-muted/30" />
        <div className="size-[10px] rounded-sm bg-primary/40" />
        <div className="size-[10px] rounded-sm bg-primary/70" />
        <div className="size-[10px] rounded-sm bg-primary" />
        <span>More</span>
      </div>
    </div>
  );
}
