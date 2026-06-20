/**
 * Upgrades companion recipes (ids 501+) with realistic ingredients and instructions.
 * Run: node scripts/upgrade-companion-recipes.js
 * Then: node scripts/fix-recipes-data.js
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RECIPES_PATH = join(__dirname, "../data/recipes.json");

const UPGRADED_COMPANIONS = [
  {
    name: "Open-Faced Garden Tartine",
    cuisine: "French",
    meal_type: "Lunch",
    ingredients: [
      "2 slices bread",
      "2 tbsp mayonnaise",
      "Lettuce leaves",
      "1 tsp lemon juice",
      "Salt and pepper",
    ],
    instructions: [
      "Toast bread until crisp.",
      "Mix mayo with lemon juice, salt, and pepper.",
      "Spread on toast and top with fresh lettuce.",
    ],
  },
  {
    name: "Crispy Celery with Creamy Dip",
    cuisine: "American",
    meal_type: "Snack",
    ingredients: [
      "2 celery stalks",
      "3 tbsp mayonnaise",
      "1 tsp lemon juice",
      "1/4 tsp garlic powder",
      "Salt and pepper",
    ],
    instructions: [
      "Cut celery into long sticks and chill.",
      "Whisk mayo with lemon juice, garlic powder, salt, and pepper.",
      "Serve celery with the creamy dip on the side.",
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
    ingredients: [
      "2 cups lettuce",
      "1 tomato, sliced",
      "1 tbsp olive oil",
      "1 tsp lemon juice",
      "Salt and pepper",
    ],
    instructions: [
      "Tear lettuce into a bowl and add tomato slices.",
      "Whisk olive oil, lemon juice, salt, and pepper.",
      "Toss and serve immediately.",
    ],
  },
  {
    name: "Skillet Cheese Toast",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: [
      "2 slices bread",
      "2 slices cheddar cheese",
      "1 tbsp butter",
      "Pinch of paprika",
    ],
    instructions: [
      "Butter one side of each bread slice.",
      "Layer cheese between slices and cook in a skillet over medium heat.",
      "Flip once and cook until the cheese melts and the bread is golden.",
      "Sprinkle with paprika and serve hot.",
    ],
  },
  {
    name: "Skillet Garlic Bread",
    cuisine: "Italian",
    meal_type: "Snack",
    ingredients: [
      "2 slices bread",
      "2 tbsp butter",
      "2 cloves garlic, minced",
      "1 tbsp olive oil",
      "1 tbsp parsley",
      "Salt",
    ],
    instructions: [
      "Mix softened butter with garlic, olive oil, parsley, and salt.",
      "Spread on bread and cook in a skillet until crisp and fragrant.",
      "Serve warm.",
    ],
  },
  {
    name: "Honey Morning Porridge",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: [
      "1/2 cup rolled oats",
      "1 cup milk",
      "1 tbsp honey",
      "Pinch of cinnamon",
      "Pinch of salt",
    ],
    instructions: [
      "Simmer oats, milk, and salt for 5 minutes, stirring often.",
      "Remove from heat and stir in honey and cinnamon.",
      "Serve warm.",
    ],
  },
  {
    name: "Creamy Stovetop Oatmeal",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: [
      "1/2 cup rolled oats",
      "1 cup milk",
      "1 tsp honey",
      "1/4 tsp vanilla",
      "Pinch of salt",
    ],
    instructions: [
      "Bring milk and salt to a gentle simmer.",
      "Stir in oats and cook 5 minutes until creamy.",
      "Off heat, stir in honey and vanilla.",
    ],
  },
  {
    name: "Peanut Butter Toast",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: [
      "2 slices bread",
      "2 tbsp peanut butter",
      "1 tsp honey",
      "Pinch of cinnamon",
    ],
    instructions: [
      "Toast bread until crisp.",
      "Spread peanut butter and drizzle with honey.",
      "Finish with a pinch of cinnamon.",
    ],
  },
  {
    name: "Peanut Butter Banana Toast",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: [
      "2 slices bread",
      "2 tbsp peanut butter",
      "1 banana, sliced",
      "1 tsp honey",
      "Pinch of cinnamon",
    ],
    instructions: [
      "Toast bread and spread with peanut butter.",
      "Top with banana slices, honey, and cinnamon.",
      "Serve immediately.",
    ],
  },
  {
    name: "Rustic Tomato Soup",
    cuisine: "Italian",
    meal_type: "Lunch",
    ingredients: [
      "2 cups vegetable broth",
      "1 can diced tomatoes",
      "2 cloves garlic, minced",
      "1 tbsp olive oil",
      "1/4 cup fresh basil",
      "Salt and pepper",
    ],
    instructions: [
      "Sauté garlic in olive oil for 1 minute.",
      "Add tomatoes and broth; simmer 12 minutes.",
      "Stir in basil, season with salt and pepper, and serve.",
    ],
  },
  {
    name: "Tomato Basil Salad",
    cuisine: "Italian",
    meal_type: "Lunch",
    ingredients: [
      "1 can diced tomatoes, drained",
      "1/4 cup fresh basil",
      "1 tbsp olive oil",
      "1 tsp lemon juice",
      "Salt and pepper",
    ],
    instructions: [
      "Combine tomatoes and torn basil in a bowl.",
      "Whisk olive oil, lemon juice, salt, and pepper.",
      "Toss and let sit 5 minutes before serving.",
    ],
  },
  {
    name: "Garlic Herb Broth",
    cuisine: "American",
    meal_type: "Snack",
    ingredients: [
      "2 cups vegetable broth",
      "1 clove garlic, minced",
      "1 tbsp olive oil",
      "1/4 tsp Italian seasoning",
      "Salt and pepper",
    ],
    instructions: [
      "Warm broth in a small pot with garlic and Italian seasoning.",
      "Simmer 5 minutes, then stir in olive oil.",
      "Season with salt and pepper and serve hot.",
    ],
  },
  {
    name: "Garlic Lemon Rice",
    cuisine: "Mediterranean",
    meal_type: "Lunch",
    ingredients: [
      "1 cup cooked rice",
      "1 tbsp olive oil",
      "1 clove garlic, minced",
      "1 tsp lemon juice",
      "Salt and pepper",
    ],
    instructions: [
      "Warm rice in a pan with olive oil and garlic for 2 minutes.",
      "Off heat, add lemon juice, salt, and pepper.",
      "Fluff and serve.",
    ],
  },
  {
    name: "Steamed Broccoli Florets",
    cuisine: "American",
    meal_type: "Side",
    ingredients: [
      "2 cups broccoli florets",
      "1 tbsp olive oil",
      "1 clove garlic, minced",
      "1 tsp lemon juice",
      "Salt and pepper",
    ],
    instructions: [
      "Steam broccoli until bright green and tender, about 4 minutes.",
      "Toss with olive oil, garlic, lemon juice, salt, and pepper.",
      "Serve warm.",
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
      "1/4 tsp cumin",
      "2 tbsp salsa",
    ],
    instructions: [
      "Mash beans lightly with cumin.",
      "Spread beans and cheese on one tortilla; top with salsa and second tortilla.",
      "Cook in a skillet 2 to 3 minutes per side until crisp and melted.",
      "Slice and serve with extra salsa if desired.",
    ],
  },
  {
    name: "Crispy Cheese Taco",
    cuisine: "Mexican",
    meal_type: "Snack",
    ingredients: [
      "2 large flour tortillas",
      "1/3 cup shredded cheese",
      "2 tbsp salsa",
      "Pinch of cumin",
    ],
    instructions: [
      "Sprinkle cheese and cumin over one tortilla.",
      "Add salsa, fold, and cook in a dry skillet until golden on both sides.",
      "Cut into wedges and serve hot.",
    ],
  },
  {
    name: "Mediterranean Crudités",
    cuisine: "Mediterranean",
    meal_type: "Snack",
    ingredients: [
      "1/2 cup hummus",
      "1 cup carrot sticks",
      "1 tsp lemon juice",
      "Pinch of paprika",
      "1 tbsp olive oil",
    ],
    instructions: [
      "Spread hummus in a bowl and swirl with olive oil.",
      "Stir lemon juice through the center and sprinkle paprika on top.",
      "Serve with crisp carrot sticks for dipping.",
    ],
  },
  {
    name: "Sunny Eggs on Toast",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: [
      "2 slices bread",
      "2 eggs",
      "1 tbsp butter",
      "Salt and pepper",
      "Pinch of paprika",
    ],
    instructions: [
      "Toast bread and fry eggs in butter to your liking.",
      "Place an egg on each slice, season with salt, pepper, and paprika.",
      "Serve immediately.",
    ],
  },
  {
    name: "Tea Room Celery Sandwiches",
    cuisine: "British",
    meal_type: "Lunch",
    ingredients: [
      "4 slices bread",
      "3 tbsp mayonnaise",
      "2 celery stalks, finely diced",
      "1 tsp lemon juice",
      "Salt and pepper",
    ],
    instructions: [
      "Mix mayo, celery, lemon juice, salt, and pepper until well combined.",
      "Spread on two bread slices and close with the remaining bread.",
      "Trim crusts if desired, cut into small triangles, and serve chilled.",
    ],
  },
  {
    name: "Weeknight Chicken Rice Bowl",
    cuisine: "American",
    meal_type: "Dinner",
    ingredients: [
      "1 cup cooked rice",
      "3/4 cup cooked shredded chicken",
      "1 tbsp olive oil",
      "1 tbsp soy sauce",
      "1 clove garlic, minced",
      "Salt and pepper",
    ],
    instructions: [
      "Warm rice and chicken in a pan with olive oil and garlic.",
      "Stir in soy sauce and cook 2 minutes until heated through.",
      "Season with salt and pepper and serve in a bowl.",
    ],
  },
  {
    name: "Easy Egg Fried Rice",
    cuisine: "Asian",
    meal_type: "Dinner",
    ingredients: [
      "1 cup cooked rice",
      "2 eggs",
      "1 tbsp soy sauce",
      "1 tbsp olive oil",
      "1 clove garlic, minced",
      "1 green onion, sliced",
      "Salt and pepper",
    ],
    instructions: [
      "Scramble eggs in hot oil, then remove from the pan.",
      "Sauté garlic, add rice, and stir-fry 2 minutes.",
      "Return eggs, add soy sauce and green onion, and toss to combine.",
      "Season with salt and pepper and serve hot.",
    ],
  },
  {
    name: "Grilled Tomato Melt",
    cuisine: "American",
    meal_type: "Lunch",
    ingredients: [
      "2 slices bread",
      "1 tomato, sliced",
      "2 slices cheddar cheese",
      "1 tbsp butter",
      "1/4 tsp garlic powder",
      "Salt and pepper",
    ],
    instructions: [
      "Layer tomato and cheese on bread; season tomato with salt, pepper, and garlic powder.",
      "Butter the outside of the sandwich and grill until golden and melted.",
      "Rest 1 minute, then slice and serve.",
    ],
  },
  {
    name: "Mini Caprese Plate",
    cuisine: "Italian",
    meal_type: "Snack",
    ingredients: [
      "1 tomato, sliced",
      "3 oz fresh mozzarella, sliced",
      "1 tbsp olive oil",
      "1/4 cup fresh basil",
      "Salt and pepper",
    ],
    instructions: [
      "Alternate tomato, mozzarella, and basil on a plate.",
      "Drizzle with olive oil and season with salt and pepper.",
      "Serve at room temperature.",
    ],
  },
  {
    name: "Honey Greek Yogurt",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: [
      "1 cup Greek yogurt",
      "1 tbsp honey",
      "1/4 tsp vanilla",
      "Pinch of cinnamon",
    ],
    instructions: [
      "Spoon yogurt into a bowl.",
      "Drizzle with honey and swirl in vanilla and cinnamon.",
      "Serve chilled.",
    ],
  },
  {
    name: "Strawberry Yogurt Parfait",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: [
      "1 cup Greek yogurt",
      "1/2 cup strawberries, sliced",
      "2 tbsp granola",
      "1 tsp honey",
    ],
    instructions: [
      "Layer yogurt, strawberries, and granola in a glass.",
      "Drizzle honey over the top.",
      "Serve immediately.",
    ],
  },
  {
    name: "Cucumber Hummus Bites",
    cuisine: "Mediterranean",
    meal_type: "Snack",
    ingredients: [
      "1/2 cup hummus",
      "1 cup cucumber slices",
      "1 tsp lemon juice",
      "1 tbsp olive oil",
      "Pinch of paprika",
    ],
    instructions: [
      "Stir lemon juice into hummus and spread on a small plate.",
      "Top with olive oil and paprika.",
      "Serve with cucumber slices for scooping.",
    ],
  },
  {
    name: "Light Tuna Lettuce Cups",
    cuisine: "American",
    meal_type: "Lunch",
    ingredients: [
      "1 can tuna in water, drained",
      "2 tbsp mayonnaise",
      "1 celery stalk, diced",
      "1 tsp lemon juice",
      "Lettuce leaves",
      "Salt and pepper",
    ],
    instructions: [
      "Mix tuna, mayo, celery, lemon juice, salt, and pepper.",
      "Spoon filling into lettuce cups.",
      "Serve chilled.",
    ],
  },
  {
    name: "Broccoli Rice Pilaf",
    cuisine: "American",
    meal_type: "Side",
    ingredients: [
      "1 cup cooked rice",
      "1 cup broccoli florets",
      "1 tbsp olive oil",
      "1 clove garlic, minced",
      "1 tbsp soy sauce",
      "Salt and pepper",
    ],
    instructions: [
      "Steam broccoli until tender.",
      "Sauté garlic in olive oil, add rice and broccoli, and stir-fry 2 minutes.",
      "Stir in soy sauce, season, and serve warm.",
    ],
  },
  {
    name: "Teriyaki Glazed Rice",
    cuisine: "Japanese",
    meal_type: "Side",
    ingredients: [
      "1 cup cooked rice",
      "2 tbsp teriyaki sauce",
      "1 tbsp olive oil",
      "1 green onion, sliced",
      "1 tsp sesame seeds",
    ],
    instructions: [
      "Warm rice in a pan with olive oil.",
      "Add teriyaki sauce and toss until glossy.",
      "Top with green onion and sesame seeds before serving.",
    ],
  },
];

const recipes = JSON.parse(readFileSync(RECIPES_PATH, "utf8"));
const byName = new Map(UPGRADED_COMPANIONS.map((recipe) => [recipe.name, recipe]));

const RENAMES = {
  "Creamy Tea Toast": "Savory Lemon Herb Toast",
  "Quick Broth Sip": "Garlic Herb Broth",
  "Olive Oil Rice Bowl": "Garlic Lemon Rice",
};

let updated = 0;

for (const recipe of recipes) {
  if (recipe.id < 501) {
    continue;
  }

  if (RENAMES[recipe.name]) {
    recipe.name = RENAMES[recipe.name];
  }

  const upgrade = byName.get(recipe.name);
  if (!upgrade) {
    continue;
  }

  recipe.name = upgrade.name;
  recipe.ingredients = upgrade.ingredients;
  recipe.instructions = upgrade.instructions;
  recipe.cuisine = upgrade.cuisine;
  recipe.meal_type = upgrade.meal_type;
  recipe.rating = 4.4;
  updated += 1;
}

writeFileSync(RECIPES_PATH, `${JSON.stringify(recipes, null, 2)}\n`);
console.log(`Updated ${updated} companion recipes.`);
