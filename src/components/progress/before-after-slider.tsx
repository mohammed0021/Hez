'use client';

import { useRef, useState, useCallback } from 'react';

import { AlertTriangle } from 'lucide-react';

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);
  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0]!.clientX);
  };

  if (!beforeUrl && !afterUrl) {
    return (
      <div className="bg-muted flex aspect-square max-w-md items-center justify-center rounded-2xl">
        <div className="text-muted-foreground flex flex-col items-center gap-2">
          <AlertTriangle size={24} className="text-muted-foreground/40" />
          <p className="text-xs">No photos to compare</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-muted relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl select-none"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
    >
      {!beforeLoaded && !beforeError && (
        <div className="bg-muted absolute inset-0 flex items-center justify-center">
          <div className="bg-primary/20 size-8 animate-pulse rounded-full" />
        </div>
      )}
      {beforeError ? (
        <div className="bg-muted absolute inset-0 flex items-center justify-center">
          <AlertTriangle size={20} className="text-muted-foreground/40" />
        </div>
      ) : (
        <img
          src={beforeUrl}
          alt={beforeLabel}
          className={`absolute inset-0 size-full object-cover ${beforeLoaded ? '' : 'opacity-0'}`}
          draggable={false}
          onLoad={() => setBeforeLoaded(true)}
          onError={() => setBeforeError(true)}
        />
      )}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${afterUrl ? position : 0}%` }}
      >
        {!afterLoaded && !afterError && (
          <div className="bg-muted absolute inset-0 flex items-center justify-center">
            <div className="bg-primary/20 size-8 animate-pulse rounded-full" />
          </div>
        )}
        {afterError ? (
          <div className="bg-muted absolute inset-0 flex items-center justify-center">
            <AlertTriangle size={20} className="text-muted-foreground/40" />
          </div>
        ) : (
          <img
            src={afterUrl}
            alt={afterLabel}
            className={`absolute top-0 left-0 size-full max-w-none object-cover ${afterLoaded ? '' : 'opacity-0'}`}
            style={{ width: `${100 / ((afterUrl ? position : 50) / 100)}%` }}
            draggable={false}
            onLoad={() => setAfterLoaded(true)}
            onError={() => setAfterError(true)}
          />
        )}
      </div>

      {afterUrl && (
        <>
          <div
            className="absolute top-0 bottom-0 z-10 w-1 cursor-col-resize bg-white shadow-lg"
            style={{ left: `${position}%` }}
            onMouseDown={onMouseDown}
            onTouchStart={onMouseDown}
          >
            <div className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="#666"
                strokeWidth="2"
              >
                <path d="M6 4L3 8L6 12" />
                <path d="M10 4L13 8L10 12" />
              </svg>
            </div>
          </div>

          <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
            {beforeLabel}
          </span>
          <span className="absolute right-2 bottom-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
            {afterLabel}
          </span>
        </>
      )}
    </div>
  );
}
