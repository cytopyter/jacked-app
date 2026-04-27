import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Radii } from '../constants/theme';

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'premium';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function PrimaryButton({
  label,
  onPress,
  disabled,
  variant = 'primary',
  style,
  textStyle,
}: PrimaryButtonProps) {
  const bgColors = {
    primary: Colors.accent,
    secondary: 'transparent',
    success: Colors.success,
    danger: Colors.danger,
    premium: Colors.purple,
  };

  const shadowColors = {
    primary: Colors.accentDim,
    secondary: 'transparent',
    success: Colors.successDark,
    danger: Colors.dangerDark,
    premium: Colors.purpleDark,
  };

  const bg = disabled ? Colors.surfaceRaised : bgColors[variant];
  const shadow = disabled ? Colors.border : shadowColors[variant];
  const textColor = variant === 'secondary' ? Colors.text2 : Colors.white;

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.85}
      style={[
        styles.btn,
        {
          backgroundColor: bg,
          shadowColor: shadow,
          borderColor: variant === 'secondary' ? Colors.borderActive : 'transparent',
          borderWidth: variant === 'secondary' ? 2 : 0,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, { color: disabled ? Colors.text3 : textColor }, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 56,
    borderRadius: Radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.6,
  },
});
