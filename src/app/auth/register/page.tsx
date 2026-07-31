'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

import { AuthLayout } from '@/components/auth/auth-layout';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterFormData } from '@/schemas/auth';
import { signUpWithEmail } from '@/services/auth';
import { useToastStore } from '@/stores/toast-store';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const toast = useToastStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await signUpWithEmail(data.email, data.password, data.name);
      toast.success(t('account_created'));
      router.replace('/auth/verify-email');
    } catch (err) {
      const message = err instanceof Error ? err.message : t('create_account_failed');
      toast.error(message);
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen-safe flex flex-col items-center justify-center p-4">
      <AuthLayout title={t('register_title')} subtitle={t('register_subtitle')}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('full_name')}</Label>
            <Input
              id="name"
              placeholder="Alex Johnson"
              autoCapitalize="words"
              autoComplete="name"
              autoFocus
              {...register('name')}
            />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('email_placeholder')}
              autoCapitalize="none"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('password_min_hint')}
                autoComplete="new-password"
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
              <UserPlus size={18} />
              {isLoading ? t('creating_account') : t('create_account')}
            </Button>
          </motion.div>

          <SocialAuthButtons isLoading={isLoading} />

          <p className="text-muted-foreground text-center text-sm">
            {t('already_have_account')}{' '}
            <Link href="/auth/login" className="text-primary font-medium">
              {t('sign_in_link')}
            </Link>
          </p>
        </form>
      </AuthLayout>
    </div>
  );
}
