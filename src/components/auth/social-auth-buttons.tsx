'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Globe, Apple } from 'lucide-react';
import { signInWithGoogle, signInWithApple } from '@/services/auth';
import { useState } from 'react';

interface SocialAuthButtonsProps {
  isLoading?: boolean;
}

export function SocialAuthButtons({ isLoading }: SocialAuthButtonsProps) {
  const [loading, setLoading] = useState<'google' | 'apple' | null>(null);

  const handleGoogle = async () => {
    setLoading('google');
    try {
      await signInWithGoogle();
    } catch {
      setLoading(null);
    }
  };

  const handleApple = async () => {
    setLoading('apple');
    try {
      await signInWithApple();
    } catch {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

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
