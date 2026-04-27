import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WorkoutLog, WorkoutExercise, WorkoutSet, WorkoutPlanDay, ExerciseTemplate } from '../lib/types';
import { calculateWorkoutVolume, todayString, suggestNextSet } from '../lib/calculations';

// ─── Default Push / Pull / Legs split ────────────────────────────────────────

export const DEFAULT_PLAN: WorkoutPlanDay[] = [
  {
    name: 'Push Day', muscles: 'Chest · Shoulders · Triceps', isRest: false,
    exercises: [
      { name: 'Bench Press',           muscleGroup: 'Chest',     sets: 4, repRangeStart: 6,  repRangeEnd: 10, setType: 'straight', defaultWeight: 60 },
      { name: 'Incline DB Press',      muscleGroup: 'Chest',     sets: 3, repRangeStart: 8,  repRangeEnd: 12, setType: 'straight', defaultWeight: 22.5 },
      { name: 'Overhead Press',        muscleGroup: 'Shoulders', sets: 3, repRangeStart: 6,  repRangeEnd: 10, setType: 'straight', defaultWeight: 40 },
      { name: 'Lateral Raises',        muscleGroup: 'Shoulders', sets: 4, repRangeStart: 12, repRangeEnd: 20, setType: 'straight', defaultWeight: 10 },
      { name: 'Tricep Pushdown',       muscleGroup: 'Triceps',   sets: 3, repRangeStart: 10, repRangeEnd: 15, setType: 'straight', defaultWeight: 25 },
    ],
  },
  {
    name: 'Pull Day', muscles: 'Back · Biceps · Rear Delts', isRest: false,
    exercises: [
      { name: 'Barbell Row',           muscleGroup: 'Back',      sets: 4, repRangeStart: 6,  repRangeEnd: 10, setType: 'straight', defaultWeight: 70 },
      { name: 'Lat Pulldown',          muscleGroup: 'Back',      sets: 3, repRangeStart: 8,  repRangeEnd: 12, setType: 'straight', defaultWeight: 55 },
      { name: 'Cable Row',             muscleGroup: 'Back',      sets: 3, repRangeStart: 8,  repRangeEnd: 12, setType: 'straight', defaultWeight: 50 },
      { name: 'Face Pulls',            muscleGroup: 'Shoulders', sets: 4, repRangeStart: 12, repRangeEnd: 20, setType: 'straight', defaultWeight: 20 },
      { name: 'Barbell Curl',          muscleGroup: 'Biceps',    sets: 3, repRangeStart: 8,  repRangeEnd: 12, setType: 'straight', defaultWeight: 30 },
      { name: 'Hammer Curl',           muscleGroup: 'Biceps',    sets: 3, repRangeStart: 10, repRangeEnd: 15, setType: 'straight', defaultWeight: 14 },
    ],
  },
  {
    name: 'Leg Day', muscles: 'Quads · Hamstrings · Glutes · Calves', isRest: false,
    exercises: [
      { name: 'Squat',                 muscleGroup: 'Quads',      sets: 4, repRangeStart: 6,  repRangeEnd: 10, setType: 'straight', defaultWeight: 80 },
      { name: 'Romanian Deadlift',     muscleGroup: 'Hamstrings', sets: 3, repRangeStart: 8,  repRangeEnd: 12, setType: 'straight', defaultWeight: 70 },
      { name: 'Leg Press',             muscleGroup: 'Quads',      sets: 3, repRangeStart: 10, repRangeEnd: 15, setType: 'straight', defaultWeight: 100 },
      { name: 'Leg Curl',              muscleGroup: 'Hamstrings', sets: 3, repRangeStart: 10, repRangeEnd: 15, setType: 'straight', defaultWeight: 40 },
      { name: 'Calf Raise',            muscleGroup: 'Calves',     sets: 4, repRangeStart: 15, repRangeEnd: 20, setType: 'straight', defaultWeight: 60 },
    ],
  },
];

// ─── Active workout state ─────────────────────────────────────────────────────

interface ActiveWorkout {
  planDayIndex: number;
  name: string;
  startedAt: string;
  exercises: WorkoutExercise[];
  bodyweight: number;
}

interface WorkoutState {
  workoutHistory: WorkoutLog[];
  activeWorkout: ActiveWorkout | null;
  currentPlanDayIndex: number;    // rotating through the 3-day split
  xp: number;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

