'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { useSettingsStore } from '@/stores/settings-store';
import { useThemeStore } from '@/stores/theme-store';
import { themes } from '@/types/theme';
import type { Gender, FitnessGoal, ExperienceLevel, ActivityLevel } from '@/stores/profile-store';
import {
  GENDER_OPTIONS,
  FITNESS_GOALS,
  EXPERIENCE_LEVELS,
  ACTIVITY_LEVELS,
} from '@/stores/profile-store';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Ruler,
  Dumbbell,
  Activity,
  ClipboardList,
} from 'lucide-react';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ku', label: 'Kurdî' },
  { value: 'ar', label: 'العربية' },
];

const WORKOUT_DURATIONS = [30, 45, 60, 90];

const WORKOUT_DAYS = [1, 2, 3, 4, 5, 6, 7];

const STEP_ICONS = [User, Ruler, Dumbbell, Activity, ClipboardList];

const STEP_LABELS = [
  'Personal Info',
  'Body Metrics',
  'Fitness Profile',
  'Activity & Preferences',
  'Summary',
];

function calculateAge(birthday: string): number {
  const birth = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function NumberStepper({
  value,
  onChange,
  min,
  max,
  step,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  const s = step ?? 1;
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - s))}
        disabled={value <= min}
        className="border-border bg-card text-foreground hover:border-primary/50 flex size-11 items-center justify-center rounded-xl border-2 transition-all disabled:opacity-30"
      >
        <ChevronLeft className="size-5" />
      </button>
      <div className="bg-muted flex min-w-[100px] items-center justify-center gap-1 rounded-xl px-4 py-3">
        <span className="text-foreground text-2xl font-bold tabular-nums">{value}</span>
        {suffix && <span className="text-muted-foreground text-sm">{suffix}</span>}
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + s))}
        disabled={value >= max}
        className="border-border bg-card text-foreground hover:border-primary/50 flex size-11 items-center justify-center rounded-xl border-2 transition-all disabled:opacity-30"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 400 : -400, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -400 : 400, opacity: 0 }),
};

