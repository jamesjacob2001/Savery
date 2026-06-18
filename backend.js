import express from "express";
import recipesRouter from "./routes/recipeApi.js";

console.log("Savery server starting...");
console.log("Hello from the backend...");

// check if port is in environment variables, if not use 3000
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("frontend"));

app.use("/api/recipes", recipesRouter);
// app.use("/api/planner", plannerRouter);
// app.use("/api/favorites", favoritesRouter);

// this function is being called by express to start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

