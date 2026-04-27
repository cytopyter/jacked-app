import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import CalorieRing from '../../components/CalorieRing';
import MacroBar from '../../components/MacroBar';
import Max from '../../components/Max';
import { Colors } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { useNutritionStore } from '../../store/useNutritionStore';
import { useWorkoutStore, DEFAULT_PLAN } from '../../store/useWorkoutStore';
import { todayString, formatDate, calculateStreak } from '../../lib/calculations';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HomeScreen() {
  const profile   = useUserStore(s => s.profile);
  const targets   = useUserStore(s => s.targets);
  const logWeight = useUserStore(s => s.logWeight);
  const weightLogs = useUserStore(s => s.weightLogs);

  const { getTotals, addWater, getDay } = useNutritionStore();
  const { workoutHistory, currentPlanDayIndex, xp, rank } = useWorkoutStore();

  const today   = todayString();
  const totals  = getTotals(today);
  const targets_ = targets;

  const calorieGoal = targets_?.calorieGoal ?? 2000;
  const proteinGoal = targets_?.proteinGoal ?? 150;
  const carbsGoal   = targets_?.carbsGoal   ?? 200;
  const fatGoal     = targets_?.fatGoal     ?? 65;

  const streak = calculateStreak(workoutHistory.map(w => w.date));
  const todayPlan = DEFAULT_PLAN[currentPlanDayIndex];

  const rankEmoji = rank === 'Bronze' ? '🥉' : rank === 'Silver' ? '🥈' : rank === 'Gold' ? '🥇' : '💎';
  const rankColor = rank === 'Bronze' ? Colors.bronze : rank === 'Silver' ? Colors.silver : rank === 'Gold' ? Colors.gold : Colors.accent;
  const xpToNext  = rank === 'Bronze' ? 2000 : rank === 'Silver' ? 5000 : rank === 'Gold' ? 10000 : 99999;

  // Last 7 days workout dot
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const isToday = dateStr === today;
    const worked  = workoutHistory.some(w => w.date === dateStr);
    return { day: DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1], worked, isToday };
  });

  const firstName = profile?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}, {firstName}.</Text>
            <Text style={styles.date}>{formatDate(today)} {streak > 0 ? `· ${streak}-day streak 🔥` : ''}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        {/* Calorie ring hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <CalorieRing eaten={totals.kcal} total={calorieGoal} size={160} />
            <Text style={styles.heroGoal}>of {calorieGoal.toLocaleString()} daily goal</Text>
          </View>
          <View style={styles.heroRight}>
            <MacroBar label="Protein" current={Math.round(totals.protein)} goal={proteinGoal} color={Colors.accent} />
            <MacroBar label="Carbs"   current={Math.round(totals.carbs)}   goal={carbsGoal}  color={Colors.warning} />
            <MacroBar label="Fat"     current={Math.round(totals.fat)}     goal={fatGoal}    color={Colors.danger} />
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.statsStrip}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{(totals.water / 1000).toFixed(1)}L</Text>
            <Text style={styles.statLabel}>💧 Water</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{Math.max(0, calorieGoal - totals.kcal).toLocaleString()}</Text>
            <Text style={styles.statLabel}>📊 Remaining</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{workoutHistory.length}</Text>
            <Text style={styles.statLabel}>💪 Workouts</Text>
          </View>
        </View>

        {/* Streak + Rank */}
        <View style={styles.row2}>
          <LinearGradient colors={['#1C1500', Colors.surface]} style={styles.miniCard}>
            <Text style={{ fontSize: 22 }}>🔥</Text>
            <Text style={[styles.bigNum, { color: Colors.gold }]}>{streak}</Text>
            <Text style={styles.miniLabel}>day streak</Text>
          </LinearGradient>
          <View style={styles.miniCard}>
            <Text style={{ fontSize: 22 }}>{rankEmoji}</Text>
            <Text style={[styles.bigNum, { color: rankColor }]}>{rank}</Text>
            <Text style={styles.miniLabel}>{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP</Text>
          </View>
        </View>

        {/* Weekly habit dots */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This week</Text>
          </View>
          <View style={styles.habitRow}>
            {last7.map((h, i) => (
              <View key={i} style={styles.habitItem}>
                <View style={[
                  styles.habitDot,
                  h.worked && styles.habitDone,
                  h.isToday && !h.worked && styles.habitActive,
                ]}>
                  {h.worked && <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900' }}>✓</Text>}
                  {h.isToday && !h.worked && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />}
                </View>
                <Text style={styles.habitDay}>{h.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Today's Workout */}
        <View style={[styles.workoutCard, { borderLeftColor: Colors.accent, borderLeftWidth: 4 }]}>
          <View style={styles.workoutTags}>
            <View style={styles.chip}><Text style={styles.chipText}>TODAY</Text></View>
            <View style={[styles.chip, { borderColor: Colors.border }]}>
              <Text style={[styles.chipText, { color: Colors.text2 }]}>~{todayPlan.exercises.length * 10} min</Text>
            </View>
          </View>
          <Text style={styles.workoutTitle}>{todayPlan.name.toUpperCase()}</Text>
          <Text style={styles.workoutMuscles}>{todayPlan.muscles}</Text>
          <Text style={styles.workoutDetail}>{todayPlan.exercises.length} exercises · Progressive overload</Text>
          <TouchableOpacity style={styles.startBtn} onPress={() => router.push('/(tabs)/workout')}>
            <Text style={styles.startBtnText}>Start Workout →</Text>
          </TouchableOpacity>
        </View>

        {/* Max message */}
        <View style={styles.maxCard}>
          <View style={styles.maxCardLeft}>
            <View style={styles.maxAvatar}>
              <Max size={56} mood={totals.protein >= proteinGoal * 0.8 ? 'cheer' : 'default'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.maxName}>Coach Max</Text>
              <Text style={styles.maxMsg}>
                {totals.kcal === 0
                  ? `Let's get started! Log your first meal to track today's calories. Your goal is ${calorieGoal.toLocaleString()} kcal.`
                  : totals.protein < proteinGoal * 0.5
                  ? `You're at ${Math.round(totals.protein)}g protein. Need ${proteinGoal - Math.round(totals.protein)}g more to hit your goal. Add a high-protein meal! 💪`
                  : `${Math.round(totals.protein)}g protein logged — great progress! ${calorieGoal - totals.kcal > 0 ? `${calorieGoal - totals.kcal} kcal remaining today.` : 'You\'ve hit your calorie goal!'}`
                }
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Quick log bar */}
      <View style={styles.quickLog}>
        <TouchableOpacity style={styles.quickLogBtn} onPress={() => router.push('/(tabs)/nutrition')}>
          <Text style={styles.quickLogText}>🍎 Log Meal</Text>
        </TouchableOpacity>
        <View style={styles.quickLogDivider} />
        <TouchableOpacity style={styles.quickLogBtn} onPress={() => router.push('/(tabs)/workout')}>
          <Text style={styles.quickLogText}>💪 Workout</Text>
        </TouchableOpacity>
        <View style={styles.quickLogDivider} />
        <TouchableOpacity style={styles.quickLogBtn} onPress={() => addWater(today, 250)}>
          <Text style={styles.quickLogText}>💧 +250ml</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: Colors.text, fontFamily: 'Nunito_800ExtraBold' },
  date: { fontSize: 13, color: Colors.text2, marginTop: 2 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '900', color: '#fff', fontFamily: 'Nunito_900Black' },
  heroCard: {
    flexDirection: 'row', marginHorizontal: 24,
    backgroundColor: Colors.surfaceRaised, borderRadius: 24,
    padding: 20, borderWidth: 1, borderColor: Colors.borderActive, gap: 20,
  },
  heroLeft: { alignItems: 'center', gap: 6 },
  heroGoal: { fontSize: 12, color: Colors.text2, fontWeight: '600' },
  heroRight: { flex: 1, justifyContent: 'center' },
  statsStrip: {
    flexDirection: 'row', marginHorizontal: 24, marginTop: 12,
    backgroundColor: Colors.surface, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontSize: 14, fontWeight: '900', color: Colors.text, fontVariant: ['tabular-nums'], fontFamily: 'Nunito_900Black' },
  statLabel: { fontSize: 11, color: Colors.text2, fontWeight: '600' },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.border },
  row2: { flexDirection: 'row', gap: 12, marginHorizontal: 24, marginTop: 12 },
  miniCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 20,
    padding: 16, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', gap: 4,
  },
  bigNum: { fontSize: 20, fontWeight: '900', fontFamily: 'Nunito_900Black' },
  miniLabel: { fontSize: 12, color: Colors.text2, textAlign: 'center' },
  section: { marginHorizontal: 24, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  habitRow: { flexDirection: 'row', justifyContent: 'space-between' },
  habitItem: { alignItems: 'center', gap: 6 },
  habitDot: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceRaised, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  habitDone: { backgroundColor: Colors.success, borderColor: Colors.successDark },
  habitActive: {
    backgroundColor: Colors.accent, borderColor: Colors.accent,
    shadowColor: Colors.accent, shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 0 }, elevation: 4,
  },
  habitDay: { fontSize: 11, color: Colors.text3, fontWeight: '600' },
  workoutCard: {
    marginHorizontal: 24, marginTop: 20,
    backgroundColor: Colors.surfaceRaised, borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: Colors.borderActive, overflow: 'hidden',
  },
  workoutTags: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  chip: { borderWidth: 1, borderColor: Colors.accent, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  chipText: { fontSize: 10, fontWeight: '800', color: Colors.accent, textTransform: 'uppercase', letterSpacing: 0.5 },
  workoutTitle: { fontSize: 26, fontWeight: '900', color: Colors.text, fontFamily: 'Nunito_900Black' },
  workoutMuscles: { fontSize: 15, color: Colors.text2, marginTop: 2 },
  workoutDetail: { fontSize: 13, color: Colors.text2, marginTop: 4 },
  startBtn: {
    marginTop: 14, backgroundColor: Colors.accent, borderRadius: 14,
    height: 48, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.accentDim, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  startBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  maxCard: {
    marginHorizontal: 24, marginTop: 16,
    backgroundColor: Colors.surface, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  maxCardLeft: { flexDirection: 'row', gap: 12 },
  maxAvatar: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden' },
  maxName: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  maxMsg: { fontSize: 14, color: Colors.text2, lineHeight: 20 },
  quickLog: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.border, height: 56,
  },
  quickLogBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  quickLogText: { fontSize: 13, fontWeight: '700', color: Colors.text2 },
  quickLogDivider: { width: 1, height: '60%', alignSelf: 'center', backgroundColor: Colors.border },
});
