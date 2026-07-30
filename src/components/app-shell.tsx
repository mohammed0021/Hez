'use client';

import { Sidebar } from './sidebar';
import { TopHeader } from './top-header';
import { CommandPalette } from './command-palette';
import { PageTransition } from './page-transition';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar />
      <CommandPalette />

      <div className="flex flex-1 flex-col md:pl-64">
        <TopHeader />

        <main className="flex-1 px-4 py-3 md:pb-6">
          <div className="mx-auto max-w-5xl">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
