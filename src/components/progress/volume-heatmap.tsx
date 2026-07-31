'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface DayData {
  date: string;
  volume: number;
  sessions: number;
}

export function VolumeHeatmap({
  data,
  startDate,
  endDate,
}: {
  data: DayData[];
  startDate: string;
  endDate: string;
}) {
  const t = useTranslations();
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
    if (currentWeek.length > 0)
      weeks.push({ date: currentWeek[currentWeek.length - 1]!.date, days: currentWeek });
    return weeks;
  }, [data, startDate, endDate]);

  const maxVolume = Math.max(...data.map((d) => d.volume), 1);

  return (
    <div className="scrollbar-none overflow-x-auto">
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 pt-6 pr-2">
          {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(
            (d) => (
              <span key={d} className="text-muted-foreground h-[14px] text-[8px] leading-[14px]">
                {t(`calendar.${d}`)}
              </span>
            ),
          )}
        </div>
        <div className="flex gap-1">
          {weeks.map((week) => (
            <div key={week.date} className="flex flex-col gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map((dow) => {
                const day = week.days.find((d) => d.day === dow);
                if (!day) return <div key={dow} className="size-[14px]" />;
                const intensity = Math.min(day.volume / maxVolume, 1);
                const bg =
                  day.volume === 0
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
      <div className="text-muted-foreground mt-2 flex items-center justify-end gap-1.5 text-[8px]">
        <span>{t('common.less')}</span>
        <div className="bg-muted/30 size-[10px] rounded-sm" />
        <div className="bg-primary/40 size-[10px] rounded-sm" />
        <div className="bg-primary/70 size-[10px] rounded-sm" />
        <div className="bg-primary size-[10px] rounded-sm" />
        <span>{t('common.more')}</span>
      </div>
    </div>
  );
}
