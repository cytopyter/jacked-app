import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../constants/theme';

interface CalorieRingProps {
  eaten?: number;
  total?: number;
  size?: number;
  strokeWidth?: number;
}

export default function CalorieRing({ eaten = 910, total = 2150, size = 160, strokeWidth = 12 }: CalorieRingProps) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(eaten / total, 1);
  const remaining = Math.max(total - eaten, 0);
  const color = pct >= 1 ? Colors.success : Colors.accent;
  const offset = circumference * (1 - pct);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={Colors.surfaceRaised} strokeWidth={strokeWidth} fill="none"
        />
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{
          fontSize: 32, fontWeight: '900', color: Colors.text,
          fontVariant: ['tabular-nums'], letterSpacing: -1,
        }}>
          {remaining.toLocaleString()}
        </Text>
        <Text style={{ fontSize: 11, fontWeight: '700', color: Colors.text2, letterSpacing: 1, textTransform: 'uppercase' }}>
          kcal left
        </Text>
      </View>
    </View>
  );
}
