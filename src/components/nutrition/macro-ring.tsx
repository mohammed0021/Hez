import { motion } from 'framer-motion';

export function MacroRing({
  value,
  max,
  label,
  unit = 'g',
  color = 'stroke-primary',
}: {
  value: number;
  max: number;
  label: string;
  unit?: string;
  color?: string;
}) {
  const size = 60;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference * (1 - percentage);

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative inline-flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted"
            opacity={0.15}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={color}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-foreground text-[11px] font-bold">
            {Math.round(percentage * 100)}%
          </span>
        </div>
      </div>
      <span className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
        {label}
      </span>
      <span className="text-foreground text-[10px] font-semibold">
        {value}/{max}
        {unit}
      </span>
    </div>
  );
}
