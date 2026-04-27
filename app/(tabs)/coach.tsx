import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Max from '../../components/Max';
import { Colors } from '../../constants/theme';

const FEATURES = [
  { icon: '📊', title: 'Smart Analysis', desc: 'Max reads your logs and adapts recommendations daily' },
  { icon: '💬', title: 'Ask Anything', desc: 'Meal swaps, exercise form, recovery — unlimited questions' },
  { icon: '🎯', title: 'Weekly Check-ins', desc: 'Proactive adjustments when progress stalls' },
];

const MESSAGES = [
  { id: 1, from: 'max', text: "Hey Alex! Great push session yesterday. Your bench is trending up 2.5kg every 2 weeks — that's solid linear progression. 💪" },
  { id: 2, from: 'max', text: "Quick note: you're a bit under on protein today. One more serving of Greek yogurt or a scoop of whey would close the gap." },
  { id: 3, from: 'user', text: "What should I eat before my workout today?" },
  { id: 4, from: 'max', text: "For a 5pm session, aim for something 90–120 min before: 40–50g carbs, 20–25g protein. Try rice cakes with peanut butter + a protein shake, or a small chicken wrap. Avoid high-fat meals — they slow digestion." },
];

const QUICK_PROMPTS = [
  "What should I eat today?",
  "How's my progress?",
  "Suggest a meal swap",
  "Am I on track this week?",
];

