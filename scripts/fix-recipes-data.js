/**
 * Normalizes recipe data for realism: fixes corrupted ingredients, recalculates
 * cost/nutrition/prep from ingredients, assigns images, and syncs variant stats.
 * Run: node scripts/fix-recipes-data.js
 * Rebuild unique dataset first: node scripts/build-unique-recipes.js
 * Then re-import data/recipes.json into MongoDB (Compass or mongoimport).
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { computeRecipeCosts } from "./ingredient-pricing.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RECIPES_PATH = join(__dirname, "../data/recipes.json");

/** One verified, working Unsplash image per base recipe (unique where possible). */
const RECIPE_IMAGE_MAP = {
  "Tuna Salad Sandwich":
    "https://images.unsplash.com/photo-1646753331142-d83ae29120dd?w=800",
  "Overnight Oats with Banana":
    "https://images.unsplash.com/photo-1682622110332-d50f50b7146d?w=800",
  "Chickpea Curry":
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
  Shakshuka: "https://images.unsplash.com/photo-1520218576172-c1a2df3fa5fc?w=800",
  "Breakfast Burrito":
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800",
  "Beef Tacos":
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
  "Greek Yogurt Parfait":
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800",
  "Pad Thai": "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800",
  "Black Bean Soup":
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
  "Coconut Rice with Mango":
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800",
  "Sheet Pan Sausage and Veggies":
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
  "Egg Fried Noodles":
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
  "Hummus and Veggie Cups":
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
  "One-Pot Chicken and Rice":
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
  "Banana Bread":
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
  "Veggie Pizza on Tortilla":
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
  "Peanut Butter Banana Smoothie":
    "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800",
  "Kimchi Fried Rice":
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
  "Caprese Sandwich":
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800",
  "Microwave Mug Omelette":
    "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800",
  "Chicken Caesar Salad":
    "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800",
  "Teriyaki Salmon Bowl":
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
  "Ramen Upgrade Bowl":
    "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800",
  "Spaghetti Aglio e Olio":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  "Baked Mac and Cheese":
    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
  "Chicken Quesadilla":
    "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800",
  "Spicy Roasted Chickpeas":
    "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800",
  "Pesto Pasta":
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
  "Grilled Cheese and Tomato Soup":
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
  "Avocado Toast with Egg":
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800",
  "Energy Bites":
    "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800",
  "Popcorn Trail Mix":
    "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800",
  "Vegetable Fried Rice":
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
  "Teriyaki Tilapia Bowl":
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
  "Microwave Baked Apple":
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800",
  "Lentil Soup":
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
  "Falafel Pita":
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
  "BBQ Chicken Rice Bowl":
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
  "Miso Soup with Tofu":
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
  "Chicken Stir-Fry":
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800",
  "Hummus Veggie Wrap":
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
};

