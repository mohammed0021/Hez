import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase-client';

export type FitnessGoal =
  'lose_fat' | 'build_muscle' | 'maintain' | 'increase_strength' | 'improve_endurance';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type ProfileVisibility = 'public' | 'friends' | 'private';

export interface ProfileState {
  displayName: string;
  bio: string;
  location: string;
  birthday: string;
  phone: string;
  avatar: string;

  heightCm: number;
  primaryGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  weeklyWorkoutGoal: number;

  profileVisibility: ProfileVisibility;
  showWorkoutHistory: boolean;
  showProgressPhotos: boolean;
  showAchievements: boolean;
  showBodyStats: boolean;

  updateProfile: (
    data: Partial<Omit<ProfileState, 'updateProfile' | 'reset' | 'syncFromServer'>>,
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
      birthday: '',
      phone: '',
      avatar: '',

      heightCm: 175,
      primaryGoal: 'build_muscle',
      experienceLevel: 'intermediate',
      weeklyWorkoutGoal: 4,

      profileVisibility: 'private',
      showWorkoutHistory: true,
      showProgressPhotos: false,
      showAchievements: true,
      showBodyStats: true,

      updateProfile: async (data) => {
        set((s) => ({ ...s, ...data }));
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('profiles')
              .update({
                display_name: data.displayName || undefined,
                bio: data.bio || undefined,
                height_cm: data.heightCm || undefined,
              })
              .eq('id', user.id);
          }
        } catch (e) {
          console.error('Failed to sync profile to server:', e);
        }
      },

      reset: () =>
        set({
          displayName: '',
          bio: '',
          location: '',
          birthday: '',
          phone: '',
          avatar: '',
          heightCm: 175,
          primaryGoal: 'build_muscle',
          experienceLevel: 'intermediate',
          weeklyWorkoutGoal: 4,
          profileVisibility: 'private',
          showWorkoutHistory: true,
          showProgressPhotos: false,
          showAchievements: true,
          showBodyStats: true,
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
              displayName: profile.display_name || '',
              bio: profile.bio || '',
              avatar: profile.avatar_url || '',
              heightCm: profile.height_cm || 175,
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
        birthday: s.birthday,
        phone: s.phone,
        avatar: s.avatar,
        heightCm: s.heightCm,
        primaryGoal: s.primaryGoal,
        experienceLevel: s.experienceLevel,
        weeklyWorkoutGoal: s.weeklyWorkoutGoal,
        profileVisibility: s.profileVisibility,
        showWorkoutHistory: s.showWorkoutHistory,
        showProgressPhotos: s.showProgressPhotos,
        showAchievements: s.showAchievements,
        showBodyStats: s.showBodyStats,
      }),
    },
  ),
);

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

export const VISIBILITY_OPTIONS: {
  value: ProfileVisibility;
  label: string;
  description: string;
}[] = [
  { value: 'public', label: 'Public', description: 'Everyone can see your profile' },
  { value: 'friends', label: 'Friends', description: 'Only friends can see your profile' },
  { value: 'private', label: 'Private', description: 'Only you can see your profile' },
];
