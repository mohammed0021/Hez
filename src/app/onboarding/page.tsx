'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { User, ChevronRight, ChevronLeft, Trophy, Zap, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAuthStore } from '@/stores/auth-store';
import {
  useProfileStore,
  type Gender,
  type FitnessGoal,
  type ExperienceLevel,
} from '@/stores/profile-store';
import { GENDER_OPTIONS, FITNESS_GOALS, EXPERIENCE_LEVELS } from '@/stores/profile-store';

const STEP_LABELS = ['name', 'gender', 'height', 'weight', 'goal', 'experience', 'days'];

const STEP_ICONS = [User, User, User, User, Target, Zap, Trophy];

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 px-4">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`size-2.5 rounded-full transition-all duration-300 ${
              i === step ? 'bg-primary w-8' : i < step ? 'bg-primary/60 w-2.5' : 'bg-muted w-2.5'
            }`}
          />
          {i < total - 1 && (
            <div
              className={`mx-1 h-0.5 w-6 rounded-full transition-colors duration-300 ${
                i < step ? 'bg-primary/60' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 400 : -400, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -400 : 400, opacity: 0, scale: 0.96 }),
};

export default function OnboardingPage() {
  const t = useTranslations('onboarding');
  const tc = useTranslations('common');
  const router = useRouter();

  const profileStore = useProfileStore();
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [displayName, setDisplayName] = useState(profileStore.displayName);
  const [gender, setGender] = useState<Gender>(profileStore.gender);
  const [heightCm, setHeightCm] = useState(profileStore.heightCm);
  const [weightKg, setWeightKg] = useState(profileStore.weightKg);
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>(profileStore.primaryGoal);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    profileStore.experienceLevel,
  );
  const [weeklyWorkoutGoal, setWeeklyWorkoutGoal] = useState(profileStore.weeklyWorkoutGoal);

  const totalSteps = STEP_LABELS.length;

  useEffect(() => {
    profileStore.updateProfile({
      displayName,
      gender,
      heightCm,
      weightKg,
      primaryGoal,
      experienceLevel,
      weeklyWorkoutGoal,
    });
  }, [
    displayName,
    gender,
    heightCm,
    weightKg,
    primaryGoal,
    experienceLevel,
    weeklyWorkoutGoal,
    profileStore,
  ]);

  const isStepValid = useCallback(() => {
    switch (step) {
      case 0:
        return displayName.trim().length >= 2;
      case 1:
        return true;
      case 2:
        return heightCm >= 50 && heightCm <= 300;
      case 3:
        return weightKg >= 10 && weightKg <= 500;
      case 4:
        return true;
      case 5:
        return true;
      case 6:
        return weeklyWorkoutGoal >= 1 && weeklyWorkoutGoal <= 7;
      default:
        return false;
    }
  }, [step, displayName, heightCm, weightKg, weeklyWorkoutGoal]);

  const goNext = useCallback(() => {
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [step, totalSteps]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const handleComplete = useCallback(async () => {
    setSubmitting(true);
    try {
      await profileStore.completeOnboarding({
        displayName,
        gender,
        heightCm,
        weightKg,
        primaryGoal,
        experienceLevel,
        weeklyWorkoutGoal,
      });
      setOnboarded(true);
      localStorage.setItem('hez-onboarded', 'true');
      router.replace('/dashboard');
    } catch {
      setSubmitting(false);
    }
  }, [
    displayName,
    gender,
    heightCm,
    weightKg,
    primaryGoal,
    experienceLevel,
    weeklyWorkoutGoal,
    profileStore,
    setOnboarded,
    router,
  ]);

  const stepTitles = [
    t('step_name'),
    t('step_gender'),
    t('step_height'),
    t('step_weight'),
    t('step_goal'),
    t('step_experience'),
    t('step_days'),
  ];
  const stepDescriptions = [
    t('step_name_desc'),
    t('step_gender_desc'),
    t('step_height_desc'),
    t('step_weight_desc'),
    t('step_goal_desc'),
    t('step_experience_desc'),
    t('step_days_desc'),
  ];

  return (
    <div className="min-h-screen-safe bg-background flex flex-col px-4 pt-4 pb-24">
      <div className="pt-2 pb-4">
        <StepIndicator step={step} total={totalSteps} />
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex h-full flex-col"
          >
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="bg-primary/10 flex size-14 items-center justify-center rounded-2xl">
                {(() => {
                  const Icon = STEP_ICONS[step]!;
                  return <Icon className="text-primary size-6" />;
                })()}
              </div>
              <h2 className="text-foreground mt-4 text-2xl font-bold">{stepTitles[step]}</h2>
              <p className="text-muted-foreground mt-1.5 text-sm">{stepDescriptions[step]}</p>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center">
              {step === 0 && (
                <div className="w-full max-w-sm space-y-4">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={t('name_placeholder')}
                    autoFocus
                    maxLength={50}
                    className="border-border bg-card text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20 w-full rounded-2xl border-2 px-5 py-4 text-lg transition-all outline-none focus:ring-2"
                  />
                </div>
              )}

              {step === 1 && (
                <div className="flex w-full max-w-sm flex-col gap-3">
                  {GENDER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setGender(opt.value)}
                      className={`flex min-h-[56px] items-center gap-3 rounded-2xl border-2 px-5 py-3 text-left transition-all duration-200 ${
                        gender === opt.value
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                      }`}
                    >
                      <span className="text-2xl">{opt.value === 'male' ? '♂️' : '♀️'}</span>
                      <span className="text-base font-medium">{t(opt.value)}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="w-full max-w-sm">
                  <Slider
                    min={100}
                    max={250}
                    step={1}
                    value={heightCm}
                    onChange={setHeightCm}
                    suffix=" cm"
                    color="#10b981"
                  />
                </div>
              )}

              {step === 3 && (
                <div className="w-full max-w-sm">
                  <Slider
                    min={30}
                    max={200}
                    step={0.5}
                    value={weightKg}
                    onChange={setWeightKg}
                    suffix=" kg"
                    color="#f59e0b"
                  />
                </div>
              )}

              {step === 4 && (
                <div className="flex w-full max-w-sm flex-col gap-3">
                  {FITNESS_GOALS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPrimaryGoal(opt.value)}
                      className={`flex min-h-[56px] items-center gap-3 rounded-2xl border-2 px-5 py-3 text-left transition-all duration-200 ${
                        primaryGoal === opt.value
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                      }`}
                    >
                      <span className="text-xl">
                        {opt.value === 'build_muscle'
                          ? '💪'
                          : opt.value === 'lose_fat'
                            ? '🔥'
                            : opt.value === 'maintain'
                              ? '⚖️'
                              : opt.value === 'increase_strength'
                                ? '🏋️'
                                : '🏃'}
                      </span>
                      <span className="text-base font-medium">{t(opt.value)}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 5 && (
                <div className="flex w-full max-w-sm flex-col gap-3">
                  {EXPERIENCE_LEVELS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setExperienceLevel(opt.value)}
                      className={`flex min-h-[56px] items-center gap-3 rounded-2xl border-2 px-5 py-3 text-left transition-all duration-200 ${
                        experienceLevel === opt.value
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                      }`}
                    >
                      <span className="text-base font-medium">{t(opt.value)}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 6 && (
                <div className="w-full max-w-sm">
                  <Slider
                    min={1}
                    max={7}
                    step={1}
                    value={weeklyWorkoutGoal}
                    onChange={setWeeklyWorkoutGoal}
                    suffix=" days"
                    color="#8b5cf6"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-2 px-2 pt-4">
        {step < totalSteps - 1 ? (
          <Button size="lg" className="w-full" onClick={goNext} disabled={!isStepValid()}>
            {tc('continue')}
            <ChevronRight className="ml-1 size-4" />
          </Button>
        ) : (
          <Button size="lg" className="w-full" onClick={handleComplete} disabled={submitting}>
            {submitting ? t('setting_up') : t('complete_setup')}
          </Button>
        )}
        {step > 0 && (
          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={goBack}
            disabled={submitting}
          >
            <ChevronLeft className="mr-1 size-4" />
            {tc('back')}
          </Button>
        )}
      </div>
    </div>
  );
}
