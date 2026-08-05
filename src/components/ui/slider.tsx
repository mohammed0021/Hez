'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  color?: string;
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  suffix = '',
  color = '#10b981',
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const pct = ((value - min) / (max - min)) * 100;

  const getValueFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      return Math.max(min, Math.min(max, stepped));
    },
    [min, max, step, value],
  );

  const onDown = useCallback(
    (clientX: number) => {
      setDragging(true);
      onChange(getValueFromClientX(clientX));
    },
    [getValueFromClientX, onChange],
  );

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX =
        'touches' in e && e.touches.length > 0 ? e.touches[0]!.clientX : (e as MouseEvent).clientX;
      onChange(getValueFromClientX(clientX));
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging, getValueFromClientX, onChange]);

  return (
    <div className="relative w-full py-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-medium">
          {min}
          {suffix}
        </span>
        <div
          className="bg-background border-border text-foreground flex items-center justify-center rounded-xl border-2 px-4 py-1 text-xl font-bold tabular-nums"
          style={{ borderColor: color }}
        >
          {value}
          {suffix && <span className="text-muted-foreground ml-1 text-sm">{suffix}</span>}
        </div>
        <span className="text-muted-foreground text-xs font-medium">
          {max}
          {suffix}
        </span>
      </div>
      <div
        ref={trackRef}
        className="relative h-3 cursor-pointer"
        onMouseDown={(e) => onDown(e.clientX)}
        onTouchStart={(e) => {
          if (e.touches.length > 0) onDown(e.touches[0]!.clientX);
        }}
      >
        <div className="bg-muted absolute top-1/2 right-0 left-0 h-2 -translate-y-1/2 rounded-full" />
        <div
          className="absolute top-1/2 left-0 h-2 -translate-y-1/2 rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(to right, ${color}40, ${color})`,
          }}
        />
        <div
          className="absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border-4 shadow-lg transition-transform"
          style={{
            left: `calc(${pct}% - 14px)`,
            borderColor: color,
            backgroundColor: '#fff',
            transform: 'translateY(-50%) scale(1.1)',
          }}
        />
      </div>
    </div>
  );
}
