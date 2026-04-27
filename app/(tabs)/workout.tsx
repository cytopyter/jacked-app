import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/theme';
import { useWorkoutStore, DEFAULT_PLAN } from '../../store/useWorkoutStore';
import { useUserStore } from '../../store/useUserStore';
import { calculateSetVolume, suggestNextSet } from '../../lib/calculations';
import type { WorkoutSet, WorkoutExercise } from '../../lib/types';

// ─── Timer hook ───────────────────────────────────────────────────────────────
function useTimer(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
      setElapsed(0);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

// ─── Set row ──────────────────────────────────────────────────────────────────
function SetRow({ set, exerciseId, onUpdate, prevSet }: {
  set: WorkoutSet;
  exerciseId: string;
  prevSet?: WorkoutSet;
  onUpdate: (setIndex: number, data: Partial<WorkoutSet>) => void;
}) {
  const [weight, setWeight] = useState(set.weight.toString());
  const [reps, setReps] = useState(set.reps.toString());

  const commitWeight = () => {
    const v = parseFloat(weight);
    if (!isNaN(v)) onUpdate(set.setIndex, { weight: v });
  };
  const commitReps = () => {
    const v = parseInt(reps);
    if (!isNaN(v)) onUpdate(set.setIndex, { reps: v });
  };

  return (
    <View style={[styles.setRow, set.done && styles.setRowDone]}>
      <Text style={styles.setLabel}>Set {set.setIndex + 1}</Text>
      {prevSet && (
        <Text style={styles.prevVal}>{prevSet.weight}×{prevSet.reps}</Text>
      )}
      <View style={styles.stepperMini}>
        <TouchableOpacity style={styles.stepBtnMini} onPress={() => {
          const v = Math.max(0, (parseFloat(weight) || 0) - 2.5);
          setWeight(v % 1 === 0 ? v.toString() : v.toFixed(1));
          onUpdate(set.setIndex, { weight: v });
        }}>
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.stepVal}
          value={weight}
          onChangeText={setWeight}
          onBlur={commitWeight}
          keyboardType="numeric"
          selectTextOnFocus
        />
        <Text style={styles.stepUnit}>kg</Text>
        <TouchableOpacity style={styles.stepBtnMini} onPress={() => {
          const v = (parseFloat(weight) || 0) + 2.5;
          setWeight(v % 1 === 0 ? v.toString() : v.toFixed(1));
          onUpdate(set.setIndex, { weight: v });
        }}>
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.xSep}>×</Text>
      <View style={styles.stepperMini}>
        <TouchableOpacity style={styles.stepBtnMini} onPress={() => {
          const v = Math.max(1, (parseInt(reps) || 0) - 1);
          setReps(v.toString());
          onUpdate(set.setIndex, { reps: v });
        }}>
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.stepVal}
          value={reps}
          onChangeText={setReps}
          onBlur={commitReps}
          keyboardType="numeric"
          selectTextOnFocus
        />
        <Text style={styles.stepUnit}>rps</Text>
        <TouchableOpacity style={styles.stepBtnMini} onPress={() => {
          const v = (parseInt(reps) || 0) + 1;
          setReps(v.toString());
          onUpdate(set.setIndex, { reps: v });
        }}>
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.doneBtn, set.done && styles.doneBtnDone]}
        onPress={() => onUpdate(set.setIndex, { done: !set.done })}
      >
        <Text style={[styles.doneBtnText, set.done && styles.doneBtnTextDone]}>
          {set.done ? '✓' : 'DONE'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Active workout ───────────────────────────────────────────────────────────
function ActiveWorkoutView() {
  const { activeWorkout, updateSet, completeWorkout, discardWorkout, getLastWorkoutForDay } = useWorkoutStore();
  const timer = useTimer(true);
  if (!activeWorkout) return null;

  const prevLog = getLastWorkoutForDay(activeWorkout.planDayIndex);
  const setsCompleted = activeWorkout.exercises.reduce((s, e) => s + e.sets.filter(st => st.done).length, 0);
  const totalSets = activeWorkout.exercises.reduce((s, e) => s + e.sets.length, 0);

  const handleComplete = () => {
    Alert.alert('Finish workout?', `${setsCompleted}/${totalSets} sets done`, [
      { text: 'Keep going', style: 'cancel' },
      { text: 'Finish', onPress: () => completeWorkout() },
    ]);
  };

  const handleDiscard = () => {
    Alert.alert('Discard workout?', 'All progress will be lost.', [
      { text: 'Keep going', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: discardWorkout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.workoutHeader}>
        <TouchableOpacity onPress={handleDiscard}>
          <Text style={styles.endBtn}>End</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.workoutTitle}>{activeWorkout.name}</Text>
          <Text style={styles.setsProgress}>{setsCompleted}/{totalSets} sets</Text>
        </View>
        <Text style={styles.timer}>{timer}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        {activeWorkout.exercises.map((ex: WorkoutExercise) => {
          const prevEx = prevLog?.exercises.find(e => e.name === ex.name);
          return (
            <View key={ex.id} style={styles.exCard}>
              <View style={styles.exHeader}>
                <Text style={styles.exName}>{ex.name}</Text>
                <View style={[styles.muscleChip, { backgroundColor: `${Colors.accent}22` }]}>
                  <Text style={styles.muscleChipText}>{ex.muscleGroup}</Text>
                </View>
              </View>
              <Text style={styles.exRange}>Target: {ex.repRangeStart}–{ex.repRangeEnd} reps</Text>
              {prevEx && (
                <Text style={styles.exPrev}>
                  Last session: {prevEx.sets.filter(s => s.done).map(s => `${s.weight}×${s.reps}`).join(', ')}
                </Text>
              )}
              <View style={{ height: 1, backgroundColor: Colors.border, marginVertical: 10 }} />
              {ex.sets.map(set => (
                <SetRow
                  key={set.setIndex}
                  set={set}
                  exerciseId={ex.id}
                  prevSet={prevEx?.sets[set.setIndex]}
                  onUpdate={(setIndex, data) => updateSet(ex.id, setIndex, data)}
                />
              ))}
            </View>
          );
        })}
        <TouchableOpacity style={styles.finishBtn} onPress={handleComplete}>
          <Text style={styles.finishBtnText}>Finish Workout ✓</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function WorkoutScreen() {
  const { activeWorkout, startWorkout, currentPlanDayIndex, workoutHistory, xp, rank } = useWorkoutStore();
  const profile = useUserStore(s => s.profile);

  if (activeWorkout) return <ActiveWorkoutView />;

  const todayPlan = DEFAULT_PLAN[currentPlanDayIndex];
  const recent = workoutHistory.slice(0, 5);
  const xpToNext = rank === 'Bronze' ? 2000 : rank === 'Silver' ? 5000 : rank === 'Gold' ? 10000 : 99999;
  const rankEmoji = rank === 'Bronze' ? '🥉' : rank === 'Silver' ? '🥈' : rank === 'Gold' ? '🥇' : '💎';
  const rankColor = rank === 'Bronze' ? Colors.bronze : rank === 'Silver' ? Colors.silver : rank === 'Gold' ? Colors.gold : Colors.accent;

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
              <Text style={[styles.chipText, { color: Colors.accent }]}>{todayPlan.name.toUpperCase()}</Text>
            </View>
            <View style={[styles.chip, { borderColor: Colors.border }]}>
              <Text style={[styles.chipText, { color: Colors.text2 }]}>{todayPlan.exercises.length} exercises</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{todayPlan.name}</Text>
          <Text style={styles.heroMuscles}>{todayPlan.muscles}</Text>
          <Text style={styles.heroDetail}>~{todayPlan.exercises.length * 10} min · Progressive overload</Text>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => startWorkout(currentPlanDayIndex, profile?.weightKG ?? 75)}
          >
            <Text style={styles.startBtnText}>Start Workout →</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Rank card */}
        <View style={styles.rankCard}>
          <Text style={{ fontSize: 26 }}>{rankEmoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rankName, { color: rankColor }]}>{rank.toUpperCase()} RANK</Text>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${Math.min(100, (xp / xpToNext) * 100)}%`, backgroundColor: rankColor }]} />
            </View>
            <Text style={styles.xpLabel}>{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP</Text>
          </View>
        </View>

        {/* Upcoming split */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Split</Text>
          <View style={{ gap: 8, marginTop: 10 }}>
            {DEFAULT_PLAN.map((day, i) => (
              <View key={i} style={[styles.splitDay, i === currentPlanDayIndex && styles.splitDayActive]}>
                {i === currentPlanDayIndex && <View style={styles.splitStripe} />}
                <Text style={{ fontSize: 20 }}>{['💪', '🔄', '🦵'][i]}</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.splitDayName}>{day.name}</Text>
                  <Text style={styles.splitDayMuscles}>{day.muscles}</Text>
                </View>
                {i === currentPlanDayIndex && (
                  <View style={styles.todayBadge}><Text style={styles.todayBadgeText}>TODAY</Text></View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Recent workouts */}
        {recent.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {recent.map(w => (
                <View key={w.id} style={styles.recentCard}>
                  <Text style={styles.recentName}>{w.name}</Text>
                  <Text style={styles.recentDate}>{w.date}</Text>
                  <Text style={styles.recentVol}>{Math.round(w.totalVolume).toLocaleString()} vol</Text>
                  <Text style={styles.recentDone}>✓ Done</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 32 }} />
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
    marginTop: 14, backgroundColor: Colors.accent, borderRadius: 14, height: 48,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.accentDim, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  startBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  rankCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: 24, marginTop: 16,
    backgroundColor: Colors.surface, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  rankName: { fontSize: 16, fontWeight: '900', fontFamily: 'Nunito_900Black', marginBottom: 6 },
  xpTrack: { height: 8, backgroundColor: Colors.surfaceRaised, borderRadius: 999, overflow: 'hidden', marginBottom: 4 },
  xpFill: { height: '100%', borderRadius: 999 },
  xpLabel: { fontSize: 12, color: Colors.text2 },
  section: { paddingHorizontal: 24, marginTop: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  splitDay: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: Colors.border, position: 'relative', overflow: 'hidden',
  },
  splitDayActive: { borderColor: Colors.accent, backgroundColor: Colors.surfaceRaised },
  splitStripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: Colors.accent },
  splitDayName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  splitDayMuscles: { fontSize: 12, color: Colors.text2, marginTop: 2 },
  todayBadge: { backgroundColor: Colors.accent, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  todayBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  recentCard: {
    width: 120, backgroundColor: Colors.surface, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: Colors.border, marginRight: 12, gap: 3,
  },
  recentName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  recentDate: { fontSize: 11, color: Colors.text3 },
  recentVol: { fontSize: 12, color: Colors.text2, fontWeight: '600' },
  recentDone: { fontSize: 12, color: Colors.success, fontWeight: '700', marginTop: 4 },
  // Active workout
  workoutHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 56, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  endBtn: { fontSize: 15, fontWeight: '700', color: Colors.danger },
  workoutTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  setsProgress: { fontSize: 12, color: Colors.text2, marginTop: 2 },
  timer: { fontSize: 18, fontWeight: '800', color: Colors.success, fontVariant: ['tabular-nums'], fontFamily: 'Nunito_800ExtraBold' },
  exCard: {
    marginHorizontal: 24, marginTop: 14, backgroundColor: Colors.surface,
    borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.border,
  },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  exName: { fontSize: 17, fontWeight: '700', color: Colors.text, flex: 1 },
  muscleChip: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  muscleChipText: { fontSize: 11, fontWeight: '700', color: Colors.accent },
  exRange: { fontSize: 12, color: Colors.accent, fontWeight: '600' },
  exPrev: { fontSize: 12, color: Colors.text3, marginTop: 2 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 5 },
  setRowDone: { opacity: 0.45 },
  setLabel: { fontSize: 13, color: Colors.text2, width: 38 },
  prevVal: { fontSize: 11, color: Colors.text3, width: 52, textAlign: 'center' },
  stepperMini: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceRaised, borderRadius: 10, overflow: 'hidden',
  },
  stepBtnMini: { width: 28, height: 34, alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { fontSize: 18, fontWeight: '700', color: Colors.text },
  stepVal: {
    fontSize: 13, fontWeight: '800', color: Colors.text,
    paddingHorizontal: 4, minWidth: 32, textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  stepUnit: { fontSize: 9, color: Colors.text2, fontWeight: '600', paddingRight: 2 },
  xSep: { fontSize: 14, color: Colors.text3, fontWeight: '700' },
  doneBtn: {
    height: 34, paddingHorizontal: 9, borderRadius: 9,
    borderWidth: 1.5, borderColor: Colors.borderActive,
    alignItems: 'center', justifyContent: 'center',
  },
  doneBtnDone: { backgroundColor: Colors.success, borderColor: Colors.successDark },
  doneBtnText: { fontSize: 11, fontWeight: '800', color: Colors.text2 },
  doneBtnTextDone: { color: '#fff' },
  finishBtn: {
    margin: 24, backgroundColor: Colors.success, borderRadius: 16, height: 52,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.successDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  finishBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
