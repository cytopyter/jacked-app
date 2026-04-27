import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { Colors } from '../constants/theme';

export default function Index() {
  const hydrated = useUserStore(s => s._hydrated);
  const profile  = useUserStore(s => s.profile);

  // Wait for AsyncStorage to load before deciding route
  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    );
  }

  if (profile?.onboardingComplete) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/onboarding/splash" />;
}
