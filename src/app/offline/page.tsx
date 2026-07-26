'use client';

import { MobileLayout } from '@/components/mobile-layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <MobileLayout title="You're Offline">
      <div className="flex flex-col items-center justify-center px-6 pt-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-muted"
        >
          <WifiOff size={36} className="text-muted-foreground" />
        </motion.div>
        <h1 className="text-xl font-bold text-foreground">No Internet Connection</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Don&apos;t worry! Your saved workouts are available offline. Connect to the internet to sync your progress.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={16} />
          Try Again
        </Button>
      </div>
    </MobileLayout>
  );
}
