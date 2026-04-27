import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import OnboardProgress from '../../components/OnboardProgress';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';

const PACE = [
  { id: 'slow', icon: '🐢', label: 'Slow', detail: '±0.25kg/wk' },
  { id: 'moderate', icon: '🎯', label: 'Moderate', detail: '±0.5kg/wk' },
  { id: 'aggressive', icon: '🚀', label: 'Aggressive', detail: '±0.75kg/wk' },
];

export default function GoalScreen() {
  const [goal, setGoal] = useState<'cut' | 'bulk' | null>(null);
  const [pace, setPace] = useState<string>('moderate');
  const setProfile = useUserStore(s => s.setProfile);

  return (
    <View style={styles.container}>
      <OnboardProgress step={5} total={9} />
      <View style={styles.content}>
        <Text style={styles.h1}>What's your goal?</Text>
        <Text style={styles.sub}>Choose your direction — we'll set the pace.</Text>

        <View style={{ gap: 14, marginTop: 20 }}>
          <TouchableOpacity
            style={[styles.goalCard, goal === 'cut' && styles.goalSelected]}
            onPress={() => setGoal('cut')}
          >
            {goal === 'cut' && <View style={styles.stripe} />}
            <Text style={{ fontSize: 40 }}>📉</Text>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.goalTitle}>CUT</Text>
              <Text style={styles.goalSub}>Lose fat, reveal muscle</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.goalCard, goal === 'bulk' && styles.goalSelected]}
            onPress={() => setGoal('bulk')}
          >
            {goal === 'bulk' && <View style={styles.stripe} />}
            <Text style={{ fontSize: 40 }}>📈</Text>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.goalTitle}>BULK</Text>
              <Text style={styles.goalSub}>Build muscle, gain size</Text>
            </View>
          </TouchableOpacity>
        </View>

        {goal && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.paceHeading}>How aggressive?</Text>
            <View style={styles.paceRow}>
              {PACE.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.paceCard, pace === p.id && styles.paceSelected]}
                  onPress={() => setPace(p.id)}
                >
                  <Text style={{ fontSize: 24 }}>{p.icon}</Text>
                  <Text style={styles.paceLabel}>{p.label}</Text>
                  <Text style={styles.paceDetail}>{p.detail}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ color: Colors.success, fontSize: 12, fontWeight: '600', textAlign: 'center', marginTop: 8 }}>
              Moderate is recommended for most beginners.
            </Text>
          </View>
        )}

        <PrimaryButton
          label="Build My Plan →"
          disabled={!goal}
          onPress={() => { setProfile({ goal: goal === 'cut' ? 'lose' : 'gain', pace: pace as any }); router.push('/onboarding/training-days'); }}
          style={{ marginTop: 24 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { flex: 1, padding: 24, paddingTop: 16 },
  h1: { fontSize: 26, fontWeight: '800', color: Colors.text, fontFamily: 'Nunito_800ExtraBold' },
  sub: { fontSize: 15, color: Colors.text2, marginTop: 6 },
  goalCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: 20, borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 2, borderColor: Colors.border,
    minHeight: 100, position: 'relative', overflow: 'hidden',
  },
  goalSelected: {
    borderColor: Colors.accent, backgroundColor: Colors.surfaceRaised,
  },
  stripe: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
    backgroundColor: Colors.accent,
  },
  goalTitle: { fontSize: 24, fontWeight: '900', color: Colors.text, fontFamily: 'Nunito_900Black' },
  goalSub: { fontSize: 15, color: Colors.text2, marginTop: 4 },
  paceHeading: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  paceRow: { flexDirection: 'row', gap: 10 },
  paceCard: {
    flex: 1, backgroundColor: Colors.surface,
    borderRadius: 16, padding: 14, alignItems: 'center', gap: 4,
    borderWidth: 2, borderColor: Colors.border,
  },
  paceSelected: { borderColor: Colors.accent, backgroundColor: Colors.surfaceRaised },
  paceLabel: { fontSize: 13, fontWeight: '700', color: Colors.text },
  paceDetail: { fontSize: 11, color: Colors.text2 },
});
