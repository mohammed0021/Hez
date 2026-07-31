'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Globe, Apple, AlertCircle } from 'lucide-react';
import { signInWithGoogle, signInWithApple } from '@/services/auth';
import { useState } from 'react';

interface SocialAuthButtonsProps {
  isLoading?: boolean;
}

export function SocialAuthButtons({ isLoading }: SocialAuthButtonsProps) {
  const t = useTranslations('auth');
  const [loading, setLoading] = useState<'google' | 'apple' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setLoading('google');
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setLoading(null);
      setError(t('google_failed'));
    }
  };

  const handleApple = async () => {
    setLoading('apple');
    setError(null);
    try {
      await signInWithApple();
    } catch {
      setLoading(null);
      setError(t('apple_failed'));
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">{t('or_continue_with')}</span>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 flex items-center gap-2 rounded-xl p-3">
          <AlertCircle size={14} className="text-destructive shrink-0" />
          <p className="text-destructive text-xs">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={isLoading || loading !== null}
          >
            <Globe size={18} />
            Google
          </Button>
        </motion.div>
        <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleApple}
            disabled={isLoading || loading !== null}
          >
            <Apple size={18} />
            Apple
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
