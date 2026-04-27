import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import CalorieRing from '../../components/CalorieRing';
import FoodSearchModal from '../../components/FoodSearchModal';
import { Colors } from '../../constants/theme';
import { useNutritionStore } from '../../store/useNutritionStore';
import { useUserStore } from '../../store/useUserStore';
import { todayString, formatDate, addDays, kcalFromAmount, macroFromAmount } from '../../lib/calculations';
import type { FoodItem, MealType, FoodLog } from '../../lib/types';

const MEAL_CONFIG: { type: MealType; label: string; color: string }[] = [
  { type: 'breakfast', label: 'BREAKFAST', color: Colors.warning },
  { type: 'lunch',     label: 'LUNCH',     color: Colors.success },
  { type: 'dinner',    label: 'DINNER',    color: Colors.accent },
  { type: 'snacks',    label: 'SNACKS',    color: Colors.purple },
];

export default function NutritionScreen() {
  const [date, setDate] = useState(todayString());
  const [modalMeal, setModalMeal] = useState<MealType | null>(null);

  const targets = useUserStore(s => s.targets);
  const { logFood, removeLog, addWater, getTotals, getDay } = useNutritionStore();

  const calorieGoal = targets?.calorieGoal ?? 2000;
  const proteinGoal = targets?.proteinGoal ?? 150;
  const carbsGoal   = targets?.carbsGoal   ?? 200;
  const fatGoal     = targets?.fatGoal     ?? 65;

  const day    = getDay(date);
  const totals = getTotals(date);
  const isToday = date === todayString();

  const mealLogs = (type: MealType): FoodLog[] => day.logs.filter(l => l.mealType === type);
  const mealKcal = (type: MealType) =>
    mealLogs(type).reduce((s, l) => s + kcalFromAmount(l.food.kcalPer100, l.amount), 0);

  const handleAddFood = (food: FoodItem, amount: number) => {
    if (modalMeal) logFood(date, modalMeal, food, amount, calorieGoal, proteinGoal, carbsGoal, fatGoal);
    setModalMeal(null);
  };

  const handleRemove = (logId: string) => {
    Alert.alert('Remove food', 'Remove this entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeLog(date, logId) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition</Text>
      </View>

      <View style={styles.dateNav}>
        <TouchableOpacity onPress={() => setDate(d => addDays(d, -1))}>
          <Text style={styles.navArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{isToday ? 'Today' : formatDate(date)}</Text>
        <TouchableOpacity onPress={() => !isToday && setDate(d => addDays(d, 1))} disabled={isToday}>
          <Text style={[styles.navArrow, isToday && { opacity: 0.2 }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryBar}>
        <CalorieRing eaten={totals.kcal} total={calorieGoal} size={52} strokeWidth={6} />
        <View style={{ flex: 1 }}>
          <Text style={styles.summaryKcal}>{Math.max(0, calorieGoal - totals.kcal).toLocaleString()} kcal left</Text>
          <Text style={styles.summaryEaten}>{totals.kcal.toLocaleString()} eaten of {calorieGoal.toLocaleString()}</Text>
        </View>
        <View style={styles.macroPills}>
          {[
            { label: `P ${Math.round(totals.protein)}g`, color: Colors.accent },
            { label: `C ${Math.round(totals.carbs)}g`,   color: Colors.warning },
            { label: `F ${Math.round(totals.fat)}g`,     color: Colors.danger },
          ].map(p => (
            <View key={p.label} style={[styles.pill, { borderColor: p.color }]}>
              <Text style={[styles.pillText, { color: p.color }]}>{p.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {MEAL_CONFIG.map(meal => (
          <View key={meal.type} style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <View style={styles.mealHeaderLeft}>
                <View style={[styles.mealDot, { backgroundColor: meal.color }]} />
                <Text style={styles.mealName}>{meal.label}</Text>
              </View>
              <Text style={styles.mealKcal}>{mealKcal(meal.type)} kcal</Text>
            </View>
            <View style={styles.mealCard}>
              {mealLogs(meal.type).map((log, i) => (
                <View key={log.id}>
                  <TouchableOpacity
                    style={styles.foodRow}
                    onLongPress={() => handleRemove(log.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.foodLeft}>
                      <Text style={styles.foodName} numberOfLines={1}>{log.food.name}</Text>
                      <Text style={styles.foodDetail}>
                        {log.amount}g · P:{Math.round(macroFromAmount(log.food.proteinPer100, log.amount))}
                        g C:{Math.round(macroFromAmount(log.food.carbsPer100, log.amount))}
                        g F:{Math.round(macroFromAmount(log.food.fatPer100, log.amount))}g
                      </Text>
                    </View>
                    <Text style={styles.foodKcal}>{kcalFromAmount(log.food.kcalPer100, log.amount)}</Text>
                  </TouchableOpacity>
                  {i < mealLogs(meal.type).length - 1 && <View style={styles.divider} />}
                </View>
              ))}
              {mealLogs(meal.type).length > 0 && <View style={styles.divider} />}
              <TouchableOpacity style={styles.addRow} onPress={() => setModalMeal(meal.type)}>
                <Text style={styles.addText}>+ Add to {meal.label.charAt(0) + meal.label.slice(1).toLowerCase()}</Text>
                <Text style={{ fontSize: 20, color: Colors.accent }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Macro progress */}
        <View style={[styles.mealSection]}>
          <View style={styles.mealCard}>
            <View style={{ padding: 16, gap: 12 }}>
              <Text style={styles.mealName}>MACRO BREAKDOWN</Text>
              {[
                { label: 'Protein', current: Math.round(totals.protein), goal: proteinGoal, color: Colors.accent },
                { label: 'Carbs',   current: Math.round(totals.carbs),   goal: carbsGoal,  color: Colors.warning },
                { label: 'Fat',     current: Math.round(totals.fat),     goal: fatGoal,    color: Colors.danger },
              ].map(m => (
                <View key={m.label}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={styles.macroLabel}>{m.label}</Text>
                    <Text style={styles.macroVal}>{m.current}g <Text style={{ color: Colors.text3 }}>/ {m.goal}g</Text></Text>
                  </View>
                  <View style={styles.macroTrack}>
                    <View style={[styles.macroFill, {
                      width: `${Math.min(100, Math.round((m.current / m.goal) * 100))}%`,
                      backgroundColor: m.color,
                    }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Water */}
        <View style={[styles.mealSection, { marginBottom: 32 }]}>
          <View style={styles.mealCard}>
            <View style={styles.waterHeader}>
              <Text style={styles.mealName}>💧 WATER</Text>
              <Text style={styles.mealKcal}>{(totals.water / 1000).toFixed(1)} / 3.0 L</Text>
            </View>
            <View style={styles.waterBar}>
              <View style={[styles.waterFill, { width: `${Math.min(100, (totals.water / 3000) * 100)}%` }]} />
            </View>
            <View style={styles.waterBtns}>
              {[250, 500, 750].map(ml => (
                <TouchableOpacity key={ml} style={styles.waterBtn} onPress={() => addWater(date, ml)}>
                  <Text style={styles.waterBtnText}>+ {ml}ml</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <FoodSearchModal
        visible={modalMeal !== null}
        mealType={modalMeal ?? 'breakfast'}
        onClose={() => setModalMeal(null)}
        onAdd={handleAddFood}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, fontFamily: 'Nunito_800ExtraBold' },
  dateNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, paddingVertical: 8 },
  navArrow: { fontSize: 28, color: Colors.text2, width: 32, textAlign: 'center' },
  dateText: { fontSize: 17, fontWeight: '700', color: Colors.text },
  summaryBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 24, paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border, marginBottom: 4,
  },
  summaryKcal: { fontSize: 16, fontWeight: '700', color: Colors.text },
  summaryEaten: { fontSize: 12, color: Colors.text2, marginTop: 2 },
  macroPills: { flexDirection: 'row', gap: 4 },
  pill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: '700' },
  mealSection: { paddingHorizontal: 24, paddingTop: 16 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mealHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mealDot: { width: 10, height: 10, borderRadius: 5 },
  mealName: { fontSize: 12, fontWeight: '800', color: Colors.text2, letterSpacing: 0.8 },
  mealKcal: { fontSize: 13, color: Colors.text2, fontWeight: '600' },
  mealCard: { backgroundColor: Colors.surface, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  foodRow: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingHorizontal: 16 },
  foodLeft: { flex: 1, marginRight: 12 },
  foodName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  foodDetail: { fontSize: 12, color: Colors.text2, marginTop: 2 },
  foodKcal: { fontSize: 16, fontWeight: '800', color: Colors.text, fontVariant: ['tabular-nums'], fontFamily: 'Nunito_800ExtraBold' },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 16 },
  addRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, paddingHorizontal: 16 },
  addText: { fontSize: 14, color: Colors.accent, fontWeight: '600' },
  macroLabel: { fontSize: 13, fontWeight: '600', color: Colors.text2 },
  macroVal: { fontSize: 14, fontWeight: '800', color: Colors.text },
  macroTrack: { height: 8, backgroundColor: Colors.surfaceRaised, borderRadius: 999, overflow: 'hidden' },
  macroFill: { height: '100%', borderRadius: 999 },
  waterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, paddingHorizontal: 16 },
  waterBar: { height: 10, backgroundColor: Colors.surfaceRaised, borderRadius: 5, margin: 16, marginTop: 0, overflow: 'hidden' },
  waterFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: 5, opacity: 0.8 },
  waterBtns: { flexDirection: 'row', gap: 10, padding: 16, paddingTop: 0 },
  waterBtn: {
    flex: 1, backgroundColor: `${Colors.accent}22`, borderRadius: 999, paddingVertical: 8,
    alignItems: 'center', borderWidth: 1, borderColor: `${Colors.accent}44`,
  },
  waterBtnText: { fontSize: 13, fontWeight: '700', color: Colors.accent },
});
