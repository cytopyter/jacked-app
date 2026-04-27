import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile, UserTargets, WeightLog } from '../lib/types';
import { calculateTargets, todayString } from '../lib/calculations';

interface UserState {
  profile: UserProfile | null;
  targets: UserTargets | null;
  weightLogs: WeightLog[];

  setProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: (profile: UserProfile) => void;
  logWeight: (weight: number) => void;
  updateWeight: (weight: number) => void;
  reset: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  age: 25,
  gender: 'male',
  heightCM: 175,
  weightKG: 80,
  goal: 'lose',
  pal: 'moderate',
  pace: 'moderate',
  trainingDays: 5,
  dietPct: 70,
  cardioSessions: 2,
  onboardingComplete: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      targets: null,
      weightLogs: [],

      setProfile: (partial) => {
        const current = get().profile ?? DEFAULT_PROFILE;
        const updated = { ...current, ...partial };
        const targets = calculateTargets(updated);
        set({ profile: updated, targets });
      },

      completeOnboarding: (profile) => {
        const targets = calculateTargets(profile);
        const initial: WeightLog = { date: todayString(), weight: profile.weightKG };
        set({
          profile: { ...profile, onboardingComplete: true },
          targets,
          weightLogs: [initial],
        });
      },

      logWeight: (weight) => {
        const date = todayString();
        const existing = get().weightLogs.findIndex(w => w.date === date);
        const logs = [...get().weightLogs];
        if (existing >= 0) {
          logs[existing] = { date, weight };
        } else {
          logs.push({ date, weight });
        }
        const profile = get().profile;
        if (profile) {
          const updated = { ...profile, weightKG: weight };
          set({ weightLogs: logs.sort((a, b) => a.date.localeCompare(b.date)), profile: updated, targets: calculateTargets(updated) });
        }
      },

      updateWeight: (weight) => {
        const profile = get().profile;
        if (!profile) return;
        const updated = { ...profile, weightKG: weight };
        set({ profile: updated, targets: calculateTargets(updated) });
      },

      reset: () => set({ profile: null, targets: null, weightLogs: [] }),
    }),
    {
      name: 'jacked-user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
