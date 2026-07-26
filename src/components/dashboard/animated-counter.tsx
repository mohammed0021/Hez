'use client';

import { useEffect, useState, useRef } from 'react';

export function AnimatedCounter({
  value,
  suffix = '',
  decimals = 0,
  duration = 1000,
  prefix = '',
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  prefix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef<number>(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return (
    <span>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}
