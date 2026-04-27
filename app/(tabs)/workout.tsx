import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/theme';

const EXERCISES = [
  { name: 'Incline Dumbbell Press', muscles: 'Chest (primary) · Shoulders (secondary)', prev: '20kg × 8', target: '20kg × 10 or 22.5kg × 8' },
  { name: 'Flat Bench Press', muscles: 'Chest (primary) · Triceps (secondary)', prev: '60kg × 6', target: '62.5kg × 6' },
  { name: 'Overhead Press', muscles: 'Shoulders (primary) · Triceps (secondary)', prev: '40kg × 8', target: '42.5kg × 8' },
  { name: 'Tricep Pushdown', muscles: 'Triceps (primary)', prev: '25kg × 12', target: '27.5kg × 12' },
];

function SetRow({ setNum, weight, reps }: { setNum: number; weight: number; reps: number }) {
  const [done, setDone] = useState(false);
  const [w, setW] = useState(weight);
  const [r, setR] = useState(reps);

  return (
    <View style={[styles.setRow, done && styles.setRowDone]}>
      <Text style={styles.setLabel}>Set {setNum}</Text>
      <View style={styles.stepperMini}>
        <TouchableOpacity style={styles.stepBtnMini} onPress={() => setW(v => Math.max(0, v - 2.5))}>
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.stepVal}>{w}<Text style={styles.stepUnit}>kg</Text></Text>
        <TouchableOpacity style={styles.stepBtnMini} onPress={() => setW(v => v + 2.5)}>
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.xSep}>×</Text>
      <View style={styles.stepperMini}>
        <TouchableOpacity style={styles.stepBtnMini} onPress={() => setR(v => Math.max(1, v - 1))}>
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.stepVal}>{r}<Text style={styles.stepUnit}> rps</Text></Text>
        <TouchableOpacity style={styles.stepBtnMini} onPress={() => setR(v => v + 1)}>
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.doneBtn, done && styles.doneBtnDone]}
        onPress={() => setDone(!done)}
      >
        <Text style={[styles.doneBtnText, done && styles.doneBtnTextDone]}>{done ? '✓' : 'DONE'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function WorkoutScreen() {
  const [activeWorkout, setActiveWorkout] = useState(false);

  if (activeWorkout) {
    return (
      <View style={styles.container}>
        <View style={styles.workoutHeader}>
          <TouchableOpacity onPress={() => setActiveWorkout(false)}>
            <Text style={styles.endBtn}>End</Text>
          </TouchableOpacity>
          <Text style={styles.workoutTitle}>Push Day</Text>
          <Text style={styles.timer}>32:14</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {EXERCISES.map((ex, i) => (
            <View key={i} style={styles.exCard}>
              <View style={styles.exHeader}>
                <Text style={styles.exName}>{ex.name}</Text>
                <TouchableOpacity>
                  <Text style={{ fontSize: 18, color: Colors.text2 }}>⇄</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.exMuscles}>{ex.muscles}</Text>
              <Text style={styles.exPrev}>↑ Last: {ex.prev}</Text>
              <Text style={styles.exTarget}>Target: {ex.target}</Text>
              <View style={{ height: 1, backgroundColor: Colors.border, marginVertical: 10 }} />
              {[1, 2, 3].map(s => (
                <SetRow key={s} setNum={s} weight={parseFloat(ex.prev)} reps={parseInt(ex.prev.split('×')[1])} />
              ))}
              <TouchableOpacity style={styles.addSet}>
                <Text style={styles.addSetText}>+ Add Set</Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Workout</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <LinearGradient colors={['#0F1E3C', Colors.surface]} style={styles.heroCard}>
          <View style={styles.heroTags}>
            <View style={[styles.chip, { borderColor: Colors.accent }]}>
              <Text style={[styles.chipText, { color: Colors.accent }]}>PUSH DAY</Text>
            </View>
            <View style={[styles.chip, { borderColor: Colors.border }]}>
              <Text style={[styles.chipText, { color: Colors.text2 }]}>Week 3 of 8</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Push Day</Text>
          <Text style={styles.heroMuscles}>Chest · Shoulders · Triceps</Text>
          <Text style={styles.heroDetail}>6 exercises · ~55 min · Moderate</Text>
          <TouchableOpacity style={styles.startBtn} onPress={() => setActiveWorkout(true)}>
            <Text style={styles.startBtnText}>Start Today's Workout →</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Split info */}
        <View style={styles.splitInfo}>
          <Text style={styles.splitTitle}>Your Split: Push / Pull / Legs</Text>
          <Text style={styles.splitSub}>Using for 3 weeks · 47 workouts completed</Text>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Progress</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '37.5%' }]} />
            </View>
            <Text style={styles.progressLabel}>Week 3/8</Text>
          </View>
          <TouchableOpacity><Text style={styles.changeLink}>Change Split</Text></TouchableOpacity>
        </View>

        {/* Recent workouts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
            {[
              { name: 'Pull Day', when: '3 days ago', time: '1h 2m' },
              { name: 'Push Day', when: '6 days ago', time: '58m' },
              { name: 'Leg Day', when: '8 days ago', time: '1h 10m' },
            ].map((w, i) => (
              <View key={i} style={styles.recentCard}>
                <Text style={styles.recentName}>{w.name}</Text>
                <Text style={styles.recentWhen}>{w.when}</Text>
                <Text style={styles.recentTime}>{w.time}</Text>
                <Text style={styles.recentDone}>✓ Done</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, { marginBottom: 32 }]}>
          <TouchableOpacity style={styles.browseBtn}>
            <Text style={styles.browseBtnText}>Browse All Workout Splits →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: Colors.text, fontFamily: 'Nunito_800ExtraBold' },
  heroCard: { marginHorizontal: 24, borderRadius: 24, padding: 20, gap: 6, borderWidth: 1, borderColor: Colors.borderActive },
  heroTags: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  chipText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: Colors.text, fontFamily: 'Nunito_900Black' },
  heroMuscles: { fontSize: 15, color: Colors.text2 },
  heroDetail: { fontSize: 13, color: Colors.text2 },
  startBtn: {
    marginTop: 16, backgroundColor: Colors.accent, borderRadius: 14,
    height: 48, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.accentDim, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  startBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  splitInfo: { marginHorizontal: 24, marginTop: 20, gap: 6 },
  splitTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  splitSub: { fontSize: 13, color: Colors.text2 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  progressLabel: { fontSize: 12, color: Colors.text3, fontWeight: '600' },
  progressBar: { flex: 1, height: 6, backgroundColor: Colors.surfaceRaised, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: 999 },
  changeLink: { fontSize: 14, color: Colors.accent, fontWeight: '600', marginTop: 4 },
  section: { paddingHorizontal: 24, marginTop: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  recentCard: {
    width: 120, backgroundColor: Colors.surface, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: Colors.border, marginRight: 12, gap: 4,
  },
  recentName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  recentWhen: { fontSize: 12, color: Colors.text2 },
  recentTime: { fontSize: 12, color: Colors.text2 },
  recentDone: { fontSize: 12, color: Colors.success, fontWeight: '700', marginTop: 4 },
  browseBtn: {
    backgroundColor: Colors.surface, borderRadius: 16, height: 52,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.borderActive,
  },
  browseBtnText: { fontSize: 15, fontWeight: '700', color: Colors.text2 },
  // Active workout styles
  workoutHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  endBtn: { fontSize: 15, fontWeight: '700', color: Colors.danger },
  workoutTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  timer: { fontSize: 18, fontWeight: '800', color: Colors.success, fontVariant: ['tabular-nums'], fontFamily: 'Nunito_800ExtraBold' },
  exCard: {
    marginHorizontal: 24, marginTop: 16, backgroundColor: Colors.surface,
    borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.border,
  },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  exName: { fontSize: 17, fontWeight: '700', color: Colors.text, flex: 1 },
  exMuscles: { fontSize: 13, color: Colors.text2, marginBottom: 6 },
  exPrev: { fontSize: 12, color: Colors.text3, marginBottom: 2 },
  exTarget: { fontSize: 12, color: Colors.accent, fontWeight: '600' },
  setRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6,
  },
  setRowDone: { opacity: 0.5 },
  setLabel: { fontSize: 13, color: Colors.text2, width: 40 },
  stepperMini: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceRaised, borderRadius: 10, overflow: 'hidden',
  },
  stepBtnMini: {
    width: 30, height: 36, alignItems: 'center', justifyContent: 'center',
  },
  stepBtnText: { fontSize: 18, fontWeight: '700', color: Colors.text },
  stepVal: { fontSize: 14, fontWeight: '800', color: Colors.text, paddingHorizontal: 6, fontVariant: ['tabular-nums'], fontFamily: 'Nunito_800ExtraBold' },
  stepUnit: { fontSize: 10, color: Colors.text2, fontWeight: '600' },
  xSep: { fontSize: 16, color: Colors.text3, fontWeight: '700' },
  doneBtn: {
    height: 36, paddingHorizontal: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.borderActive,
    alignItems: 'center', justifyContent: 'center',
  },
  doneBtnDone: { backgroundColor: Colors.success, borderColor: Colors.successDark },
  doneBtnText: { fontSize: 12, fontWeight: '800', color: Colors.text2 },
  doneBtnTextDone: { color: '#fff' },
  addSet: { paddingVertical: 8, alignItems: 'center', marginTop: 4 },
  addSetText: { fontSize: 14, color: Colors.accent, fontWeight: '600' },
});
