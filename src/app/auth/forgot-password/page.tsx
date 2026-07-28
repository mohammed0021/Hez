'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/auth';
import { sendPasswordResetEmail } from '@/services/auth';
import { useToastStore } from '@/stores/toast-store';

export default function ForgotPasswordPage() {
  const toast = useToastStore();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(data.email);
      setSent(true);
      toast.success('Check your email for reset instructions');
    } catch {
      toast.error('Failed to send reset email. Try again.');
    } finally {
      setIsLoading(false);
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1"
        >
          <div className="bg-primary mb-4 inline-flex size-10 items-center justify-center rounded-2xl">
            <Mail size={20} className="text-primary-foreground" />
          </div>
          <h1 className="text-foreground text-2xl font-bold">Reset password</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            {sent
              ? 'Email sent! Check your inbox for the reset link.'
              : "Enter your email and we'll send you a reset link."}
          </p>
        </motion.div>

        {!sent ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoFocus
                  {...register('email')}
                />
                {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
              </div>

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="min-h-[44px] w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  <Send size={18} />
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8"
          >
            <Button
              variant="outline"
              className="min-h-[44px] w-full"
              onClick={() => setSent(false)}
            >
              Send again
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
