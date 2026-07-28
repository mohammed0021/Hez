import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase-client';
import { useNutritionGoalsStore } from './nutrition-goals-store';

export type Gender = 'male' | 'female';
export type FitnessGoal =
  'lose_fat' | 'build_muscle' | 'maintain' | 'increase_strength' | 'improve_endurance';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type UnitSystem = 'metric' | 'imperial';
export type ProfileVisibility = 'public' | 'friends' | 'private';

export interface ProfileState {
  displayName: string;
  bio: string;
  location: string;
  gender: Gender;
  birthday: string;
  phone: string;
  avatar: string;

  heightCm: number;
  weightKg: number;

  primaryGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  activityLevel: ActivityLevel;
  weeklyWorkoutGoal: number;
  workoutDuration: number;

  unitSystem: UnitSystem;
  profileVisibility: ProfileVisibility;
  showWorkoutHistory: boolean;
  showProgressPhotos: boolean;
  showAchievements: boolean;
  showBodyStats: boolean;

  onboardingCompleted: boolean;

  updateProfile: (
    data: Partial<
      Omit<ProfileState, 'updateProfile' | 'reset' | 'syncFromServer' | 'completeOnboarding'>
    >,
  ) => Promise<void>;
  completeOnboarding: (
    data: Partial<
      Omit<ProfileState, 'updateProfile' | 'reset' | 'syncFromServer' | 'completeOnboarding'>
    >,
  ) => Promise<void>;
  reset: () => void;
  syncFromServer: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      displayName: '',
      bio: '',
      location: '',
      gender: 'male' as Gender,
      birthday: '',
      phone: '',
      avatar: '',

      heightCm: 175,
      weightKg: 70,

      primaryGoal: 'build_muscle' as FitnessGoal,
      experienceLevel: 'intermediate' as ExperienceLevel,
      activityLevel: 'moderate' as ActivityLevel,
      weeklyWorkoutGoal: 4,
      workoutDuration: 45,

      unitSystem: 'metric' as UnitSystem,
      profileVisibility: 'private' as ProfileVisibility,
      showWorkoutHistory: true,
      showProgressPhotos: false,
      showAchievements: true,
      showBodyStats: true,

      onboardingCompleted: false,

