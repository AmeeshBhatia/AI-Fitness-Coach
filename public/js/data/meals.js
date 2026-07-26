/**
 * MEAL DATABASE — budget-friendly Indian meals
 *
 * Macros are per standard serving of the base recipe. The diet engine scales
 * servings up or down to hit the user's calorie target, so these are reference
 * values rather than fixed portions.
 *
 * Diet rules encoded here:
 *   veg     dairy allowed (paneer, curd, buttermilk), NO egg, no meat or fish
 *   vegan   no animal products at all (no dairy, no egg)
 *   nonveg  a vegetarian day with exactly ONE non-veg meal, rotating between
 *           dinner and lunch. Egg counts as non-veg, so egg dishes live here.
 *
 * Protein on a budget comes mainly from dal, chana, rajma, soya chunks,
 * paneer, tofu, curd, peanuts and sprouts.
 */

export const SLOTS = ["breakfast", "lunch", "snack", "dinner"];

export const SLOT_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack: "Evening Snack",
  dinner: "Dinner",
  // Added by the diet engine only when a high calorie target can't be met
  // by portion scaling alone.
  extra: "Extra Snack"
};

export const DIET_TYPES = [
  { id: "veg", label: "Vegetarian", blurb: "Dairy included, no egg" },
  { id: "nonveg", label: "Non-Vegetarian", blurb: "One non-veg meal a day, rest vegetarian" },
  { id: "vegan", label: "Vegan", blurb: "No dairy, no egg, no animal products" }
];

/* ============================================================
   VEGETARIAN — dairy yes, egg no
   ============================================================ */
const VEG_MEALS = {
  breakfast: [
    { name: "Poha with Peanuts & Sprouts", kcal: 350, p: 12, c: 52, f: 10 },
    { name: "Paneer Paratha with Curd", kcal: 450, p: 22, c: 48, f: 20 },
    { name: "Moong Dal Chilla with Green Chutney", kcal: 330, p: 20, c: 40, f: 10 },
    { name: "Vegetable Upma with Peanuts", kcal: 340, p: 10, c: 50, f: 11 },
    { name: "Idli with Sambar", kcal: 320, p: 12, c: 55, f: 6 },
    { name: "Soya Granule Bhurji with Roti", kcal: 400, p: 28, c: 42, f: 12 },
    { name: "Besan Chilla with Curd", kcal: 360, p: 18, c: 42, f: 13 }
  ],
  lunch: [
    { name: "Rajma Curry with Rice & Salad", kcal: 540, p: 22, c: 80, f: 12 },
    { name: "Paneer Bhurji with 2 Roti", kcal: 520, p: 28, c: 48, f: 22 },
    { name: "Chole with Jeera Rice", kcal: 520, p: 20, c: 78, f: 12 },
    { name: "Dal Tadka with Rice & Curd", kcal: 500, p: 20, c: 72, f: 12 },
    { name: "Soya Chunk Curry with 2 Roti", kcal: 510, p: 34, c: 55, f: 14 },
    { name: "Tofu Bhurji with Paratha", kcal: 530, p: 26, c: 52, f: 22 },
    { name: "Kadhi Chawal with Sabzi", kcal: 490, p: 18, c: 70, f: 14 }
  ],
  snack: [
    { name: "Roasted Chana with Masala Chai", kcal: 210, p: 12, c: 26, f: 6 },
    { name: "Sprouts Chaat with Lemon", kcal: 200, p: 14, c: 24, f: 5 },
    { name: "Paneer Tikka Cubes", kcal: 240, p: 22, c: 8, f: 14 },
    { name: "Curd with Roasted Peanuts", kcal: 230, p: 14, c: 16, f: 12 },
    { name: "Banana with Peanut Butter", kcal: 250, p: 8, c: 32, f: 11 },
    { name: "Masala Buttermilk with Murmura", kcal: 190, p: 8, c: 28, f: 5 }
  ],
  dinner: [
    { name: "Palak Paneer with Rice", kcal: 520, p: 26, c: 50, f: 22 },
    { name: "Tofu & Vegetable Stir-Fry with Rice", kcal: 500, p: 26, c: 58, f: 14 },
    { name: "Mixed Dal Khichdi with Curd", kcal: 480, p: 20, c: 70, f: 11 },
    { name: "Soya Keema with 2 Roti", kcal: 510, p: 32, c: 52, f: 16 },
    { name: "Paneer Butter Masala with Roti", kcal: 540, p: 28, c: 48, f: 24 },
    { name: "Chana Masala with Roti & Salad", kcal: 490, p: 22, c: 68, f: 12 },
    { name: "Lauki Chana Dal with Rice", kcal: 470, p: 20, c: 68, f: 10 }
  ]
};

/* ============================================================
   VEGAN — no dairy, no egg
   ============================================================ */
