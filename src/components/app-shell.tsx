'use client';

import { Sidebar } from './sidebar';
import { BottomNav } from './bottom-nav';
import { TopHeader } from './top-header';
import { CommandPalette } from './command-palette';
import { PageTransition } from './page-transition';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <CommandPalette />

      <div className="flex flex-1 flex-col md:pl-64">
        <TopHeader />

        <main className="flex-1 px-4 pb-20 pt-4 md:pb-6">
          <div className="mx-auto max-w-5xl">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
