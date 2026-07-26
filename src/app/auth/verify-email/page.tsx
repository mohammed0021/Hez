'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useToastStore } from '@/stores/toast-store';

export default function VerifyEmailPage() {
  const router = useRouter();
  const toast = useToastStore();
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsResending(false);
    toast.success('Verification email sent!');
  };

  const handleCheck = () => {
    router.refresh();
  };

  return (
    <div className="flex min-h-screen-safe flex-col bg-background px-6 pt-16 pb-8">
      <Link href="/auth/login" className="mb-6 flex size-10 items-center justify-center rounded-xl bg-muted">
        <ArrowLeft size={20} className="text-foreground" />
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex flex-1 flex-col items-center justify-center text-center"
      >
        <div className="mb-6 flex size-20 items-center justify-center rounded-[2rem] bg-primary/10">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Mail size={36} className="text-primary" />
          </motion.div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground leading-relaxed">
          We sent a verification link to your email. Click the link to activate your account.
        </p>

        <div className="mt-8 space-y-3 w-full max-w-xs">
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

        <p className="mt-6 text-xs text-muted-foreground">
          Didn&apos;t receive it? Check your spam folder or try a different email address.
        </p>
      </motion.div>
    </div>
  );
}
