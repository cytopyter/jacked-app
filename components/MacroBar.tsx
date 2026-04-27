import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../constants/theme';

interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  color: string;
  unit?: string;
}

export default function MacroBar({ label, current, goal, color, unit = 'g' }: MacroBarProps) {
  const pct = Math.min(current / goal, 1);
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.text2 }}>{label}</Text>
        <Text style={{ fontSize: 13, fontWeight: '700', color, fontVariant: ['tabular-nums'] }}>
          {current} / {goal}{unit}
        </Text>
      </View>
      <View style={{ height: 8, backgroundColor: Colors.surfaceRaised, borderRadius: 999, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${pct * 100}%`, backgroundColor: color, borderRadius: 999 }} />
      </View>
    </View>
  );
}
