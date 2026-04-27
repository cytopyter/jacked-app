import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Max from '../../components/Max';
import { Colors } from '../../constants/theme';

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;
  const mascotY = useRef(new Animated.Value(40)).current;
  const mascotOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
      ]),
      Animated.timing(lineWidth, { toValue: 48, duration: 350, useNativeDriver: false, delay: 100 }),
      Animated.parallel([
        Animated.spring(mascotY, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true, delay: 100 }),
        Animated.timing(mascotOpacity, { toValue: 1, duration: 400, useNativeDriver: true, delay: 100 }),
      ]),
    ]).start();

    const t = setTimeout(() => router.replace('/onboarding/welcome'), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.center, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <Text style={styles.wordmark}>JACKED</Text>
        <Animated.View style={[styles.line, { width: lineWidth }]} />
      </Animated.View>
      <Animated.View style={{ opacity: mascotOpacity, transform: [{ translateY: mascotY }], marginTop: 16 }}>
        <Max size={140} mood="default" />
      </Animated.View>
      <View style={styles.dots}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, { opacity: 0.4 + i * 0.3 }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center', gap: 0,
  },
  center: { alignItems: 'center' },
  wordmark: {
    fontSize: 48, fontWeight: '900', color: Colors.text,
    letterSpacing: 6, fontFamily: 'Nunito_900Black',
  },
  line: {
    height: 3, backgroundColor: Colors.accent, borderRadius: 999, marginTop: 12,
  },
  dots: {
    flexDirection: 'row', gap: 6, marginTop: 32,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent,
  },
});
