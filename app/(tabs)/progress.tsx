import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Circle, Line } from 'react-native-svg';
import { Colors } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { useNutritionStore } from '../../store/useNutritionStore';
import { todayString, calculateStreak, extractPersonalRecords } from '../../lib/calculations';

function WeightChart({ logs }: { logs: { date: string; weight: number }[] }) {
  if (logs.length < 2) {
    return (
      <View style={{ height: 120, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: Colors.text3, fontSize: 13 }}>Log more weight entries to see your chart</Text>
      </View>
    );
  }
  const w = 300, h = 120;
  const weights = logs.map(l => l.weight);
  const minW = Math.min(...weights), maxW = Math.max(...weights);
  const range = maxW - minW || 1;
  const pts = logs.map((l, i) => ({
    x: (i / (logs.length - 1)) * w,
    y: h - ((l.weight - minW) / range) * (h * 0.75) - h * 0.1,
  }));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const area = path + ` L ${pts[pts.length - 1].x} ${h} L 0 ${h} Z`;

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Defs>
        <SvgGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={Colors.accent} stopOpacity={0.25} />
          <Stop offset="100%" stopColor={Colors.accent} stopOpacity={0} />
        </SvgGradient>
      </Defs>
      <Path d={area} fill="url(#chartGrad)" />
      <Path d={path} stroke={Colors.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r="3" fill={Colors.accent} />
      ))}
    </Svg>
  );
}

