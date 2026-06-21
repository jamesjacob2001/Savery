/**
 * Builds a dataset of 1000 unique college-budget recipes.
 * Run: node scripts/build-unique-recipes.js
 * Then: node scripts/fix-recipes-data.js
 * Then: node scripts/seed-mongodb.js
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  BREAKFAST_TEMPLATES,
  SAUCE_STYLES,
  PROTEINS,
  GRAINS,
  VEGETABLES,
  PASTA_NAMES,
  SANDWICH_NAMES,
  SNACK_NAMES,
  DESSERT_NAMES,
  SOUP_TEMPLATES,
  buildBowlRecipe,
  buildSoupRecipe,
  buildPastaRecipe,
  buildSandwichRecipe,
  buildSnackRecipe,
  buildDessertRecipe,
  buildTacoRecipe,
  buildStirFryRecipe,
  buildOnePotRecipe,
  buildBreakfastVariation,
} from "./recipe-generators.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RECIPES_PATH = join(__dirname, "../data/recipes.json");
const SEEDS_PATH = join(__dirname, "../data/recipe-seeds.json");
const TARGET_COUNT = 1000;

function recipeKey(recipe) {
  return JSON.stringify({
    name: recipe.name.toLowerCase(),
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
  });
}

function randomDate() {
  const start = new Date("2022-01-01").getTime();
  const end = new Date("2025-06-01").getTime();
  const date = new Date(start + Math.random() * (end - start));
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function addRecipe(catalog, seen, recipe) {
  const key = recipeKey(recipe);
  if (seen.has(key) || seen.has(recipe.name.toLowerCase())) {
    return false;
  }
  seen.add(key);
  seen.add(recipe.name.toLowerCase());
  catalog.push(recipe);
  return true;
}

function generateCatalog() {
  const catalog = [];
  const seen = new Set();

  const seeds = JSON.parse(readFileSync(SEEDS_PATH, "utf8"));
  for (const recipe of seeds) {
    addRecipe(catalog, seen, recipe);
  }

  for (const recipe of BREAKFAST_TEMPLATES) {
    addRecipe(catalog, seen, { ...recipe, serving_size: 1, rating: 4.2 });
  }

  for (const name of PASTA_NAMES) {
    addRecipe(catalog, seen, { ...buildPastaRecipe(name), serving_size: 1, rating: 4.2 });
  }

  for (const name of SANDWICH_NAMES) {
    addRecipe(catalog, seen, { ...buildSandwichRecipe(name), serving_size: 1, rating: 4.2 });
  }

  for (const name of SNACK_NAMES) {
    addRecipe(catalog, seen, { ...buildSnackRecipe(name), serving_size: 1, rating: 4.2 });
  }

  for (const name of DESSERT_NAMES) {
    addRecipe(catalog, seen, { ...buildDessertRecipe(name), serving_size: 1, rating: 4.2 });
  }

  for (const template of SOUP_TEMPLATES) {
    addRecipe(catalog, seen, {
      ...buildSoupRecipe(template, "Soup"),
      serving_size: 1,
      rating: 4.2,
    });
    addRecipe(catalog, seen, {
      ...buildSoupRecipe(template, "Stew"),
      serving_size: 1,
      rating: 4.2,
    });
  }

  outer: for (const sauce of SAUCE_STYLES) {
    for (const protein of PROTEINS) {
      for (const grain of GRAINS) {
        for (const vegetable of VEGETABLES) {
          if (catalog.length >= TARGET_COUNT) {
            break outer;
          }
          addRecipe(catalog, seen, {
            ...buildBowlRecipe(sauce, protein, grain, vegetable),
            serving_size: 1,
            rating: 4.2,
          });
        }
      }
    }
  }

  let index = 0;
  while (catalog.length < TARGET_COUNT) {
    const generators = [
      () => buildBreakfastVariation(index),
      () => buildTacoRecipe(index),
      () => buildStirFryRecipe(index),
      () => buildOnePotRecipe(index),
    ];
    const recipe = {
      ...generators[index % generators.length](),
      serving_size: 1,
      rating: 4.2,
    };
    addRecipe(catalog, seen, recipe);
    index += 1;
    if (index > TARGET_COUNT * 20) {
      throw new Error("Unable to generate enough unique recipes.");
    }
  }

  return catalog.slice(0, TARGET_COUNT);
}

const catalog = generateCatalog();

const recipes = catalog.map((recipe, index) => ({
  id: index + 1,
  name: recipe.name,
  ingredients: recipe.ingredients,
  instructions: recipe.instructions,
  cost: 0,
  cost_currency: "USD",
  preparation_time: 0,
  protein: 0,
  cuisine: recipe.cuisine,
  calories: 0,
  dietary_restrictions: recipe.dietary_restrictions,
  spice_level: recipe.spice_level,
  meal_type: recipe.meal_type,
  rating: Math.round((recipe.rating ?? 4.2) * 10) / 10,
  serving_size: recipe.serving_size ?? 1,
  source_url: `https://www.savery.app/recipes/${slugify(recipe.name)}`,
  created_at: randomDate(),
  image_url: "",
}));

writeFileSync(RECIPES_PATH, `${JSON.stringify(recipes, null, 2)}\n`);

const uniqueNames = new Set(recipes.map((recipe) => recipe.name));
const uniqueContent = new Set(
  recipes.map((recipe) =>
    JSON.stringify({ ingredients: recipe.ingredients, instructions: recipe.instructions })
  )
);

console.log(`Wrote ${recipes.length} recipes to ${RECIPES_PATH}`);
console.log(`Unique names: ${uniqueNames.size}`);
console.log(`Unique ingredient/instruction sets: ${uniqueContent.size}`);

if (uniqueNames.size !== TARGET_COUNT || uniqueContent.size !== TARGET_COUNT) {
  console.warn("Warning: duplicates detected in generated dataset.");
  process.exitCode = 1;
}