      updateProfile: async (data) => {
        set((s) => ({ ...s, ...data }));
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;

          const dbData: Record<string, unknown> = {};
          if ('displayName' in data) dbData.display_name = data.displayName;
          if ('bio' in data) dbData.bio = data.bio;
          if ('location' in data) dbData.location = data.location;
          if ('gender' in data) dbData.gender = data.gender;
          if ('birthday' in data) dbData.birthday = data.birthday;
          if ('phone' in data) dbData.phone = data.phone;
          if ('avatar' in data) dbData.avatar_url = data.avatar;
          if ('heightCm' in data) dbData.height_cm = data.heightCm;
          if ('weightKg' in data) dbData.weight_kg = data.weightKg;
          if ('primaryGoal' in data) dbData.primary_goal = data.primaryGoal;
          if ('experienceLevel' in data) dbData.experience_level = data.experienceLevel;
          if ('activityLevel' in data) dbData.activity_level = data.activityLevel;
          if ('weeklyWorkoutGoal' in data) dbData.weekly_workout_goal = data.weeklyWorkoutGoal;
          if ('workoutDuration' in data) dbData.workout_duration = data.workoutDuration;
          if ('unitSystem' in data) dbData.unit_system = data.unitSystem;
          if ('profileVisibility' in data) dbData.profile_visibility = data.profileVisibility;
          if ('showWorkoutHistory' in data) dbData.show_workout_history = data.showWorkoutHistory;
          if ('showProgressPhotos' in data) dbData.show_progress_photos = data.showProgressPhotos;
          if ('showAchievements' in data) dbData.show_achievements = data.showAchievements;
          if ('showBodyStats' in data) dbData.show_body_stats = data.showBodyStats;
          if ('onboardingCompleted' in data) dbData.onboarding_completed = data.onboardingCompleted;

          await supabase.from('profiles').update(dbData).eq('id', user.id);
        } catch (e) {
          console.error('Failed to sync profile to server:', e);
        }
      },

      completeOnboarding: async (data) => {
        set((s) => ({ ...s, ...data, onboardingCompleted: true }));
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;

          await supabase.from('profiles').upsert({
            id: user.id,
            display_name: data.displayName ?? '',
            bio: data.bio ?? '',
            location: data.location ?? '',
            gender: data.gender ?? 'male',
            birthday: data.birthday ?? '',
            phone: data.phone ?? '',
            avatar_url: data.avatar ?? '',
            height_cm: data.heightCm ?? 175,
            weight_kg: data.weightKg ?? 70,
            primary_goal: data.primaryGoal ?? 'build_muscle',
            experience_level: data.experienceLevel ?? 'intermediate',
            activity_level: data.activityLevel ?? 'moderate',
            weekly_workout_goal: data.weeklyWorkoutGoal ?? 4,
            workout_duration: data.workoutDuration ?? 45,
            unit_system: data.unitSystem ?? 'metric',
            profile_visibility: data.profileVisibility ?? 'private',
            show_workout_history: data.showWorkoutHistory ?? true,
            show_progress_photos: data.showProgressPhotos ?? false,
            show_achievements: data.showAchievements ?? true,
            show_body_stats: data.showBodyStats ?? true,
            onboarding_completed: true,
          });
        } catch (e) {
          console.error('Failed to save onboarding to server:', e);
        }

        localStorage.setItem('hez-onboarded', 'true');

        useNutritionGoalsStore.getState().autoCalculateFromProfile();
      },

      reset: () =>
        set({
          displayName: '',
          bio: '',
          location: '',
          gender: 'male' as Gender,
          birthday: '',
          phone: '',
          avatar: '',
          heightCm: 175,
          weightKg: 70,
          primaryGoal: 'build_muscle' as FitnessGoal,
          experienceLevel: 'intermediate' as ExperienceLevel,
          activityLevel: 'moderate' as ActivityLevel,
          weeklyWorkoutGoal: 4,
          workoutDuration: 45,
          unitSystem: 'metric' as UnitSystem,
          profileVisibility: 'private' as ProfileVisibility,
          showWorkoutHistory: true,
          showProgressPhotos: false,
          showAchievements: true,
          showBodyStats: true,
          onboardingCompleted: false,
        }),

      syncFromServer: async () => {
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (profile) {
            set({
              displayName: profile.display_name ?? '',
              bio: profile.bio ?? '',
              location: profile.location ?? '',
              gender: profile.gender ?? 'male',
              birthday: profile.birthday ?? '',
              phone: profile.phone ?? '',
              avatar: profile.avatar_url ?? '',
              heightCm: profile.height_cm ?? 175,
              weightKg: profile.weight_kg ?? 70,
              primaryGoal: profile.primary_goal ?? 'build_muscle',
              experienceLevel: profile.experience_level ?? 'intermediate',
              activityLevel: profile.activity_level ?? 'moderate',
              weeklyWorkoutGoal: profile.weekly_workout_goal ?? 4,
              workoutDuration: profile.workout_duration ?? 45,
              unitSystem: profile.unit_system ?? 'metric',
              profileVisibility: profile.profile_visibility ?? 'private',
              showWorkoutHistory: profile.show_workout_history ?? true,
              showProgressPhotos: profile.show_progress_photos ?? false,
              showAchievements: profile.show_achievements ?? true,
              showBodyStats: profile.show_body_stats ?? true,
              onboardingCompleted: profile.onboarding_completed ?? false,
            });
          }
        } catch (e) {
          console.error('Failed to sync profile from server:', e);
        }
      },
    }),
    {
      name: 'hez-profile',
      partialize: (s) => ({
        displayName: s.displayName,
        bio: s.bio,
        location: s.location,
        gender: s.gender,
        birthday: s.birthday,
        phone: s.phone,
        avatar: s.avatar,
        heightCm: s.heightCm,
        weightKg: s.weightKg,
        primaryGoal: s.primaryGoal,
        experienceLevel: s.experienceLevel,
        activityLevel: s.activityLevel,
        weeklyWorkoutGoal: s.weeklyWorkoutGoal,
        workoutDuration: s.workoutDuration,
        unitSystem: s.unitSystem,
        profileVisibility: s.profileVisibility,
        showWorkoutHistory: s.showWorkoutHistory,
        showProgressPhotos: s.showProgressPhotos,
        showAchievements: s.showAchievements,
        showBodyStats: s.showBodyStats,
        onboardingCompleted: s.onboardingCompleted,
      }),
    },
  ),
);

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export const FITNESS_GOALS: { value: FitnessGoal; label: string }[] = [
  { value: 'build_muscle', label: 'Build Muscle' },
  { value: 'lose_fat', label: 'Lose Fat' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'increase_strength', label: 'Increase Strength' },
  { value: 'improve_endurance', label: 'Improve Endurance' },
];

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'New to fitness training' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience with training' },
  { value: 'advanced', label: 'Advanced', description: 'Experienced and consistent' },
];

export const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'light', label: 'Lightly Active', description: '1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', description: '3-5 days/week' },
  { value: 'active', label: 'Very Active', description: '6-7 days/week' },
  { value: 'very_active', label: 'Extremely Active', description: 'Physical job + training' },
];

export const UNIT_OPTIONS: { value: UnitSystem; label: string }[] = [
  { value: 'metric', label: 'Metric (kg/cm)' },
  { value: 'imperial', label: 'Imperial (lbs/ft)' },
];

export const VISIBILITY_OPTIONS: {
  value: ProfileVisibility;
  label: string;
  description: string;
}[] = [
  { value: 'public', label: 'Public', description: 'Everyone can see your profile' },
  { value: 'friends', label: 'Friends', description: 'Only friends can see your profile' },
  { value: 'private', label: 'Private', description: 'Only you can see your profile' },
];
