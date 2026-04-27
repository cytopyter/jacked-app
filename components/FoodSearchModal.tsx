import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, TextInput,
  FlatList, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors } from '../constants/theme';
import { searchFood, lookupBarcode } from '../lib/api';
import { kcalFromAmount } from '../lib/calculations';
import type { FoodItem, MealType } from '../lib/types';

interface Props {
  visible: boolean;
  mealType: MealType;
  onClose: () => void;
  onAdd: (food: FoodItem, amount: number) => void;
}

function FoodRow({ item, onAdd }: { item: FoodItem; onAdd: (amount: number) => void }) {
  const [amount, setAmount] = useState(item.servingSize.toString());
  const kcal = kcalFromAmount(item.kcalPer100, parseFloat(amount) || 0);

  return (
    <View style={styles.foodRow}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
        {item.brand && <Text style={styles.foodBrand} numberOfLines={1}>{item.brand}</Text>}
        <Text style={styles.foodMacros}>
          {kcal} kcal · P:{Math.round(item.proteinPer100 * (parseFloat(amount) || 0) / 100)}g
          · C:{Math.round(item.carbsPer100 * (parseFloat(amount) || 0) / 100)}g
          · F:{Math.round(item.fatPer100 * (parseFloat(amount) || 0) / 100)}g
        </Text>
      </View>
      <View style={styles.foodRight}>
        <View style={styles.amountRow}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            selectTextOnFocus
          />
          <Text style={styles.amountUnit}>g</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => onAdd(parseFloat(amount) || 100)}
        >
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function FoodSearchModal({ visible, mealType, onClose, onAdd }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.length < 2) { setResults([]); setSearched(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      const foods = await searchFood(text);
      setResults(foods);
      setLoading(false);
    }, 600);
  }, []);

  const handleAdd = useCallback((food: FoodItem, amount: number) => {
    onAdd(food, amount);
    setQuery('');
    setResults([]);
    setSearched(false);
  }, [onAdd]);

  const MEAL_LABELS: Record<MealType, string> = {
    breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks',
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add to {MEAL_LABELS[mealType]}</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search food, e.g. 'chicken breast'"
            placeholderTextColor={Colors.text3}
            value={query}
            onChangeText={handleSearch}
            autoFocus
            returnKeyType="search"
          />
          {loading && <ActivityIndicator size="small" color={Colors.accent} />}
        </View>

        {/* Results */}
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <FoodRow item={item} onAdd={(amount) => handleAdd(item, amount)} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              {!searched ? (
                <>
                  <Text style={styles.emptyIcon}>🍎</Text>
                  <Text style={styles.emptyText}>Search from millions of foods</Text>
                  <Text style={styles.emptySubtext}>Powered by USDA FoodData Central & Open Food Facts</Text>
                </>
              ) : !loading ? (
                <>
                  <Text style={styles.emptyIcon}>😕</Text>
                  <Text style={styles.emptyText}>No results for "{query}"</Text>
                  <Text style={styles.emptySubtext}>Try a different search term</Text>
                </>
              ) : null}
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 16, color: Colors.text2 },
  title: { fontSize: 17, fontWeight: '700', color: Colors.text },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    margin: 16, backgroundColor: Colors.surfaceRaised,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: Colors.borderActive,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 16, color: Colors.text },
  foodRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, gap: 12,
  },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  foodBrand: { fontSize: 12, color: Colors.text3, marginTop: 2 },
  foodMacros: { fontSize: 12, color: Colors.text2, marginTop: 4 },
  foodRight: { alignItems: 'flex-end', gap: 6 },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  amountInput: {
    width: 56, height: 34, backgroundColor: Colors.surfaceRaised,
    borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
    textAlign: 'center', fontSize: 15, fontWeight: '700', color: Colors.text,
  },
  amountUnit: { fontSize: 12, color: Colors.text2, fontWeight: '600' },
  addBtn: {
    backgroundColor: Colors.accent, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  addBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  separator: { height: 1, backgroundColor: Colors.border, marginLeft: 16 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 17, fontWeight: '700', color: Colors.text },
  emptySubtext: { fontSize: 13, color: Colors.text3, textAlign: 'center', paddingHorizontal: 32 },
});
