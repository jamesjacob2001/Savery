import express from "express";
import SaveryMongoDB from "../db/MyMongoDB.js";

const saveryMongoDB = SaveryMongoDB();
const router = express.Router();

function parseStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => String(item).trim()).filter(Boolean);
}

function buildRecipeDocument(body, id) {
  const ingredients = parseStringArray(body.ingredients);
  const instructions = parseStringArray(body.instructions);
  const cost = Number(body.cost);
  const preparationTime = Number(body.preparation_time);
  const cookTime = Number(body.cook_time ?? 0);
  const servingSize = Number(body.serving_size ?? 1);
  const costPerServing = cost / servingSize;
  const shoppingLow = Math.floor(cost);
  const shoppingHigh = Math.ceil(cost);

  return {
    id,
    name: String(body.name).trim(),
    ingredients,
    instructions,
    cost,
    cost_currency: "USD",
    cost_total: cost,
    cost_per_serving: Number(costPerServing.toFixed(2)),
    preparation_time: preparationTime,
    cook_time: cookTime,
    total_time: preparationTime + cookTime,
    serving_size: servingSize,
    protein: Number(body.protein),
    cuisine: String(body.cuisine).trim(),
    meal_type: String(body.meal_type).trim(),
    dietary_restrictions: body.dietary_restrictions || "None",
    spice_level: body.spice_level || "Mild",
    image_url: body.image_url || "",
    ingredient_costs: ingredients.map((item) => ({
      item,
      cost: 0,
      note: "User submitted",
    })),
    shopping_cost: Number(cost.toFixed(2)),
    shopping_cost_low: shoppingLow,
    shopping_cost_high: shoppingHigh,
    remaining_value: 0,
    source_url: "user-submitted",
    created_at: new Date().toLocaleDateString("en-US"),
  };
}

function validateRecipeBody(body) {
  const ingredients = parseStringArray(body.ingredients);
  const instructions = parseStringArray(body.instructions);
  const cost = Number(body.cost);
  const preparationTime = Number(body.preparation_time);
  const cookTime = Number(body.cook_time ?? 0);
  const servingSize = Number(body.serving_size ?? 1);
  const protein = Number(body.protein);

  if (!body.name || !String(body.name).trim()) {
    return "Recipe name is required.";
  }

  if (ingredients.length === 0) {
    return "At least one ingredient is required.";
  }

  if (instructions.length === 0) {
    return "At least one instruction is required.";
  }

  if (!Number.isFinite(cost) || cost < 0) {
    return "Valid cost is required.";
  }

  if (!Number.isFinite(preparationTime) || preparationTime < 0) {
    return "Valid prep time is required.";
  }

  if (!Number.isFinite(cookTime) || cookTime < 0) {
    return "Valid cook time is required.";
  }

  if (!Number.isFinite(servingSize) || servingSize < 1) {
    return "Servings must be at least 1.";
  }

  if (!body.cuisine || !String(body.cuisine).trim()) {
    return "Cuisine is required.";
  }

  if (!body.meal_type || !String(body.meal_type).trim()) {
    return "Meal type is required.";
  }

  if (!Number.isFinite(protein) || protein < 0) {
    return "Valid protein amount is required.";
  }

  return null;
}

router.get("/", async (req, res) => {
  try {
    console.log("Recieved request for /api/recipes");
    const recipes = await saveryMongoDB.getRecipes();
    res.json({ recipes });
  } catch (error) {
    console.error("Error getting recipes", error);
    return res.status(500).json({ error: "Error getting recipes" });
  }
});

router.post("/", async (req, res) => {
  try {
    const validationError = validateRecipeBody(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const id = await saveryMongoDB.getNextRecipeId();
    const recipeDoc = buildRecipeDocument(req.body, id);
    const recipe = await saveryMongoDB.createRecipe(recipeDoc);

    return res.status(201).json({ recipe });
  } catch (error) {
    console.error("Error creating recipe", error);
    return res.status(500).json({ error: "Error creating recipe" });
  }
});

export default router;
