import express from "express";
import SaveryMongoDB from "../db/MyMongoDB.js";

const saveryMongoDB = SaveryMongoDB();
const router = express.Router();

const DEMO_USER_ID = "demo-user";

router.get("/", async (req, res) => {
  try {
    const mealPlans = await saveryMongoDB.getMealPlans(DEMO_USER_ID);
    return res.json({ mealPlans });
  } catch (error) {
    console.error("Error getting meal plans", error);
    return res.status(500).json({ error: "Error getting meal plans" });
  }
});

router.post("/", async (req, res) => {
  try {
    const mealPlan = await saveryMongoDB.createMealPlan(DEMO_USER_ID, req.body);
    return res.status(201).json({ mealPlan });
  } catch (error) {
    console.error("Error creating meal plan", error);
    return res.status(500).json({ error: "Error creating meal plan" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const mealPlan = await saveryMongoDB.updateMealPlan(
      DEMO_USER_ID,
      req.params.id,
      req.body
    );

    return res.json({ mealPlan });
  } catch (error) {
    console.error("Error updating meal plan", error);
    return res.status(500).json({ error: "Error updating meal plan" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await saveryMongoDB.deleteMealPlan(DEMO_USER_ID, req.params.id);
    return res.json({ deleted: true });
  } catch (error) {
    console.error("Error deleting meal plan", error);
    return res.status(500).json({ error: "Error deleting meal plan" });
  }
});

export default router;