export default function ProgressScreen() {
  const [weightInput, setWeightInput] = useState('');
  const profile    = useUserStore(s => s.profile);
  const weightLogs = useUserStore(s => s.weightLogs);
  const logWeight  = useUserStore(s => s.logWeight);
  const targets    = useUserStore(s => s.targets);

  const { workoutHistory, xp, rank } = useWorkoutStore();
  const { getTotals } = useNutritionStore();

  const streak  = calculateStreak(workoutHistory.map(w => w.date));
  const bestStreak = streak; // simplified — could track historical best
  const prs     = extractPersonalRecords(workoutHistory);

  const sortedLogs = [...weightLogs].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  const startWeight = sortedLogs[0]?.weight ?? profile?.weightKG ?? 0;
  const currentWeight = sortedLogs[sortedLogs.length - 1]?.weight ?? profile?.weightKG ?? 0;
  const change = currentWeight - startWeight;

  const xpToNext  = rank === 'Bronze' ? 2000 : rank === 'Silver' ? 5000 : rank === 'Gold' ? 10000 : 99999;
  const rankEmoji = rank === 'Bronze' ? '🥉' : rank === 'Silver' ? '🥈' : rank === 'Gold' ? '🥇' : '💎';
  const rankColor = rank === 'Bronze' ? Colors.bronze : rank === 'Silver' ? Colors.silver : rank === 'Gold' ? Colors.gold : Colors.accent;
  const nextRank  = rank === 'Bronze' ? 'Silver' : rank === 'Silver' ? 'Gold' : rank === 'Gold' ? 'Diamond' : 'MAX';

  // Last 8 weeks heatmap
  const today = todayString();
  const workoutDates = new Set(workoutHistory.map(w => w.date));
  const WEEKS = Array.from({ length: 8 }, (_, wi) =>
    Array.from({ length: 7 }, (_, di) => {
      const d = new Date();
      d.setDate(d.getDate() - (7 * (7 - wi)) + di);
      const ds = d.toISOString().split('T')[0];
      if (ds > today) return 'future';
      if (ds === today) return 'today';
      return workoutDates.has(ds) ? 'full' : 'empty';
    })
  );

  const handleLogWeight = () => {
    const w = parseFloat(weightInput);
    if (isNaN(w) || w < 20 || w > 400) {
      Alert.alert('Invalid weight', 'Please enter a valid weight in kg.');
      return;
    }
    logWeight(w);
    setWeightInput('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Weight chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weight Tracking</Text>
          <View style={{ alignItems: 'center', marginVertical: 16 }}>
            <WeightChart logs={sortedLogs} />
          </View>
          <View style={styles.weightStats}>
            {[
              { label: 'Start',   val: `${startWeight.toFixed(1)} kg`,    color: Colors.text },
              { label: 'Current', val: `${currentWeight.toFixed(1)} kg`,  color: Colors.accent },
              { label: 'Change',  val: `${change >= 0 ? '+' : ''}${change.toFixed(1)} kg`, color: change <= 0 ? Colors.success : Colors.danger },
            ].map(s => (
              <View key={s.label} style={styles.wStat}>
                <Text style={styles.wStatLabel}>{s.label}</Text>
                <Text style={[styles.wStatVal, { color: s.color }]}>{s.val}</Text>
              </View>
            ))}
          </View>
          <View style={styles.logWeightRow}>
            <TextInput
              style={styles.weightInputField}
              placeholder={`${currentWeight.toFixed(1)}`}
              placeholderTextColor={Colors.text3}
              value={weightInput}
              onChangeText={setWeightInput}
              keyboardType="numeric"
            />
            <Text style={styles.kgLabel}>kg</Text>
            <TouchableOpacity style={styles.logWeightBtn} onPress={handleLogWeight}>
              <Text style={styles.logWeightBtnText}>Log Weight</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rank */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <View style={styles.rankRow}>
            {['🥉', '🥈', '🥇', '💎'].map((r, i) => {
              const ranks = ['Bronze', 'Silver', 'Gold', 'Diamond'];
              const active = ranks[i] === rank;
              const passed = ['Bronze', 'Silver', 'Gold', 'Diamond'].indexOf(rank) > i;
              return (
                <View key={i} style={[styles.rankBadge, (active || passed) && styles.rankBadgeActive]}>
                  <Text style={{ fontSize: 22, opacity: active || passed ? 1 : 0.35 }}>{r}</Text>
                </View>
              );
            })}
          </View>
          <Text style={[styles.rankName, { color: rankColor }]}>{rank.toUpperCase()} RANK</Text>
          <View style={styles.xpBarTrack}>
            <View style={[styles.xpBarFill, {
              width: `${Math.min(100, Math.round((xp / xpToNext) * 100))}%`,
              backgroundColor: rankColor,
            }]} />
          </View>
          <Text style={styles.xpLabel}>{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP to {nextRank}</Text>
          <Text style={styles.rankHint}>{Math.max(0, xpToNext - xp).toLocaleString()} XP to reach {nextRank}</Text>
        </View>

        {/* Workout heatmap */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={styles.cardTitle}>Workout History</Text>
          <View style={styles.heatmap}>
            <View style={styles.heatDays}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <Text key={i} style={styles.heatDayLabel}>{d}</Text>
              ))}
            </View>
            {WEEKS.map((week, wi) => (
              <View key={wi} style={styles.heatWeek}>
                {week.map((state, di) => (
                  <View key={di} style={[
                    styles.heatCell,
                    state === 'full'   && styles.heatFull,
                    state === 'today'  && styles.heatToday,
                    state === 'future' && styles.heatFuture,
                  ]} />
                ))}
              </View>
            ))}
          </View>
          <Text style={styles.streakInfo}>Current: {streak} days · Workouts: {workoutHistory.length}</Text>
        </View>

        {/* Personal records */}
        {prs.length > 0 && (
          <View style={[styles.card, { marginTop: 16 }]}>
            <Text style={styles.cardTitle}>Personal Records 🏆</Text>
            {prs.slice(0, 6).map((pr, i) => (
              <View key={i} style={styles.prRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.prName}>{pr.exerciseName}</Text>
                  <Text style={styles.prDate}>{pr.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.prWeight}>{pr.weight}kg × {pr.reps}</Text>
                  <Text style={styles.prOneRM}>e1RM: {pr.estimatedOneRM}kg</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            { icon: '🔥', val: streak.toString(),                       label: 'Day Streak' },
            { icon: '💪', val: workoutHistory.length.toString(),        label: 'Workouts' },
            { icon: '⚡', val: xp.toLocaleString(),                     label: 'Total XP' },
            { icon: '🏆', val: prs.length.toString(),                   label: 'PRs Set' },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={{ fontSize: 22 }}>{s.icon}</Text>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, fontFamily: 'Nunito_800ExtraBold' },
  card: { marginHorizontal: 24, backgroundColor: Colors.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  weightStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },
  wStat: { flex: 1, alignItems: 'center' },
  wStatLabel: { fontSize: 12, color: Colors.text2, fontWeight: '600' },
  wStatVal: { fontSize: 16, fontWeight: '800', color: Colors.text, fontVariant: ['tabular-nums'], fontFamily: 'Nunito_800ExtraBold' },
  logWeightRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  weightInputField: {
    flex: 1, height: 44, backgroundColor: Colors.surfaceRaised,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.borderActive,
    paddingHorizontal: 14, fontSize: 16, color: Colors.text, fontWeight: '700',
  },
  kgLabel: { fontSize: 14, color: Colors.text2, fontWeight: '600' },
  logWeightBtn: {
    backgroundColor: Colors.accent, borderRadius: 12, height: 44,
    paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center',
  },
  logWeightBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  rankRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  rankBadge: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.surfaceRaised, alignItems: 'center', justifyContent: 'center', opacity: 0.4 },
  rankBadgeActive: { opacity: 1 },
  rankName: { fontSize: 22, fontWeight: '900', fontFamily: 'Nunito_900Black', marginBottom: 12 },
  xpBarTrack: { height: 12, backgroundColor: Colors.surfaceRaised, borderRadius: 999, overflow: 'hidden', marginBottom: 8 },
  xpBarFill: { height: '100%', borderRadius: 999 },
  xpLabel: { fontSize: 14, color: Colors.text2, fontWeight: '600' },
  rankHint: { fontSize: 13, color: Colors.text3, marginTop: 6 },
  heatmap: { marginTop: 12, gap: 4 },
  heatDays: { flexDirection: 'row', gap: 4, marginBottom: 4 },
  heatDayLabel: { width: 28, fontSize: 10, color: Colors.text3, textAlign: 'center', fontWeight: '600' },
  heatWeek: { flexDirection: 'row', gap: 4 },
  heatCell: { width: 28, height: 28, borderRadius: 6, backgroundColor: Colors.surfaceRaised },
  heatFull: { backgroundColor: Colors.accent },
  heatToday: { backgroundColor: Colors.accent, borderWidth: 2, borderColor: '#fff' },
  heatFuture: { backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border },
  streakInfo: { fontSize: 13, color: Colors.text2, fontWeight: '600', marginTop: 12 },
  prRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  prName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  prDate: { fontSize: 11, color: Colors.text3, marginTop: 2 },
  prWeight: { fontSize: 14, fontWeight: '800', color: Colors.accent },
  prOneRM: { fontSize: 11, color: Colors.text3, marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 24, marginTop: 16 },
  statCard: {
    width: '46%', backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', gap: 4,
  },
  statVal: { fontSize: 24, fontWeight: '900', color: Colors.text, fontFamily: 'Nunito_900Black' },
  statLabel: { fontSize: 13, color: Colors.text2, fontWeight: '600' },
});