/** Fallback keyword rules — recipe name only, not cuisine or ingredients. */
const IMAGE_RULES = [
  {
    priority: 100,
    keywords: ["tuna salad", "tuna sandwich"],
    urls: [
      "https://images.unsplash.com/photo-1528735602780-2552fd63c440?w=800",
      "https://images.unsplash.com/photo-1553909489-df37546a0a0f?w=800",
    ],
  },
  {
    priority: 100,
    keywords: ["overnight oats", "oats with banana", "oats with"],
    urls: [
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800",
      "https://images.unsplash.com/photo-1517673130602-bb0b384864e8?w=800",
    ],
  },
  {
    priority: 95,
    keywords: ["chickpea curry", "chana masala"],
    urls: [
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800",
    ],
  },
  {
    priority: 90,
    keywords: ["shakshuka"],
    urls: ["https://images.unsplash.com/photo-1520218576172-c1a2df3fa5fc?w=800"],
  },
  {
    priority: 90,
    keywords: ["breakfast burrito", "burrito"],
    urls: [
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800",
      "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800",
    ],
  },
  {
    priority: 90,
    keywords: ["beef taco", "taco"],
    urls: [
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
      "https://images.unsplash.com/photo-1599974579688-8dbddb0e2e0e?w=800",
    ],
  },
  {
    priority: 90,
    keywords: ["yogurt parfait", "parfait"],
    urls: [
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
    ],
  },
  {
    priority: 90,
    keywords: ["pad thai"],
    urls: ["https://images.unsplash.com/photo-1559314802-3d099474a489?w=800"],
  },
  {
    priority: 85,
    keywords: ["black bean soup", "lentil soup", "miso soup", "tomato soup"],
    urls: [
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
      "https://images.unsplash.com/photo-1604909052743-94e404bee059?w=800",
    ],
  },
  {
    priority: 85,
    keywords: ["coconut rice", "mango rice"],
    urls: ["https://images.unsplash.com/photo-1455619452474-d2be8b1e70cb?w=800"],
  },
  {
    priority: 85,
    keywords: ["sheet pan", "sausage and veg"],
    urls: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"],
  },
  {
    priority: 85,
    keywords: ["fried noodle", "egg fried noodle", "lo mein"],
    urls: ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800"],
  },
  {
    priority: 80,
    keywords: ["hummus"],
    urls: [
      "https://images.unsplash.com/photo-1608030259749-69d03e737f72?w=800",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    ],
  },
  {
    priority: 85,
    keywords: ["chicken and rice", "bbq chicken rice"],
    urls: [
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
    ],
  },
  {
    priority: 85,
    keywords: ["banana bread"],
    urls: ["https://images.unsplash.com/photo-1607920461886-b3714b7b7e1f?w=800"],
  },
  {
    priority: 85,
    keywords: ["pizza"],
    urls: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    ],
  },
  {
    priority: 85,
    keywords: ["smoothie"],
    urls: [
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800",
      "https://images.unsplash.com/photo-1505252585467-126054f932f4?w=800",
    ],
  },
  {
    priority: 85,
    keywords: ["kimchi fried rice", "fried rice"],
    urls: [
      "https://images.unsplash.com/photo-1585036495441-4c4f2a9e7f3b?w=800",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    ],
  },
  {
    priority: 85,
    keywords: ["caprese sandwich", "caprese"],
    urls: ["https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800"],
  },
  {
    priority: 85,
    keywords: ["omelette", "omelet", "mug omelette"],
    urls: [
      "https://images.unsplash.com/photo-1525351484164-769922bb5b08?w=800",
      "https://images.unsplash.com/photo-1482049012105-33866bd37086?w=800",
    ],
  },
  {
    priority: 85,
    keywords: ["caesar salad", "chicken salad"],
    urls: [
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    ],
  },
  {
    priority: 92,
    keywords: ["teriyaki", "fish bowl", "tilapia"],
    urls: [
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
      "https://images.unsplash.com/photo-1519708222418-c8fd9a32b2a2?w=800",
    ],
  },
  {
    priority: 90,
    keywords: ["salmon"],
    urls: [
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
      "https://images.unsplash.com/photo-1519708222418-c8fd9a32b2a2?w=800",
    ],
  },
  {
    priority: 90,
    keywords: ["ramen"],
    urls: [
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
      "https://images.unsplash.com/photo-1611145346292-24a4e5d3702f?w=800",
    ],
  },
  {
    priority: 85,
    keywords: ["spaghetti", "aglio e olio", "pesto pasta", "pasta"],
    urls: [
      "https://images.unsplash.com/photo-1473093290893-5790c4525e59?w=800",
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
    ],
  },
  {
    priority: 85,
    keywords: ["mac and cheese", "mac & cheese"],
    urls: ["https://images.unsplash.com/photo-1543339493-8fad0e436877?w=800"],
  },
  {
    priority: 85,
    keywords: ["quesadilla"],
    urls: ["https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800"],
  },
  {
    priority: 80,
    keywords: ["roasted chickpea", "chickpea"],
    urls: ["https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800"],
  },
  {
    priority: 85,
    keywords: ["grilled cheese"],
    urls: ["https://images.unsplash.com/photo-1615874699903-48d24203d13b?w=800"],
  },
  {
    priority: 85,
    keywords: ["avocado toast"],
    urls: ["https://images.unsplash.com/photo-1541519227355-08fa5d50c44d?w=800"],
  },
  {
    priority: 75,
    keywords: ["energy bite", "trail mix", "popcorn"],
    urls: ["https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800"],
  },
  {
    priority: 80,
    keywords: ["baked apple", "apple"],
    urls: ["https://images.unsplash.com/photo-1567304948995-4da29945b8c7?w=800"],
  },
  {
    priority: 85,
    keywords: ["falafel", "pita"],
    urls: ["https://images.unsplash.com/photo-1601050690578-3f5266b2c15c?w=800"],
  },
  {
    priority: 85,
    keywords: ["miso", "tofu soup"],
    urls: ["https://images.unsplash.com/photo-1617097897407-02f8d4e5c8c1?w=800"],
  },
  {
    priority: 85,
    keywords: ["stir-fry", "stir fry"],
    urls: ["https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800"],
  },
  {
    priority: 80,
    keywords: ["wrap", "veggie wrap"],
    urls: ["https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800"],
  },
  {
    priority: 85,
    keywords: ["chicken"],
    urls: [
      "https://images.unsplash.com/photo-1604908177525-402471fa5788?w=800",
      "https://images.unsplash.com/photo-1598103442097-1447435c4356?w=800",
    ],
  },
  {
    priority: 85,
    keywords: ["beef", "steak"],
    urls: ["https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800"],
  },
  {
    priority: 80,
    keywords: ["sandwich"],
    urls: [
      "https://images.unsplash.com/photo-1528735602780-2552fd63c440?w=800",
      "https://images.unsplash.com/photo-1553909489-df37546a0a0f?w=800",
    ],
  },
  {
    priority: 80,
    keywords: ["salad"],
    urls: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800"],
  },
  {
    priority: 80,
    keywords: ["soup"],
    urls: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800"],
  },
  {
    priority: 80,
    keywords: ["curry"],
    urls: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800"],
  },
  {
    priority: 75,
    keywords: ["toast", "french toast", "pancake", "waffle"],
    urls: [
      "https://images.unsplash.com/photo-1528202133047-9a5e764c3c9b?w=800",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
    ],
  },
  {
    priority: 75,
    keywords: ["cookie", "brownie", "cake", "dessert", "muffin"],
    urls: [
      "https://images.unsplash.com/photo-1499636132040-9f581a0f5466?w=800",
      "https://images.unsplash.com/photo-1607920461886-b3714b7b7e1f?w=800",
    ],
  },
  {
    priority: 70,
    keywords: ["rice bowl", "rice"],
    urls: ["https://images.unsplash.com/photo-1585036495441-4c4f2a9e7f3b?w=800"],
  },
  {
    priority: 70,
    keywords: ["egg"],
    urls: ["https://images.unsplash.com/photo-1525351484164-769922bb5b08?w=800"],
  },
];

