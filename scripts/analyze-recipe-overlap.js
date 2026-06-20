/**
 * Analyzes ingredient package overlap across recipes.json.
 * Run: node scripts/analyze-recipe-overlap.js
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { getLeftoverRecommendations } from "../frontend/js/recommendations.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RECIPES_PATH = join(__dirname, "../data/recipes.json");

const recipes = JSON.parse(readFileSync(RECIPES_PATH, "utf8"));

function getPackageKeys(recipe) {
  return [
    ...new Set(
      (recipe.ingredient_costs || [])
        .filter((line) => line.package_key)
        .map((line) => line.package_key)
    ),
  ];
}

const pkgFreq = new Map();
for (const recipe of recipes) {
  for (const key of getPackageKeys(recipe)) {
    pkgFreq.set(key, (pkgFreq.get(key) || 0) + 1);
  }
}

const recStats = recipes.map((recipe) => {
  const recs = getLeftoverRecommendations(recipe, recipes, 99);
  return {
    name: recipe.name,
    packages: getPackageKeys(recipe).length,
    recommendations: recs.length,
    zeroExtra: recs.filter((item) => item.extraKeys.length === 0).length,
  };
});

recStats.sort((a, b) => a.recommendations - b.recommendations);

const noRecs = recStats.filter((item) => item.recommendations === 0);
const withRecs = recipes.length - noRecs.length;

console.log(`Recipes: ${recipes.length}`);
console.log(`With leftover recommendations: ${withRecs}`);
console.log(`With zero recommendations: ${noRecs.length}`);
console.log(
  `Average recommendations per recipe: ${(
    recStats.reduce((sum, item) => sum + item.recommendations, 0) / recipes.length
  ).toFixed(1)}`
);

console.log("\nMost common packages:");
[...pkgFreq.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .forEach(([key, count]) => console.log(`  ${count} recipes — ${key}`));

console.log("\nSample recipes with no overlap matches:");
noRecs.slice(0, 12).forEach((item) => console.log(`  ${item.name}`));

console.log("\nSample recipes with good overlap:");
recStats
  .filter((item) => item.recommendations >= 3)
  .slice(-10)
  .forEach((item) =>
    console.log(`  ${item.recommendations} matches — ${item.name}`)
  );