const VEGAN_MEALS = {
  breakfast: [
    { name: "Poha with Peanuts & Sprouts", kcal: 350, p: 12, c: 52, f: 10 },
    { name: "Moong Dal Chilla with Green Chutney", kcal: 330, p: 20, c: 40, f: 10 },
    { name: "Vegetable Upma with Peanuts", kcal: 340, p: 10, c: 50, f: 11 },
    { name: "Idli with Sambar", kcal: 320, p: 12, c: 55, f: 6 },
    { name: "Soya Granule Bhurji with Roti", kcal: 400, p: 28, c: 42, f: 12 },
    { name: "Peanut Butter Banana Toast", kcal: 420, p: 16, c: 52, f: 18 }
  ],
  lunch: [
    { name: "Rajma Curry with Rice & Salad", kcal: 540, p: 22, c: 80, f: 12 },
    { name: "Chole with Jeera Rice", kcal: 520, p: 20, c: 78, f: 12 },
    { name: "Soya Chunk Curry with 2 Roti", kcal: 510, p: 34, c: 55, f: 14 },
    { name: "Dal Tadka with Rice", kcal: 490, p: 20, c: 74, f: 10 },
    { name: "Tofu Bhurji with 2 Roti", kcal: 500, p: 28, c: 48, f: 20 },
    { name: "Sambar with Rice & Vegetables", kcal: 480, p: 16, c: 76, f: 10 }
  ],
  snack: [
    { name: "Roasted Chana with Green Tea", kcal: 210, p: 12, c: 26, f: 6 },
    { name: "Sprouts Chaat with Lemon", kcal: 200, p: 14, c: 24, f: 5 },
    { name: "Banana with Peanut Butter", kcal: 250, p: 8, c: 32, f: 11 },
    { name: "Roasted Peanuts with Jaggery", kcal: 240, p: 10, c: 22, f: 13 },
    { name: "Murmura Chivda", kcal: 190, p: 6, c: 30, f: 5 },
    { name: "Soya Milk with Dates", kcal: 200, p: 8, c: 30, f: 5 }
  ],
  dinner: [
    { name: "Tofu & Vegetable Stir-Fry with Rice", kcal: 500, p: 26, c: 58, f: 14 },
    { name: "Mixed Dal Khichdi", kcal: 470, p: 18, c: 72, f: 10 },
    { name: "Soya Keema with 2 Roti", kcal: 510, p: 32, c: 52, f: 16 },
    { name: "Chana Masala with Roti", kcal: 490, p: 22, c: 68, f: 12 },
    { name: "Baingan Bharta with 2 Roti", kcal: 450, p: 14, c: 60, f: 16 },
    { name: "Vegetable Sambar with Rice", kcal: 480, p: 16, c: 76, f: 10 }
  ]
};

/* ============================================================
   MEALS — the non-veg plan starts from the vegetarian day, then the diet
   engine swaps exactly one slot for a dish from NONVEG_DISHES below.
   ============================================================ */
export const MEALS = {
  veg: VEG_MEALS,
  nonveg: VEG_MEALS,
  vegan: VEGAN_MEALS
};

/**
 * The single non-veg meal of the day. Only lunch and dinner are used, since
 * that's when a non-veg dish realistically appears in an Indian meal pattern.
 * Every dish is flagged `nonveg: true` so the UI can badge it.
 */
export const NONVEG_DISHES = {
  lunch: [
    { name: "Chicken Curry with Rice", kcal: 560, p: 42, c: 55, f: 18, nonveg: true },
    { name: "Egg Curry with Rice", kcal: 500, p: 26, c: 55, f: 20, nonveg: true },
    { name: "Fish Curry with Rice", kcal: 520, p: 38, c: 55, f: 16, nonveg: true },
    { name: "Chicken Biryani (single plate)", kcal: 600, p: 36, c: 70, f: 20, nonveg: true },
    { name: "Chicken Keema Matar with 2 Roti", kcal: 550, p: 38, c: 45, f: 24, nonveg: true },
    { name: "Egg Bhurji with 2 Roti", kcal: 480, p: 24, c: 45, f: 22, nonveg: true }
  ],
  dinner: [
    { name: "Grilled Chicken with Roti & Salad", kcal: 520, p: 45, c: 40, f: 18, nonveg: true },
    { name: "Chicken Tikka with 2 Roti", kcal: 540, p: 44, c: 42, f: 20, nonveg: true },
    { name: "Fish Fry with Rice & Dal", kcal: 540, p: 36, c: 58, f: 18, nonveg: true },
    { name: "Boiled Egg Curry with 2 Roti", kcal: 490, p: 26, c: 44, f: 22, nonveg: true },
    { name: "Chicken Stew with Rice", kcal: 510, p: 38, c: 52, f: 16, nonveg: true },
    { name: "Masala Omelette with 2 Roti", kcal: 460, p: 24, c: 42, f: 20, nonveg: true }
  ]
};

/** Which slot carries the day's non-veg meal. Alternates dinner / lunch. */
export function nonVegSlotForDay(dayIndex) {
  return dayIndex % 2 === 0 ? "dinner" : "lunch";
}
