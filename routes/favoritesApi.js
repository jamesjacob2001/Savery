import express from "express";
import SaveryMongoDB from "../db/MyMongoDB.js";

const saveryMongoDB = SaveryMongoDB();
const router = express.Router();

const DEMO_USER_ID = "demo-user";

function parseRecipeId(value) {
  const recipeId = Number(value);

  if (!Number.isInteger(recipeId) || recipeId < 1) {
    return null;
  }

  return recipeId;
}

router.get("/", async (req, res) => {
  try {
    const favorites = await saveryMongoDB.getFavorites(DEMO_USER_ID);
    return res.json({ favorites });
  } catch (error) {
    console.error("Error getting favorites", error);
    return res.status(500).json({ error: "Error getting favorites" });
  }
});

router.post("/", async (req, res) => {
  try {
    const recipeId = parseRecipeId(req.body.recipeId);

    if (recipeId == null) {
      return res.status(400).json({ error: "Valid recipeId is required." });
    }

    const favorite = await saveryMongoDB.createFavorite(DEMO_USER_ID, recipeId);

    return res.status(201).json({ favorite });
  } catch (error) {
    console.error("Error creating favorite", error);
    return res.status(500).json({ error: "Error creating favorite" });
  }
});

router.delete("/:recipeId", async (req, res) => {
  try {
    const recipeId = parseRecipeId(req.params.recipeId);

    if (recipeId == null) {
      return res.status(400).json({ error: "Valid recipeId is required." });
    }

    await saveryMongoDB.deleteFavorite(DEMO_USER_ID, recipeId);

    return res.json({ deleted: true });
  } catch (error) {
    console.error("Error deleting favorite", error);
    return res.status(500).json({ error: "Error deleting favorite" });
  }
});

export default router;