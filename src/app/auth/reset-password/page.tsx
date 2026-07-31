'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas/auth';
import { updatePassword } from '@/services/auth';
import { useToastStore } from '@/stores/toast-store';

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
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
      toast.success(t('password_updated'));
      router.replace('/');
    } catch {
      toast.error(t('password_update_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen-safe flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-primary mb-4 inline-flex size-10 items-center justify-center rounded-2xl">
            <Lock size={20} className="text-primary-foreground" />
          </div>
          <h1 className="text-foreground text-2xl font-bold">{t('reset_password_title')}</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">{t('reset_password_subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">{t('new_password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('password_min_hint')}
                  autoComplete="new-password"
                  autoFocus
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirm_password')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('confirm_password_placeholder')}
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="min-h-[44px] w-full" size="lg" disabled={isLoading}>
                <CheckCircle size={18} />
                {isLoading ? t('updating') : t('update_password')}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
