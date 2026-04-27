// ─── User ────────────────────────────────────────────────────────────────────

export type Gender = 'male' | 'female';
export type Goal = 'lose' | 'maintain' | 'gain';
export type PAL = 'sedentary' | 'light' | 'moderate' | 'active' | 'extreme';
export type Pace = 'slow' | 'moderate' | 'aggressive';
export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  heightCM: number;
  weightKG: number;
  goal: Goal;
  pal: PAL;
  pace: Pace;
  trainingDays: number;
  dietPct: number;      // 30-100: % of deficit from diet
  cardioSessions: number;
  onboardingComplete: boolean;
}

export interface UserTargets {
  bmr: number;
  tdee: number;
  calorieGoal: number;
  proteinGoal: number;   // grams
  carbsGoal: number;     // grams
  fatGoal: number;       // grams
  deficitKcal: number;
}

// ─── Food & Nutrition ────────────────────────────────────────────────────────

export type FoodSource = 'fdc' | 'off' | 'custom';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  source: FoodSource;
  servingSize: number;   // default serving in grams/ml
  servingUnit: string;
  kcalPer100: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
  imageUrl?: string;
  barcode?: string;
}

export interface FoodLog {
  id: string;
  date: string;          // YYYY-MM-DD
  mealType: MealType;
  food: FoodItem;
  amount: number;        // in grams or ml
  loggedAt: string;      // ISO timestamp
}

export interface DayNutrition {
  date: string;
  logs: FoodLog[];
  waterML: number;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

// ─── Workout ─────────────────────────────────────────────────────────────────

export type MuscleGroup =
  | 'Chest' | 'Back' | 'Shoulders' | 'Triceps' | 'Biceps'
  | 'Quads' | 'Hamstrings' | 'Glutes' | 'Calves' | 'Abs' | 'Forearms';

export type SetType = 'straight' | 'drop' | 'myorep';

export interface WorkoutSet {
  setIndex: number;
  weight: number;        // kg
  reps: number;
  rir: number;           // Reps In Reserve
  done: boolean;
  skipped: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: WorkoutSet[];
  repRangeStart: number;
  repRangeEnd: number;
  setType: SetType;
  notes?: string;
  bodyweightFraction?: number;
}

export interface WorkoutLog {
  id: string;
  date: string;          // YYYY-MM-DD
  name: string;
  splitDay: string;
  startedAt: string;
  endedAt?: string;
  exercises: WorkoutExercise[];
  bodyweight: number;
  totalVolume: number;
  notes?: string;
}

// ─── Exercise Plan ────────────────────────────────────────────────────────────

export interface ExerciseTemplate {
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  repRangeStart: number;
  repRangeEnd: number;
  setType: SetType;
  defaultWeight?: number;
  bodyweightFraction?: number;
}

export interface WorkoutPlanDay {
  name: string;
  muscles: string;
  isRest: boolean;
  exercises: ExerciseTemplate[];
}

// ─── Progress ────────────────────────────────────────────────────────────────

export interface WeightLog {
  date: string;          // YYYY-MM-DD
  weight: number;        // kg
}

export interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  estimatedOneRM: number;
}
