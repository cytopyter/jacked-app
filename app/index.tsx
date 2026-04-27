import { Redirect } from 'expo-router';
import { useUserStore } from '../store/useUserStore';

export default function Index() {
  const profile = useUserStore(s => s.profile);
  if (profile?.onboardingComplete) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/onboarding/splash" />;
}
