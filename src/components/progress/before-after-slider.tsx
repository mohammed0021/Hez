'use client';

import { useRef, useState, useCallback } from 'react';

export function BeforeAfterSlider({ beforeUrl, afterUrl, beforeLabel = 'Before', afterLabel = 'After' }: { beforeUrl: string; afterUrl: string; beforeLabel?: string; afterLabel?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => { if (isDragging) handleMove(e.clientX); };
  const onTouchMove = (e: React.TouchEvent) => { handleMove(e.touches[0]!.clientX); };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-md mx-auto select-none overflow-hidden rounded-2xl bg-muted"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
    >
      <img src={beforeUrl} alt={beforeLabel} className="absolute inset-0 size-full object-cover" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={afterUrl} alt={afterLabel} className="absolute top-0 left-0 size-full object-cover max-w-none" style={{ width: `${100 / (position / 100)}%` }} draggable={false} />
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-10"
        style={{ left: `${position}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#666" strokeWidth="2">
            <path d="M6 4L3 8L6 12" />
            <path d="M10 4L13 8L10 12" />
          </svg>
        </div>
      </div>

      <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">{beforeLabel}</span>
      <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">{afterLabel}</span>
    </div>
  );
}
