import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase-client';

export type UserRole = 'user' | 'premium' | 'admin';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRole;
  isLoading: boolean;
  isOnboarded: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setRole: (role: UserRole) => void;
  setLoading: (loading: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
  initialize: () => Promise<void>;
  reset: () => void;
}

let authListener: { data: { subscription: { unsubscribe: () => void } } } | null = null;

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  session: null,
  role: 'user',
  isLoading: true,
  isOnboarded: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setRole: (role) => set({ role }),
  setLoading: (isLoading) => set({ isLoading }),
  setOnboarded: (isOnboarded) => set({ isOnboarded }),

  initialize: async () => {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          set({ user, session, role: (profile?.role as UserRole) || 'user', isLoading: false });
        } else {
          set({ user: null, session: null, isLoading: false });
        }

        const onboarded =
          typeof window !== 'undefined' ? localStorage.getItem('hez-onboarded') === 'true' : false;
        set({ isOnboarded: onboarded });
      } else {
        set({ user: null, session: null, isLoading: false });
      }

      if (authListener) {
        authListener.data.subscription.unsubscribe();
      }

      authListener = supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null });
        if (!session?.user) set({ role: 'user' });
      });
    } catch {
      set({ user: null, session: null, isLoading: false });
    }
  },

  reset: () => {
    if (authListener) {
      authListener.data.subscription.unsubscribe();
      authListener = null;
    }
    set({ user: null, session: null, role: 'user', isLoading: false });
  },
}));

export const useIsAdmin = () => useAuthStore((s) => s.role === 'admin');
