'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

interface FabProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
}

export function Fab({ onClick, icon, label }: FabProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="fixed bottom-20 right-4 z-50 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-lg shadow-primary/25"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {icon || <Plus size={22} />}
      {label && <span className="text-sm font-medium">{label}</span>}
    </motion.button>
  );
}
