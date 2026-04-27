import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import OnboardProgress from '../../components/OnboardProgress';
import OptionCard from '../../components/OptionCard';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors } from '../../constants/theme';

const LEVELS = [
  { id: 'sedentary', icon: '🪑', title: 'Sedentary', sub: 'Desk job, little to no exercise' },
  { id: 'light', icon: '🚶', title: 'Lightly Active', sub: '1–2 workouts per week' },
  { id: 'moderate', icon: '🏃', title: 'Moderately Active', sub: '3–4 workouts per week', tag: 'Most common', tagColor: Colors.success },
  { id: 'very', icon: '🏋️', title: 'Very Active', sub: '5–6 workouts per week' },
  { id: 'athlete', icon: '⚡', title: 'Athlete Level', sub: '2× daily training' },
];

export default function ActivityScreen() {
  const [selected, setSelected] = useState<string | null>('moderate');

  return (
    <View style={styles.container}>
      <OnboardProgress step={3} total={9} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>How active are you?</Text>
        <Text style={styles.sub}>Be honest — this is the biggest variable in your calorie calculation.</Text>
        <View style={{ gap: 10, marginTop: 16 }}>
          {LEVELS.map(l => (
            <OptionCard
              key={l.id}
              icon={l.icon}
              title={l.title}
              subtitle={l.sub}
              selected={selected === l.id}
              onPress={() => setSelected(l.id)}
              tag={l.tag}
              tagColor={l.tagColor}
            />
          ))}
        </View>
        <PrimaryButton
          label="Continue"
          disabled={!selected}
          onPress={() => router.push('/onboarding/body-fat')}
          style={{ marginTop: 20 }}
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
});
