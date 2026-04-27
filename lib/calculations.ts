import type { UserProfile, UserTargets, WorkoutSet, WorkoutExercise, WorkoutLog, PersonalRecord } from './types';

// ─── BMR: Schofield 1985 (age-stratified, used by OpenNutriTracker) ──────────

export function calculateBMR(weightKG: number, age: number, gender: 'male' | 'female'): number {
  if (gender === 'male') {
    if (age < 10) return 22.706 * weightKG + 504.3;
    if (age < 18) return 17.686 * weightKG + 658.2;
    if (age < 30) return 15.057 * weightKG + 692.2;
    if (age < 60) return 11.472 * weightKG + 873.1;
    return 11.711 * weightKG + 587.7;
  } else {
    if (age < 10) return 20.315 * weightKG + 485.9;
    if (age < 18) return 13.384 * weightKG + 692.6;
    if (age < 30) return 14.818 * weightKG + 486.6;
    if (age < 60) return 8.126 * weightKG + 845.6;
    return 9.082 * weightKG + 658.5;
  }
}

// ─── PAL multipliers (WHO 2001) ───────────────────────────────────────────────

const PAL_VALUES: Record<string, number> = {
  sedentary: 1.4,
  light: 1.55,
  moderate: 1.65,
  active: 1.8,
  extreme: 2.0,
};

export function calculateTDEE(bmr: number, pal: string): number {
  return Math.round(bmr * (PAL_VALUES[pal] ?? 1.55));
}

// ─── Calorie goal (TDEE ± deficit/surplus) ───────────────────────────────────

const GOAL_ADJUSTMENTS: Record<string, Record<string, number>> = {
  lose:     { slow: -250, moderate: -500, aggressive: -750 },
  maintain: { slow: 0,    moderate: 0,    aggressive: 0 },
  gain:     { slow: 250,  moderate: 500,  aggressive: 750 },
};

export function calculateCalorieGoal(tdee: number, goal: string, pace: string): number {
  return Math.round(tdee + (GOAL_ADJUSTMENTS[goal]?.[pace] ?? 0));
}

// ─── Macros (ported from macro_calc.dart) ────────────────────────────────────

export function calculateMacros(calorieGoal: number, goal: string): { protein: number; carbs: number; fat: number } {
  // Higher protein for cuts, moderate for bulk, balanced for maintain
  const proteinPct = goal === 'lose' ? 0.35 : goal === 'gain' ? 0.28 : 0.25;
  const fatPct = 0.25;
  const carbsPct = 1 - proteinPct - fatPct;

  return {
    protein: Math.round((calorieGoal * proteinPct) / 4),
    fat:     Math.round((calorieGoal * fatPct) / 9),
    carbs:   Math.round((calorieGoal * carbsPct) / 4),
  };
}

// ─── Full target calculation from user profile ───────────────────────────────

export function calculateTargets(profile: UserProfile): UserTargets {
  const bmr = calculateBMR(profile.weightKG, profile.age, profile.gender);
  const tdee = calculateTDEE(bmr, profile.pal);
  const calorieGoal = calculateCalorieGoal(tdee, profile.goal, profile.pace);
  const macros = calculateMacros(calorieGoal, profile.goal);
  const deficitKcal = tdee - calorieGoal;

  return {
    bmr: Math.round(bmr),
    tdee,
    calorieGoal,
    proteinGoal: macros.protein,
    carbsGoal: macros.carbs,
    fatGoal: macros.fat,
    deficitKcal,
  };
}

// ─── Nutrition helpers ────────────────────────────────────────────────────────

export function kcalFromAmount(kcalPer100: number, amount: number): number {
  return Math.round((kcalPer100 * amount) / 100);
}

export function macroFromAmount(per100: number, amount: number): number {
  return parseFloat(((per100 * amount) / 100).toFixed(1));
}

// ─── Volume calculation (ported from MyFit's workoutUtils.ts) ────────────────

export function calculateSetVolume(
  reps: number,
  rir: number,
  load: number,
  bodyweightFraction: number = 0,
  bodyweight: number = 0,
): number {
  return (reps + rir) * load + bodyweightFraction * bodyweight;
}

export function calculateExerciseVolume(sets: WorkoutSet[], bodyweight: number = 0, bwFraction: number = 0): number {
  return sets
    .filter(s => s.done && !s.skipped)
    .reduce((sum, s) => sum + calculateSetVolume(s.reps, s.rir, s.weight, bwFraction, bodyweight), 0);
}

