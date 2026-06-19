/**
 * Reassigns recipe images by dish type and recalculates costs from ingredients.
 * Run: node scripts/fix-recipes-data.js
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RECIPES_PATH = join(__dirname, "../data/recipes.json");

/** Primary image for each base recipe name (name is the source of truth). */
const RECIPE_IMAGE_MAP = {
  "Tuna Salad Sandwich": [
    "https://images.unsplash.com/photo-1553909489-df37546a0a0f?w=800",
    "https://images.unsplash.com/photo-1528735602780-2552fd63c440?w=800",
  ],
  "Overnight Oats with Banana": [
    "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800",
    "https://images.unsplash.com/photo-1517673130602-bb0b384864e8?w=800",
  ],
  "Chickpea Curry": [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800",
  ],
  Shakshuka: ["https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800"],
  "Breakfast Burrito": [
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800",
    "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800",
  ],
  "Beef Tacos": [
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
    "https://images.unsplash.com/photo-1599974579688-8dbddb0e2e0e?w=800",
  ],
  "Greek Yogurt Parfait": [
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
  ],
  "Pad Thai": ["https://images.unsplash.com/photo-1559314802-3d099474a489?w=800"],
  "Black Bean Soup": [
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
    "https://images.unsplash.com/photo-1604909052743-94e404bee059?w=800",
  ],
  "Coconut Rice with Mango": [
    "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cb?w=800",
  ],
  "Sheet Pan Sausage and Veggies": [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
  ],
  "Egg Fried Noodles": [
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
  ],
  "Hummus and Veggie Cups": [
    "https://images.unsplash.com/photo-1608030259749-69d03e737f72?w=800",
  ],
  "One-Pot Chicken and Rice": [
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
  ],
  "Banana Bread": [
    "https://images.unsplash.com/photo-1607920461886-b3714b7b7e1f?w=800",
  ],
  "Veggie Pizza on Tortilla": [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
  ],
  "Peanut Butter Banana Smoothie": [
    "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800",
    "https://images.unsplash.com/photo-1505252585467-126054f932f4?w=800",
  ],
  "Kimchi Fried Rice": [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    "https://images.unsplash.com/photo-1585036495441-4c4f2a9e7f3b?w=800",
  ],
  "Caprese Sandwich": [
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800",
  ],
  "Microwave Mug Omelette": [
    "https://images.unsplash.com/photo-1525351484164-769922bb5b08?w=800",
    "https://images.unsplash.com/photo-1482049012105-33866bd37086?w=800",
  ],
  "Chicken Caesar Salad": [
    "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800",
  ],
  "Teriyaki Salmon Bowl": [
    "https://images.unsplash.com/photo-1519708222418-c8fd9a32b2a2?w=800",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
  ],
  "Ramen Upgrade Bowl": [
    "https://images.unsplash.com/photo-1611145346292-24a4e5d3702f?w=800",
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
  ],
  "Spaghetti Aglio e Olio": [
    "https://images.unsplash.com/photo-1473093290893-5790c4525e59?w=800",
  ],
  "Baked Mac and Cheese": [
    "https://images.unsplash.com/photo-1543339493-8fad0e436877?w=800",
  ],
  "Chicken Quesadilla": [
    "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800",
  ],
  "Spicy Roasted Chickpeas": [
    "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800",
  ],
  "Pesto Pasta": [
    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
  ],
  "Grilled Cheese and Tomato Soup": [
    "https://images.unsplash.com/photo-1615874699903-48d24203d13b?w=800",
  ],
  "Avocado Toast with Egg": [
    "https://images.unsplash.com/photo-1541519227355-08fa5d50c44d?w=800",
  ],
  "Energy Bites": [
    "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800",
  ],
  "Popcorn Trail Mix": [
    "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800",
  ],
  "Vegetable Fried Rice": [
    "https://images.unsplash.com/photo-1585036495441-4c4f2a9e7f3b?w=800",
  ],
  "Teriyaki Tilapia Bowl": [
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
  ],
  "Microwave Baked Apple": [
    "https://images.unsplash.com/photo-1567304948995-4da29945b8c7?w=800",
  ],
  "Lentil Soup": [
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
  ],
  "Falafel Pita": [
    "https://images.unsplash.com/photo-1601050690578-3f5266b2c15c?w=800",
  ],
  "BBQ Chicken Rice Bowl": [
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
  ],
  "Miso Soup with Tofu": [
    "https://images.unsplash.com/photo-1617097897407-02f8d4e5c8c1?w=800",
  ],
  "Chicken Stir-Fry": [
    "https://images.unsplash.com/photo-1604908177525-402471fa5788?w=800",
  ],
  "Hummus Veggie Wrap": [
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800",
  ],
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
    urls: ["https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800"],
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

/** Estimated USD cost per ingredient line (college grocery prices). */
const INGREDIENT_COSTS = [
  ["salmon", 7.5],
  ["tilapia", 3.5],
  ["shrimp", 6.5],
  ["steak", 8.0],
  ["beef", 5.5],
  ["chicken", 4.0],
  ["pork", 4.5],
  ["sausage", 3.5],
  ["bacon", 3.0],
  ["tuna", 1.75],
  ["turkey", 3.5],
  ["tofu", 2.0],
  ["tempeh", 2.5],
  ["eggs", 0.6],
  ["cheese", 2.25],
  ["mozzarella", 2.5],
  ["parmesan", 2.0],
  ["feta", 2.5],
  ["coconut milk", 1.75],
  ["chickpeas", 1.1],
  ["black beans", 0.95],
  ["lentils", 0.85],
  ["kidney beans", 0.95],
  ["ground beef", 5.0],
  ["ground turkey", 4.0],
  ["rice", 0.75],
  ["pasta", 1.1],
  ["noodles", 1.0],
  ["ramen", 0.5],
  ["bread", 1.25],
  ["tortilla", 0.9],
  ["oats", 0.55],
  ["peanut butter", 1.1],
  ["banana", 0.35],
  ["avocado", 1.25],
  ["spinach", 1.5],
  ["broccoli", 1.6],
  ["bell pepper", 1.0],
  ["onion", 0.5],
  ["garlic", 0.35],
  ["tomato", 0.9],
  ["potato", 0.7],
  ["sweet potato", 0.85],
  ["mango", 1.2],
  ["yogurt", 1.1],
  ["milk", 0.7],
  ["butter", 0.6],
  ["olive oil", 0.4],
  ["soy sauce", 0.25],
  ["curry powder", 0.3],
  ["kimchi", 1.5],
  ["miso", 1.0],
  ["pesto", 2.0],
  ["hummus", 1.75],
  ["falafel", 2.0],
  ["apple", 0.6],
  ["honey", 0.4],
  ["maple syrup", 0.5],
  ["chocolate", 1.0],
  ["flour", 0.4],
  ["sugar", 0.3],
  ["mayonnaise", 0.35],
  ["lettuce", 0.75],
  ["cucumber", 0.6],
  ["carrot", 0.45],
  ["corn", 0.65],
  ["mushroom", 1.2],
  ["salmon fillet", 8.0],
  ["can tuna", 1.5],
];

const MEAL_TYPE_MULTIPLIER = {
  Breakfast: 0.9,
  Lunch: 1.0,
  Dinner: 1.15,
  Snack: 0.65,
  Dessert: 0.75,
};

function cleanRecipeName(name) {
  return name
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s#\d+$/, "")
    .trim();
}

function fixRecipeConsistency(recipe) {
  const text = `${recipe.name} ${recipe.ingredients.join(" ")}`.toLowerCase();

  if (recipe.name.toLowerCase().includes("salmon") && text.includes("tilapia")) {
    recipe.name = recipe.name.replace(/salmon/gi, "Tilapia");
  }

  if (recipe.name.toLowerCase().includes("chicken") && text.includes("tofu") && !text.includes("chicken")) {
    recipe.name = recipe.name.replace(/chicken/gi, "Tofu");
  }

  if (recipe.name.toLowerCase().includes("beef") && text.includes("lentils") && !text.includes("beef")) {
    recipe.name = recipe.name.replace(/beef/gi, "Lentil");
  }
}

function pickImage(recipe) {
  const baseName = cleanRecipeName(recipe.name);

  const mapped = RECIPE_IMAGE_MAP[baseName];
  if (mapped) {
    return mapped[recipe.id % mapped.length];
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

function estimateIngredientCost(ingredientLine) {
  const lower = ingredientLine.toLowerCase();
  for (const [keyword, cost] of INGREDIENT_COSTS) {
    if (lower.includes(keyword)) {
      return cost;
    }
  }
  return 0.65;
}

function estimateRecipeCost(recipe) {
  let total = recipe.ingredients.reduce(
    (sum, line) => sum + estimateIngredientCost(line),
    0
  );

  total += 0.45;
  total *= MEAL_TYPE_MULTIPLIER[recipe.meal_type] || 1;

  const servings = Math.max(recipe.serving_size || 1, 1);
  if (servings > 3) {
    total *= 1 + (servings - 3) * 0.08;
  }

  total = Math.min(Math.max(total, 2.5), 28.0);
  return Math.round(total * 100) / 100;
}

const recipes = JSON.parse(readFileSync(RECIPES_PATH, "utf8"));
const imageCounts = {};

for (const recipe of recipes) {
  fixRecipeConsistency(recipe);
  recipe.image_url = pickImage(recipe);
  recipe.cost = estimateRecipeCost(recipe);
  imageCounts[recipe.image_url] = (imageCounts[recipe.image_url] || 0) + 1;
}

writeFileSync(RECIPES_PATH, `${JSON.stringify(recipes, null, 2)}\n`);

const costs = recipes.map((r) => r.cost);
console.log(`Updated ${recipes.length} recipes.`);
console.log(
  `Cost range: $${Math.min(...costs)} – $${Math.max(...costs)} (avg $${(costs.reduce((a, b) => a + b, 0) / costs.length).toFixed(2)})`
);
console.log(`Unique images: ${Object.keys(imageCounts).length}`);