const MEAL_TYPE_FALLBACK = {
  Breakfast: [
    "https://images.unsplash.com/photo-1525351484164-769922bb5b08?w=800",
    "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800",
    "https://images.unsplash.com/photo-1528202133047-9a5e764c3c9b?w=800",
  ],
  Lunch: [
    "https://images.unsplash.com/photo-1528735602780-2552fd63c440?w=800",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
  ],
  Dinner: [
    "https://images.unsplash.com/photo-1473093290893-5790c4525e59?w=800",
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
  ],
  Snack: [
    "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800",
    "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800",
  ],
  Dessert: [
    "https://images.unsplash.com/photo-1499636132040-9f581a0f5466?w=800",
    "https://images.unsplash.com/photo-1607920461886-b3714b7b7e1f?w=800",
  ],
};

const MEAL_TYPE_MULTIPLIER = {
  Breakfast: 0.9,
  Lunch: 1.0,
  Dinner: 1.15,
  Snack: 0.65,
  Dessert: 0.75,
};

/** Protein grams estimated per ingredient line (one college-meal portion). */
const INGREDIENT_PROTEIN = [
  ["chicken", 32],
  ["ground beef", 28],
  ["ground turkey", 26],
  ["beef", 26],
  ["steak", 30],
  ["sausage", 18],
  ["bacon", 12],
  ["pork", 24],
  ["salmon", 28],
  ["tilapia", 24],
  ["tuna", 22],
  ["shrimp", 20],
  ["turkey", 26],
  ["tofu", 14],
  ["tempeh", 16],
  ["eggs", 12],
  ["egg", 6],
  ["cheese", 8],
  ["mozzarella", 7],
  ["parmesan", 6],
  ["feta", 6],
  ["yogurt", 10],
  ["peanut butter", 8],
  ["chickpeas", 12],
  ["black beans", 10],
  ["lentils", 11],
  ["kidney beans", 10],
  ["hummus", 6],
  ["falafel", 8],
  ["oats", 5],
  ["milk", 4],
  ["ramen", 4],
  ["pasta", 6],
  ["rice", 3],
];

