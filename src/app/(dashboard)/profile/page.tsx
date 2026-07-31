'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Ruler,
  Target,
  Activity,
  Award,
  MapPin,
  Cake,
  Phone,
  Pencil,
  ChevronRight,
  Flame,
  Dumbbell,
  Zap,
  Trophy,
  Weight,
  Calendar,
  BarChart3,
  Clock,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import {
  useProfileStore,
  FITNESS_GOALS,
  EXPERIENCE_LEVELS,
  GENDER_OPTIONS,
  ACTIVITY_LEVELS,
  UNIT_OPTIONS,
  type FitnessGoal,
  type ExperienceLevel,
  type Gender,
  type ActivityLevel,
  type UnitSystem,
} from '@/stores/profile-store';
import { useSettingsStore } from '@/stores/settings-store';
import { useWeightStore } from '@/stores/weight-store';
import { useMeasurementStore, MEASUREMENT_FIELDS } from '@/stores/measurement-store';
import { useGamificationStore } from '@/stores/gamification-store';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';
import { ACHIEVEMENTS } from '@/lib/gamification-types';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type ProfileTab = 'personal' | 'stats' | 'goals' | 'activity' | 'achievements';

export default function ProfilePage() {
  const t = useTranslations();
  const user = useAuthStore((s) => s.user);
  const profile = useProfileStore();
  const { heightUnit, weightUnit } = useSettingsStore();
  const weightEntries = useWeightStore((s) => s.entries);
  const measurements = useMeasurementStore((s) => s.entries);
  const sessions = useWorkoutHistoryStore((s) => s.sessions);
  const gamification = useGamificationStore();

  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: profile.displayName,
    bio: profile.bio,
    location: profile.location,
    birthday: profile.birthday,
    phone: profile.phone,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    gender: profile.gender,
    primaryGoal: profile.primaryGoal,
    experienceLevel: profile.experienceLevel,
    activityLevel: profile.activityLevel,
    weeklyWorkoutGoal: profile.weeklyWorkoutGoal,
    workoutDuration: profile.workoutDuration,
    unitSystem: profile.unitSystem,
  });

  const email = user?.email || '';
  const displayName = profile.displayName || email.split('@')[0] || t('profile.user');
  const initial = displayName.charAt(0).toUpperCase();

  const latestWeight = weightEntries.length > 0 ? weightEntries[0] : null;
  const latestMeasurement = measurements.length > 0 ? measurements[0] : null;
  const totalWorkouts = gamification.getTotalWorkouts();
  const totalVolume = gamification.getTotalVolume();
  const currentStreak = gamification.getCurrentStreak();
  const levelInfo = gamification.getLevel();
  const unlockedIds = new Set(gamification.achievements.map((a) => a.id));

  const recentSessions = sessions.slice(0, 5);
  const thisWeekSessions = sessions.filter((s) => {
    const d = new Date(s.completedAt);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return d >= startOfWeek;
  }).length;
  const recentVolume = sessions.slice(0, 30).reduce((s, e) => s + e.volume, 0);
  const [thirtyDaysAgo] = useState(() => Date.now() - 30 * 86400000);

  const genderLabel = (value: string) =>
    ({ male: t('profile.male'), female: t('profile.female') })[value] ?? value;
  const goalLabel = (value: string) =>
    ({
      build_muscle: t('profile.build_muscle'),
      lose_fat: t('profile.lose_fat'),
      maintain: t('profile.maintain'),
      increase_strength: t('profile.increase_strength'),
      improve_endurance: t('profile.improve_endurance'),
    })[value] ?? value;
  const experienceLabel = (value: string) =>
    ({
      beginner: t('profile.beginner'),
      intermediate: t('profile.intermediate'),
      advanced: t('profile.advanced'),
    })[value] ?? value;
  const activityLabel = (value: string) =>
    ({
      sedentary: t('profile.sedentary'),
      light: t('profile.lightly_active'),
      moderate: t('profile.moderately_active'),
      active: t('profile.very_active'),
      very_active: t('profile.extremely_active'),
    })[value] ?? value;
  const unitLabel = (value: string) =>
    ({ metric: t('profile.unit_metric'), imperial: t('profile.unit_imperial') })[value] ?? value;
  const measurementLabel = (key: string) =>
    ({
      chest: t('progress.measurement_chest'),
      waist: t('progress.measurement_waist'),
      hips: t('progress.measurement_hips'),
      leftArm: t('progress.measurement_left_arm'),
      rightArm: t('progress.measurement_right_arm'),
      leftThigh: t('progress.measurement_left_thigh'),
      rightThigh: t('progress.measurement_right_thigh'),
      leftCalf: t('progress.measurement_left_calf'),
      rightCalf: t('progress.measurement_right_calf'),
      shoulders: t('progress.measurement_shoulders'),
      neck: t('progress.measurement_neck'),
    })[key] ?? key;

  const tabs: {
    id: ProfileTab;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[] = [
    { id: 'personal', label: t('profile.tab_personal'), icon: User },
    { id: 'stats', label: t('profile.body_stats'), icon: Ruler },
    { id: 'goals', label: t('profile.tab_goals'), icon: Target },
    { id: 'activity', label: t('profile.tab_activity'), icon: Activity },
    { id: 'achievements', label: t('gamification.achievements'), icon: Award },
  ];

  const startEdit = () => {
    setEditForm({
      displayName: profile.displayName,
      bio: profile.bio,
      location: profile.location,
      birthday: profile.birthday,
      phone: profile.phone,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      gender: profile.gender,
      primaryGoal: profile.primaryGoal,
      experienceLevel: profile.experienceLevel,
      activityLevel: profile.activityLevel,
      weeklyWorkoutGoal: profile.weeklyWorkoutGoal,
      workoutDuration: profile.workoutDuration,
      unitSystem: profile.unitSystem,
    });
    setEditing(true);
  };

  const saveEdit = () => {
    profile.updateProfile(editForm);
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const formatHeight = (cm: number) => {
    if (heightUnit === 'ft_in') {
      const totalIn = cm / 2.54;
      const ft = Math.floor(totalIn / 12);
      const inc = Math.round(totalIn % 12);
      return `${ft}'${inc}"`;
    }
    return `${cm} cm`;
  };

  const formatWeight = (kg: number) => {
    if (weightUnit === 'lbs') return `${Math.round(kg * 2.20462)} lbs`;
    return `${kg} kg`;
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="flex flex-col items-center py-6">
        <div className="relative">
          <div className="bg-primary/10 text-primary flex size-20 items-center justify-center rounded-full text-3xl font-bold">
            {initial}
          </div>
          <button
            onClick={startEdit}
            className="bg-primary absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full text-white shadow-lg"
          >
            <Pencil size={12} />
          </button>
        </div>
        <h2 className="text-foreground mt-4 text-xl font-bold">{displayName}</h2>
        {profile.bio && (
          <p className="text-muted-foreground mt-1 max-w-xs text-center text-sm">{profile.bio}</p>
        )}
        <p className="text-muted-foreground text-sm">{email}</p>
        <div className="text-muted-foreground mt-3 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <Trophy size={12} /> {t('gamification.level', { level: levelInfo.level })}
          </span>
          <span className="flex items-center gap-1">
            <Flame size={12} /> {t('profile.day_streak_value', { count: currentStreak })}
          </span>
          <span className="flex items-center gap-1">
            <Dumbbell size={12} /> {t('profile.workouts_value', { count: totalWorkouts })}
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-background sticky top-0 z-10 -mx-4 overflow-hidden px-4">
        <div className="bg-muted/50 flex gap-1 overflow-x-auto rounded-xl p-1 [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 space-y-4"
      >
        {/* Personal Information */}
        {activeTab === 'personal' && (
          <SectionCard>
            <SectionHeader icon={User} title={t('profile.personal_info')} onEdit={startEdit} />
            {editing ? (
              <div className="space-y-3">
                <InputField
                  label={t('profile.display_name')}
                  value={editForm.displayName}
                  onChange={(v) => setEditForm((f) => ({ ...f, displayName: v }))}
                />
                <TextareaField
                  label={t('profile.bio')}
                  value={editForm.bio}
                  onChange={(v) => setEditForm((f) => ({ ...f, bio: v }))}
                />
                <InputField
                  label={t('profile.location')}
                  value={editForm.location}
                  onChange={(v) => setEditForm((f) => ({ ...f, location: v }))}
                />
                <InputField
                  label={t('profile.birthday')}
                  value={editForm.birthday}
                  type="date"
                  onChange={(v) => setEditForm((f) => ({ ...f, birthday: v }))}
                />
                <InputField
                  label={t('profile.phone')}
                  value={editForm.phone}
                  type="tel"
                  onChange={(v) => setEditForm((f) => ({ ...f, phone: v }))}
                />
                <div>
                  <p className="text-foreground/80 mb-2 text-xs font-medium">
                    {t('profile.gender')}
                  </p>
                  <div className="flex gap-2">
                    {GENDER_OPTIONS.map((g) => (
                      <button
                        key={g.value}
                        onClick={() => setEditForm((f) => ({ ...f, gender: g.value as Gender }))}
                        className={`min-h-[44px] flex-1 rounded-xl py-2 text-sm font-medium transition-colors ${
                          editForm.gender === g.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {genderLabel(g.value)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-foreground/80 mb-2 text-xs font-medium">
                    {t('profile.unit_system')}
                  </p>
                  <div className="flex gap-2">
                    {UNIT_OPTIONS.map((u) => (
                      <button
                        key={u.value}
                        onClick={() =>
                          setEditForm((f) => ({ ...f, unitSystem: u.value as UnitSystem }))
                        }
                        className={`min-h-[44px] flex-1 rounded-xl py-2 text-sm font-medium transition-colors ${
                          editForm.unitSystem === u.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {unitLabel(u.value)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={cancelEdit}
                    className="border-border text-muted-foreground hover:bg-muted min-h-[44px] flex-1 rounded-xl border py-2 text-sm font-medium transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={saveEdit}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 min-h-[44px] flex-1 rounded-xl py-2 text-sm font-medium transition-colors"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <InfoRow
                  icon={MapPin}
                  label={t('profile.location')}
                  value={profile.location || t('profile.not_set')}
                />
                <InfoRow
                  icon={Cake}
                  label={t('profile.birthday')}
                  value={
                    profile.birthday
                      ? new Date(profile.birthday).toLocaleDateString()
                      : t('profile.not_set')
                  }
                />
                <InfoRow
                  icon={Phone}
                  label={t('profile.phone')}
                  value={profile.phone || t('profile.not_set')}
                />
                <InfoRow icon={User} label={t('auth.email')} value={email} />
              </div>
            )}
          </SectionCard>
        )}

        {/* Body Stats */}
        {activeTab === 'stats' && (
          <>
            <SectionCard>
              <SectionHeader icon={Ruler} title={t('profile.body_stats')} />
              <div className="space-y-3">
                {editing ? (
                  <>
                    <InputField
                      label={`${t('profile.height')} (${heightUnit})`}
                      value={String(editForm.heightCm)}
                      type="number"
                      onChange={(v) => setEditForm((f) => ({ ...f, heightCm: Number(v) }))}
                    />
                    <InputField
                      label={`${t('profile.weight')} (${editForm.unitSystem === 'imperial' ? 'lbs' : 'kg'})`}
                      value={String(editForm.weightKg)}
                      type="number"
                      onChange={(v) => setEditForm((f) => ({ ...f, weightKg: Number(v) }))}
                    />
                  </>
                ) : (
                  <>
                    <InfoRow
                      icon={Ruler}
                      label={t('profile.height')}
                      value={formatHeight(profile.heightCm)}
                    />
                    <InfoRow
                      icon={Weight}
                      label={t('profile.base_weight')}
                      value={`${profile.weightKg || '—'} kg`}
                    />
                  </>
                )}
                <InfoRow
                  icon={Weight}
                  label={t('profile.latest_weight')}
                  value={
                    latestWeight
                      ? `${formatWeight(latestWeight.weightKg)}${latestWeight.bodyFatPercent ? ` · ${t('profile.body_fat_value', { percent: latestWeight.bodyFatPercent })}` : ''}`
                      : t('profile.no_entries')
                  }
                />
                {latestWeight?.bodyFatPercent && (
                  <InfoRow
                    icon={BarChart3}
                    label={t('profile.body_fat')}
                    value={`${latestWeight.bodyFatPercent}%`}
                  />
                )}
              </div>
              <Link
                href="/progress/weight"
                className="bg-muted/50 text-muted-foreground hover:bg-muted mt-3 flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors"
              >
                {t('profile.track_weight')}
                <ChevronRight size={14} />
              </Link>
            </SectionCard>

            {latestMeasurement && (
              <SectionCard>
                <SectionHeader
                  icon={Ruler}
                  title={t('profile.latest_measurements')}
                  subtitle={new Date(latestMeasurement.date).toLocaleDateString()}
                />
                <div className="grid grid-cols-2 gap-2">
                  {MEASUREMENT_FIELDS.map((field) => {
                    const val = latestMeasurement[field.key] as number | null;
                    return (
                      <div key={field.key} className="bg-muted/30 rounded-xl px-3 py-2">
                        <p className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
                          {measurementLabel(field.key)}
                        </p>
                        <p className="text-foreground text-sm font-medium">
                          {val ? `${val} cm` : '—'}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <Link
                  href="/progress/measurements"
                  className="bg-muted/50 text-muted-foreground hover:bg-muted mt-3 flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors"
                >
                  {t('profile.all_measurements')}
                  <ChevronRight size={14} />
                </Link>
              </SectionCard>
            )}
          </>
        )}

        {/* Goals */}
        {activeTab === 'goals' && (
          <>
            <SectionCard>
              <SectionHeader
                icon={Target}
                title={t('profile.fitness_goals')}
                onEdit={activeTab === 'goals' ? startEdit : undefined}
              />
              {editing ? (
                <div className="space-y-3">
                  <SelectField
                    label={t('profile.primary_goal')}
                    value={editForm.primaryGoal}
                    options={FITNESS_GOALS.map((g) => ({
                      value: g.value,
                      label: goalLabel(g.value),
                    }))}
                    onChange={(v) => setEditForm((f) => ({ ...f, primaryGoal: v as FitnessGoal }))}
                  />
                  <SelectField
                    label={t('profile.experience_level')}
                    value={editForm.experienceLevel}
                    options={EXPERIENCE_LEVELS.map((l) => ({
                      value: l.value,
                      label: experienceLabel(l.value),
                    }))}
                    onChange={(v) =>
                      setEditForm((f) => ({ ...f, experienceLevel: v as ExperienceLevel }))
                    }
                  />
                  <InputField
                    label={t('profile.weekly_workout_goal')}
                    value={String(editForm.weeklyWorkoutGoal)}
                    type="number"
                    onChange={(v) => setEditForm((f) => ({ ...f, weeklyWorkoutGoal: Number(v) }))}
                  />
                  <div>
                    <p className="text-foreground/80 mb-2 text-xs font-medium">
                      {t('profile.activity_level')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ACTIVITY_LEVELS.map((a) => (
                        <button
                          key={a.value}
                          onClick={() =>
                            setEditForm((f) => ({ ...f, activityLevel: a.value as ActivityLevel }))
                          }
                          className={`min-h-[44px] rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                            editForm.activityLevel === a.value
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {activityLabel(a.value)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground/80 mb-2 text-xs font-medium">
                      {t('profile.workout_duration')}
                    </p>
                    <div className="flex gap-2">
                      {[30, 45, 60, 90].map((d) => (
                        <button
                          key={d}
                          onClick={() => setEditForm((f) => ({ ...f, workoutDuration: d }))}
                          className={`min-h-[44px] flex-1 rounded-xl py-2 text-sm font-medium transition-colors ${
                            editForm.workoutDuration === d
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {d} {t('common.minute_short')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={cancelEdit}
                      className="border-border text-muted-foreground hover:bg-muted min-h-[44px] flex-1 rounded-xl border py-2 text-sm font-medium transition-colors"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      onClick={saveEdit}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 min-h-[44px] flex-1 rounded-xl py-2 text-sm font-medium transition-colors"
                    >
                      {t('common.save')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <InfoRow
                    icon={Target}
                    label={t('profile.primary_goal')}
                    value={goalLabel(profile.primaryGoal) || profile.primaryGoal}
                  />
                  <InfoRow
                    icon={BarChart3}
                    label={t('profile.experience')}
                    value={experienceLabel(profile.experienceLevel) || profile.experienceLevel}
                  />
                  <InfoRow
                    icon={Calendar}
                    label={t('dashboard.weekly_goal')}
                    value={t('profile.sessions_value', { count: profile.weeklyWorkoutGoal })}
                  />
                  <InfoRow
                    icon={Activity}
                    label={t('profile.activity_level')}
                    value={activityLabel(profile.activityLevel) || profile.activityLevel}
                  />
                  <InfoRow
                    icon={Clock}
                    label={t('profile.workout_duration')}
                    value={`${profile.workoutDuration || 45} ${t('common.minute_short')}`}
                  />
                  <InfoRow
                    icon={User}
                    label={t('profile.gender')}
                    value={genderLabel(profile.gender) || profile.gender || t('profile.not_set')}
                  />
                  <div className="bg-muted/30 mt-3 rounded-xl p-3">
                    <p className="text-foreground mb-2 text-xs font-medium">
                      {t('profile.progress_this_week')}
                    </p>
                    <div className="flex gap-1">
                      {Array.from({ length: profile.weeklyWorkoutGoal }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full ${i < Math.min(thisWeekSessions, profile.weeklyWorkoutGoal) ? 'bg-primary' : 'bg-muted-foreground/20'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>
          </>
        )}

        {/* Activity History */}
        {activeTab === 'activity' && (
          <>
            <SectionCard>
              <SectionHeader icon={Activity} title={t('profile.overview')} />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <Dumbbell size={20} className="text-primary mx-auto" />
                  <p className="text-foreground mt-1 text-lg font-bold">{totalWorkouts}</p>
                  <p className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
                    {t('profile.total_workouts')}
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <Weight size={20} className="text-primary mx-auto" />
                  <p className="text-foreground mt-1 text-lg font-bold">
                    {totalVolume.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
                    {t('profile.total_volume')} (kg)
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <Flame size={20} className="text-primary mx-auto" />
                  <p className="text-foreground mt-1 text-lg font-bold">{currentStreak}</p>
                  <p className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
                    {t('profile.streak_days')}
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <Zap size={20} className="text-primary mx-auto" />
                  <p className="text-foreground mt-1 text-lg font-bold">{levelInfo.level}</p>
                  <p className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
                    {t('profile.level')}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader icon={Clock} title={t('dashboard.recent_workouts')} />
              {recentSessions.length > 0 ? (
                <div className="space-y-1">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="hover:bg-muted flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors"
                    >
                      <div>
                        <p className="text-foreground text-sm font-medium">{session.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(session.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground text-sm font-medium">
                          {session.volume.toLocaleString()} kg
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {t('profile.exercises_value', {
                            count: session.blocks.reduce((s, b) => s + b.exercises.length, 0),
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-6 text-center text-sm">
                  {t('dashboard.no_recent_workouts')}
                </p>
              )}
              <Link
                href="/workouts"
                className="bg-muted/50 text-muted-foreground hover:bg-muted mt-2 flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors"
              >
                {t('profile.view_all_workouts')}
                <ChevronRight size={14} />
              </Link>
            </SectionCard>

            <SectionCard>
              <SectionHeader icon={BarChart3} title={t('profile.last_30_days')} />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
                    {t('profile.workouts_completed')}
                  </p>
                  <p className="text-foreground text-lg font-bold">
                    {
                      sessions.filter((s) => new Date(s.completedAt) > new Date(thirtyDaysAgo))
                        .length
                    }
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
                    {t('workouts.volume')}
                  </p>
                  <p className="text-foreground text-lg font-bold">
                    {recentVolume.toLocaleString()} kg
                  </p>
                </div>
              </div>
            </SectionCard>
          </>
        )}

        {/* Achievements */}
        {activeTab === 'achievements' && (
          <SectionCard>
            <SectionHeader
              icon={Award}
              title={t('gamification.achievements')}
              subtitle={t('profile.unlocked_count', {
                count: gamification.achievements.length,
                total: ACHIEVEMENTS.length,
              })}
            />
            <div className="grid grid-cols-2 gap-2">
              {ACHIEVEMENTS.map((ach) => {
                const unlocked = unlockedIds.has(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`rounded-xl border p-3 transition-colors ${
                      unlocked
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border bg-muted/20 opacity-50'
                    }`}
                  >
                    <p
                      className={`text-lg ${unlocked ? 'text-primary' : 'text-muted-foreground/40'}`}
                    >
                      {unlocked
                        ? ach.icon === 'Dumbbell'
                          ? '🏋️'
                          : ach.icon === 'Flame'
                            ? '🔥'
                            : ach.icon === 'Swords'
                              ? '⚔️'
                              : ach.icon === 'Trophy'
                                ? '🏆'
                                : ach.icon === 'Weight'
                                  ? '🏋️'
                                  : ach.icon === 'Award'
                                    ? '🎖️'
                                    : ach.icon === 'CalendarCheck'
                                      ? '✅'
                                      : ach.icon === 'Calendar'
                                        ? '📅'
                                        : ach.icon === 'Sunrise'
                                          ? '🌅'
                                          : ach.icon === 'Moon'
                                            ? '🌙'
                                            : ach.icon === 'Zap'
                                              ? '⚡'
                                              : ach.icon === 'Crown'
                                                ? '👑'
                                                : ach.icon === 'Ruler'
                                                  ? '📏'
                                                  : ach.icon === 'Apple'
                                                    ? '🍎'
                                                    : ach.icon === 'Pill'
                                                      ? '💊'
                                                      : ach.icon === 'TrendingUp'
                                                        ? '📈'
                                                        : ach.icon === 'Compass'
                                                          ? '🧭'
                                                          : ach.icon === 'Clock'
                                                            ? '⏱️'
                                                            : ach.icon === 'ArrowUp'
                                                              ? '⬆️'
                                                              : ach.icon === 'ArrowUpCircle'
                                                                ? '🔝'
                                                                : ach.icon === 'Gem'
                                                                  ? '💎'
                                                                  : ach.icon === 'ListTodo'
                                                                    ? '📋'
                                                                    : ach.icon === 'Droplets'
                                                                      ? '💧'
                                                                      : ach.icon === 'CalendarDays'
                                                                        ? '📆'
                                                                        : '⭐'
                        : '🔒'}
                    </p>
                    <p className="text-foreground mt-1 text-xs font-medium">{ach.title}</p>
                    <p className="text-muted-foreground/60 text-[10px]">{ach.description}</p>
                    {unlocked && (
                      <p className="text-primary mt-1 text-[10px] font-medium">
                        +{ach.xpReward} XP
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}
      </motion.div>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="border-border bg-card rounded-xl border p-4">{children}</div>;
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  onEdit,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle?: string;
  onEdit?: () => void;
}) {
  const t = useTranslations();
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-primary" />
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        {subtitle && <span className="text-muted-foreground/60 text-[10px]">{subtitle}</span>}
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-primary hover:text-primary/80 text-xs font-medium transition-colors"
        >
          {t('common.edit')}
        </button>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={14} className="text-muted-foreground/60" />
      <span className="text-muted-foreground flex-1 text-sm">{label}</span>
      <span className="text-foreground text-sm font-medium">{value}</span>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-muted-foreground mb-1 block text-xs font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-border bg-background text-foreground focus:border-primary w-full rounded-xl border px-3 py-2 text-sm transition-colors outline-none"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-muted-foreground mb-1 block text-xs font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="border-border bg-background text-foreground focus:border-primary w-full resize-none rounded-xl border px-3 py-2 text-sm transition-colors outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-muted-foreground mb-1 block text-xs font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-border bg-background text-foreground focus:border-primary w-full rounded-xl border px-3 py-2 text-sm transition-colors outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
