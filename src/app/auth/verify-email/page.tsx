'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useToastStore } from '@/stores/toast-store';
import { createClient } from '@/lib/supabase-client';

export default function VerifyEmailPage() {
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
      toast.error('Unable to determine your email address. Please try logging in again.');
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
        toast.success('Verification email sent!');
      }
    } catch {
      toast.error('Failed to resend verification email');
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
      toast.success('Email verified! Welcome to Hêz.');
      router.replace('/onboarding');
    } else {
      toast.error('Email not yet verified. Check your inbox or resend.');
    }
  };

  return (
    <div className="min-h-screen-safe bg-background flex flex-col px-6 pt-16 pb-8">
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
        className="flex flex-1 flex-col items-center justify-center text-center"
      >
        <div className="bg-primary/10 mb-6 flex size-20 items-center justify-center rounded-[2rem]">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Mail size={36} className="text-primary" />
          </motion.div>
        </div>
        <h1 className="text-foreground text-2xl font-bold">Check your email</h1>
        <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
          We sent a verification link to your email. Click the link to activate your account.
        </p>

        <div className="mt-8 w-full max-w-xs space-y-3">
          <Button className="w-full" onClick={handleCheck}>
            I&apos;ve verified my email
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={isResending}
          >
            <RefreshCw size={16} className={isResending ? 'animate-spin' : ''} />
            {isResending ? 'Sending...' : 'Resend email'}
          </Button>
        </div>

        <p className="text-muted-foreground mt-6 text-xs">
          Didn&apos;t receive it? Check your spam folder or try a different email address.
        </p>
      </motion.div>
    </div>
  );
}