/** Calorie estimates per ingredient line. */
const INGREDIENT_CALORIES = [
  ["chicken", 180],
  ["ground beef", 250],
  ["ground turkey", 170],
  ["beef", 220],
  ["steak", 240],
  ["sausage", 200],
  ["bacon", 120],
  ["pork", 200],
  ["salmon", 200],
  ["tilapia", 120],
  ["tuna", 120],
  ["shrimp", 100],
  ["tofu", 80],
  ["eggs", 140],
  ["egg", 70],
  ["cheese", 110],
  ["mozzarella", 80],
  ["parmesan", 50],
  ["feta", 75],
  ["rice", 200],
  ["pasta", 220],
  ["noodles", 200],
  ["ramen", 190],
  ["bread", 160],
  ["tortilla", 120],
  ["oats", 150],
  ["peanut butter", 190],
  ["banana", 90],
  ["avocado", 120],
  ["potato", 110],
  ["sweet potato", 100],
  ["butter", 100],
  ["olive oil", 120],
  ["coconut milk", 140],
  ["chickpeas", 130],
  ["black beans", 110],
  ["honey", 60],
  ["chocolate", 80],
  ["yogurt", 100],
  ["milk", 60],
  ["mango", 60],
  ["apple", 50],
  ["hummus", 80],
  ["kimchi", 15],
  ["spinach", 20],
  ["broccoli", 30],
  ["bell pepper", 25],
  ["tomato", 20],
  ["corn", 60],
  ["mushroom", 15],
  ["carrot", 25],
  ["onion", 20],
  ["garlic", 5],
];

const ANIMAL_PRODUCTS =
  /\b(chicken|beef|pork|sausage|bacon|turkey|tuna|salmon|tilapia|shrimp|steak|egg(?!plant)|eggs|cheese|milk|yogurt|butter|cream|honey|mayonnaise|mayo)\b/i;
const MEAT_PRODUCTS =
  /\b(chicken|beef|pork|sausage|bacon|turkey|tuna|salmon|tilapia|shrimp|steak|ground beef|ground turkey)\b/i;
const GLUTEN_PRODUCTS =
  /\b(bread|pasta|noodles|ramen|tortilla|flour|soy sauce|breadcrumbs|croutons|macaroni|spaghetti|pesto pasta)\b/i;

function cleanRecipeName(name) {
  return name
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s#\d+$/, "")
    .trim();
}

function recipeContentKey(recipe) {
  return JSON.stringify({
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
  });
}

function matchIngredientValue(line, table, fallback = 0) {
  const lower = line.toLowerCase();
  for (const [keyword, value] of table) {
    if (lower.includes(keyword)) {
      return value;
    }
  }
  return fallback;
}

function ingredientsText(recipe) {
  return recipe.ingredients.join(" ").toLowerCase();
}

function fixRecipeConsistency(recipe) {
  const text = `${recipe.name} ${recipe.ingredients.join(" ")}`.toLowerCase();

  if (recipe.name.toLowerCase().includes("salmon") && text.includes("tilapia")) {
    recipe.name = recipe.name.replace(/salmon/gi, "Tilapia");
    recipe.instructions = recipe.instructions.map((step) =>
      step.replace(/salmon/gi, "tilapia")
    );
  }

  if (
    recipe.name.toLowerCase().includes("chicken") &&
    text.includes("tofu") &&
    !text.includes("chicken")
  ) {
    recipe.name = recipe.name.replace(/chicken/gi, "Tofu");
  }

  if (
    recipe.name.toLowerCase().includes("beef") &&
    text.includes("lentils") &&
    !text.includes("beef")
  ) {
    recipe.name = recipe.name.replace(/beef/gi, "Lentil");
  }

  const ingText = ingredientsText(recipe);
  if (
    recipe.instructions.some((step) => /\bsalmon\b/i.test(step)) &&
    !/\bsalmon\b/i.test(ingText)
  ) {
    recipe.instructions = recipe.instructions.map((step) =>
      step.replace(/\bsalmon\b/gi, "fish")
    );
  }
}

