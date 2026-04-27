import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import OnboardProgress from '../../components/OnboardProgress';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors } from '../../constants/theme';

function Stepper({ value, unit, onInc, onDec }: { value: number; unit: string; onInc: () => void; onDec: () => void }) {
  return (
    <View style={styles.stepperRow}>
      <TouchableOpacity style={styles.stepBtn} onPress={onDec}>
        <Text style={styles.stepBtnText}>−</Text>
      </TouchableOpacity>
      <View style={styles.stepNum}>
        <Text style={styles.stepNumText}>{value}</Text>
        <Text style={styles.stepUnit}>{unit}</Text>
      </View>
      <TouchableOpacity style={styles.stepBtn} onPress={onInc}>
        <Text style={styles.stepBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HeightWeightScreen() {
  const [unitKg, setUnitKg] = useState(true);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(75);

  return (
    <View style={styles.container}>
      <OnboardProgress step={2} total={9} />

      <View style={styles.illu}>
        <Text style={{ fontSize: 60 }}>📏</Text>
        <Text style={styles.illuLabel}>Your measurements</Text>
      </View>

      <View style={styles.sheet}>
        <View style={styles.row}>
          <Text style={styles.h1}>Your measurements</Text>
          <TouchableOpacity
            style={styles.unitToggle}
            onPress={() => setUnitKg(!unitKg)}
          >
            <Text style={styles.unitText}>{unitKg ? 'kg / cm' : 'lbs / ft'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sub}>We use this to calculate your exact calorie needs.</Text>

        <View style={{ gap: 20, marginTop: 8 }}>
          <View>
            <Text style={styles.label}>Height</Text>
            <Stepper
              value={heightCm}
              unit={unitKg ? 'cm' : 'in'}
              onInc={() => setHeightCm(h => Math.min(250, h + 1))}
              onDec={() => setHeightCm(h => Math.max(100, h - 1))}
            />
          </View>
          <View>
            <Text style={styles.label}>Weight</Text>
            <Stepper
              value={weightKg}
              unit={unitKg ? 'kg' : 'lbs'}
              onInc={() => setWeightKg(w => Math.min(300, w + 1))}
              onDec={() => setWeightKg(w => Math.max(30, w - 1))}
            />
          </View>
        </View>
        <PrimaryButton
          label="Continue"
          onPress={() => router.push('/onboarding/activity')}
          style={{ marginTop: 16 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  illu: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  illuLabel: { fontSize: 18, color: Colors.text2, fontWeight: '600' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 40,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  h1: { fontSize: 26, fontWeight: '800', color: Colors.text, fontFamily: 'Nunito_800ExtraBold' },
  sub: { fontSize: 15, color: Colors.text2, marginTop: 6 },
  label: { fontSize: 13, color: Colors.text2, fontWeight: '600', marginBottom: 8 },
  unitToggle: {
    backgroundColor: Colors.surfaceRaised, borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  unitText: { fontSize: 13, color: Colors.accent, fontWeight: '700' },
  stepperRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceRaised,
    borderRadius: 16, borderWidth: 1, borderColor: Colors.border,
    padding: 6,
  },
  stepBtn: {
    width: 52, height: 52, borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  stepBtnText: { fontSize: 26, fontWeight: '700', color: Colors.text },
  stepNum: { flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  stepNumText: { fontSize: 28, fontWeight: '900', color: Colors.text, fontVariant: ['tabular-nums'], fontFamily: 'Nunito_900Black' },
  stepUnit: { fontSize: 14, color: Colors.text2, fontWeight: '600' },
});
