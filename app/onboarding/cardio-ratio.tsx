import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import OnboardProgress from '../../components/OnboardProgress';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors } from '../../constants/theme';

export default function CardioRatioScreen() {
  const [dietPct, setDietPct] = useState(65);
  const [cardioSessions, setCardioSessions] = useState(2);

  const totalDeficit = 500;
  const dietKcal = Math.round(totalDeficit * dietPct / 100);
  const cardioKcal = totalDeficit - dietKcal;
  const perSession = cardioSessions > 0 ? Math.round(cardioKcal / cardioSessions) : 0;
  const sessionMins = Math.max(15, Math.round(perSession / 8));

  return (
    <View style={styles.container}>
      <OnboardProgress step={7} total={9} />

      {/* Visual deficit bar */}
      <View style={styles.visual}>
        <Text style={styles.visualLabel}>500 kcal/day deficit split</Text>
        <View style={styles.deficitBar}>
          <View style={[styles.deficitFill, { flex: dietPct }]}>
            {dietPct > 30 && (
              <Text style={styles.deficitText}>🥗 {dietKcal} kcal</Text>
            )}
          </View>
          <View style={[styles.deficitEmpty, { flex: 100 - dietPct }]}>
            {(100 - dietPct) > 20 && (
              <Text style={styles.deficitText2}>🏃 {cardioKcal} kcal</Text>
            )}
          </View>
        </View>
        <View style={styles.deficitStats}>
          <Text style={{ fontSize: 12, color: Colors.accent, fontWeight: '700' }}>{dietPct}% from diet</Text>
          <Text style={{ fontSize: 12, color: Colors.text2, fontWeight: '700' }}>{100 - dietPct}% from cardio</Text>
        </View>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.h1}>Your deficit strategy</Text>
        <Text style={styles.sub}>Drag to find your balance. Most people do 60-70% diet.</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Diet slider */}
          <View style={styles.sliderCard}>
            <View style={styles.sliderHeader}>
              <View>
                <Text style={styles.sliderTitle}>🥗 Diet contribution</Text>
                <Text style={styles.sliderSub}>{dietKcal} kcal less from food per day</Text>
              </View>
              <Text style={[styles.sliderValue, { color: Colors.accent }]}>{dietPct}%</Text>
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={30}
              maximumValue={100}
              step={5}
              value={dietPct}
              onValueChange={(v) => setDietPct(Math.round(v))}
              minimumTrackTintColor={Colors.accent}
              maximumTrackTintColor={Colors.surfaceRaised}
              thumbTintColor={Colors.accent}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>← More cardio</Text>
              <Text style={styles.sliderLabelText}>Diet only →</Text>
            </View>
          </View>

          {/* Cardio sessions slider */}
          <View style={[styles.sliderCard, { marginTop: 14 }]}>
            <View style={styles.sliderHeader}>
              <View>
                <Text style={styles.sliderTitle}>🏃 Cardio sessions / week</Text>
                <Text style={styles.sliderSub}>
                  {cardioSessions > 0
                    ? `~${sessionMins} min each · ${perSession} kcal/session`
                    : 'No cardio planned'}
                </Text>
              </View>
              <Text style={[styles.sliderValue, { color: Colors.success }]}>{cardioSessions}×</Text>
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={5}
              step={1}
              value={cardioSessions}
              onValueChange={(v) => setCardioSessions(Math.round(v))}
              minimumTrackTintColor={Colors.success}
              maximumTrackTintColor={Colors.surfaceRaised}
              thumbTintColor={Colors.success}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>No cardio</Text>
              <Text style={styles.sliderLabelText}>5× per week</Text>
            </View>
          </View>

          {/* Summary card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>YOUR PLAN PREVIEW</Text>
            <View style={{ gap: 8, marginTop: 8 }}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Daily food target</Text>
                <Text style={styles.summaryVal}>{2650 - dietKcal} kcal</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Weekly cardio</Text>
                <Text style={styles.summaryVal}>{cardioSessions > 0 ? `${cardioSessions}× · ${sessionMins} min` : 'None'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Weekly deficit</Text>
                <Text style={[styles.summaryVal, { color: Colors.accent }]}>{totalDeficit * 7} kcal</Text>
              </View>
            </View>
          </View>

          <PrimaryButton
            label="Build My Plan →"
            onPress={() => router.push('/onboarding/plan-loading')}
            style={{ marginTop: 16, marginBottom: 32 }}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  visual: { padding: 20, paddingHorizontal: 24, gap: 10 },
  visualLabel: { fontSize: 11, fontWeight: '700', color: Colors.text3, textTransform: 'uppercase', letterSpacing: 1 },
  deficitBar: {
    height: 44, borderRadius: 14, overflow: 'hidden', flexDirection: 'row',
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surfaceRaised,
  },
  deficitFill: {
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  deficitEmpty: { alignItems: 'center', justifyContent: 'center' },
  deficitText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  deficitText2: { fontSize: 12, fontWeight: '800', color: Colors.text2 },
  deficitStats: { flexDirection: 'row', justifyContent: 'space-between' },
  sheet: {
    flex: 1, backgroundColor: Colors.surface,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 0,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  h1: { fontSize: 26, fontWeight: '800', color: Colors.text, fontFamily: 'Nunito_800ExtraBold' },
  sub: { fontSize: 15, color: Colors.text2, marginTop: 6, marginBottom: 16 },
  sliderCard: {
    backgroundColor: Colors.surfaceRaised, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  sliderTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  sliderSub: { fontSize: 11, color: Colors.text2, marginTop: 2 },
  sliderValue: { fontSize: 22, fontWeight: '900', fontVariant: ['tabular-nums'], fontFamily: 'Nunito_900Black' },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  sliderLabelText: { fontSize: 11, color: Colors.text3 },
  summaryCard: {
    backgroundColor: Colors.surfaceRaised, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: Colors.borderActive, marginTop: 14,
  },
  summaryTitle: { fontSize: 11, fontWeight: '700', color: Colors.text3, textTransform: 'uppercase', letterSpacing: 1 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 14, color: Colors.text2, fontWeight: '600' },
  summaryVal: { fontSize: 14, color: Colors.text, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
