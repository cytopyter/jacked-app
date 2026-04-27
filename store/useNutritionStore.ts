import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FoodLog, DayNutrition, MealType, FoodItem } from '../lib/types';
import { kcalFromAmount, macroFromAmount, todayString } from '../lib/calculations';

interface NutritionState {
  days: Record<string, DayNutrition>;   // keyed by YYYY-MM-DD
  recentFoods: FoodItem[];              // last 20 unique foods logged

  getDay: (date: string) => DayNutrition;
  logFood: (date: string, mealType: MealType, food: FoodItem, amount: number, calorieGoal: number, proteinGoal: number, carbsGoal: number, fatGoal: number) => void;
  removeLog: (date: string, logId: string) => void;
  addWater: (date: string, ml: number) => void;
  getTotals: (date: string) => { kcal: number; protein: number; carbs: number; fat: number; water: number };
}

function emptyDay(date: string, calorieGoal = 2000, proteinGoal = 150, carbsGoal = 200, fatGoal = 65): DayNutrition {
  return { date, logs: [], waterML: 0, calorieGoal, proteinGoal, carbsGoal, fatGoal };
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      days: {},
      recentFoods: [],

      getDay: (date) => {
        return get().days[date] ?? emptyDay(date);
      },

      logFood: (date, mealType, food, amount, calorieGoal, proteinGoal, carbsGoal, fatGoal) => {
        const days = { ...get().days };
        if (!days[date]) days[date] = emptyDay(date, calorieGoal, proteinGoal, carbsGoal, fatGoal);

        const log: FoodLog = {
          id: `${Date.now()}-${Math.random()}`,
          date,
          mealType,
          food,
          amount,
          loggedAt: new Date().toISOString(),
        };

        days[date] = {
          ...days[date],
          logs: [...days[date].logs, log],
          calorieGoal,
          proteinGoal,
          carbsGoal,
          fatGoal,
        };

        // Keep recent foods (last 20 unique by id)
        const recent = [food, ...get().recentFoods.filter(f => f.id !== food.id)].slice(0, 20);

        set({ days, recentFoods: recent });
      },

      removeLog: (date, logId) => {
        const days = { ...get().days };
        if (!days[date]) return;
        days[date] = { ...days[date], logs: days[date].logs.filter(l => l.id !== logId) };
        set({ days });
      },

      addWater: (date, ml) => {
        const days = { ...get().days };
        if (!days[date]) days[date] = emptyDay(date);
        days[date] = { ...days[date], waterML: (days[date].waterML ?? 0) + ml };
        set({ days });
      },

      getTotals: (date) => {
        const day = get().days[date];
        if (!day) return { kcal: 0, protein: 0, carbs: 0, fat: 0, water: 0 };
        const totals = day.logs.reduce(
          (acc, log) => ({
            kcal:    acc.kcal    + kcalFromAmount(log.food.kcalPer100, log.amount),
            protein: acc.protein + macroFromAmount(log.food.proteinPer100, log.amount),
            carbs:   acc.carbs   + macroFromAmount(log.food.carbsPer100, log.amount),
            fat:     acc.fat     + macroFromAmount(log.food.fatPer100, log.amount),
            water:   acc.water,
          }),
          { kcal: 0, protein: 0, carbs: 0, fat: 0, water: day.waterML ?? 0 }
        );
        return totals;
      },
    }),
    {
      name: 'jacked-nutrition-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
