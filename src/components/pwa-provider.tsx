'use client';

import { useEffect } from 'react';
import { listenForInstallPrompt } from '@/lib/pwa';
import { InstallPrompt } from './install-prompt';
import { UpdatePrompt } from './update-prompt';
import { ToastContainer } from '@/components/ui/toast';

interface PwaProviderProps {
  children: React.ReactNode;
}

export function PwaProvider({ children }: PwaProviderProps) {
  useEffect(() => {
    listenForInstallPrompt();
  }, []);

  return (
    <>
      {children}
      <InstallPrompt />
      <UpdatePrompt />
      <ToastContainer />
    </>
  );
}
