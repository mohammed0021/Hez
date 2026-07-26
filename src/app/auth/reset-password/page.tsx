'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas/auth';
import { updatePassword } from '@/services/auth';
import { useToastStore } from '@/stores/toast-store';

export default function ResetPasswordPage() {
  const router = useRouter();
  const toast = useToastStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await updatePassword(data.password);
      toast.success('Password updated successfully!');
      router.replace('/');
    } catch {
      toast.error('Failed to update password. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen-safe flex-col bg-background px-6 pt-16 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1"
      >
        <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-primary">
          <Lock size={20} className="text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Set new password</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Choose a strong password you haven&apos;t used before.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                autoFocus
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              <CheckCircle size={18} />
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
