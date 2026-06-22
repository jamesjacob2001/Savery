// plannerPage.js
// Handles all UI logic for the Meal Planner page (planner.html)
// Renders the weekly grid, handles slot selection, save, and clear

// ── Constants ──────────────────────────────────────────────────────────────

// Days of the week shown as columns
const DAYS = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

// Meal times shown as rows
const MEALS = ["Breakfast", "Lunch", "Dinner"];

// localStorage key — stores the current plan between page refreshes
const STORAGE_KEY = "savery_weekly_plan";

// ── State ──────────────────────────────────────────────────────────────────

/*
  planState is a flat object keyed by "MealTime-Day"
  e.g. { "Breakfast-Mon": "Chicken Pasta", "Dinner-Fri": "Beef Tacos" }
  Empty slots are simply absent from the object.
*/
let planState = {};

// Stores all recipes fetched from MongoDB.
// Used later to populate the recipe picker and calculate total cost.
let recipes = [];

// Keeps track of the currently selected meal plan.
let currentMealPlanId = null;

// Stores saved meal plans fetched from MongoDB.
let mealPlans = [];

// ── On Page Load ───────────────────────────────────────────────────────────

/**
 * Loads all recipes from the backend.
 * These recipes will be used for selecting meals and calculating cost.
 */
async function loadRecipes() {
  try {
    const response = await fetch("/api/recipes");

    if (!response.ok) {
      throw new Error("Failed to load recipes");
    }

    const data = await response.json();
    recipes = data.recipes || [];
  } catch (error) {
    console.error("Error loading recipes", error);
    recipes = [];
  }
}

/**
 * Loads all saved meal plans from MongoDB and fills the saved plans dropdown.
 */
async function loadMealPlans() {
  try {
    const response = await fetch("/api/planner");

    if (!response.ok) {
      throw new Error("Failed to load meal plans");
    }

    const data = await response.json();
    mealPlans = data.mealPlans || [];
    populateMealPlanSelect();
  } catch (error) {
    console.error("Error loading meal plans", error);
    mealPlans = [];
    populateMealPlanSelect();
  }
}

/**
 * Updates the saved meal plan dropdown based on mealPlans.
 */
function populateMealPlanSelect() {
  const select = document.getElementById("mealPlanSelect");

  select.innerHTML = `
    <option value="">Create New Meal Plan</option>
  `;

  mealPlans.forEach((plan) => {
    const option = document.createElement("option");
    option.value = plan._id;
    option.textContent = plan.title || "Untitled Meal Plan";
    select.appendChild(option);
  });
}

/**
 * Loads the selected saved meal plan into the current planner grid.
 */
function loadSelectedMealPlan() {
  const select = document.getElementById("mealPlanSelect");
  const selectedId = select.value;

  if (!selectedId) {
    currentMealPlanId = null;
    document.getElementById("mealPlanTitle").value = "";
    planState = {};
    renderGrid();
    updateCostBanner();
    return;
  }

  const selectedPlan = mealPlans.find((plan) => plan._id === selectedId);

  if (!selectedPlan) {
    return;
  }

  currentMealPlanId = selectedPlan._id;
  document.getElementById("mealPlanTitle").value = selectedPlan.title || "";
  planState = selectedPlan.meals || {};

  renderGrid();
  updateCostBanner();
}

document.addEventListener("DOMContentLoaded", async () => {
  // Load recipes and saved meal plans from MongoDB
  await loadRecipes();
  await loadMealPlans();

  // Build the planner grid and calculate the starting cost
  renderGrid();
  updateCostBanner();

  // Wire up planner action buttons
  document.getElementById("savePlanBtn").addEventListener("click", savePlan);
  document.getElementById("clearPlanBtn").addEventListener("click", clearPlan);

  // When a user selects a saved meal plan, load it into the grid
  document
    .getElementById("mealPlanSelect")
    .addEventListener("change", loadSelectedMealPlan);
});

// ── Render Grid ────────────────────────────────────────────────────────────

/**
 * Builds the tbody rows of the planner table.
 * One row per meal time; one cell per day plus a label cell.
 */
