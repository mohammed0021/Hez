'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { User, AtSign, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { completeProfileSchema, type CompleteProfileFormData } from '@/schemas/auth';
import { createClient } from '@/lib/supabase-client';
import { useToastStore } from '@/stores/toast-store';
import { useAuthStore } from '@/stores/auth-store';

const goals = [
  { value: 'build_muscle', label: 'Build Muscle', emoji: '💪' },
  { value: 'lose_weight', label: 'Lose Weight', emoji: '🔥' },
  { value: 'maintain', label: 'Maintain', emoji: '⚖️' },
  { value: 'improve_endurance', label: 'Endurance', emoji: '🏃' },
  { value: 'general_fitness', label: 'General Fitness', emoji: '🌟' },
] as const;

export default function CompleteProfilePage() {
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
          })
          .eq('id', user.id);
      }
      setOnboarded(true);
      localStorage.setItem('hez-onboarded', 'true');
      toast.success("Profile complete! Let's go!");
      router.replace('/');
    } catch {
      toast.error('Failed to save profile. Try again.');
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
        <h1 className="text-foreground mt-4 text-2xl font-bold">Complete your profile</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">Help us personalize your experience.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-8 flex-1"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
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
            <Label htmlFor="username">Username</Label>
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
            <Label htmlFor="bio">Bio (optional)</Label>
            <Input id="bio" placeholder="Tell us about yourself..." {...register('bio')} />
            {errors.bio && <p className="text-destructive text-xs">{errors.bio.message}</p>}
          </div>

          <div className="space-y-3">
            <Label>Fitness Goal</Label>
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
                  <span className="text-foreground text-xs font-medium">{goal.label}</span>
                </button>
              ))}
            </div>
            {errors.goal && <p className="text-destructive text-xs">{errors.goal.message}</p>}
          </div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              <ChevronRight size={18} />
              {isLoading ? 'Saving...' : 'Complete Setup'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
