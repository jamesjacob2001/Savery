/**
 * Adds simple companion recipes that use leftover ingredients from popular dishes.
 * Run: node scripts/add-overlap-recipes.js
 * Then: node scripts/fix-recipes-data.js
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RECIPES_PATH = join(__dirname, "../data/recipes.json");

/** Subset recipes — only use packages already bought for related meals. */
const COMPANION_RECIPES = [
  {
    name: "Open-Faced Garden Tartine",
    cuisine: "American",
    meal_type: "Lunch",
    ingredients: ["2 slices bread", "2 tbsp mayonnaise", "Lettuce leaves"],
    instructions: [
      "Toast the bread.",
      "Spread mayo on each slice.",
      "Add lettuce and serve.",
    ],
  },
  {
    name: "Crispy Celery with Creamy Dip",
    cuisine: "American",
    meal_type: "Snack",
    ingredients: ["2 celery stalks", "2 tbsp mayonnaise", "Salt and pepper"],
    instructions: [
      "Cut celery into sticks.",
      "Serve with mayo for dipping.",
      "Season with salt and pepper.",
    ],
  },
  {
    name: "Savory Lemon Herb Toast",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: [
      "2 slices bread",
      "2 tbsp mayonnaise",
      "1 tsp lemon juice",
      "1/4 tsp garlic powder",
      "Black pepper",
    ],
    instructions: [
      "Toast bread until golden.",
      "Stir lemon juice and garlic powder into the mayo.",
      "Spread generously and finish with black pepper.",
    ],
  },
  {
    name: "Garden Tomato Salad",
    cuisine: "American",
    meal_type: "Lunch",
    ingredients: ["1 cup lettuce", "1 tomato, sliced", "1 tbsp olive oil"],
    instructions: [
      "Chop lettuce and slice tomato.",
      "Toss with olive oil.",
      "Season with salt and pepper.",
    ],
  },
  {
    name: "Skillet Cheese Toast",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["2 slices bread", "1 slice cheddar cheese", "1 tsp butter"],
    instructions: [
      "Butter bread and top with cheese.",
      "Toast in a pan until cheese melts.",
    ],
  },
  {
    name: "Skillet Garlic Bread",
    cuisine: "Italian",
    meal_type: "Snack",
    ingredients: [
      "2 slices bread",
      "1 tbsp butter",
      "1 clove garlic, minced",
      "1 tbsp olive oil",
    ],
    instructions: [
      "Mix butter, garlic, and olive oil.",
      "Spread on bread and toast until golden.",
    ],
  },
  {
    name: "Honey Morning Porridge",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["1/2 cup rolled oats", "1/2 cup milk", "1 tsp honey"],
    instructions: [
      "Simmer oats and milk 5 minutes.",
      "Stir in honey and serve warm.",
    ],
  },
  {
    name: "Creamy Stovetop Oatmeal",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["1/2 cup rolled oats", "1 cup milk"],
    instructions: ["Simmer oats in milk 5 minutes.", "Serve warm."],
  },
  {
    name: "Peanut Butter Toast",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["2 slices bread", "2 tbsp peanut butter"],
    instructions: ["Toast bread.", "Spread peanut butter and serve."],
  },
  {
    name: "Peanut Butter Banana Toast",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: [
      "2 slices bread",
      "2 tbsp peanut butter",
      "1/2 banana, sliced",
    ],
    instructions: [
      "Toast bread and spread peanut butter.",
      "Top with banana slices.",
    ],
  },
  {
    name: "Rustic Tomato Soup",
    cuisine: "Italian",
    meal_type: "Lunch",
    ingredients: [
      "1 cup vegetable broth",
      "1 can diced tomatoes",
      "1 tbsp olive oil",
    ],
    instructions: [
      "Simmer broth and tomatoes 10 minutes.",
      "Stir in olive oil and serve.",
    ],
  },
  {
    name: "Tomato Basil Salad",
    cuisine: "Italian",
    meal_type: "Lunch",
    ingredients: [
      "1 can diced tomatoes",
      "1/4 cup fresh basil",
      "1 tbsp olive oil",
    ],
    instructions: ["Combine tomatoes and basil.", "Drizzle with olive oil."],
  },
  {
    name: "Quick Broth Sip",
    cuisine: "American",
    meal_type: "Snack",
    ingredients: ["1 cup vegetable broth", "1 tbsp olive oil"],
    instructions: ["Heat broth.", "Stir in olive oil and serve."],
  },
  {
    name: "Olive Oil Rice Bowl",
    cuisine: "Asian",
    meal_type: "Lunch",
    ingredients: ["1 cup cooked rice", "1 tbsp olive oil", "Salt and pepper"],
    instructions: [
      "Warm rice in a bowl.",
      "Drizzle with olive oil and season.",
    ],
  },
  {
    name: "Steamed Broccoli Florets",
    cuisine: "American",
    meal_type: "Side",
    ingredients: ["1 cup broccoli florets", "1 tbsp olive oil", "Salt and pepper"],
    instructions: [
      "Steam broccoli until tender.",
      "Toss with olive oil and season.",
    ],
  },
  {
    name: "Cheesy Black Bean Quesadilla",
    cuisine: "Mexican",
    meal_type: "Lunch",
    ingredients: [
      "2 large flour tortillas",
      "1/2 cup black beans, drained",
      "1/2 cup shredded cheese",
    ],
    instructions: [
      "Layer beans and cheese on a tortilla.",
      "Top with second tortilla and cook until melted.",
    ],
  },
  {
    name: "Crispy Cheese Taco",
    cuisine: "Mexican",
    meal_type: "Snack",
    ingredients: ["1 large flour tortilla", "1/4 cup shredded cheese"],
    instructions: [
      "Sprinkle cheese on tortilla.",
      "Fold and warm in a pan until cheese melts.",
    ],
  },
  {
    name: "Mediterranean Crudités",
    cuisine: "Mediterranean",
    meal_type: "Snack",
    ingredients: ["1/2 cup hummus", "1 cup carrot sticks"],
    instructions: ["Serve hummus with carrot sticks for dipping."],
  },
  {
    name: "Sunny Eggs on Toast",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["2 slices bread", "1 egg", "1 tsp butter"],
    instructions: [
      "Toast bread and fry egg.",
      "Serve egg on toast with butter.",
    ],
  },
  {
    name: "Tea Room Celery Sandwiches",
    cuisine: "American",
    meal_type: "Lunch",
    ingredients: [
      "2 slices bread",
      "2 tbsp mayonnaise",
      "1 celery stalk, diced",
    ],
    instructions: [
      "Mix mayo and celery.",
      "Spread on bread and serve.",
    ],
  },
  {
    name: "Weeknight Chicken Rice Bowl",
    cuisine: "American",
    meal_type: "Dinner",
    ingredients: [
      "1 cup cooked rice",
      "1/2 cup cooked shredded chicken",
      "1 tbsp olive oil",
    ],
    instructions: [
      "Warm rice and chicken together.",
      "Drizzle with olive oil and serve.",
    ],
  },
  {
    name: "Easy Egg Fried Rice",
    cuisine: "Asian",
    meal_type: "Dinner",
    ingredients: [
      "1 cup cooked rice",
      "1 egg",
      "1 tbsp soy sauce",
      "1 tbsp olive oil",
    ],
    instructions: [
      "Scramble egg in oil.",
      "Add rice and soy sauce.",
      "Stir-fry 3 minutes and serve.",
    ],
  },
  {
    name: "Grilled Tomato Melt",
    cuisine: "American",
    meal_type: "Lunch",
    ingredients: [
      "2 slices bread",
      "1 tomato, sliced",
      "1 slice cheddar cheese",
      "1 tsp butter",
    ],
    instructions: [
      "Layer tomato and cheese on bread.",
      "Butter outside and grill until melted.",
    ],
  },
  {
    name: "Mini Caprese Plate",
    cuisine: "Italian",
    meal_type: "Snack",
    ingredients: [
      "1 tomato, sliced",
      "2 oz fresh mozzarella",
      "1 tbsp olive oil",
    ],
    instructions: [
      "Arrange tomato and mozzarella.",
      "Drizzle with olive oil.",
    ],
  },
  {
    name: "Honey Greek Yogurt",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["1 cup Greek yogurt", "1 tsp honey"],
    instructions: ["Add yogurt to a bowl.", "Drizzle with honey."],
  },
  {
    name: "Strawberry Yogurt Parfait",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["1 cup Greek yogurt", "1/2 cup strawberries"],
    instructions: ["Top yogurt with sliced strawberries."],
  },
  {
    name: "Cucumber Hummus Bites",
    cuisine: "Mediterranean",
    meal_type: "Snack",
    ingredients: ["1/2 cup hummus", "1 cup cucumber slices"],
    instructions: ["Serve hummus with cucumber for dipping."],
  },
  {
    name: "Light Tuna Lettuce Cups",
    cuisine: "American",
    meal_type: "Lunch",
    ingredients: [
      "1 can tuna in water, drained",
      "2 tbsp mayonnaise",
      "Lettuce leaves",
    ],
    instructions: [
      "Mix tuna and mayo.",
      "Spoon into lettuce leaves and serve.",
    ],
  },
  {
    name: "Broccoli Rice Pilaf",
    cuisine: "American",
    meal_type: "Side",
    ingredients: [
      "1 cup cooked rice",
      "1/2 cup broccoli florets",
      "1 tbsp olive oil",
    ],
    instructions: [
      "Steam broccoli.",
      "Mix with warm rice and olive oil.",
    ],
  },
  {
    name: "Teriyaki Glazed Rice",
    cuisine: "Japanese",
    meal_type: "Side",
    ingredients: [
      "1 cup cooked rice",
      "1 tbsp teriyaki sauce",
      "1 tbsp olive oil",
    ],
    instructions: [
      "Warm rice with olive oil.",
      "Drizzle teriyaki sauce and serve.",
    ],
  },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function randomDate() {
  const start = new Date("2022-01-01").getTime();
  const end = new Date("2025-06-01").getTime();
  const date = new Date(start + Math.random() * (end - start));
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

const recipes = JSON.parse(readFileSync(RECIPES_PATH, "utf8"));
const existingNames = new Set(recipes.map((recipe) => recipe.name.toLowerCase()));
let nextId = Math.max(...recipes.map((recipe) => recipe.id)) + 1;

const added = [];

for (const template of COMPANION_RECIPES) {
  if (existingNames.has(template.name.toLowerCase())) {
    continue;
  }

  recipes.push({
    id: nextId,
    name: template.name,
    ingredients: template.ingredients,
    instructions: template.instructions,
    cost: 0,
    cost_currency: "USD",
    preparation_time: 0,
    protein: 0,
    cuisine: template.cuisine,
    calories: 0,
    dietary_restrictions: "None",
    spice_level: "Mild",
    meal_type: template.meal_type,
    rating: 4.1,
    serving_size: 1,
    source_url: `https://www.savery.app/recipes/${slugify(template.name)}`,
    created_at: randomDate(),
    image_url:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
  });

  existingNames.add(template.name.toLowerCase());
  added.push(template.name);
  nextId += 1;
}

writeFileSync(RECIPES_PATH, `${JSON.stringify(recipes, null, 2)}\n`);

console.log(`Added ${added.length} companion recipes (${recipes.length} total).`);
added.forEach((name) => console.log(`  + ${name}`));
