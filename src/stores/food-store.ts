import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FoodDBItem {
  id: string;
  name: string;
  servingSize: number;
  servingLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category: string;
}

const DEFAULT_FOODS: FoodDBItem[] = [
  { id: 'f1', name: 'Chicken Breast (cooked)', servingSize: 100, servingLabel: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: 'meat' },
  { id: 'f2', name: 'Egg (whole)', servingSize: 1, servingLabel: '1 large', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0, category: 'dairy' },
  { id: 'f3', name: 'Egg White', servingSize: 1, servingLabel: '1 large', calories: 17, protein: 3.6, carbs: 0.2, fat: 0, fiber: 0, category: 'dairy' },
  { id: 'f4', name: 'Greek Yogurt (plain)', servingSize: 100, servingLabel: '100g', calories: 59, protein: 10, carbs: 3.6, fat: 0.7, fiber: 0, category: 'dairy' },
  { id: 'f5', name: 'Milk (whole)', servingSize: 100, servingLabel: '100ml', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, category: 'dairy' },
  { id: 'f6', name: 'Protein Shake (whey)', servingSize: 1, servingLabel: '1 scoop', calories: 120, protein: 25, carbs: 3, fat: 1.5, fiber: 0, category: 'supplements' },
  { id: 'f7', name: 'Oats', servingSize: 100, servingLabel: '100g', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, category: 'grains' },
  { id: 'f8', name: 'White Rice (cooked)', servingSize: 100, servingLabel: '100g', calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4, category: 'grains' },
  { id: 'f9', name: 'Brown Rice (cooked)', servingSize: 100, servingLabel: '100g', calories: 123, protein: 2.7, carbs: 25.6, fat: 1, fiber: 1.6, category: 'grains' },
  { id: 'f10', name: 'Sweet Potato (baked)', servingSize: 100, servingLabel: '100g', calories: 90, protein: 2, carbs: 20.7, fat: 0.1, fiber: 3.3, category: 'veg' },
  { id: 'f11', name: 'Broccoli', servingSize: 100, servingLabel: '100g', calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6, category: 'veg' },
  { id: 'f12', name: 'Spinach', servingSize: 100, servingLabel: '100g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, category: 'veg' },
  { id: 'f13', name: 'Banana', servingSize: 1, servingLabel: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, category: 'fruit' },
  { id: 'f14', name: 'Apple', servingSize: 1, servingLabel: '1 medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, category: 'fruit' },
  { id: 'f15', name: 'Blueberries', servingSize: 100, servingLabel: '100g', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, category: 'fruit' },
  { id: 'f16', name: 'Almonds', servingSize: 30, servingLabel: '30g (~23 nuts)', calories: 164, protein: 6, carbs: 6.1, fat: 14.2, fiber: 3.5, category: 'nuts' },
  { id: 'f17', name: 'Peanut Butter', servingSize: 32, servingLabel: '2 tbsp (32g)', calories: 188, protein: 8, carbs: 6.3, fat: 16, fiber: 1.9, category: 'nuts' },
  { id: 'f18', name: 'Olive Oil', servingSize: 15, servingLabel: '1 tbsp (15ml)', calories: 119, protein: 0, carbs: 0, fat: 13.5, fiber: 0, category: 'fats' },
  { id: 'f19', name: 'Avocado', servingSize: 100, servingLabel: '100g', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, category: 'fats' },
  { id: 'f20', name: 'Salmon (cooked)', servingSize: 100, servingLabel: '100g', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, category: 'meat' },
  { id: 'f21', name: 'Tuna (canned in water)', servingSize: 100, servingLabel: '100g', calories: 116, protein: 26, carbs: 0, fat: 0.8, fiber: 0, category: 'meat' },
  { id: 'f22', name: 'Beef (lean, cooked)', servingSize: 100, servingLabel: '100g', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, category: 'meat' },
  { id: 'f23', name: 'Pasta (cooked)', servingSize: 100, servingLabel: '100g', calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, category: 'grains' },
  { id: 'f24', name: 'Bread (whole wheat)', servingSize: 1, servingLabel: '1 slice', calories: 69, protein: 3.6, carbs: 12, fat: 0.9, fiber: 1.9, category: 'grains' },
  { id: 'f25', name: 'Cottage Cheese', servingSize: 100, servingLabel: '100g', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, category: 'dairy' },
  { id: 'f26', name: 'Whey Protein Isolate', servingSize: 1, servingLabel: '1 scoop', calories: 110, protein: 26, carbs: 1, fat: 0.5, fiber: 0, category: 'supplements' },
  { id: 'f27', name: 'Quinoa (cooked)', servingSize: 100, servingLabel: '100g', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, category: 'grains' },
  { id: 'f28', name: 'Mixed Vegetables', servingSize: 100, servingLabel: '100g', calories: 45, protein: 2.2, carbs: 8.7, fat: 0.4, fiber: 2.9, category: 'veg' },
  { id: 'f29', name: 'Orange', servingSize: 1, servingLabel: '1 medium', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, fiber: 3.1, category: 'fruit' },
  { id: 'f30', name: 'Rice Cakes', servingSize: 1, servingLabel: '1 cake', calories: 35, protein: 0.7, carbs: 7.3, fat: 0.3, fiber: 0.4, category: 'grains' },
  { id: 'f31', name: 'Hummus', servingSize: 100, servingLabel: '100g', calories: 166, protein: 7.9, carbs: 14.3, fat: 9.6, fiber: 6, category: 'veg' },
  { id: 'f32', name: 'Dark Chocolate (70%)', servingSize: 30, servingLabel: '30g', calories: 170, protein: 2.2, carbs: 12, fat: 12, fiber: 3.1, category: 'snacks' },
  { id: 'f33', name: 'Mixed Nuts', servingSize: 30, servingLabel: '30g', calories: 173, protein: 5, carbs: 6, fat: 15, fiber: 2.5, category: 'nuts' },
  { id: 'f34', name: 'Turkey Breast (deli)', servingSize: 100, servingLabel: '100g', calories: 104, protein: 19, carbs: 1, fat: 2, fiber: 0, category: 'meat' },
  { id: 'f35', name: 'Tofu (firm)', servingSize: 100, servingLabel: '100g', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, category: 'meat' },
];

interface FoodDBState {
  foods: FoodDBItem[];
  customFoods: FoodDBItem[];
  addCustomFood: (food: Omit<FoodDBItem, 'id'>) => void;
  deleteCustomFood: (id: string) => void;
  searchFoods: (query: string) => FoodDBItem[];
  getAllFoods: () => FoodDBItem[];
}

export const useFoodDBStore = create<FoodDBState>()(
  persist(
    (set, get) => ({
      foods: DEFAULT_FOODS,
      customFoods: [],

      addCustomFood: (food) => {
        const id = Math.random().toString(36).substring(2, 10);
        set((s) => ({ customFoods: [...s.customFoods, { ...food, id }] }));
      },

      deleteCustomFood: (id) =>
        set((s) => ({ customFoods: s.customFoods.filter((f) => f.id !== id) })),

      searchFoods: (query) => {
        const q = query.toLowerCase();
        const all = get().getAllFoods();
        if (!q) return all;
        return all.filter((f) => f.name.toLowerCase().includes(q));
      },

      getAllFoods: () => [...get().foods, ...get().customFoods],
    }),
    {
      name: 'hez-food-db',
      partialize: (s) => ({ customFoods: s.customFoods }),
    },
  ),
);
