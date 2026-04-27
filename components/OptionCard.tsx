import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors, Radii } from '../constants/theme';

interface OptionCardProps {
  icon?: string;
  title: string;
  subtitle?: string;
  selected?: boolean;
  onPress?: () => void;
  tag?: string;
  tagColor?: string;
  rightElement?: React.ReactNode;
}

export default function OptionCard({
  icon, title, subtitle, selected, onPress, tag, tagColor, rightElement
}: OptionCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, selected && styles.selected]}
    >
      {selected && <View style={styles.stripe} />}
      {icon && (
        <Text style={styles.icon}>{icon}</Text>
      )}
      <View style={styles.content}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.title}>{title}</Text>
          {tag && (
            <View style={[styles.tag, { borderColor: tagColor ?? Colors.success }]}>
              <Text style={[styles.tagText, { color: tagColor ?? Colors.success }]}>{tag}</Text>
            </View>
          )}
        </View>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
      {rightElement ?? null}
      {selected && (
        <View style={styles.check}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
    padding: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radii.cardSm,
    gap: 14,
    position: 'relative',
  },
  selected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.surfaceRaised,
  },
  stripe: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: Colors.accent,
  },
  icon: {
    fontSize: 26,
    width: 36,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  sub: {
    fontSize: 13,
    color: Colors.text2,
    marginTop: 2,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