function findCanonicalIngredients(group) {
  const baseName = cleanRecipeName(group[0].name);
  const exact = group.find((recipe) => recipe.name === baseName);
  if (exact) {
    return exact.ingredients;
  }

  const counts = new Map();
  for (const recipe of group) {
    const key = JSON.stringify(recipe.ingredients);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const [mostCommonKey] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return JSON.parse(mostCommonKey);
}

function normalizeIngredientsByBaseDish(recipes) {
  const groups = new Map();

  for (const recipe of recipes) {
    const baseName = cleanRecipeName(recipe.name);
    if (!groups.has(baseName)) {
      groups.set(baseName, []);
    }
    groups.get(baseName).push(recipe);
  }

  for (const group of groups.values()) {
    const canonical = findCanonicalIngredients(group);
    for (const recipe of group) {
      recipe.ingredients = [...canonical];
    }
  }
}

function inferDietaryRestrictions(recipe) {
  const ing = ingredientsText(recipe);
  const hasAnimal = ANIMAL_PRODUCTS.test(ing);
  const hasMeat = MEAT_PRODUCTS.test(ing);
  const hasGluten = GLUTEN_PRODUCTS.test(ing);
  const hasDairy = /\b(cheese|milk|yogurt|butter|cream|mozzarella|parmesan|feta)\b/i.test(
    ing
  );

  if (!hasAnimal) {
    return "Vegan";
  }
  if (!hasMeat && hasDairy) {
    return "Vegetarian";
  }
  if (!hasMeat && !hasDairy) {
    return hasAnimal ? "Pescatarian" : "Vegetarian";
  }
  if (!hasGluten) {
    return "Gluten-free";
  }
  return "None";
}

function inferSpiceLevel(recipe) {
  const text = `${ingredientsText(recipe)} ${recipe.name}`.toLowerCase();
  if (/\b(spicy|sriracha|chili|chilli|hot sauce|jalape|gochujang|kimchi)\b/.test(text)) {
    return "Hot";
  }
  if (/\b(curry|paprika|cumin|pepper flakes|chipotle)\b/.test(text)) {
    return "Medium";
  }
  return "Mild";
}

function estimateProtein(recipe) {
  let total = recipe.ingredients.reduce(
    (sum, line) => sum + matchIngredientValue(line, INGREDIENT_PROTEIN, 1.5),
    0
  );
  total *= MEAL_TYPE_MULTIPLIER[recipe.meal_type] || 1;
  return Math.round(Math.min(Math.max(total, 3), 55) * 10) / 10;
}

function estimateCalories(recipe) {
  let total = recipe.ingredients.reduce(
    (sum, line) => sum + matchIngredientValue(line, INGREDIENT_CALORIES, 25),
    0
  );
  total += 40;
  total *= MEAL_TYPE_MULTIPLIER[recipe.meal_type] || 1;
  return Math.round(Math.min(Math.max(total, 120), 850));
}

function estimatePrepTime(recipe) {
  const steps = recipe.instructions.length;
  const text = `${recipe.name} ${recipe.instructions.join(" ")}`.toLowerCase();
  let minutes = 5 + steps * 3;

  if (/microwave|mug|quick|5.minute|no.cook|no cook/.test(text)) {
    minutes = Math.min(minutes, 10);
  }
  if (/overnight|refrigerate overnight/.test(text)) {
    minutes = Math.min(minutes, 8);
  }

  return Math.round(Math.min(Math.max(minutes, 5), 25));
}

function estimateCookTime(recipe) {
  const text = recipe.instructions.join(" ").toLowerCase();
  let minutes = 0;

  const patterns = [
    /simmer\s+(?:for\s+)?(\d+)/,
    /bake\s+(?:for\s+)?(\d+)/,
    /(?:cook|fry|grill|roast|boil)\s+(?:for\s+)?(\d+)/,
    /(\d+)\s+minutes/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      minutes = Math.max(minutes, Number(match[1]));
    }
  }

  if (/sheet pan|one-pot|one pot|stir-fry|stir fry/.test(recipe.name.toLowerCase())) {
    minutes = Math.max(minutes, 20);
  }
  if (/soup|stew|chili|curry|roast|bake|casserole/.test(recipe.name.toLowerCase())) {
    minutes = Math.max(minutes, 15);
  }

  return Math.round(Math.min(Math.max(minutes, 0), 60));
}

function estimateTotalTime(recipe) {
  return estimatePrepTime(recipe) + estimateCookTime(recipe);
}

function computeBaseStats(recipe) {
  const costs = computeRecipeCosts(recipe);
  return {
    ...costs,
    protein: estimateProtein(recipe),
    calories: estimateCalories(recipe),
    preparation_time: estimatePrepTime(recipe),
    cook_time: estimateCookTime(recipe),
    total_time: estimateTotalTime(recipe),
    dietary_restrictions: inferDietaryRestrictions(recipe),
    spice_level: inferSpiceLevel(recipe),
    rating: 4.2,
  };
}

function inferRating(recipe, baseRating) {
  const name = recipe.name.toLowerCase();
  let rating = baseRating;
  if (/\(budget\)|\(dorm-friendly\)|\(student special\)/.test(name)) {
    rating -= 0.1;
  }
  if (/\(quick\)|\(easy\)/.test(name)) {
    rating += 0.05;
  }
  return Math.round(Math.min(Math.max(rating, 3.5), 5) * 10) / 10;
}

