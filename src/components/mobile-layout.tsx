'use client';

import { AppHeader } from './app-header';
import { PullToRefresh } from './pull-to-refresh';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  onRefresh?: () => Promise<void>;
}

export function MobileLayout({
  children,
  title,
  showBack,
  onBack,
  rightAction,
  onRefresh,
}: MobileLayoutProps) {
  const content = (
    <main
      className="min-h-screen-safe mx-auto max-w-lg px-4"
      style={{
        paddingTop: 'calc(48px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {children}
    </main>
  );

  return (
    <>
      <AppHeader title={title} showBack={showBack} onBack={onBack} rightAction={rightAction} />
      {onRefresh ? <PullToRefresh onRefresh={onRefresh}>{content}</PullToRefresh> : content}
    </>
  );
}