function renderGrid() {
  const tbody = document.getElementById("plannerBody");
  tbody.innerHTML = ""; // clear before re-render

  MEALS.forEach((meal) => {
    const row = document.createElement("tr");

    // First cell: meal label (Breakfast / Lunch / Dinner)
    const labelCell = document.createElement("td");
    labelCell.className = "meal-label";
    labelCell.textContent = meal;
    row.appendChild(labelCell);

    // One cell per day
    DAYS.forEach((day) => {
      const cell = document.createElement("td");
      cell.className = "planner-slot";
      cell.dataset.meal = meal;
      cell.dataset.day = day;

      // Fill cell content based on current state
      renderSlotContent(cell, meal, day);

      // Clicking an empty slot opens the recipe picker
      cell.addEventListener("click", (e) => {
        // Ignore clicks on the remove button inside a filled slot
        if (e.target.classList.contains("slot-remove-btn")) return;
        openSlotPicker(meal, day);
      });

      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });
}


/**
 * Finds a recipe by its numeric id.
 * Meal plans store recipe IDs, but the UI needs recipe names and costs.
 */
function getRecipeById(recipeId) {
  return recipes.find((recipe) => Number(recipe.id) === Number(recipeId));
}

/**
 * Fills a single slot cell with either the recipe name + remove button,
 * or the placeholder dots if the slot is empty.
 */
function renderSlotContent(cell, meal, day) {
  const key = `${meal}-${day}`;
  const recipeId = planState[key];
  const recipe = getRecipeById(recipeId);

  if (recipe) {
    // Slot is filled — show the recipe name and a remove button
    cell.innerHTML = `
      <span class="slot-recipe-name">${recipe.name}</span>
      <button class="slot-remove-btn" aria-label="Remove recipe">✕</button>
    `;

    
    // Wire the remove button
    cell.querySelector(".slot-remove-btn").addEventListener("click", () => {
      removeSlot(meal, day);
    });
  } else {
    // Slot is empty — show placeholder
    cell.innerHTML = `<span class="slot-placeholder">···</span>`;
  }
}

// ── Slot Picker Modal ──────────────────────────────────────────────────────

/**
 * Opens a simple modal that lets the user type a recipe name
 * and assign it to the chosen meal/day slot.
 */
function openSlotPicker(meal, day) {
  // Build modal markup
  const modal = document.createElement("div");
  modal.className = "slot-picker-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  modal.innerHTML = `
    <div class="slot-picker-box">
      <button class="slot-picker-close" aria-label="Close">&times;</button>
      <h3>Add Recipe — ${meal} / ${day}</h3>
      <input
        type="text"
        id="slotInput"
        placeholder="Type a recipe name..."
        autocomplete="off"
      />
      <button class="btn-savery-green" id="slotConfirmBtn">Add to Plan</button>
    </div>
  `;

  document.body.appendChild(modal);

  const input = modal.querySelector("#slotInput");
  input.focus();

  // Confirm button — assign the typed name to the slot
  modal.querySelector("#slotConfirmBtn").addEventListener("click", () => {
    const value = input.value.trim();
    if (value) {
      assignSlot(meal, day, value);
    }
    closeModal(modal);
  });

  // Allow Enter key to confirm
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = input.value.trim();
      if (value) assignSlot(meal, day, value);
      closeModal(modal);
    }
  });

  // Close button
  modal.querySelector(".slot-picker-close").addEventListener("click", () => {
    closeModal(modal);
  });

  // Click outside the box to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal);
  });
}

/** Removes the modal from the DOM */
function closeModal(modal) {
  modal.remove();
}

// ── State Mutations ────────────────────────────────────────────────────────

/** Assigns a recipe name to a slot and re-renders that cell */
function assignSlot(meal, day, recipeName) {
  planState[`${meal}-${day}`] = recipeName;
  refreshSlot(meal, day);
  updateCostBanner();
}

/** Removes a recipe from a slot and re-renders that cell */
function removeSlot(meal, day) {
  delete planState[`${meal}-${day}`];
  refreshSlot(meal, day);
  updateCostBanner();
}

/**
 * Re-renders a single slot cell without rebuilding the whole grid.
 * Finds the cell by its data attributes.
 */
function refreshSlot(meal, day) {
  const cell = document.querySelector(
    `.planner-slot[data-meal="${meal}"][data-day="${day}"]`
  );
  if (cell) {
    renderSlotContent(cell, meal, day);
    // Re-attach the cell click listener (innerHTML wipe removes old ones)
    cell.addEventListener("click", (e) => {
      if (e.target.classList.contains("slot-remove-btn")) return;
      openSlotPicker(meal, day);
    });
  }
}

// ── Cost Estimation ────────────────────────────────────────────────────────

/**
 * Updates the cost banner.
 * NOTE: When the backend is connected, this will fetch real recipe costs.
 * For now, each filled slot counts as a $5 placeholder cost.
 */
function updateCostBanner() {
  const filledSlots = Object.keys(planState).length;
  // Placeholder: $5 per meal slot — will be replaced with real data
  const estimatedCost = (filledSlots * 5).toFixed(2);
  document.getElementById("totalCost").textContent = `$${estimatedCost}`;
}

// ── Persistence (localStorage) ─────────────────────────────────────────────

/**
 * Saves the current planState to localStorage so it
 * survives page refreshes. Will later be replaced by a
 * POST to /api/plans when the backend is wired up.
 */
function savePlan() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(planState));
  alert("Meal plan saved!");
}

/** Loads a previously saved plan from localStorage */
function loadPlanFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      planState = JSON.parse(stored);
    } catch {
      // If stored data is corrupt, start fresh
      planState = {};
    }
  }
}

/** Clears all slots and removes the saved plan from localStorage */
function clearPlan() {
  if (!confirm("Clear the entire meal plan?")) return;
  planState = {};
  localStorage.removeItem(STORAGE_KEY);
  renderGrid();
  updateCostBanner();
}