function pickImage(recipe) {
  const baseName = cleanRecipeName(recipe.name);

  if (RECIPE_IMAGE_MAP[baseName]) {
    return RECIPE_IMAGE_MAP[baseName];
  }

  const nameText = baseName.toLowerCase();
  const matches = IMAGE_RULES.filter((rule) =>
    rule.keywords.some((kw) => nameText.includes(kw))
  );

  if (matches.length > 0) {
    matches.sort((a, b) => {
      const longestA = Math.max(
        ...a.keywords.filter((kw) => nameText.includes(kw)).map((kw) => kw.length)
      );
      const longestB = Math.max(
        ...b.keywords.filter((kw) => nameText.includes(kw)).map((kw) => kw.length)
      );
      return b.priority - a.priority || longestB - longestA;
    });
    const urls = matches[0].urls;
    return urls[recipe.id % urls.length];
  }

  const fallback =
    MEAL_TYPE_FALLBACK[recipe.meal_type] || MEAL_TYPE_FALLBACK.Lunch;
  return fallback[recipe.id % fallback.length];
}

const recipes = JSON.parse(readFileSync(RECIPES_PATH, "utf8"));
const imageCounts = {};
const baseStatsByContent = new Map();

normalizeIngredientsByBaseDish(recipes);

for (const recipe of recipes) {
  fixRecipeConsistency(recipe);
  recipe.image_url = pickImage(recipe);

  const contentKey = recipeContentKey(recipe);
  if (!baseStatsByContent.has(contentKey)) {
    baseStatsByContent.set(contentKey, computeBaseStats(recipe));
  }

  const base = baseStatsByContent.get(contentKey);
  recipe.cost = base.cost;
  recipe.cost_total = base.cost_total;
  recipe.cost_per_serving = base.cost_per_serving;
  recipe.shopping_cost = base.shopping_cost;
  recipe.shopping_cost_low = base.shopping_cost_low;
  recipe.shopping_cost_high = base.shopping_cost_high;
  recipe.remaining_value = base.remaining_value;
  recipe.ingredient_costs = base.ingredient_costs;
  recipe.protein = base.protein;
  recipe.calories = base.calories;
  recipe.preparation_time = base.preparation_time;
  recipe.cook_time = base.cook_time;
  recipe.total_time = base.total_time;
  recipe.dietary_restrictions = base.dietary_restrictions;
  recipe.spice_level = base.spice_level;
  recipe.serving_size = base.serving_size;
  recipe.rating = inferRating(recipe, base.rating);
  recipe.cost_currency = "USD";

  imageCounts[recipe.image_url] = (imageCounts[recipe.image_url] || 0) + 1;
}

writeFileSync(RECIPES_PATH, `${JSON.stringify(recipes, null, 2)}\n`);

const costs = recipes.map((r) => r.cost_per_serving);
function clean(n) {
  return n.replace(/\s*\([^)]*\)/g, "").replace(/\s#\d+$/, "").trim();
}
const chicken = recipes.filter((x) => clean(x.name) === "One-Pot Chicken and Rice");
const chickenCosts = [...new Set(chicken.map((x) => x.cost_per_serving))];

console.log(`Updated ${recipes.length} recipes.`);
console.log(
  `Per-serving cost range: $${Math.min(...costs).toFixed(2)} – $${Math.max(...costs).toFixed(2)} (avg $${(costs.reduce((a, b) => a + b, 0) / costs.length).toFixed(2)})`
);
console.log(`Unique images: ${Object.keys(imageCounts).length}`);
console.log(`Unique ingredient/instruction sets: ${baseStatsByContent.size}`);
console.log(
  `One-Pot Chicken and Rice: ${chicken.length} variants, ${chickenCosts.length} distinct costs (${chickenCosts.map((c) => "$" + c.toFixed(2)).join(", ")})`
);

const uniqueImages = new Set(Object.values(RECIPE_IMAGE_MAP));
console.log(`Mapped dishes: ${Object.keys(RECIPE_IMAGE_MAP).length}, unique image URLs: ${uniqueImages.size}`);

const brokenImages = [];
for (const [dish, url] of Object.entries(RECIPE_IMAGE_MAP)) {
  const response = await fetch(url);
  if (!response.ok) {
    brokenImages.push(dish);
  }
}
if (brokenImages.length > 0) {
  console.warn("Broken image URLs:", brokenImages.join(", "));
} else {
  console.log("All mapped image URLs verified.");
}
