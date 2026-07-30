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
import Link from 'next/link';

type ProfileTab = 'personal' | 'stats' | 'goals' | 'activity' | 'achievements';

export default function ProfilePage() {
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
  const displayName = profile.displayName || email.split('@')[0] || 'User';
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

  const tabs: {
    id: ProfileTab;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[] = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'stats', label: 'Body Stats', icon: Ruler },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'achievements', label: 'Achievements', icon: Award },
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
            <Trophy size={12} /> Lv.{levelInfo.level}
          </span>
          <span className="flex items-center gap-1">
            <Flame size={12} /> {currentStreak} day streak
          </span>
          <span className="flex items-center gap-1">
            <Dumbbell size={12} /> {totalWorkouts} workouts
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
            <SectionHeader icon={User} title="Personal Information" onEdit={startEdit} />
            {editing ? (
              <div className="space-y-3">
                <InputField
                  label="Display Name"
                  value={editForm.displayName}
                  onChange={(v) => setEditForm((f) => ({ ...f, displayName: v }))}
                />
                <TextareaField
                  label="Bio"
                  value={editForm.bio}
                  onChange={(v) => setEditForm((f) => ({ ...f, bio: v }))}
                />
                <InputField
                  label="Location"
                  value={editForm.location}
                  onChange={(v) => setEditForm((f) => ({ ...f, location: v }))}
                />
                <InputField
                  label="Birthday"
                  value={editForm.birthday}
                  type="date"
                  onChange={(v) => setEditForm((f) => ({ ...f, birthday: v }))}
                />
                <InputField
                  label="Phone"
                  value={editForm.phone}
                  type="tel"
                  onChange={(v) => setEditForm((f) => ({ ...f, phone: v }))}
                />
                <div>
                  <p className="text-foreground/80 mb-2 text-xs font-medium">Gender</p>
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
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-foreground/80 mb-2 text-xs font-medium">Unit System</p>
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
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={cancelEdit}
                    className="border-border text-muted-foreground hover:bg-muted min-h-[44px] flex-1 rounded-xl border py-2 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 min-h-[44px] flex-1 rounded-xl py-2 text-sm font-medium transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <InfoRow icon={MapPin} label="Location" value={profile.location || 'Not set'} />
                <InfoRow
                  icon={Cake}
                  label="Birthday"
                  value={
                    profile.birthday ? new Date(profile.birthday).toLocaleDateString() : 'Not set'
                  }
                />
                <InfoRow icon={Phone} label="Phone" value={profile.phone || 'Not set'} />
                <InfoRow icon={User} label="Email" value={email} />
              </div>
            )}
          </SectionCard>
        )}

        {/* Body Stats */}
        {activeTab === 'stats' && (
          <>
            <SectionCard>
              <SectionHeader icon={Ruler} title="Body Stats" />
              <div className="space-y-3">
                {editing ? (
                  <>
                    <InputField
                      label={`Height (${heightUnit})`}
                      value={String(editForm.heightCm)}
                      type="number"
                      onChange={(v) => setEditForm((f) => ({ ...f, heightCm: Number(v) }))}
                    />
                    <InputField
                      label={`Weight (${editForm.unitSystem === 'imperial' ? 'lbs' : 'kg'})`}
                      value={String(editForm.weightKg)}
                      type="number"
                      onChange={(v) => setEditForm((f) => ({ ...f, weightKg: Number(v) }))}
                    />
                  </>
                ) : (
                  <>
                    <InfoRow icon={Ruler} label="Height" value={formatHeight(profile.heightCm)} />
                    <InfoRow
                      icon={Weight}
                      label="Base Weight"
                      value={`${profile.weightKg || '—'} kg`}
                    />
                  </>
                )}
                <InfoRow
                  icon={Weight}
                  label="Latest Weight"
                  value={
                    latestWeight
                      ? `${formatWeight(latestWeight.weightKg)} ${latestWeight.bodyFatPercent ? `· ${latestWeight.bodyFatPercent}% body fat` : ''}`
                      : 'No entries yet'
                  }
                />
                {latestWeight?.bodyFatPercent && (
                  <InfoRow
                    icon={BarChart3}
                    label="Body Fat"
                    value={`${latestWeight.bodyFatPercent}%`}
                  />
                )}
              </div>
              <Link
                href="/progress/weight"
                className="bg-muted/50 text-muted-foreground hover:bg-muted mt-3 flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors"
              >
                Track Weight
                <ChevronRight size={14} />
              </Link>
            </SectionCard>

            {latestMeasurement && (
              <SectionCard>
                <SectionHeader
                  icon={Ruler}
                  title="Latest Measurements"
                  subtitle={new Date(latestMeasurement.date).toLocaleDateString()}
                />
                <div className="grid grid-cols-2 gap-2">
                  {MEASUREMENT_FIELDS.map((field) => {
                    const val = latestMeasurement[field.key] as number | null;
                    return (
                      <div key={field.key} className="bg-muted/30 rounded-xl px-3 py-2">
                        <p className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
                          {field.label}
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
                  All Measurements
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
                title="Fitness Goals"
                onEdit={activeTab === 'goals' ? startEdit : undefined}
              />
              {editing ? (
                <div className="space-y-3">
                  <SelectField
                    label="Primary Goal"
                    value={editForm.primaryGoal}
                    options={FITNESS_GOALS.map((g) => ({ value: g.value, label: g.label }))}
                    onChange={(v) => setEditForm((f) => ({ ...f, primaryGoal: v as FitnessGoal }))}
                  />
                  <SelectField
                    label="Experience Level"
                    value={editForm.experienceLevel}
                    options={EXPERIENCE_LEVELS.map((l) => ({ value: l.value, label: l.label }))}
                    onChange={(v) =>
                      setEditForm((f) => ({ ...f, experienceLevel: v as ExperienceLevel }))
                    }
                  />
                  <InputField
                    label="Weekly Workout Goal"
                    value={String(editForm.weeklyWorkoutGoal)}
                    type="number"
                    onChange={(v) => setEditForm((f) => ({ ...f, weeklyWorkoutGoal: Number(v) }))}
                  />
                  <div>
                    <p className="text-foreground/80 mb-2 text-xs font-medium">Activity Level</p>
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
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground/80 mb-2 text-xs font-medium">Workout Duration</p>
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
                          {d} min
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={cancelEdit}
                      className="border-border text-muted-foreground hover:bg-muted min-h-[44px] flex-1 rounded-xl border py-2 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 min-h-[44px] flex-1 rounded-xl py-2 text-sm font-medium transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <InfoRow
                    icon={Target}
                    label="Primary Goal"
                    value={
                      FITNESS_GOALS.find((g) => g.value === profile.primaryGoal)?.label ||
                      profile.primaryGoal
                    }
                  />
                  <InfoRow
                    icon={BarChart3}
                    label="Experience"
                    value={
                      EXPERIENCE_LEVELS.find((l) => l.value === profile.experienceLevel)?.label ||
                      profile.experienceLevel
                    }
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Weekly Goal"
                    value={`${profile.weeklyWorkoutGoal} sessions`}
                  />
                  <InfoRow
                    icon={Activity}
                    label="Activity Level"
                    value={
                      ACTIVITY_LEVELS.find((a) => a.value === profile.activityLevel)?.label ||
                      profile.activityLevel
                    }
                  />
                  <InfoRow
                    icon={Clock}
                    label="Workout Duration"
                    value={`${profile.workoutDuration || 45} min`}
                  />
                  <InfoRow
                    icon={User}
                    label="Gender"
                    value={
                      GENDER_OPTIONS.find((g) => g.value === profile.gender)?.label ||
                      profile.gender ||
                      'Not set'
                    }
                  />
                  <div className="bg-muted/30 mt-3 rounded-xl p-3">
                    <p className="text-foreground mb-2 text-xs font-medium">Progress this week</p>
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
              <SectionHeader icon={Activity} title="Overview" />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <Dumbbell size={20} className="text-primary mx-auto" />
                  <p className="text-foreground mt-1 text-lg font-bold">{totalWorkouts}</p>
                  <p className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
                    Total Workouts
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <Weight size={20} className="text-primary mx-auto" />
                  <p className="text-foreground mt-1 text-lg font-bold">
                    {totalVolume.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
                    Total Volume (kg)
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <Flame size={20} className="text-primary mx-auto" />
                  <p className="text-foreground mt-1 text-lg font-bold">{currentStreak}</p>
                  <p className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
                    Day Streak
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <Zap size={20} className="text-primary mx-auto" />
                  <p className="text-foreground mt-1 text-lg font-bold">{levelInfo.level}</p>
                  <p className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
                    Level
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader icon={Clock} title="Recent Workouts" />
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
                          {session.blocks.reduce((s, b) => s + b.exercises.length, 0)} exercises
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-6 text-center text-sm">
                  No workouts yet. Start your first workout!
                </p>
              )}
              <Link
                href="/workouts"
                className="bg-muted/50 text-muted-foreground hover:bg-muted mt-2 flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors"
              >
                View All Workouts
                <ChevronRight size={14} />
              </Link>
            </SectionCard>

            <SectionCard>
              <SectionHeader icon={BarChart3} title="Last 30 Days" />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
                    Workouts
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
                    Volume
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
              title="Achievements"
              subtitle={`${gamification.achievements.length} / ${ACHIEVEMENTS.length} unlocked`}
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
          Edit
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
