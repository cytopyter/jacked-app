export const Colors = {
  bg: '#090E1A',
  surface: '#111827',
  surfaceRaised: '#1C2638',
  border: '#1E2D45',
  borderActive: '#2D4A6B',
  accent: '#3B82F6',
  accentDim: '#1D4ED8',
  success: '#10B981',
  successDark: '#059669',
  warning: '#F59E0B',
  danger: '#EF4444',
  dangerDark: '#DC2626',
  purple: '#8B5CF6',
  purpleDark: '#6D28D9',
  text: '#F9FAFB',
  text2: '#9CA3AF',
  text3: '#4B5563',
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  white: '#FFFFFF',
};

export const Typography = {
  display: { fontSize: 36, fontWeight: '900' as const, letterSpacing: -0.5 },
  h1: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.3 },
  h2: { fontSize: 22, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '700' as const },
  bodyLg: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '500' as const },
  bodyS: { fontSize: 13, fontWeight: '500' as const },
  micro: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.5 },
  num: { fontVariant: ['tabular-nums'] as any, fontWeight: '900' as const },
};

export const Spacing = {
  screenPad: 24,
  cardPad: 20,
  sectionGap: 24,
  itemGap: 12,
  microGap: 8,
};

export const Radii = {
  screen: 24,
  card: 20,
  cardSm: 16,
  button: 16,
  input: 14,
  pill: 999,
  sheet: 28,
};
