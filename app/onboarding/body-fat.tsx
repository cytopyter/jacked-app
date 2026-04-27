import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path, Ellipse } from 'react-native-svg';
import { router } from 'expo-router';
import OnboardProgress from '../../components/OnboardProgress';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors } from '../../constants/theme';

const MALE_OPTIONS = [
  { range: '~8-12%', idx: 0 },
  { range: '~13-17%', idx: 1 },
  { range: '~18-22%', idx: 2 },
  { range: '~25-30%', idx: 3 },
  { range: '~32-38%', idx: 4 },
  { range: '~40%+', idx: 5 },
];
const FEMALE_OPTIONS = [
  { range: '~16-20%', idx: 0 },
  { range: '~22-26%', idx: 1 },
  { range: '~28-32%', idx: 2 },
  { range: '~35-38%', idx: 3 },
  { range: '~40-44%', idx: 4 },
  { range: '~45%+', idx: 5 },
];

function BodySilhouette({ idx, selected }: { idx: number; selected: boolean }) {
  // Abstract body shape — gets progressively wider/rounder
  const w = 40 + idx * 8;
  const color = selected ? Colors.accent : '#3D5270';
  return (
    <Svg width={50} height={68} viewBox="0 0 50 68">
      <Ellipse cx="25" cy="16" rx={10 + idx} ry="12" fill={color} opacity={0.9} />
      <Path
        d={`M${25 - w / 2} 28 Q ${25 - w / 2 - 4} 48 ${25 - w / 2 + 2} 65 Q 25 68 ${25 + w / 2 - 2} 65 Q ${25 + w / 2 + 4} 48 ${25 + w / 2} 28 Q 25 22 ${25 - w / 2} 28 Z`}
        fill={color} opacity={0.8}
      />
    </Svg>
  );
}

export default function BodyFatScreen() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [selected, setSelected] = useState<number | null>(2);
  const options = gender === 'male' ? MALE_OPTIONS : FEMALE_OPTIONS;

  return (
    <View style={styles.container}>
      <OnboardProgress step={4} total={9} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Which looks closest to you?</Text>
        <Text style={styles.sub}>Tap the one that's nearest. No judgment — just math.</Text>

        {/* Gender toggle */}
        <View style={styles.toggle}>
          {(['male', 'female'] as const).map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.toggleBtn, gender === g && styles.toggleActive]}
              onPress={() => setGender(g)}
            >
              <Text style={[styles.toggleText, gender === g && styles.toggleTextActive]}>
                {g === 'male' ? 'Men' : 'Women'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {options.map((o) => (
            <TouchableOpacity
              key={o.idx}
              style={[styles.cell, selected === o.idx && styles.cellSelected]}
              onPress={() => setSelected(o.idx)}
            >
              <BodySilhouette idx={o.idx} selected={selected === o.idx} />
              <Text style={[styles.pct, selected === o.idx && { color: Colors.accent }]}>
                {o.range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selected !== null && (
          <View style={styles.chip}>
            <Text style={{ color: Colors.accent, fontWeight: '700', fontSize: 13 }}>
              {options[selected].range} body fat selected
            </Text>
          </View>
        )}

        <PrimaryButton
          label="Continue"
          disabled={selected === null}
          onPress={() => router.push('/onboarding/goal')}
          style={{ marginTop: 16 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 24, paddingTop: 16, paddingBottom: 40 },
  h1: { fontSize: 26, fontWeight: '800', color: Colors.text, fontFamily: 'Nunito_800ExtraBold' },
  sub: { fontSize: 15, color: Colors.text2, marginTop: 8, lineHeight: 22 },
  toggle: {
    flexDirection: 'row', backgroundColor: Colors.surfaceRaised,
    borderRadius: 999, padding: 4, alignSelf: 'center',
    marginTop: 16, borderWidth: 1, borderColor: Colors.border,
  },
  toggleBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 999 },
  toggleActive: { backgroundColor: Colors.accent },
  toggleText: { fontSize: 14, fontWeight: '700', color: Colors.text2 },
  toggleTextActive: { color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 },
  cell: {
    width: '30%', backgroundColor: Colors.surfaceRaised,
    borderRadius: 14, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, opacity: 0.75,
  },
  cellSelected: {
    borderColor: Colors.accent, borderWidth: 2,
    opacity: 1,
    shadowColor: Colors.accent, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  pct: { fontSize: 12, color: Colors.text2, fontWeight: '600', marginTop: 8 },
  chip: {
    backgroundColor: `${Colors.accent}22`, borderRadius: 999,
    padding: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.accent,
    marginTop: 12,
  },
});
