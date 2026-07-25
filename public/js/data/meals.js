/**
 * MEAL DATABASE
 *
 * Macros are per standard serving of the base recipe. The diet engine
 * scales servings up or down to hit the user's calorie target, so these
 * are reference values rather than fixed portions.
 *
 * Nutrition figures are approximations consistent with USDA FoodData
 * Central averages for the constituent ingredients.
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
  { id: "veg", label: "Vegetarian", blurb: "Includes dairy and eggs" },
  { id: "nonveg", label: "Non-Vegetarian", blurb: "Includes meat, fish and eggs" },
  { id: "vegan", label: "Vegan", blurb: "No animal products at all" }
];

export const MEALS = {
  veg: {
    breakfast: [
      { name: "Greek Yogurt Parfait with Oats & Berries", kcal: 320, p: 20, c: 45, f: 6 },
      { name: "Paneer Bhurji with Whole Wheat Toast", kcal: 400, p: 24, c: 38, f: 16 },
      { name: "Vegetable & Cheese Omelette with Toast", kcal: 380, p: 26, c: 30, f: 17 },
      { name: "Masala Oats with Whey Protein & Peanut Butter", kcal: 420, p: 30, c: 44, f: 14 },
      { name: "Cottage Cheese Pancakes with Honey", kcal: 390, p: 28, c: 40, f: 12 }
    ],
    lunch: [
      { name: "Chickpea & Vegetable Curry with Brown Rice", kcal: 520, p: 22, c: 70, f: 14 },
      { name: "Paneer Tikka with Quinoa Salad", kcal: 560, p: 32, c: 48, f: 24 },
      { name: "Lentil Dal with Roti & Mixed Vegetables", kcal: 480, p: 24, c: 65, f: 12 },
      { name: "Rajma Curry with Steamed Rice & Salad", kcal: 540, p: 22, c: 78, f: 12 },
      { name: "Halloumi & Roasted Vegetable Grain Bowl", kcal: 580, p: 28, c: 52, f: 26 }
    ],
    snack: [
      { name: "Greek Yogurt with Almonds", kcal: 220, p: 16, c: 14, f: 11 },
      { name: "Hummus with Carrot & Cucumber Sticks", kcal: 200, p: 8, c: 22, f: 9 },
      { name: "Whey Protein Shake with Banana", kcal: 260, p: 25, c: 28, f: 4 },
      { name: "Roasted Chana with Green Tea", kcal: 210, p: 12, c: 26, f: 6 },
      { name: "Cottage Cheese with Pineapple", kcal: 190, p: 20, c: 16, f: 5 }
    ],
    dinner: [
      { name: "Tofu Stir-Fry with Brown Rice", kcal: 500, p: 28, c: 55, f: 15 },
      { name: "Paneer & Vegetable Curry with Roti", kcal: 540, p: 30, c: 50, f: 18 },
      { name: "Cottage Cheese Salad Bowl with Quinoa", kcal: 460, p: 32, c: 40, f: 16 },
      { name: "Vegetable & Lentil Soup with Wholegrain Bread", kcal: 440, p: 22, c: 58, f: 12 },
      { name: "Egg Curry with Steamed Rice", kcal: 520, p: 28, c: 52, f: 20 }
    ]
  },

  nonveg: {
    breakfast: [
      { name: "Scrambled Eggs with Whole Wheat Toast & Avocado", kcal: 420, p: 28, c: 32, f: 20 },
      { name: "Greek Yogurt with Chicken Sausage & Berries", kcal: 380, p: 30, c: 30, f: 14 },
      { name: "Oats with Whey Protein & Peanut Butter", kcal: 400, p: 30, c: 40, f: 14 },
      { name: "Egg White Omelette with Smoked Salmon", kcal: 360, p: 34, c: 20, f: 16 },
      { name: "Turkey & Egg Breakfast Wrap", kcal: 430, p: 32, c: 38, f: 17 }
    ],
    lunch: [
      { name: "Grilled Chicken Breast with Brown Rice & Broccoli", kcal: 550, p: 45, c: 50, f: 14 },
      { name: "Salmon Fillet with Quinoa & Asparagus", kcal: 580, p: 40, c: 42, f: 24 },
      { name: "Turkey Mince Stir-Fry with Vegetables & Rice", kcal: 520, p: 42, c: 48, f: 16 },
      { name: "Chicken Tikka with Roti & Cucumber Raita", kcal: 560, p: 44, c: 46, f: 20 },
      { name: "Tuna & Chickpea Salad with Wholegrain Pitta", kcal: 490, p: 38, c: 48, f: 14 }
    ],
    snack: [
      { name: "Boiled Eggs with Mixed Nuts", kcal: 260, p: 18, c: 6, f: 18 },
      { name: "Chicken Breast Strips with Salad", kcal: 220, p: 28, c: 6, f: 9 },
      { name: "Whey Protein Shake with Banana", kcal: 260, p: 25, c: 28, f: 4 },
      { name: "Greek Yogurt with Walnuts & Honey", kcal: 240, p: 18, c: 20, f: 10 },
      { name: "Tuna on Wholegrain Crackers", kcal: 230, p: 24, c: 18, f: 7 }
    ],
    dinner: [
      { name: "Grilled Salmon with Sweet Potato & Greens", kcal: 560, p: 38, c: 45, f: 22 },
      { name: "Chicken Stir-Fry with Brown Rice", kcal: 540, p: 42, c: 50, f: 15 },
      { name: "Lean Beef Steak with Roasted Vegetables", kcal: 580, p: 45, c: 30, f: 28 },
      { name: "Baked Cod with Quinoa & Green Beans", kcal: 470, p: 40, c: 42, f: 12 },
      { name: "Chicken & Lentil Curry with Rice", kcal: 550, p: 42, c: 54, f: 16 }
    ]
  },

  vegan: {
    breakfast: [
      { name: "Oats with Almond Milk, Chia Seeds & Berries", kcal: 350, p: 12, c: 50, f: 10 },
      { name: "Tofu Scramble with Whole Wheat Toast", kcal: 380, p: 22, c: 34, f: 16 },
      { name: "Pea Protein Smoothie with Banana & Oat Milk", kcal: 400, p: 28, c: 40, f: 12 },
      { name: "Peanut Butter & Banana on Wholegrain Toast", kcal: 420, p: 16, c: 52, f: 18 },
      { name: "Soy Yogurt with Granola & Mixed Seeds", kcal: 360, p: 18, c: 44, f: 13 }
    ],
    lunch: [
      { name: "Chickpea & Vegetable Curry with Brown Rice", kcal: 520, p: 20, c: 72, f: 12 },
      { name: "Tofu & Quinoa Buddha Bowl", kcal: 540, p: 26, c: 55, f: 18 },
      { name: "Black Bean & Sweet Potato Bowl with Rice", kcal: 500, p: 20, c: 78, f: 10 },
      { name: "Lentil Dal with Roti & Sauteed Spinach", kcal: 480, p: 24, c: 66, f: 11 },
      { name: "Tempeh Wrap with Hummus & Salad", kcal: 530, p: 28, c: 54, f: 19 }
    ],
    snack: [
      { name: "Hummus with Vegetable Sticks", kcal: 200, p: 8, c: 22, f: 9 },
      { name: "Roasted Chickpeas with Mixed Nuts", kcal: 230, p: 10, c: 20, f: 12 },
      { name: "Vegan Protein Shake with Banana", kcal: 240, p: 22, c: 26, f: 4 },
      { name: "Edamame with Sea Salt", kcal: 190, p: 17, c: 15, f: 8 },
      { name: "Almond Butter on Rice Cakes", kcal: 220, p: 8, c: 24, f: 12 }
    ],
    dinner: [
      { name: "Tofu Stir-Fry with Brown Rice & Vegetables", kcal: 500, p: 24, c: 58, f: 14 },
      { name: "Lentil & Vegetable Curry with Quinoa", kcal: 520, p: 24, c: 62, f: 14 },
      { name: "Tempeh & Vegetable Stir-Fry with Rice", kcal: 540, p: 28, c: 55, f: 16 },
      { name: "Chickpea Pasta with Tomato & Basil Sauce", kcal: 510, p: 26, c: 70, f: 11 },
      { name: "Soy Mince Chilli with Brown Rice", kcal: 530, p: 30, c: 64, f: 13 }
    ]
  }
};
