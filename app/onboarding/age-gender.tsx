import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import OnboardProgress from '../../components/OnboardProgress';
import OptionCard from '../../components/OptionCard';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors } from '../../constants/theme';

export default function AgeGenderScreen() {
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  return (
    <View style={styles.container}>
      <OnboardProgress step={1} total={9} />

      <View style={styles.illu}>
        <View style={styles.ageDisplay}>
          <Text style={styles.ageNum}>{age}</Text>
          <Text style={styles.ageLabel}>years old</Text>
        </View>
        <View style={styles.stepRow}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setAge(a => Math.max(16, a - 1))}
          >
            <Text style={styles.stepBtnText}>−</Text>
          </TouchableOpacity>
          <View style={{ width: 24 }} />
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setAge(a => Math.min(80, a + 1))}
          >
            <Text style={styles.stepBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.h1}>Age & biological sex</Text>
        <Text style={styles.sub}>Used for accurate calorie calculations only.</Text>
        <View style={{ gap: 10, marginTop: 6 }}>
          <OptionCard
            icon="♂"
            title="Male"
            selected={gender === 'male'}
            onPress={() => setGender('male')}
          />
          <OptionCard
            icon="♀"
            title="Female"
            selected={gender === 'female'}
            onPress={() => setGender('female')}
          />
        </View>
        <PrimaryButton
          label="Continue"
          disabled={!gender}
          onPress={() => router.push('/onboarding/height-weight')}
          style={{ marginTop: 12 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  illu: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  ageDisplay: { alignItems: 'center' },
  ageNum: {
    fontSize: 72, fontWeight: '900', color: Colors.text,
    fontVariant: ['tabular-nums'], letterSpacing: -2,
    fontFamily: 'Nunito_900Black',
  },
  ageLabel: { fontSize: 16, color: Colors.text2, fontWeight: '600' },
  stepRow: {
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: Colors.border,
    paddingTop: 16,
  },
  stepBtn: {
    width: 56, height: 56, borderRadius: 14,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  stepBtnText: { fontSize: 28, fontWeight: '700', color: Colors.text },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 40,
    borderTopWidth: 1, borderTopColor: Colors.border,
    gap: 6,
  },
  h1: { fontSize: 26, fontWeight: '800', color: Colors.text, fontFamily: 'Nunito_800ExtraBold' },
  sub: { fontSize: 15, color: Colors.text2 },
});
