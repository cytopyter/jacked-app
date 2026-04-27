import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/theme';

interface OnboardProgressProps {
  step: number;
  total: number;
  showBack?: boolean;
}

export default function OnboardProgress({ step, total, showBack = true }: OnboardProgressProps) {
  const pct = (step / total) * 100;
  return (
    <View>
      <View style={{ height: 4, backgroundColor: Colors.surfaceRaised, marginHorizontal: 24, borderRadius: 999, marginTop: 8 }}>
        <View style={{ height: '100%', width: `${pct}%`, backgroundColor: Colors.accent, borderRadius: 999 }} />
      </View>
      {showBack && (
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: 12, marginTop: 4 }}
        >
          <Text style={{ fontSize: 24, color: Colors.text2 }}>‹</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
