import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Max from '../../components/Max';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors } from '../../constants/theme';

const CARDS = [
  { emoji: '🔥', title: 'Daily Calories', val: 2150, suffix: 'kcal/day', color: Colors.accent },
  { emoji: '💪', title: 'Daily Protein', val: 150, suffix: 'grams', color: Colors.success },
  { emoji: '🏋️', title: 'Workout Split', text: 'Push / Pull / Legs', sub: '5 days per week', color: Colors.warning },
  { emoji: '🏃', title: 'Cardio', text: '2× per week', sub: '25 min moderate', color: Colors.purple },
];

function AnimatedNumber({ target, duration = 800 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <Text style={styles.cardVal}>{val.toLocaleString()}</Text>;
}

export default function PlanRevealScreen() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    CARDS.forEach((_, i) => {
      setTimeout(() => setVisible(v => v + 1), i * 180 + 300);
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <View key={i} style={{
          position: 'absolute',
          width: 3, height: 3, borderRadius: 2,
          backgroundColor: [Colors.accent, Colors.success, Colors.purple][i % 3],
          left: `${(i * 5.7) % 100}%` as any,
          bottom: -10,
          opacity: 0.5,
        }} />
      ))}

      {/* Full progress */}
      <View style={[styles.progressBar, { width: '100%', backgroundColor: Colors.success }]} />

      <View style={styles.scroll}>
        <View style={styles.mascotArea}>
          <Max size={130} mood="cheer" />
          <Text style={styles.overline}>YOUR PERSONALIZED PLAN</Text>
          <Text style={styles.headline}>You're ready to{'\n'}get Jacked. 🔥</Text>
        </View>

        <View style={styles.cards}>
          {CARDS.map((c, i) => (
            <Animated.View
              key={i}
              style={[
                styles.card,
                { borderLeftColor: c.color, opacity: i < visible ? 1 : 0, transform: [{ translateY: i < visible ? 0 : 20 }] }
              ]}
            >
              <View style={[styles.cardIcon, { backgroundColor: `${c.color}22` }]}>
                <Text style={{ fontSize: 22 }}>{c.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{c.title}</Text>
                {'val' in c ? (
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                    <AnimatedNumber target={c.val} />
                    <Text style={styles.cardSuffix}>{c.suffix}</Text>
                  </View>
                ) : (
                  <>
                    <Text style={[styles.cardVal, { fontSize: 20 }]}>{c.text}</Text>
                    <Text style={styles.cardSuffix}>{c.sub}</Text>
                  </>
                )}
              </View>
            </Animated.View>
          ))}
        </View>

        <PrimaryButton
          label="Start My Transformation →"
          onPress={() => router.replace('/(tabs)')}
          style={{ marginTop: 8 }}
          variant="primary"
        />
        <TouchableOpacity style={{ marginTop: 14, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: Colors.text3 }}>You can adjust anything later.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  progressBar: { position: 'absolute', top: 0, left: 0, height: 3, zIndex: 10 },
  scroll: { flex: 1, padding: 24, paddingTop: 40 },
  mascotArea: { alignItems: 'center', marginBottom: 24, gap: 4 },
  overline: {
    fontSize: 11, fontWeight: '800', color: Colors.accent,
    textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 8,
  },
  headline: {
    fontSize: 30, fontWeight: '900', color: Colors.text, textAlign: 'center',
    fontFamily: 'Nunito_900Black', lineHeight: 38,
  },
  cards: { gap: 12 },
  card: {
    backgroundColor: Colors.surfaceRaised, borderRadius: 18, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderColor: Colors.borderActive,
    borderLeftWidth: 4,
  },
  cardIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 12, fontWeight: '700', color: Colors.text2, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardVal: { fontSize: 24, fontWeight: '900', color: Colors.text, fontVariant: ['tabular-nums'], fontFamily: 'Nunito_900Black' },
  cardSuffix: { fontSize: 13, color: Colors.text2 },
});
