import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import OnboardProgress from '../../components/OnboardProgress';
import OptionCard from '../../components/OptionCard';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors } from '../../constants/theme';

const OPTIONS = [
  { days: 3, split: 'Full Body', detail: '3 sessions · Full body each session', tag: 'Beginner', tagColor: Colors.success },
  { days: 4, split: 'Upper / Lower', detail: '2 upper + 2 lower body days' },
  { days: 5, split: 'Push / Pull / Legs', detail: '5× per week · The gold standard', tag: 'Most Popular', tagColor: Colors.accent },
  { days: 6, split: 'PPL × 2', detail: '6× per week · Each muscle group twice' },
  { days: 7, split: 'Full Athlete Split', detail: 'Daily training · Advanced only', tag: 'Advanced', tagColor: Colors.purple },
];

export default function TrainingDaysScreen() {
  const [selected, setSelected] = useState(5);

  return (
    <View style={styles.container}>
      <OnboardProgress step={6} total={9} />

      {/* Illustration: day blocks */}
      <View style={styles.illu}>
        <View style={styles.dayGrid}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <View
              key={i}
              style={[
                styles.dayBlock,
                i < selected && styles.dayBlockActive,
              ]}
            >
              <Text style={[styles.dayLetter, i < selected && styles.dayLetterActive]}>{d}</Text>
              {i < selected && <View style={styles.dayDot} />}
            </View>
          ))}
        </View>
        <View style={styles.splitBadge}>
          <Text style={styles.splitBadgeDays}>{selected} days</Text>
          <Text style={styles.splitBadgeName}>· {OPTIONS.find(o => o.days === selected)?.split}</Text>
        </View>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.h1}>How many days do you train?</Text>
        <Text style={styles.sub}>We'll match your split to your schedule.</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 12 }}>
          <View style={{ gap: 10 }}>
            {OPTIONS.map(o => (
              <OptionCard
                key={o.days}
                title={o.split}
                subtitle={o.detail}
                selected={selected === o.days}
                onPress={() => setSelected(o.days)}
                tag={o.tag}
                tagColor={o.tagColor}
                rightElement={
                  <View style={[styles.dayNum, selected === o.days && styles.dayNumSelected]}>
                    <Text style={[styles.dayNumText, selected === o.days && styles.dayNumTextSelected]}>{o.days}</Text>
                  </View>
                }
              />
            ))}
          </View>
          <PrimaryButton
            label="Continue"
            onPress={() => router.push('/onboarding/cardio-ratio')}
            style={{ marginTop: 16, marginBottom: 32 }}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  illu: {
    paddingVertical: 24, paddingHorizontal: 24, alignItems: 'center', gap: 16,
  },
  dayGrid: { flexDirection: 'row', gap: 8 },
  dayBlock: {
    width: 36, height: 44, borderRadius: 10,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', gap: 3,
  },
  dayBlockActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accentDim,
    shadowColor: Colors.accent, shadowOpacity: 0.35, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  dayLetter: { fontSize: 12, fontWeight: '800', color: Colors.text3 },
  dayLetterActive: { color: '#fff' },
  dayDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.7)' },
  splitBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surfaceRaised, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.borderActive,
  },
  splitBadgeDays: { fontSize: 15, fontWeight: '900', color: Colors.accent, fontFamily: 'Nunito_900Black' },
  splitBadgeName: { fontSize: 15, fontWeight: '600', color: Colors.text2 },
  sheet: {
    flex: 1, backgroundColor: Colors.surface,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 0,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  h1: { fontSize: 26, fontWeight: '800', color: Colors.text, fontFamily: 'Nunito_800ExtraBold' },
  sub: { fontSize: 15, color: Colors.text2, marginTop: 6 },
  dayNum: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  dayNumSelected: { backgroundColor: `${Colors.accent}28`, borderColor: `${Colors.accent}66` },
  dayNumText: { fontSize: 16, fontWeight: '900', color: Colors.text2, fontFamily: 'Nunito_900Black' },
  dayNumTextSelected: { color: Colors.accent },
});
