import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../../constants/theme';

function WeightChart() {
  const points = [82, 81.2, 80.5, 80.1, 79.6, 79.2, 78.8, 78.5, 78.2];
  const w = 300, h = 120;
  const minW = Math.min(...points), maxW = Math.max(...points);
  const range = maxW - minW || 1;
  const pts = points.map((p, i) => ({
    x: (i / (points.length - 1)) * w,
    y: h - ((p - minW) / range) * (h * 0.8) - h * 0.1,
  }));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = path + ` L ${pts[pts.length - 1].x} ${h} L 0 ${h} Z`;

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Defs>
        <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={Colors.accent} stopOpacity={0.25} />
          <Stop offset="100%" stopColor={Colors.accent} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={area} fill="url(#chartGrad)" />
      <Path d={path} stroke={Colors.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Goal line */}
      <Path d={`M 0 ${h - ((75 - minW) / range) * (h * 0.8) - h * 0.1} L ${w} ${h - ((75 - minW) / range) * (h * 0.8) - h * 0.1}`}
        stroke={Colors.success} strokeWidth="1.5" strokeDasharray="6 4" fill="none" />
    </Svg>
  );
}

const WEEKS = Array.from({ length: 8 }, (_, wi) =>
  Array.from({ length: 7 }, (_, di) => {
    const total = wi * 7 + di;
    const today = 46;
    if (total > today) return 'future';
    if (total === today) return 'today';
    const r = Math.random();
    if (r > 0.85) return 'missed';
    if (r > 0.7) return 'light';
    return 'full';
  })
);

