import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Max from '../../components/Max';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors } from '../../constants/theme';

const FloatingIcon = ({ emoji, delay, x }: { emoji: string; delay: number; x: number }) => {
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(y, { toValue: -20, duration: 3000 + delay * 500, useNativeDriver: true, delay }),
        Animated.timing(y, { toValue: 0, duration: 3000 + delay * 500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.Text style={{ position: 'absolute', left: x, fontSize: 24, opacity: 0.4, transform: [{ translateY: y }] }}>
      {emoji}
    </Animated.Text>
  );
};

export default function WelcomeScreen() {
  const sheetY = useRef(new Animated.Value(60)).current;
  const sheetOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(sheetY, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true, delay: 300 }),
      Animated.timing(sheetOpacity, { toValue: 1, duration: 400, useNativeDriver: true, delay: 300 }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top illustration area */}
      <View style={styles.illu}>
        <View style={{ position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(59,130,246,0.08)' }} />
        <FloatingIcon emoji="🏋️" delay={0} x={30} />
        <FloatingIcon emoji="🍎" delay={500} x={220} />
        <FloatingIcon emoji="🔥" delay={200} x={60} />
        <FloatingIcon emoji="⚡" delay={700} x={250} />
        <Max size={190} mood="default" />
      </View>

      {/* Bottom sheet */}
      <Animated.View style={[styles.sheet, { opacity: sheetOpacity, transform: [{ translateY: sheetY }] }]}>
        <Text style={styles.overline}>YOUR TRANSFORMATION STARTS HERE</Text>
        <Text style={styles.headline}>Get Jacked.</Text>
        <Text style={styles.sub}>
          Answer 6 questions. Get your exact calorie target, protein goal, and workout plan — instantly.
        </Text>
        <View style={styles.proof}>
          <Text style={styles.proofText}>🔥  47,200 people transformed with JACKED</Text>
        </View>
        <PrimaryButton
          label="Let's build your physique →"
          onPress={() => router.push('/onboarding/age-gender')}
          style={{ marginTop: 8 }}
        />
        <TouchableOpacity style={{ marginTop: 14, alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: Colors.text2 }}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.bg,
  },
  illu: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 28, paddingBottom: 40,
    borderTopWidth: 1, borderTopColor: Colors.border,
    gap: 6,
  },
  overline: {
    fontSize: 11, fontWeight: '800', color: Colors.accent,
    textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center',
  },
  headline: {
    fontSize: 40, fontWeight: '900', color: Colors.text,
    textAlign: 'center', letterSpacing: -0.5,
    fontFamily: 'Nunito_900Black',
  },
  sub: {
    fontSize: 16, color: Colors.text2, textAlign: 'center',
    lineHeight: 23, paddingHorizontal: 8,
  },
  proof: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: 12, padding: 10, alignItems: 'center',
    marginVertical: 4,
  },
  proofText: {
    fontSize: 13, color: Colors.text2, fontWeight: '600',
  },
});