  startWorkout: (planDayIndex: number, bodyweight: number) => void;
  updateSet: (exerciseId: string, setIndex: number, data: Partial<WorkoutSet>) => void;
  completeWorkout: (notes?: string) => WorkoutLog | null;
  discardWorkout: () => void;
  getLastWorkoutForDay: (planDayIndex: number) => WorkoutLog | null;
  getPrevSets: (planDayIndex: number, exerciseName: string) => WorkoutSet[];
  getStreak: () => number;
}

function makeExercisesFromTemplate(templates: ExerciseTemplate[], prevLog: WorkoutLog | null): WorkoutExercise[] {
  return templates.map((t, i) => {
    const prevExercise = prevLog?.exercises.find(e => e.name === t.name);

    const sets: WorkoutSet[] = Array.from({ length: t.sets }, (_, si) => {
      const prevSet = prevExercise?.sets[si];
      const suggestion = suggestNextSet(
        prevSet ? { weight: prevSet.weight, reps: prevSet.reps, rir: prevSet.rir } : null,
        t.repRangeStart,
        t.repRangeEnd,
      );
      return {
        setIndex: si,
        weight: suggestion.weight,
        reps: suggestion.reps,
        rir: suggestion.rir,
        done: false,
        skipped: false,
      };
    });

    return {
      id: `ex-${i}-${Date.now()}`,
      name: t.name,
      muscleGroup: t.muscleGroup,
      sets,
      repRangeStart: t.repRangeStart,
      repRangeEnd: t.repRangeEnd,
      setType: t.setType,
    };
  });
}

function getRankFromXP(xp: number): 'Bronze' | 'Silver' | 'Gold' | 'Diamond' {
  if (xp >= 10000) return 'Diamond';
  if (xp >= 5000) return 'Gold';
  if (xp >= 2000) return 'Silver';
  return 'Bronze';
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workoutHistory: [],
      activeWorkout: null,
      currentPlanDayIndex: 0,
      xp: 0,
      rank: 'Bronze',

      startWorkout: (planDayIndex, bodyweight) => {
        const plan = DEFAULT_PLAN[planDayIndex];
        const prevLog = get().getLastWorkoutForDay(planDayIndex);
        const exercises = makeExercisesFromTemplate(plan.exercises, prevLog);
        set({
          activeWorkout: {
            planDayIndex,
            name: plan.name,
            startedAt: new Date().toISOString(),
            exercises,
            bodyweight,
          },
        });
      },

      updateSet: (exerciseId, setIndex, data) => {
        const active = get().activeWorkout;
        if (!active) return;
        const exercises = active.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          const sets = ex.sets.map(s =>
            s.setIndex === setIndex ? { ...s, ...data } : s
          );
          return { ...ex, sets };
        });
        set({ activeWorkout: { ...active, exercises } });
      },

      completeWorkout: (notes) => {
        const active = get().activeWorkout;
        if (!active) return null;

        const endedAt = new Date().toISOString();
        const totalVolume = calculateWorkoutVolume(active.exercises, active.bodyweight);
        const xpEarned = Math.round(totalVolume / 100) + 50;

        const log: WorkoutLog = {
          id: `workout-${Date.now()}`,
          date: todayString(),
          name: active.name,
          splitDay: active.name,
          startedAt: active.startedAt,
          endedAt,
          exercises: active.exercises,
          bodyweight: active.bodyweight,
          totalVolume,
          notes,
        };

        const newXP = get().xp + xpEarned;
        const nextDayIndex = (active.planDayIndex + 1) % DEFAULT_PLAN.length;

        set(state => ({
          workoutHistory: [log, ...state.workoutHistory],
          activeWorkout: null,
          currentPlanDayIndex: nextDayIndex,
          xp: newXP,
          rank: getRankFromXP(newXP),
        }));

        return log;
      },

      discardWorkout: () => set({ activeWorkout: null }),

      getLastWorkoutForDay: (planDayIndex) => {
        const dayName = DEFAULT_PLAN[planDayIndex]?.name;
        return get().workoutHistory.find(w => w.splitDay === dayName) ?? null;
      },

      getPrevSets: (planDayIndex, exerciseName) => {
        const log = get().getLastWorkoutForDay(planDayIndex);
        return log?.exercises.find(e => e.name === exerciseName)?.sets ?? [];
      },

      getStreak: () => {
        const dates = get().workoutHistory.map(w => w.date);
        const { calculateStreak } = require('../lib/calculations');
        return calculateStreak(dates);
      },
    }),
    {
      name: 'jacked-workout-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
