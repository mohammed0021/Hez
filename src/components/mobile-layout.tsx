'use client';

import { BottomNav } from './bottom-nav';
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
    <main className="mx-auto max-w-lg pb-20 pt-12 safe-bottom safe-top min-h-screen-safe">
      {children}
    </main>
  );

  return (
    <>
      <AppHeader title={title} showBack={showBack} onBack={onBack} rightAction={rightAction} />
      {onRefresh ? <PullToRefresh onRefresh={onRefresh}>{content}</PullToRefresh> : content}
      <BottomNav />
    </>
  );
}