export function calculateWorkoutVolume(exercises: WorkoutExercise[], bodyweight: number = 0): number {
  return exercises.reduce((sum, ex) =>
    sum + calculateExerciseVolume(ex.sets, bodyweight, ex.bodyweightFraction ?? 0), 0);
}

// ─── Berger formula (ported from MyFit's progressiveOverloadMagic) ────────────
// Predicts reps achievable at a new load given previous performance

export function solveBergerReps(
  prevReps: number,
  prevRIR: number,
  prevLoad: number,
  newLoad: number,
  targetRIR: number,
): number {
  const E = Math.E;
  const expMult = Math.pow(E, (131 * (prevReps + prevRIR)) / 5000);
  const prevE = 9745640 * prevLoad - 423641;
  const newE = 9745640 * newLoad - 423641;
  if (newE <= 0 || prevE <= 0) return prevReps;
  const ratio = (expMult * prevE) / newE;
  return Math.round(38.1679 * Math.log(ratio) - targetRIR);
}

export function calculateOverloadPct(
  prevReps: number, prevRIR: number, prevLoad: number,
  newReps: number,  newRIR: number,  newLoad: number,
): number {
  const E = Math.E;
  const prevExp = Math.pow(E, (prevReps + prevRIR) / 38.1679);
  const newExp  = Math.pow(E, (newReps  + newRIR)  / 38.1679);
  const prevE = 9745640 * prevLoad - 423641;
  const newE  = 9745640 * newLoad  - 423641;
  if (prevE <= 0) return 0;
  return ((newExp * newE) / (prevExp * prevE) - 1) * 100;
}

// ─── Progressive overload suggestion ─────────────────────────────────────────

export function suggestNextSet(
  prev: { weight: number; reps: number; rir: number } | null,
  repRangeStart: number,
  repRangeEnd: number,
  minimumWeightChange: number = 2.5,
): { weight: number; reps: number; rir: number } {
  if (!prev) return { weight: 20, reps: repRangeStart, rir: 2 };

  // Hit top of rep range → increase load
  if (prev.reps >= repRangeEnd && prev.rir <= 1) {
    const newWeight = Math.ceil((prev.weight * 1.025) / minimumWeightChange) * minimumWeightChange;
    const newReps = solveBergerReps(prev.reps, prev.rir, prev.weight, newWeight, 2);
    return { weight: newWeight, reps: Math.max(repRangeStart, newReps), rir: 2 };
  }

  // Still room in rep range → add a rep
  if (prev.reps < repRangeEnd) {
    return { weight: prev.weight, reps: prev.reps + 1, rir: Math.max(0, prev.rir - 1) };
  }

  return { weight: prev.weight, reps: prev.reps, rir: prev.rir };
}

// ─── 1RM estimate (Epley formula) ────────────────────────────────────────────

export function estimateOneRM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

// ─── Personal records ────────────────────────────────────────────────────────

export function extractPersonalRecords(workouts: WorkoutLog[]): PersonalRecord[] {
  const prs = new Map<string, PersonalRecord>();

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      for (const set of exercise.sets) {
        if (!set.done || set.skipped || set.reps < 1) continue;
        const oneRM = estimateOneRM(set.weight, set.reps);
        const existing = prs.get(exercise.name);
        if (!existing || oneRM > existing.estimatedOneRM) {
          prs.set(exercise.name, {
            exerciseName: exercise.name,
            weight: set.weight,
            reps: set.reps,
            date: workout.date,
            estimatedOneRM: oneRM,
          });
        }
      }
    }
  }
  return Array.from(prs.values()).sort((a, b) => b.estimatedOneRM - a.estimatedOneRM);
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

// ─── Streak calculation ───────────────────────────────────────────────────────

export function calculateStreak(workoutDates: string[]): number {
  if (!workoutDates.length) return 0;
  const sorted = [...new Set(workoutDates)].sort().reverse();
  const today = todayString();
  let streak = 0;
  let checkDate = today;

  for (const date of sorted) {
    if (date === checkDate || date === addDays(checkDate, -1)) {
      streak++;
      checkDate = date;
    } else if (date < checkDate) {
      break;
    }
  }
  return streak;
}