export default function OnboardingPage() {
  const router = useRouter();

  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const settingsStore = useSettingsStore();
  const themeStore = useThemeStore();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [birthday, setBirthday] = useState('');

  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('build_muscle');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('intermediate');

  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [workoutDays, setWorkoutDays] = useState(4);
  const [workoutDuration, setWorkoutDuration] = useState(45);
  const [language, setLanguage] = useState('en');
  const [themeId, setThemeId] = useState('hez-green');

  const [submitting, setSubmitting] = useState(false);

  const age = useMemo(() => (birthday ? calculateAge(birthday) : 0), [birthday]);

  const isStepValid = useMemo(() => {
    switch (step) {
      case 0:
        return fullName.trim().length > 0 && birthday.length > 0 && age >= 10 && age <= 120;
      case 1:
        return heightCm >= 50 && heightCm <= 300 && weightKg >= 10 && weightKg <= 500;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  }, [step, fullName, birthday, age, heightCm, weightKg]);

  const goNext = useCallback(() => {
    if (step < 4) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [step]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const handleComplete = useCallback(async () => {
    setSubmitting(true);
    try {
      const onboardingData = {
        displayName: fullName,
        gender,
        birthday,
        heightCm,
        weightKg,
        primaryGoal: fitnessGoal,
        experienceLevel,
        activityLevel,
        weeklyWorkoutGoal: workoutDays,
        workoutDuration,
        unitSystem,
      };

      await profileStore.completeOnboarding(onboardingData);

      settingsStore.setLanguage(language);
      themeStore.setThemeId(themeId as never);

      authStore.setOnboarded(true);
      router.replace('/dashboard');
    } catch {
      setSubmitting(false);
    }
  }, [
    fullName,
    gender,
    birthday,
    heightCm,
    weightKg,
    fitnessGoal,
    experienceLevel,
    activityLevel,
    workoutDays,
    workoutDuration,
    unitSystem,
    language,
    themeId,
    profileStore,
    settingsStore,
    themeStore,
    authStore,
    router,
  ]);

  const totalSteps = 5;

  return (
    <div className="min-h-screen-safe bg-background flex flex-col px-4 pt-4 pb-24">
      <div className="flex items-center justify-between px-2 pt-2 pb-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  i === step
                    ? 'bg-primary text-primary-foreground scale-110'
                    : i < step
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`mx-1 h-0.5 w-6 rounded-full transition-colors duration-300 ${
                    i < step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
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
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-primary/10 flex size-10 items-center justify-center rounded-2xl">
                {(() => {
                  const Icon = STEP_ICONS[step]!;
                  return <Icon className="text-primary size-5" />;
                })()}
              </div>
              <div>
                <h2 className="text-foreground text-xl font-bold">{STEP_LABELS[step]}</h2>
                {step === 0 && (
                  <p className="text-muted-foreground text-sm">Tell us about yourself</p>
                )}
                {step === 1 && (
                  <p className="text-muted-foreground text-sm">Your body measurements</p>
                )}
                {step === 2 && (
                  <p className="text-muted-foreground text-sm">Define your fitness path</p>
                )}
                {step === 3 && (
                  <p className="text-muted-foreground text-sm">Customize your experience</p>
                )}
                {step === 4 && (
                  <p className="text-muted-foreground text-sm">Review before starting</p>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto pr-1 pb-4">
              {/* Step 0 - Personal Info */}
              {step === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="border-border bg-card text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20 w-full rounded-xl border-2 px-4 py-3 text-base transition-all outline-none focus:ring-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-medium">Gender</label>
                    <div className="flex gap-2">
                      {GENDER_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setGender(opt.value)}
                          className={`min-h-[44px] flex-1 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                            gender === opt.value
                              ? 'border-primary bg-primary/10 text-primary shadow-sm'
                              : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-medium">Date of Birth</label>
                    <input
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="border-border bg-card text-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border-2 px-4 py-3 text-base transition-all outline-none focus:ring-2"
                    />
                    {birthday && age > 0 && (
                      <p className="text-muted-foreground text-sm">
                        You are <span className="text-foreground font-semibold">{age}</span> years
                        old
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 1 - Body Metrics */}
              {step === 1 && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-foreground text-sm font-medium">Height</label>
                    <div className="flex justify-center">
                      <NumberStepper
                        value={heightCm}
                        onChange={setHeightCm}
                        min={50}
                        max={300}
                        suffix="cm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-foreground text-sm font-medium">Weight</label>
                    <div className="flex justify-center">
                      <NumberStepper
                        value={weightKg}
                        onChange={setWeightKg}
                        min={10}
                        max={500}
                        suffix="kg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-medium">Units</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setUnitSystem('metric')}
                        className={`min-h-[44px] flex-1 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                          unitSystem === 'metric'
                            ? 'border-primary bg-primary/10 text-primary shadow-sm'
                            : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                        }`}
                      >
                        Metric (kg/cm)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnitSystem('imperial')}
                        className={`min-h-[44px] flex-1 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                          unitSystem === 'imperial'
                            ? 'border-primary bg-primary/10 text-primary shadow-sm'
                            : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                        }`}
                      >
                        Imperial (lbs/ft)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 - Fitness Profile */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-medium">Fitness Goal</label>
                    <div className="flex flex-wrap gap-2">
                      {FITNESS_GOALS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFitnessGoal(opt.value)}
                          className={`min-h-[44px] flex-1 basis-[calc(50%-4px)] rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all duration-200 ${
                            fitnessGoal === opt.value
                              ? 'border-primary bg-primary/10 text-primary shadow-sm'
                              : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-medium">Experience Level</label>
                    <div className="flex gap-2">
                      {EXPERIENCE_LEVELS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setExperienceLevel(opt.value)}
                          className={`min-h-[44px] flex-1 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            experienceLevel === opt.value
                              ? 'border-primary bg-primary/10 text-primary shadow-sm'
                              : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 - Activity & Preferences */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-medium">Activity Level</label>
                    <div className="flex flex-wrap gap-2">
                      {ACTIVITY_LEVELS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setActivityLevel(opt.value)}
                          className={`min-h-[44px] flex-1 basis-[calc(50%-4px)] rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all duration-200 ${
                            activityLevel === opt.value
                              ? 'border-primary bg-primary/10 text-primary shadow-sm'
                              : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-medium">
                      Workout Days Per Week:{' '}
                      <span className="text-primary font-bold">{workoutDays}</span>
                    </label>
                    <div className="flex gap-1.5">
                      {WORKOUT_DAYS.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setWorkoutDays(d)}
                          className={`min-h-[44px] flex-1 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                            workoutDays === d
                              ? 'border-primary bg-primary/10 text-primary shadow-sm'
                              : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-medium">
                      Preferred Workout Duration
                    </label>
                    <div className="flex gap-2">
                      {WORKOUT_DURATIONS.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setWorkoutDuration(d)}
                          className={`min-h-[44px] flex-1 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                            workoutDuration === d
                              ? 'border-primary bg-primary/10 text-primary shadow-sm'
                              : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                          }`}
                        >
                          {d} min
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-medium">
                      Preferred Language
                    </label>
                    <div className="flex gap-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.value}
                          type="button"
                          onClick={() => setLanguage(lang.value)}
                          className={`min-h-[44px] flex-1 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                            language === lang.value
                              ? 'border-primary bg-primary/10 text-primary shadow-sm'
                              : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-medium">Theme Color</label>
                    <div className="flex flex-wrap gap-3">
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setThemeId(t.id)}
                          className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all duration-200 ${
                            themeId === t.id
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border bg-card hover:border-muted-foreground/30'
                          }`}
                        >
                          <div
                            className={`size-8 rounded-full ${
                              t.id === 'hez-green'
                                ? 'bg-emerald-500'
                                : t.id === 'blossom-pink'
                                  ? 'bg-pink-400'
                                  : t.id === 'ocean-blue'
                                    ? 'bg-blue-500'
                                    : t.id === 'purple'
                                      ? 'bg-purple-500'
                                      : t.id === 'orange'
                                        ? 'bg-orange-500'
                                        : t.id === 'crimson'
                                          ? 'bg-red-500'
                                          : t.id === 'midnight'
                                            ? 'bg-gray-900'
                                            : 'border border-gray-200 bg-gray-100'
                            }`}
                          />
                          <span className="text-muted-foreground text-[10px] font-medium">
                            {t.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 - Summary */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="bg-primary/5 border-primary/10 rounded-2xl border p-5 text-center">
                    <div className="bg-primary/10 mx-auto mb-3 flex size-16 items-center justify-center rounded-full">
                      <User className="text-primary size-7" />
                    </div>
                    <h3 className="text-foreground text-xl font-bold">
                      Welcome, {fullName.split(' ')[0]}!
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Here&apos;s a summary of your profile
                    </p>
                  </div>

                  <div className="space-y-3">
                    <SummarySection title="Personal Info">
                      <SummaryRow label="Name" value={fullName} />
                      <SummaryRow label="Gender" value={gender === 'male' ? 'Male' : 'Female'} />
                      <SummaryRow
                        label="Age"
                        value={`${age} years (${new Date(birthday).toLocaleDateString()})`}
                      />
                    </SummarySection>

                    <SummarySection title="Body Metrics">
                      <SummaryRow label="Height" value={`${heightCm} cm`} />
                      <SummaryRow label="Weight" value={`${weightKg} kg`} />
                      <SummaryRow
                        label="Units"
                        value={unitSystem === 'metric' ? 'Metric' : 'Imperial'}
                      />
                    </SummarySection>

                    <SummarySection title="Fitness Profile">
                      <SummaryRow
                        label="Goal"
                        value={
                          FITNESS_GOALS.find((g) => g.value === fitnessGoal)?.label ?? fitnessGoal
                        }
                      />
                      <SummaryRow
                        label="Experience"
                        value={
                          EXPERIENCE_LEVELS.find((e) => e.value === experienceLevel)?.label ??
                          experienceLevel
                        }
                      />
                    </SummarySection>

                    <SummarySection title="Activity & Preferences">
                      <SummaryRow
                        label="Activity Level"
                        value={
                          ACTIVITY_LEVELS.find((a) => a.value === activityLevel)?.label ??
                          activityLevel
                        }
                      />
                      <SummaryRow label="Workout Days" value={`${workoutDays} days/week`} />
                      <SummaryRow label="Duration" value={`${workoutDuration} min`} />
                      <SummaryRow
                        label="Language"
                        value={LANGUAGES.find((l) => l.value === language)?.label ?? language}
                      />
                      <SummaryRow
                        label="Theme"
                        value={themes.find((t) => t.id === themeId)?.label ?? themeId}
                      />
                    </SummarySection>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-2 px-2 pt-4">
        {step < 4 ? (
          <Button size="lg" className="w-full" onClick={goNext} disabled={!isStepValid}>
            Continue
            <ChevronRight className="ml-1 size-4" />
          </Button>
        ) : (
          <Button size="lg" className="w-full" onClick={handleComplete} disabled={submitting}>
            {submitting ? 'Setting up...' : 'Complete Setup'}
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
            Back
          </Button>
        )}
      </div>
    </div>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-border bg-card rounded-xl border p-4">
      <h4 className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-foreground text-sm font-medium">{value}</span>
    </div>
  );
}
