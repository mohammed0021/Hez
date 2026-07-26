import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase-client';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isOnboarded: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
  initialize: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isOnboarded: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  setOnboarded: (isOnboarded) => set({ isOnboarded }),

  initialize: async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        set({ user, session, isLoading: false });

        const onboarded = typeof window !== 'undefined'
          ? localStorage.getItem('hez-onboarded') === 'true'
          : false;
        set({ isOnboarded: onboarded });
      } else {
        set({ user: null, session: null, isLoading: false });
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null });
      });
    } catch {
      set({ user: null, session: null, isLoading: false });
    }
  },

  reset: () => set({ user: null, session: null, isLoading: false }),
}));
