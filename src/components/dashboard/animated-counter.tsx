'use client';

export function AnimatedCounter({
  value,
  suffix = '',
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <span>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
