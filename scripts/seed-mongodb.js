/**
 * Replaces all documents in Savery.Recipes with data/recipes.json.
 * Run: node scripts/seed-mongodb.js
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { MongoClient } from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RECIPES_PATH = join(__dirname, "../data/recipes.json");
const DB_NAME = "Savery";
const COLLECTION = "Recipes";
const URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

const recipes = JSON.parse(readFileSync(RECIPES_PATH, "utf8"));

if (recipes.length < 1000) {
  console.error(
    `Expected at least 1000 recipes in ${RECIPES_PATH}, found ${recipes.length}.`
  );
  console.error("Run: node scripts/build-unique-recipes.js && node scripts/fix-recipes-data.js");
  process.exit(1);
}

const client = new MongoClient(URI);

try {
  await client.connect();
  const collection = client.db(DB_NAME).collection(COLLECTION);

  await collection.deleteMany({});
  const result = await collection.insertMany(recipes);

  const count = await collection.countDocuments();
  console.log(`Seeded ${result.insertedCount} recipes into ${DB_NAME}.${COLLECTION}`);
  console.log(`Collection now contains ${count} documents.`);
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
} finally {
  await client.close();
}
