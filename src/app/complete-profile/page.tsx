'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { User, AtSign, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { completeProfileSchema, type CompleteProfileFormData } from '@/schemas/auth';
import { createClient } from '@/lib/supabase-client';
import { useToastStore } from '@/stores/toast-store';
import { useAuthStore } from '@/stores/auth-store';

const goals = [
  { value: 'build_muscle', emoji: '💪' },
  { value: 'lose_weight', emoji: '🔥' },
  { value: 'maintain', emoji: '⚖️' },
  { value: 'improve_endurance', emoji: '🏃' },
  { value: 'general_fitness', emoji: '🌟' },
] as const;

const GOAL_LABEL_KEYS: Record<(typeof goals)[number]['value'], string> = {
  build_muscle: 'build_muscle',
  lose_weight: 'lose_weight',
  maintain: 'maintain',
  improve_endurance: 'endurance',
  general_fitness: 'general_fitness',
};

export default function CompleteProfilePage() {
  const tp = useTranslations('profile');
  const tc = useTranslations('common');
  const to = useTranslations('onboarding');
  const router = useRouter();
  const toast = useToastStore();
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: { goal: undefined },
  });

  const selectedGoal = watch('goal');

  const onSubmit = async (data: CompleteProfileFormData) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        await supabase
          .from('profiles')
          .update({
            display_name: data.name,
            username: data.username,
            bio: data.bio,
            goal: data.goal,
            onboarding_completed: true,
          })
          .eq('id', user.id);
      }
      setOnboarded(true);
      localStorage.setItem('hez-onboarded', 'true');
      toast.success(tp('complete_toast'));
      router.replace('/');
    } catch {
      toast.error(tp('save_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen-safe bg-background flex flex-col px-4 pt-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-primary mb-2 inline-flex size-10 items-center justify-center rounded-2xl">
          <User size={20} className="text-primary-foreground" />
        </div>
        <h1 className="text-foreground mt-4 text-2xl font-bold">{tp('complete_profile')}</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">{tp('complete_profile_subtitle')}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-8 flex-1"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">{tp('display_name')}</Label>
            <Input
              id="name"
              placeholder="Alex Johnson"
              autoCapitalize="words"
              autoFocus
              {...register('name')}
            />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">{tp('username')}</Label>
            <div className="relative">
              <AtSign
                size={16}
                className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
              />
              <Input
                id="username"
                placeholder="username"
                autoCapitalize="none"
                autoComplete="username"
                className="pl-8"
                {...register('username')}
              />
            </div>
            {errors.username && (
              <p className="text-destructive text-xs">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">
              {tp('bio')} ({tc('optional')})
            </Label>
            <Input id="bio" placeholder={tp('bio_placeholder')} {...register('bio')} />
            {errors.bio && <p className="text-destructive text-xs">{errors.bio.message}</p>}
          </div>

          <div className="space-y-3">
            <Label>{tp('fitness_goal')}</Label>
            <div className="grid grid-cols-2 gap-2">
              {goals.map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => setValue('goal', goal.value, { shouldValidate: true })}
                  className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-all ${
                    selectedGoal === goal.value
                      ? 'bg-primary/15 ring-primary ring-2'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <span className="text-xl">{goal.emoji}</span>
                  <span className="text-foreground text-xs font-medium">
                    {tp(GOAL_LABEL_KEYS[goal.value])}
                  </span>
                </button>
              ))}
            </div>
            {errors.goal && <p className="text-destructive text-xs">{errors.goal.message}</p>}
          </div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              <ChevronRight size={18} />
              {isLoading ? tc('saving') : to('complete_setup')}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
