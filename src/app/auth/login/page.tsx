'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, LogIn } from 'lucide-react';

import { AuthLayout } from '@/components/auth/auth-layout';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginFormData } from '@/schemas/auth';
import { signInWithEmail } from '@/services/auth';
import { useToastStore } from '@/stores/toast-store';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const toast = useToastStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      toast.success(t('welcome_back_toast'));
      router.replace('/');
    } catch (err) {
      toast.error(t('invalid_credentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen-safe flex flex-col items-center justify-center p-4">
      <AuthLayout title={t('login_title')} subtitle={t('login_subtitle')}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full max-w-sm space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('email_placeholder')}
              autoCapitalize="none"
              autoComplete="email"
              autoFocus
              {...register('email')}
            />
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('password')}</Label>
              <Link href="/auth/forgot-password" className="text-primary text-xs font-medium">
                {t('forgot_password')}
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('password_placeholder')}
                autoComplete="current-password"
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

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="min-h-[44px] w-full" size="lg" disabled={isLoading}>
              <LogIn size={18} />
              {isLoading ? t('signing_in') : t('sign_in')}
            </Button>
          </motion.div>

          <SocialAuthButtons isLoading={isLoading} />

          <p className="text-muted-foreground text-center text-sm">
            {t('dont_have_account')}{' '}
            <Link href="/auth/register" className="text-primary font-medium">
              {t('sign_up')}
            </Link>
          </p>
        </form>
      </AuthLayout>
    </div>
  );
}
