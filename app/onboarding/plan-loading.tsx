import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import Max from '../../components/Max';
import { Colors } from '../../constants/theme';

const STEPS = [
  { label: 'Calculating your maintenance calories...', result: 'TDEE: 2,650 kcal/day' },
  { label: 'Applying your deficit...', result: 'Target: 2,150 kcal/day' },
  { label: 'Optimising protein & macros...', result: '150g protein · 160g carbs · 60g fat' },
  { label: 'Building your personalised split...', result: 'Push/Pull/Legs · 5×/wk' },
];

export default function PlanLoadingScreen() {
  const [step, setStep] = useState(0);
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: 100,
      duration: 3800,
      useNativeDriver: false,
    }).start();

    const timers = STEPS.map((_, i) =>
      setTimeout(() => setStep(i + 1), 800 + i * 900)
    );
    const navTimer = setTimeout(() => router.replace('/onboarding/plan-reveal'), 4200);
    return () => { timers.forEach(clearTimeout); clearTimeout(navTimer); };
  }, []);

  return (
    <View style={styles.container}>
      {/* Stars */}
      <View style={StyleSheet.absoluteFill}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={i} style={{
            position: 'absolute',
            width: 3, height: 3, borderRadius: 2,
            backgroundColor: [Colors.accent, Colors.success, Colors.purple][i % 3],
            left: `${(i * 8.3) % 100}%` as any,
            bottom: -10,
            opacity: 0.5,
          }} />
        ))}
      </View>

      {/* Progress bar */}
      <Animated.View style={[styles.progressBar, {
        width: progressWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })
      }]} />

      {/* Content */}
      <View style={styles.content}>
        <Max size={120} mood="think" />
        <Text style={styles.overline}>PERSONALISING YOUR PLAN</Text>
        <Text style={styles.title}>Crunching the numbers...</Text>

        <View style={styles.steps}>
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step - 1 && step < STEPS.length + 1;
            return (
              <View key={i} style={[styles.stepCard, done && styles.stepDone, i === step && styles.stepActive]}>
                <View style={[styles.stepIcon, done ? styles.stepIconDone : styles.stepIconPending]}>
                  {done ? (
                    <Text style={{ color: Colors.success, fontSize: 14, fontWeight: '900' }}>✓</Text>
                  ) : i === step ? (
                    <View style={styles.pulseDot} />
                  ) : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stepLabel, done && { color: Colors.text2 }]}>{s.label}</Text>
                  {done && (
                    <Text style={styles.stepResult}>{s.result}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.footer}>Based on your answers · Adjustable anytime</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  progressBar: {
    position: 'absolute', top: 0, left: 0, height: 3,
    backgroundColor: Colors.accent, borderRadius: 999, zIndex: 10,
  },
  content: {
    flex: 1, alignItems: 'center', padding: 24, paddingTop: 48, gap: 4,
  },
  overline: {
    fontSize: 11, fontWeight: '800', color: Colors.accent,
    textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 16,
  },
  title: {
    fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 24,
  },
  steps: { width: '100%', gap: 10 },
  stepCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  stepDone: { backgroundColor: Colors.surface, borderColor: Colors.border },
  stepActive: { backgroundColor: Colors.surfaceRaised, borderColor: Colors.borderActive },
  stepIcon: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepIconDone: { backgroundColor: `${Colors.success}33` },
  stepIconPending: { backgroundColor: `${Colors.accent}22` },
  pulseDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent,
  },
  stepLabel: { fontSize: 13, color: Colors.text, fontWeight: '600' },
  stepResult: { fontSize: 14, fontWeight: '800', color: Colors.text, marginTop: 2, fontVariant: ['tabular-nums'] },
  footer: { fontSize: 12, color: Colors.text3, marginTop: 20, textAlign: 'center' },
});
