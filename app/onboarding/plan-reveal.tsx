import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import Max from '../../components/Max';
import { Colors } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, target / 40);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(interval); }
      else setDisplay(Math.round(start));
    }, 30);
    return () => clearInterval(interval);
  }, [target]);
  return <Text style={styles.statVal}>{display.toLocaleString()}{suffix}</Text>;
}

export default function PlanRevealScreen() {
  const targets = useUserStore(s => s.targets);
  const profile = useUserStore(s => s.profile);
  const opacities = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    opacities.forEach((anim, i) => {
      Animated.timing(anim, { toValue: 1, duration: 400, delay: 300 + i * 200, useNativeDriver: true }).start();
    });
  }, []);

  const kcal    = targets?.calorieGoal ?? 2150;
  const protein = targets?.proteinGoal ?? 150;
  const carbs   = targets?.carbsGoal   ?? 220;
  const fat     = targets?.fatGoal     ?? 60;

  const stats = [
    { label: 'Daily Calories', value: kcal,    suffix: ' kcal', color: Colors.accent },
    { label: 'Protein Goal',   value: protein,  suffix: 'g',     color: Colors.success },
    { label: 'Carbs Goal',     value: carbs,    suffix: 'g',     color: Colors.warning },
    { label: 'Fat Goal',       value: fat,       suffix: 'g',     color: Colors.danger },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.mascotWrap}>
          <Max size={100} mood="cheer" />
        </View>
        <Text style={styles.title}>Your plan is ready!</Text>
        <Text style={styles.subtitle}>
          Based on your profile{profile?.name ? `, ${profile.name}` : ''}, here's exactly what I've calculated.
        </Text>

        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <Animated.View key={i} style={[styles.statCard, { opacity: opacities[i] }]}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <AnimatedNumber target={s.value} suffix={s.suffix} />
              <View style={[styles.statBar, { backgroundColor: `${s.color}22` }]}>
                <View style={[styles.statBarFill, { backgroundColor: s.color }]} />
              </View>
            </Animated.View>
          ))}
        </View>

        {targets && (
          <View style={styles.tdeeCard}>
            <Text style={styles.tdeeLabel}>Your maintenance calories (TDEE)</Text>
            <Text style={styles.tdeeVal}>{targets.tdee.toLocaleString()} kcal/day</Text>
            <Text style={styles.tdeeNote}>
              {targets.deficitKcal > 0
                ? `${targets.deficitKcal} kcal daily deficit → ~${Math.round(targets.deficitKcal * 7 / 7700 * 10) / 10}kg/week loss`
                : targets.deficitKcal < 0
                ? `${Math.abs(targets.deficitKcal)} kcal daily surplus`
                : 'Eating at maintenance'}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.cta} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.ctaText}>Let's Get JACKED →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, alignItems: 'center' },
  mascotWrap: { width: 100, height: 100, marginBottom: 20 },
  title: { fontSize: 30, fontWeight: '900', color: Colors.text, fontFamily: 'Nunito_900Black', textAlign: 'center' },
  subtitle: { fontSize: 15, color: Colors.text2, textAlign: 'center', marginTop: 8, marginBottom: 28, lineHeight: 22 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, width: '100%' },
  statCard: {
    width: '47%', backgroundColor: Colors.surface, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  statLabel: { fontSize: 12, color: Colors.text2, fontWeight: '700' },
  statVal: { fontSize: 26, fontWeight: '900', color: Colors.text, fontFamily: 'Nunito_900Black' },
  statBar: { height: 4, borderRadius: 999, overflow: 'hidden' },
  statBarFill: { height: '100%', borderRadius: 999, width: '100%' },
  tdeeCard: {
    width: '100%', marginTop: 16, backgroundColor: Colors.surfaceRaised, borderRadius: 20,
    padding: 16, borderWidth: 1, borderColor: Colors.borderActive, alignItems: 'center', gap: 4,
  },
  tdeeLabel: { fontSize: 12, color: Colors.text2, fontWeight: '600' },
  tdeeVal: { fontSize: 22, fontWeight: '900', color: Colors.accent, fontFamily: 'Nunito_900Black' },
  tdeeNote: { fontSize: 13, color: Colors.text3, textAlign: 'center' },
  cta: {
    marginTop: 28, width: '100%', backgroundColor: Colors.accent, borderRadius: 16, height: 56,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.accentDim, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  ctaText: { fontSize: 18, fontWeight: '900', color: '#fff', fontFamily: 'Nunito_900Black' },
});