export default function CoachScreen() {
  const [isPro] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(MESSAGES);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: input.trim() }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'max',
        text: "Great question! Based on your current stats and today's log, I'd recommend focusing on hitting your protein target first. You're at 98g — shoot for 150g total today. 🎯"
      }]);
    }, 1000);
  };

  if (chatMode || isPro) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setChatMode(false)} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.chatHeaderCenter}>
            <View style={styles.chatAvatarWrap}>
              <Max size={32} mood="default" />
            </View>
            <View>
              <Text style={styles.chatName}>Coach Max</Text>
              <Text style={styles.chatStatus}>● Online</Text>
            </View>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.chatScroll} contentContainerStyle={{ padding: 16, gap: 10 }} showsVerticalScrollIndicator={false}>
          <View style={styles.contextStrip}>
            <Text style={styles.contextText}>📊 2,150 kcal · 150g protein · Push Day today</Text>
          </View>
          {messages.map(msg => (
            <View key={msg.id} style={[styles.bubble, msg.from === 'user' ? styles.bubbleUser : styles.bubbleMax]}>
              {msg.from === 'max' && (
                <View style={styles.maxBubbleAvatar}>
                  <Max size={24} mood="default" />
                </View>
              )}
              <View style={[styles.bubbleInner, msg.from === 'user' ? styles.bubbleInnerUser : styles.bubbleInnerMax]}>
                <Text style={[styles.bubbleText, msg.from === 'user' ? styles.bubbleTextUser : styles.bubbleTextMax]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.quickPromptsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
            {QUICK_PROMPTS.map((p, i) => (
              <TouchableOpacity key={i} style={styles.quickChip} onPress={() => setInput(p)}>
                <Text style={styles.quickChipText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask Max anything..."
            placeholderTextColor={Colors.text3}
            multiline
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} onPress={sendMessage} disabled={!input.trim()}>
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Coach</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.crownWrap}>
            <Text style={styles.crown}>👑</Text>
          </View>
          <View style={styles.mascotWrap}>
            <Max size={100} mood="cheer" />
          </View>
          <Text style={styles.heroTitle}>Meet Coach Max</Text>
          <Text style={styles.heroSub}>Your AI fitness coach that learns your body, adapts your plan, and keeps you accountable every single day.</Text>
        </View>

        {/* Free tier message */}
        <View style={styles.freeCard}>
          <View style={styles.freeCardHeader}>
            <Text style={styles.freeCardTitle}>Today's message from Max</Text>
            <View style={styles.freeBadge}><Text style={styles.freeBadgeText}>FREE</Text></View>
          </View>
          <Text style={styles.freeMsg}>
            You're on a 12-day streak — that's your longest run this month! Keep the momentum going. Your push session today is key to hitting weekly volume targets.
          </Text>
          <Text style={styles.freeMsgFooter}>3 messages left this week</Text>
          <TouchableOpacity style={styles.replyBtn} onPress={() => setChatMode(true)}>
            <Text style={styles.replyBtnText}>Reply to Max</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featureSection}>
          <Text style={styles.featureHeading}>Unlock unlimited coaching</Text>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Text style={{ fontSize: 22 }}>{f.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Upgrade CTA */}
        <View style={styles.upgradeSection}>
          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>Upgrade to Pro · $9.99/mo</Text>
            <Text style={styles.upgradeSub}>Cancel anytime · 7-day free trial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.restoreBtn}>
            <Text style={styles.restoreBtnText}>Restore purchase</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, fontFamily: 'Nunito_800ExtraBold' },

  heroSection: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 8, paddingBottom: 24, gap: 10 },
  crownWrap: { position: 'absolute', top: 0, zIndex: 1 },
  crown: { fontSize: 28 },
  mascotWrap: { width: 100, height: 100, marginTop: 16 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: Colors.text, fontFamily: 'Nunito_900Black', textAlign: 'center' },
  heroSub: { fontSize: 15, color: Colors.text2, textAlign: 'center', lineHeight: 22 },

  freeCard: {
    marginHorizontal: 24, backgroundColor: Colors.surface,
    borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border,
    gap: 10,
  },
  freeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  freeCardTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  freeBadge: { backgroundColor: `${Colors.success}22`, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: `${Colors.success}44` },
  freeBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.success, letterSpacing: 0.5 },
  freeMsg: { fontSize: 15, color: Colors.text2, lineHeight: 22 },
  freeMsgFooter: { fontSize: 12, color: Colors.text3 },
  replyBtn: {
    borderWidth: 1.5, borderColor: Colors.borderActive, borderRadius: 12,
    height: 42, alignItems: 'center', justifyContent: 'center',
  },
  replyBtnText: { fontSize: 14, fontWeight: '700', color: Colors.text2 },

  featureSection: { marginHorizontal: 24, marginTop: 20, gap: 10 },
  featureHeading: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  featureCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  featureIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: `${Colors.purple}22`,
    borderWidth: 1, borderColor: `${Colors.purple}44`,
    alignItems: 'center', justifyContent: 'center',
  },
  featureTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  featureDesc: { fontSize: 13, color: Colors.text2, lineHeight: 18 },

  upgradeSection: { marginHorizontal: 24, marginTop: 20, gap: 12 },
  upgradeBtn: {
    backgroundColor: Colors.purple, borderRadius: 16,
    height: 58, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#5B21B6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
    gap: 2,
  },
  upgradeBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  upgradeSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  restoreBtn: { alignItems: 'center', paddingVertical: 8 },
  restoreBtnText: { fontSize: 13, color: Colors.text3 },

  // Chat styles
  chatHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 28, color: Colors.text, fontWeight: '600', lineHeight: 32 },
  chatHeaderCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chatAvatarWrap: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden', backgroundColor: Colors.surfaceRaised },
  chatName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  chatStatus: { fontSize: 12, color: Colors.success },
  chatScroll: { flex: 1 },
  contextStrip: {
    backgroundColor: Colors.surfaceRaised, borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 6,
  },
  contextText: { fontSize: 12, color: Colors.text2, fontWeight: '600', textAlign: 'center' },
  bubble: { flexDirection: 'row', gap: 8 },
  bubbleUser: { justifyContent: 'flex-end' },
  bubbleMax: { justifyContent: 'flex-start', alignItems: 'flex-end' },
  maxBubbleAvatar: { width: 28, height: 28, borderRadius: 14, overflow: 'hidden', backgroundColor: Colors.surfaceRaised },
  bubbleInner: { maxWidth: '78%', borderRadius: 16, padding: 12 },
  bubbleInnerMax: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderBottomLeftRadius: 4 },
  bubbleInnerUser: { backgroundColor: Colors.accent, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTextMax: { color: Colors.text },
  bubbleTextUser: { color: '#fff' },
  quickPromptsRow: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  quickChip: {
    backgroundColor: Colors.surfaceRaised, borderRadius: 999,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.borderActive,
  },
  quickChipText: { fontSize: 13, color: Colors.text2, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  input: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.borderActive,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15, color: Colors.text, maxHeight: 100,
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.surfaceRaised },
  sendBtnText: { fontSize: 20, fontWeight: '700', color: '#fff', lineHeight: 24 },
});
