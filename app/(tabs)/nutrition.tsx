import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CalorieRing from '../../components/CalorieRing';
import { Colors } from '../../constants/theme';

const MEALS = [
  {
    name: 'BREAKFAST', kcal: 412, color: Colors.warning,
    foods: [
      { name: 'Eggs (3 large)', portion: '3 large', kcal: 210, macros: 'P:18 C:2 F:15' },
      { name: 'Low-fat Cheese', portion: '30g', kcal: 80, macros: 'P:8 C:0 F:5' },
      { name: 'Whole Wheat Toast', portion: '1 slice', kcal: 122, macros: 'P:5 C:22 F:2' },
    ]
  },
  {
    name: 'LUNCH', kcal: 580, color: Colors.success,
    foods: [
      { name: 'Chicken Breast', portion: '200g', kcal: 330, macros: 'P:62 C:0 F:7' },
      { name: 'Brown Rice', portion: '100g cooked', kcal: 130, macros: 'P:3 C:28 F:1' },
      { name: 'Mixed Vegetables', portion: '150g', kcal: 120, macros: 'P:5 C:22 F:1' },
    ]
  },
  {
    name: 'DINNER', kcal: 0, color: Colors.accent,
    foods: []
  },
  {
    name: 'SNACKS', kcal: 0, color: Colors.purple,
    foods: []
  },
];

export default function NutritionScreen() {
  const [date, setDate] = useState('Monday, Apr 27');
  const totalEaten = 992;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 24 }}>📅</Text>
        </TouchableOpacity>
      </View>

      {/* Date navigator */}
      <View style={styles.dateNav}>
        <TouchableOpacity><Text style={styles.navArrow}>‹</Text></TouchableOpacity>
        <Text style={styles.dateText}>{date}</Text>
        <TouchableOpacity><Text style={styles.navArrow}>›</Text></TouchableOpacity>
      </View>

      {/* Summary bar */}
      <View style={styles.summaryBar}>
        <CalorieRing eaten={totalEaten} total={2150} size={48} strokeWidth={6} />
        <Text style={styles.summaryKcal}>1,158 kcal left</Text>
        <View style={styles.macroPills}>
          <View style={[styles.pill, { borderColor: Colors.accent }]}>
            <Text style={[styles.pillText, { color: Colors.accent }]}>P 98g</Text>
          </View>
          <View style={[styles.pill, { borderColor: Colors.warning }]}>
            <Text style={[styles.pillText, { color: Colors.warning }]}>C 50g</Text>
          </View>
          <View style={[styles.pill, { borderColor: Colors.danger }]}>
            <Text style={[styles.pillText, { color: Colors.danger }]}>F 27g</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {MEALS.map((meal) => (
          <View key={meal.name} style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <View style={styles.mealHeaderLeft}>
                <View style={[styles.mealDot, { backgroundColor: meal.color }]} />
                <Text style={styles.mealName}>{meal.name}</Text>
              </View>
              <Text style={styles.mealKcal}>{meal.kcal} kcal</Text>
            </View>
            <View style={styles.mealCard}>
              {meal.foods.map((food, i) => (
                <View key={i}>
                  <View style={styles.foodRow}>
                    <View style={styles.foodLeft}>
                      <Text style={styles.foodName}>{food.name}</Text>
                      <Text style={styles.foodDetail}>{food.portion} · {food.macros}</Text>
                    </View>
                    <Text style={styles.foodKcal}>{food.kcal}</Text>
                  </View>
                  {i < meal.foods.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
              {meal.foods.length > 0 && <View style={styles.divider} />}
              <TouchableOpacity style={styles.addRow}>
                <Text style={styles.addText}>+ Add food to {meal.name.charAt(0) + meal.name.slice(1).toLowerCase()}</Text>
                <Text style={{ fontSize: 20, color: Colors.accent }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Water tracker */}
        <View style={[styles.mealSection, { marginBottom: 32 }]}>
          <View style={styles.mealCard}>
            <View style={styles.waterHeader}>
              <Text style={styles.mealName}>💧 Water</Text>
              <Text style={styles.mealKcal}>2.1 / 3.0 L</Text>
            </View>
            <View style={styles.waterBar}>
              <View style={[styles.waterFill, { width: '70%' }]} />
            </View>
            <View style={styles.waterBtns}>
              {['+ 250ml', '+ 500ml', '+ 750ml'].map(l => (
                <TouchableOpacity key={l} style={styles.waterBtn}>
                  <Text style={styles.waterBtnText}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 56, paddingBottom: 12,
  },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, fontFamily: 'Nunito_800ExtraBold' },
  dateNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16,
    paddingVertical: 8,
  },
  navArrow: { fontSize: 24, color: Colors.text2, fontWeight: '600', width: 32, textAlign: 'center' },
  dateText: { fontSize: 17, fontWeight: '700', color: Colors.text },
  summaryBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 24, paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
    marginBottom: 4,
  },
  summaryKcal: { fontSize: 16, fontWeight: '700', color: Colors.text, flex: 1 },
  macroPills: { flexDirection: 'row', gap: 6 },
  pill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  pillText: { fontSize: 11, fontWeight: '700' },
  mealSection: { paddingHorizontal: 24, paddingTop: 16 },
  mealHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
  },
  mealHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mealDot: { width: 10, height: 10, borderRadius: 5 },
  mealName: { fontSize: 12, fontWeight: '800', color: Colors.text2, textTransform: 'uppercase', letterSpacing: 0.8 },
  mealKcal: { fontSize: 13, color: Colors.text2, fontWeight: '600' },
  mealCard: {
    backgroundColor: Colors.surface, borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border,
  },
  foodRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14, paddingHorizontal: 16,
  },
  foodLeft: { flex: 1 },
  foodName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  foodDetail: { fontSize: 12, color: Colors.text2, marginTop: 2 },
  foodKcal: { fontSize: 16, fontWeight: '800', color: Colors.text, fontVariant: ['tabular-nums'], fontFamily: 'Nunito_800ExtraBold' },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 16 },
  addRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, paddingHorizontal: 16,
  },
  addText: { fontSize: 14, color: Colors.accent, fontWeight: '600' },
  waterHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, paddingHorizontal: 16,
  },
  waterBar: {
    height: 10, backgroundColor: Colors.surfaceRaised, borderRadius: 5, margin: 16, marginTop: 0, overflow: 'hidden',
  },
  waterFill: {
    height: '100%', backgroundColor: Colors.accent, borderRadius: 5, opacity: 0.8,
  },
  waterBtns: { flexDirection: 'row', gap: 10, padding: 16, paddingTop: 0 },
  waterBtn: {
    flex: 1, backgroundColor: `${Colors.accent}22`, borderRadius: 999,
    paddingVertical: 8, alignItems: 'center',
    borderWidth: 1, borderColor: `${Colors.accent}44`,
  },
  waterBtnText: { fontSize: 13, fontWeight: '700', color: Colors.accent },
});
