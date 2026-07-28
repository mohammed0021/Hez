'use client';

import { MobileLayout } from '@/components/mobile-layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <MobileLayout title="You're Offline">
      <div className="min-h-screen-safe flex flex-col items-center justify-center px-4 pt-4 pb-24 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-muted mb-6 flex size-20 items-center justify-center rounded-3xl"
        >
          <WifiOff size={36} className="text-muted-foreground" />
        </motion.div>
        <h1 className="text-foreground text-xl font-bold">No Internet Connection</h1>
        <p className="text-muted-foreground mt-2 max-w-xs text-sm">
          Don&apos;t worry! Your saved workouts are available offline. Connect to the internet to
          sync your progress.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
          <RefreshCw size={16} />
          Try Again
        </Button>
      </div>
    </MobileLayout>
  );
}
