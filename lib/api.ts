import type { FoodItem } from './types';

// ─── USDA FoodData Central (ported from fdc_data_source.dart) ────────────────

const FDC_API_KEY = 'DEMO_KEY'; // Replace with your key from api.nal.usda.gov
const FDC_BASE = 'https://api.nal.usda.gov/fdc/v1';

interface FDCNutrient {
  nutrientId: number;
  nutrientName: string;
  unitName: string;
  value: number;
}

interface FDCFood {
  fdcId: number;
  description: string;
  brandOwner?: string;
  brandName?: string;
  dataType: string;
  foodNutrients: FDCNutrient[];
  servingSize?: number;
  servingSizeUnit?: string;
}

function parseFDCFood(food: FDCFood): FoodItem | null {
  const get = (id: number) => food.foodNutrients?.find(n => n.nutrientId === id)?.value ?? 0;

  const kcal    = get(1008);
  const protein = get(1003);
  const carbs   = get(1005);
  const fat     = get(1004);

  if (!kcal && !protein) return null;

  return {
    id: `fdc-${food.fdcId}`,
    name: food.description,
    brand: food.brandOwner ?? food.brandName,
    source: 'fdc',
    servingSize: food.servingSize ?? 100,
    servingUnit: food.servingSizeUnit ?? 'g',
    kcalPer100: kcal,
    proteinPer100: protein,
    carbsPer100: carbs,
    fatPer100: fat,
  };
}

export async function searchFDC(query: string): Promise<FoodItem[]> {
  try {
    const url = `${FDC_BASE}/foods/search?query=${encodeURIComponent(query)}&pageSize=20&api_key=${FDC_API_KEY}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.foods as FDCFood[])
      .map(parseFDCFood)
      .filter((f): f is FoodItem => f !== null);
  } catch {
    return [];
  }
}

// ─── OpenFoodFacts (ported from off_data_source.dart) ─────────────────────────

const OFF_BASE = 'https://world.openfoodfacts.org';

interface OFFProduct {
  _id?: string;
  product_name?: string;
  brands?: string;
  image_front_small_url?: string;
  serving_size?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    'energy-kcal_serving'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
}

function parseOFFProduct(p: OFFProduct): FoodItem | null {
  const n = p.nutriments;
  if (!n || !p.product_name) return null;

  const kcal    = n['energy-kcal_100g'] ?? 0;
  const protein = n.proteins_100g ?? 0;
  const carbs   = n.carbohydrates_100g ?? 0;
  const fat     = n.fat_100g ?? 0;

  if (!kcal && !protein) return null;

  return {
    id: `off-${p._id ?? Math.random()}`,
    name: p.product_name,
    brand: p.brands,
    source: 'off',
    servingSize: 100,
    servingUnit: 'g',
    kcalPer100: kcal,
    proteinPer100: protein,
    carbsPer100: carbs,
    fatPer100: fat,
    imageUrl: p.image_front_small_url,
    barcode: p._id,
  };
}

export async function searchOpenFoodFacts(query: string): Promise<FoodItem[]> {
  try {
    const url = `${OFF_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1&page_size=20&fields=_id,product_name,brands,nutriments,image_front_small_url`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'JACKED-App/1.0 (https://github.com/cytopyter/jacked-app)' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products as OFFProduct[])
      .map(parseOFFProduct)
      .filter((f): f is FoodItem => f !== null);
  } catch {
    return [];
  }
}

export async function lookupBarcode(barcode: string): Promise<FoodItem | null> {
  try {
    const url = `${OFF_BASE}/api/v0/product/${barcode}.json?fields=_id,product_name,brands,nutriments,image_front_small_url`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'JACKED-App/1.0 (https://github.com/cytopyter/jacked-app)' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;
    return parseOFFProduct({ ...data.product, _id: barcode });
  } catch {
    return null;
  }
}

// ─── Combined search (FDC + OpenFoodFacts in parallel) ───────────────────────

export async function searchFood(query: string): Promise<FoodItem[]> {
  const [fdc, off] = await Promise.allSettled([searchFDC(query), searchOpenFoodFacts(query)]);
  const fdcResults = fdc.status === 'fulfilled' ? fdc.value : [];
  const offResults = off.status === 'fulfilled' ? off.value : [];

  // Deduplicate by name (prefer FDC data)
  const seen = new Set<string>();
  const combined: FoodItem[] = [];
  for (const item of [...fdcResults, ...offResults]) {
    const key = item.name.toLowerCase().slice(0, 30);
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(item);
    }
  }
  return combined.slice(0, 30);
}