export default function ProgressScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
        <TouchableOpacity style={styles.logBtn}>
          <Text style={styles.logBtnText}>+ Log Weight</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Weight chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weight</Text>
            <View style={styles.filters}>
              {['1M', '3M', '6M', '1Y'].map((f, i) => (
                <TouchableOpacity key={f} style={[styles.filterBtn, i === 0 && styles.filterActive]}>
                  <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{ alignItems: 'center', marginVertical: 16 }}>
            <WeightChart />
          </View>
          <View style={styles.weightStats}>
            <View style={styles.wStat}>
              <Text style={styles.wStatLabel}>Start</Text>
              <Text style={styles.wStatVal}>82.0 kg</Text>
            </View>
            <View style={styles.wStat}>
              <Text style={styles.wStatLabel}>Current</Text>
              <Text style={[styles.wStatVal, { color: Colors.accent }]}>78.2 kg</Text>
            </View>
            <View style={styles.wStat}>
              <Text style={styles.wStatLabel}>Change</Text>
              <Text style={[styles.wStatVal, { color: Colors.success }]}>-3.8 kg ↓</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logWeightBtn}>
            <Text style={styles.logWeightBtnText}>+ Log Today's Weight</Text>
          </TouchableOpacity>
        </View>

        {/* Rank card */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <View style={styles.rankRow}>
            {['🥉', '🥈', '🥇', '💎'].map((r, i) => (
              <View key={i} style={[styles.rankBadge, i === 0 && styles.rankBadgeActive]}>
                <Text style={{ fontSize: 22 }}>{r}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.rankName, { color: Colors.bronze }]}>BRONZE RANK</Text>
          <View style={styles.xpBarTrack}>
            <View style={[styles.xpBarFill, { width: '62%' }]} />
          </View>
          <Text style={styles.xpLabel}>1,240 / 2,000 XP to Silver</Text>
          <Text style={styles.rankHint}>12 more consistent workouts to reach Silver</Text>
        </View>

        {/* Streak heatmap */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={styles.cardTitle}>Streak History</Text>
          <View style={styles.heatmap}>
            <View style={styles.heatDays}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <Text key={i} style={styles.heatDayLabel}>{d}</Text>
              ))}
            </View>
            {WEEKS.map((week, wi) => (
              <View key={wi} style={styles.heatWeek}>
                {week.map((state, di) => (
                  <View key={di} style={[styles.heatCell,
                    state === 'full' && styles.heatFull,
                    state === 'light' && styles.heatLight,
                    state === 'missed' && styles.heatMissed,
                    state === 'today' && styles.heatToday,
                  ]} />
                ))}
              </View>
            ))}
          </View>
          <Text style={styles.streakInfo}>Current: 12 days · Best: 23 days</Text>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            { icon: '🔥', val: '12', label: 'Day Streak' },
            { icon: '💪', val: '47', label: 'Workouts' },
            { icon: '📅', val: '38', label: 'Days Logged' },
            { icon: '🏆', val: '6', label: 'Best Week' },
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
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, fontFamily: 'Nunito_800ExtraBold' },
  logBtn: {
    backgroundColor: Colors.surfaceRaised, borderRadius: 999,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.accent,
  },
  logBtnText: { fontSize: 13, fontWeight: '700', color: Colors.accent },
  card: {
    marginHorizontal: 24, backgroundColor: Colors.surface,
    borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  filters: { flexDirection: 'row', gap: 4 },
  filterBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  filterActive: { backgroundColor: Colors.accent },
  filterText: { fontSize: 13, color: Colors.text2, fontWeight: '600' },
  filterTextActive: { color: '#fff', fontWeight: '700' },
  weightStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },
  wStat: { flex: 1, alignItems: 'center' },
  wStatLabel: { fontSize: 12, color: Colors.text2, fontWeight: '600' },
  wStatVal: { fontSize: 16, fontWeight: '800', color: Colors.text, fontVariant: ['tabular-nums'], fontFamily: 'Nunito_800ExtraBold' },
  logWeightBtn: {
    marginTop: 12, borderWidth: 2, borderColor: Colors.borderActive,
    borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center',
  },
  logWeightBtnText: { fontSize: 14, fontWeight: '700', color: Colors.text2 },
  rankRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  rankBadge: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.surfaceRaised, alignItems: 'center', justifyContent: 'center', opacity: 0.4 },
  rankBadgeActive: { opacity: 1, backgroundColor: `${Colors.bronze}22`, borderWidth: 1, borderColor: Colors.bronze },
  rankName: { fontSize: 22, fontWeight: '900', fontFamily: 'Nunito_900Black', marginBottom: 12 },
  xpBarTrack: { height: 12, backgroundColor: Colors.surfaceRaised, borderRadius: 999, overflow: 'hidden', marginBottom: 8 },
  xpBarFill: { height: '100%', backgroundColor: Colors.bronze, borderRadius: 999 },
  xpLabel: { fontSize: 14, color: Colors.text2, fontWeight: '600' },
  rankHint: { fontSize: 13, color: Colors.text3, marginTop: 6 },
  heatmap: { marginTop: 12, gap: 4 },
  heatDays: { flexDirection: 'row', gap: 4, marginBottom: 4 },
  heatDayLabel: { width: 28, fontSize: 10, color: Colors.text3, textAlign: 'center', fontWeight: '600' },
  heatWeek: { flexDirection: 'row', gap: 4 },
  heatCell: { width: 28, height: 28, borderRadius: 6, backgroundColor: Colors.surfaceRaised },
  heatFull: { backgroundColor: Colors.accent },
  heatLight: { backgroundColor: `${Colors.accent}55` },
  heatMissed: { backgroundColor: `${Colors.danger}33` },
  heatToday: { backgroundColor: Colors.accent, borderWidth: 2, borderColor: '#fff' },
  streakInfo: { fontSize: 13, color: Colors.text2, fontWeight: '600', marginTop: 12 },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    paddingHorizontal: 24, marginTop: 16,
  },
  statCard: {
    width: '46%', backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', gap: 4,
  },
  statVal: { fontSize: 24, fontWeight: '900', color: Colors.text, fontFamily: 'Nunito_900Black' },
  statLabel: { fontSize: 13, color: Colors.text2, fontWeight: '600' },
});
