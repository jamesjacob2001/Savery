function parseLines(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function showFieldError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.classList.toggle("hidden", !message);
}

function hideMessages() {
  document.getElementById("formError").classList.add("hidden");
  document.getElementById("formSuccess").classList.add("hidden");
}

function showError(message) {
  const el = document.getElementById("formError");
  el.textContent = message;
  el.classList.remove("hidden");
  document.getElementById("formSuccess").classList.add("hidden");
}

function showSuccess(recipe) {
  const el = document.getElementById("formSuccess");
  const link =
    recipe?.id != null
      ? `index.html?highlight=${recipe.id}`
      : "index.html";
  el.innerHTML = `Recipe saved! <a href="${link}">View recipes</a>`;
  el.classList.remove("hidden");
  document.getElementById("formError").classList.add("hidden");
}

function readFormPayload(form) {
  const data = new FormData(form);
  const ingredients = parseLines(data.get("ingredients") || "");
  const instructions = parseLines(data.get("instructions") || "");

  return {
    name: String(data.get("name") || "").trim(),
    ingredients,
    instructions,
    cost: Number(data.get("cost")),
    preparation_time: Number(data.get("preparation_time")),
    cook_time: Number(data.get("cook_time") || 0),
    serving_size: Number(data.get("serving_size") || 1),
    image_url: String(data.get("image_url") || "").trim(),
    cuisine: String(data.get("cuisine") || "").trim(),
    meal_type: String(data.get("meal_type") || "").trim(),
    protein: Number(data.get("protein")),
    dietary_restrictions: String(data.get("dietary_restrictions") || "None"),
    spice_level: String(data.get("spice_level") || "Mild"),
  };
}

function validatePayload(payload) {
  showFieldError("ingredientsHint", "");
  showFieldError("instructionsHint", "");

  if (!payload.name) {
    return "Recipe name is required.";
  }

  if (payload.ingredients.length === 0) {
    showFieldError("ingredientsHint", "Add at least one ingredient (one per line).");
    return "Ingredients are required.";
  }

  if (payload.instructions.length === 0) {
    showFieldError(
      "instructionsHint",
      "Add at least one instruction step (one per line)."
    );
    return "Instructions are required.";
  }

  if (!Number.isFinite(payload.cost) || payload.cost < 0) {
    return "Enter a valid cost.";
  }

  if (
    !Number.isFinite(payload.preparation_time) ||
    payload.preparation_time < 0
  ) {
    return "Enter a valid prep time.";
  }

  if (!Number.isFinite(payload.cook_time) || payload.cook_time < 0) {
    return "Enter a valid cook time.";
  }

  if (!Number.isFinite(payload.serving_size) || payload.serving_size < 1) {
    return "Servings must be at least 1.";
  }

  if (!payload.cuisine) {
    return "Select a cuisine.";
  }

  if (!payload.meal_type) {
    return "Select a meal type.";
  }

  if (!Number.isFinite(payload.protein) || payload.protein < 0) {
    return "Enter a valid protein amount.";
  }

  return null;
}

async function submitRecipe(payload) {
  const response = await fetch("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Failed to save recipe.");
  }

  return data.recipe;
}

async function handleSubmit(event) {
  event.preventDefault();
  hideMessages();

  const form = event.target;
  const submitBtn = document.getElementById("submitBtn");
  const payload = readFormPayload(form);
  const error = validatePayload(payload);

  if (error) {
    showError(error);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting…";

  try {
    const recipe = await submitRecipe(payload);
    showSuccess(recipe);
    form.reset();
    document.getElementById("recipeCookTime").value = "0";
    document.getElementById("recipeServings").value = "1";
  } catch (err) {
    showError(err.message || "Failed to save recipe. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("createRecipeForm")
    .addEventListener("submit", handleSubmit);
});
