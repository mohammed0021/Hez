'use client';

import { useEffect, useRef } from 'react';
import { useGamificationStore } from '@/stores/gamification-store';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';
import { useWeightStore } from '@/stores/weight-store';
import { useMeasurementStore } from '@/stores/measurement-store';
import { useSupplementStore } from '@/stores/supplement-store';
import { usePRStore } from '@/stores/pr-store';
import { XP_REWARDS, ACHIEVEMENTS } from './gamification-types';
import { notify } from '@/lib/notification-service';
export function useGamificationSync() {
  const syncedRef = useRef({
    sessions: 0,
    weights: 0,
    measurements: 0,
    supplements: '',
    prs: 0,
  });

  useEffect(() => {
    const check = () => {
      const gamification = useGamificationStore.getState();

      // Workout sessions
      const sessions = useWorkoutHistoryStore.getState().sessions;
      const newSessions = sessions.slice(syncedRef.current.sessions);
      for (const s of newSessions) {
        const volumeXp = Math.floor(s.volume / 100) * XP_REWARDS.workout_volume_per_100kg;
        gamification.addXp(XP_REWARDS.workout_complete + volumeXp, `workout_complete_${s.name}`);
        const setCount = s.blocks.reduce(
          (acc, b) =>
            acc + b.exercises.reduce((a, e) => a + e.sets.filter((st) => st.completed).length, 0),
          0,
        );
        gamification.addXp(setCount * XP_REWARDS.set_complete, `workout_sets_${setCount}`);
        const totalVolume = s.blocks.reduce(
          (acc, b) =>
            acc +
            b.exercises.reduce(
              (a, e) =>
                a +
                e.sets
                  .filter((st) => st.completed)
                  .reduce((v, st) => v + (st.actualWeightKg || 0) * (st.actualReps || 0), 0),
              0,
            ),
          0,
        );
        if (totalVolume > 0) {
          gamification.addXp(
            Math.floor(totalVolume / 100),
            `workout_volume_${Math.floor(totalVolume / 100)}`,
          );
        }
      }
      syncedRef.current.sessions = sessions.length;

      // Weight entries
      const weightEntries = useWeightStore.getState().entries;
      const newWeights = weightEntries.slice(syncedRef.current.weights);
      newWeights.forEach(() => gamification.addXp(XP_REWARDS.weight_log, 'weight_log'));
      syncedRef.current.weights = weightEntries.length;

      // Measurement entries
      const measEntries = useMeasurementStore.getState().entries;
      const newMeasures = measEntries.slice(syncedRef.current.measurements);
      newMeasures.forEach(() => gamification.addXp(XP_REWARDS.measurement_log, 'measurement_log'));
      syncedRef.current.measurements = measEntries.length;

      // Supplement logs (check if new daily logs appeared)
      const suppLogs = useSupplementStore.getState().logs;
      const suppKey = suppLogs
        .map((l) => `${l.date}-${Object.keys(l.supplements).length}`)
        .join(',');
      if (suppKey !== syncedRef.current.supplements) {
        const today = new Date().toISOString().slice(0, 10);
        const todayLog = suppLogs.find((l) => l.date === today);
        if (todayLog && Object.keys(todayLog.supplements).length > 0) {
          gamification.addXp(XP_REWARDS.supplement_log, 'supplement_log');
        }
        syncedRef.current.supplements = suppKey;
      }

      // PR celebrations
      const allPRs = usePRStore.getState().getAllRecords();
      if (allPRs.length > syncedRef.current.prs) {
        for (let i = syncedRef.current.prs; i < allPRs.length; i++) {
          const pr = allPRs[i];
          if (pr?.source === 'auto') {
            gamification.celebratePr(pr.exerciseName);
          }
        }
        syncedRef.current.prs = allPRs.length;
      }

      // Check achievements and challenges
      const unlocked = gamification.checkAchievements(true);
      if (unlocked.length > 0) {
        for (const ach of unlocked) {
          const def = ACHIEVEMENTS.find((a) => a.id === ach.id);
          if (def) {
            notify(`Achievement Unlocked: ${def.title}`, {
              body: def.description,
              tag: `achievement_${ach.id}`,
              data: { type: 'achievement_unlocked', url: '/gamification' },
            });
          }
        }
      }
      gamification.checkChallenges();
    };

    check();
    const interval = setInterval(check, 15000);

    return () => clearInterval(interval);
  }, []);
}
