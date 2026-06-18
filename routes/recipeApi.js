import express from "express";
import SaveryMongoDB from "../db/MelissaMongoDB.js";

const saveryMongoDB = SaveryMongoDB();
const router = express.Router();

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

export default router;
