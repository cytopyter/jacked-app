import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/theme';

function TabIcon({ focused, emoji, label }: { focused: boolean; emoji: string; label: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      {focused && (
        <View style={{
          position: 'absolute', top: -4,
          width: 50, height: 30, borderRadius: 999,
          backgroundColor: Colors.surfaceRaised,
        }} />
      )}
      <Text style={{ fontSize: 22, zIndex: 1 }}>{emoji}</Text>
      {focused && (
        <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.accent, zIndex: 1 }}>{label}</Text>
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 82,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.text3,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🏠" label="Today" />,
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🍎" label="Food" />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🏋️" label="Workout" />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="📈" label="Progress" />,
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🤖" label="Coach" />,
        }}
      />
    </Tabs>
  );
}
