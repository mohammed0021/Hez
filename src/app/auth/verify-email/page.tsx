'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useToastStore } from '@/stores/toast-store';
import { createClient } from '@/lib/supabase-client';

export default function VerifyEmailPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const toast = useToastStore();
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
    });
  }, []);

  const handleResend = async () => {
    if (!email) {
      toast.error(t('no_email_found'));
      return;
    }
    setIsResending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t('verification_sent'));
      }
    } catch {
      toast.error(t('resend_failed'));
    } finally {
      setIsResending(false);
    }
  };

  const handleCheck = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email_confirmed_at) {
      toast.success(t('email_verified'));
      router.replace('/onboarding');
    } else {
      toast.error(t('not_verified_yet'));
    }
  };

  return (
    <div className="min-h-screen-safe flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link
          href="/auth/login"
          className="bg-muted mb-6 flex size-10 items-center justify-center rounded-xl"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex flex-col items-center justify-center text-center"
        >
          <div className="bg-primary/10 mb-6 flex size-20 items-center justify-center rounded-[2rem]">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Mail size={36} className="text-primary" />
            </motion.div>
          </div>
          <h1 className="text-foreground text-2xl font-bold">{t('verify_email_title')}</h1>
          <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
            {t('verify_email_subtitle')}
          </p>

          <div className="mt-8 w-full max-w-xs space-y-3">
            <Button className="min-h-[44px] w-full" onClick={handleCheck}>
              {t('i_verified_email')}
            </Button>
            <Button
              variant="outline"
              className="min-h-[44px] w-full"
              onClick={handleResend}
              disabled={isResending}
            >
              <RefreshCw size={16} className={isResending ? 'animate-spin' : ''} />
              {isResending ? t('sending') : t('resend_email')}
            </Button>
          </div>

          <p className="text-muted-foreground mt-6 text-xs">{t('spam_hint')}</p>
        </motion.div>
      </div>
    </div>
  );
}
