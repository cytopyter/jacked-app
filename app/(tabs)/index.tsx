import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CalorieRing from '../../components/CalorieRing';
import MacroBar from '../../components/MacroBar';
import Max from '../../components/Max';
import { Colors } from '../../constants/theme';

const HABITS = [
  { day: 'Mon', done: true }, { day: 'Tue', done: true }, { day: 'Wed', done: true },
  { day: 'Thu', active: true }, { day: 'Fri', done: false }, { day: 'Sat', done: false }, { day: 'Sun', done: false },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, Alex.</Text>
            <Text style={styles.date}>Monday, April 27 · 12-day streak 🔥</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
        </View>

        {/* Calorie Ring Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <CalorieRing eaten={910} total={2150} size={160} />
            <Text style={styles.heroGoal}>of 2,150 daily goal</Text>
          </View>
          <View style={styles.heroRight}>
            <MacroBar label="Protein" current={98} goal={150} color={Colors.accent} />
            <MacroBar label="Carbs" current={140} goal={200} color={Colors.warning} />
            <MacroBar label="Fat" current={38} goal={60} color={Colors.danger} />
          </View>
        </View>

        {/* Quick stats strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statItem}><Text style={styles.statVal}>320</Text><Text style={styles.statLabel}>🏃 Burned</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={styles.statVal}>2.1L</Text><Text style={styles.statLabel}>💧 Water</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={styles.statVal}>1,830</Text><Text style={styles.statLabel}>📊 Net</Text></View>
        </View>

        {/* Streak + Rank */}
        <View style={styles.row2}>
          <LinearGradient colors={['#1C1500', Colors.surface]} style={styles.miniCard}>
            <Text style={{ fontSize: 22 }}>🔥</Text>
            <Text style={[styles.bigNum, { color: Colors.gold }]}>12</Text>
            <Text style={styles.miniLabel}>day streak</Text>
          </LinearGradient>
          <View style={styles.miniCard}>
            <Text style={{ fontSize: 22 }}>🥉</Text>
            <Text style={[styles.bigNum, { color: Colors.bronze }]}>Bronze</Text>
            <Text style={styles.miniLabel}>1,240 / 2,000 XP</Text>
          </View>
        </View>

        {/* Weekly Habit Dots */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This week</Text>
            <TouchableOpacity><Text style={styles.sectionLink}>See history →</Text></TouchableOpacity>
          </View>
          <View style={styles.habitRow}>
            {HABITS.map((h, i) => (
              <View key={i} style={styles.habitItem}>
                <View style={[
                  styles.habitDot,
                  h.done && styles.habitDone,
                  h.active && styles.habitActive,
                ]}>
                  {h.done && <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900' }}>✓</Text>}
                  {h.active && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />}
                </View>
                <Text style={styles.habitDay}>{h.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Today's Workout Card */}
        <View style={[styles.workoutCard, { borderLeftColor: Colors.accent, borderLeftWidth: 4 }]}>
          <View style={styles.workoutTags}>
            <View style={styles.chip}><Text style={styles.chipText}>TODAY</Text></View>
            <View style={[styles.chip, { borderColor: Colors.border }]}><Text style={[styles.chipText, { color: Colors.text2 }]}>~55 min</Text></View>
          </View>
          <Text style={styles.workoutTitle}>PUSH DAY</Text>
          <Text style={styles.workoutMuscles}>Chest · Shoulders · Triceps</Text>
          <Text style={styles.workoutDetail}>6 exercises</Text>
          <TouchableOpacity style={styles.startBtn}>
            <Text style={styles.startBtnText}>Start Workout →</Text>
          </TouchableOpacity>
        </View>

        {/* Max's Message Card */}
        <View style={styles.maxCard}>
          <View style={styles.maxCardLeft}>
            <View style={styles.maxAvatar}>
              <Max size={56} mood="default" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.maxName}>Coach Max</Text>
              <Text style={styles.maxMsg}>
                You're 98g into protein. One more chicken breast and you're locked. 💪
              </Text>
              <Text style={styles.maxFooter}>3 messages left this week · Upgrade for unlimited</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Quick log bar */}
      <View style={styles.quickLog}>
        <TouchableOpacity style={styles.quickLogBtn}><Text style={styles.quickLogText}>🍎 Log Meal</Text></TouchableOpacity>
        <View style={styles.quickLogDivider} />
        <TouchableOpacity style={styles.quickLogBtn}><Text style={styles.quickLogText}>💪 Log Workout</Text></TouchableOpacity>
        <View style={styles.quickLogDivider} />
        <TouchableOpacity style={styles.quickLogBtn}><Text style={styles.quickLogText}>💧 Log Water</Text></TouchableOpacity>
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
    padding: 20, borderWidth: 1, borderColor: Colors.borderActive,
    gap: 20,
  },
  heroLeft: { alignItems: 'center', gap: 6 },
  heroGoal: { fontSize: 12, color: Colors.text2, fontWeight: '600' },
  heroRight: { flex: 1, justifyContent: 'center' },
  statsStrip: {
    flexDirection: 'row', marginHorizontal: 24, marginTop: 12,
    backgroundColor: Colors.surface, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontSize: 14, fontWeight: '900', color: Colors.text, fontVariant: ['tabular-nums'], fontFamily: 'Nunito_900Black' },
  statLabel: { fontSize: 11, color: Colors.text2, fontWeight: '600' },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.border },
  row2: { flexDirection: 'row', gap: 12, marginHorizontal: 24, marginTop: 12 },
  miniCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 20,
    padding: 16, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', gap: 4,
  },
  bigNum: { fontSize: 20, fontWeight: '900', fontFamily: 'Nunito_900Black' },
  miniLabel: { fontSize: 12, color: Colors.text2, textAlign: 'center' },
  section: { marginHorizontal: 24, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  sectionLink: { fontSize: 13, color: Colors.accent, fontWeight: '600' },
  habitRow: { flexDirection: 'row', justifyContent: 'space-between' },
  habitItem: { alignItems: 'center', gap: 6 },
  habitDot: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 2, borderColor: Colors.border,
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
  chip: {
    borderWidth: 1, borderColor: Colors.accent, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3,
  },
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
  maxFooter: { fontSize: 11, color: Colors.text3, marginTop: 8 },
  quickLog: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.border, height: 56,
  },
  quickLogBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  quickLogText: { fontSize: 13, fontWeight: '700', color: Colors.text2 },
  quickLogDivider: { width: 1, height: '60%', alignSelf: 'center', backgroundColor: Colors.border },
});
