import express from "express";

const recipes = [
  {
    id: 1,
    name: "Recipe 1",
    description: "Description 1",
    ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
    instructions: ["Instruction 1", "Instruction 2", "Instruction 3"],
  },
];
const router = express.Router();

router.get("/", (req, res) => {
  console.log("Recieved request for /api/recipes");
  res.json({ recipes });
});

export default router;
