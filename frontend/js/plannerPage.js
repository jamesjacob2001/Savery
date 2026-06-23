// plannerPage.js
// Handles all UI logic for the Meal Planner page (planner.html)
// Renders the weekly grid, handles slot selection, save, and clear

// ── Constants ──────────────────────────────────────────────────────────────

// Days of the week shown as columns
const DAYS = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

// Meal times shown as rows
const MEALS = ["Breakfast", "Lunch", "Dinner"];


// ── State ──────────────────────────────────────────────────────────────────

/*
  planState is a flat object keyed by "MealTime-Day"
 e.g. { "Breakfast-Mon": 12, "Dinner-Fri": 45 }
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

// Keeps track of the active filters inside the recipe picker modal.
let pickerFilterState = {
  cuisines: new Set(),
  mealTypes: new Set(),
  dietary: new Set(),
  maxTime: null,
};

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getUniqueValues(recipeList, field) {
  return [...new Set(recipeList.map((recipe) => recipe[field]).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b)
  );
}

function buildPickerFilterOptions(modal, containerId, field, groupName) {
  const container = modal.querySelector(`#${containerId}`);
  const values = getUniqueValues(recipes, field);

  if (!container) {
    return;
  }

  container.innerHTML = values
    .map(
      (value) => `
        <label class="filter-chip">
          <input type="checkbox" name="${groupName}" value="${escapeHtml(value)}" />
          ${escapeHtml(value)}
        </label>
      `
    )
    .join("");
}

function initializePickerFilterPanel(modal) {
  buildPickerFilterOptions(modal, "pickerCuisineOptions", "cuisine", "cuisine");
  buildPickerFilterOptions(modal, "pickerMealOptions", "meal_type", "meal");
  buildPickerFilterOptions(
    modal,
    "pickerDietOptions",
    "dietary_restrictions",
    "diet"
  );
}

function readCheckedValues(modal, name) {
  return new Set(
    [...modal.querySelectorAll(`input[name="${name}"]:checked`)].map(
      (input) => input.value
    )
  );
}

function syncPickerFilterState(modal) {
  pickerFilterState.cuisines = readCheckedValues(modal, "cuisine");
  pickerFilterState.mealTypes = readCheckedValues(modal, "meal");
  pickerFilterState.dietary = readCheckedValues(modal, "diet");

  const maxTimeValue = modal.querySelector("#pickerFilterMaxTime").value;
  pickerFilterState.maxTime = maxTimeValue ? Number(maxTimeValue) : null;
}

function getTotalTime(recipe) {
  if (recipe.total_time != null) {
    return recipe.total_time;
  }
  const prep = recipe.preparation_time ?? 0;
  const cook = recipe.cook_time ?? 0;
  return prep + cook || null;
}

function recipeMatchesPickerFilters(recipe) {
  if (
    pickerFilterState.cuisines.size > 0 &&
    !pickerFilterState.cuisines.has(recipe.cuisine)
  ) {
    return false;
  }

  if (
    pickerFilterState.mealTypes.size > 0 &&
    !pickerFilterState.mealTypes.has(recipe.meal_type)
  ) {
    return false;
  }

  if (
    pickerFilterState.dietary.size > 0 &&
    !pickerFilterState.dietary.has(recipe.dietary_restrictions)
  ) {
    return false;
  }

  if (pickerFilterState.maxTime != null) {
    const totalTime = getTotalTime(recipe);
    if (totalTime == null || totalTime > pickerFilterState.maxTime) {
      return false;
    }
  }

  return true;
}

function getFilteredPickerRecipes() {
  return recipes.filter((recipe) => recipeMatchesPickerFilters(recipe));
}

function renderPickerRecipeOptions(modal) {
  const select = modal.querySelector("#slotRecipeSelect");
  const summary = modal.querySelector("#pickerFilterSummary");
  const confirmButton = modal.querySelector("#slotConfirmBtn");
  const filteredRecipes = getFilteredPickerRecipes();

  select.innerHTML = `
    <option value="">${
      filteredRecipes.length > 0 ? "Choose a recipe..." : "No recipes match these filters"
    }</option>
    ${filteredRecipes
      .map(
        (recipe) =>
          `<option value="${recipe.id}">${escapeHtml(recipe.name)} - $${Number(
            recipe.cost_per_serving ?? recipe.cost ?? 0
          ).toFixed(2)}/serving</option>`
      )
      .join("")}
  `;

  if (summary) {
    summary.textContent = `${filteredRecipes.length} recipe${filteredRecipes.length === 1 ? "" : "s"} available`;
  }

  if (confirmButton) {
    confirmButton.disabled = filteredRecipes.length === 0;
  }
}

function setupPickerFilterControls(modal) {
  modal.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.addEventListener("change", () => {
      syncPickerFilterState(modal);
      renderPickerRecipeOptions(modal);
    });
  });

  const maxTimeInput = modal.querySelector("#pickerFilterMaxTime");
  if (maxTimeInput) {
    maxTimeInput.addEventListener("input", () => {
      syncPickerFilterState(modal);
      renderPickerRecipeOptions(modal);
    });
  }

  const clearButton = modal.querySelector("#pickerFilterClearBtn");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      pickerFilterState.cuisines.clear();
      pickerFilterState.mealTypes.clear();
      pickerFilterState.dietary.clear();
      pickerFilterState.maxTime = null;

      modal.querySelectorAll("#pickerFilterPanel input[type='checkbox']").forEach((input) => {
        input.checked = false;
      });
      maxTimeInput.value = "";
      renderPickerRecipeOptions(modal);
    });
  }
}

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
  document
    .getElementById("savePlanBtn")
    .addEventListener("click", savePlan);


  document
    .getElementById("clearPlanBtn")
    .addEventListener("click", clearPlan);

  // When a user selects a saved meal plan, load it into the grid
  document
    .getElementById("mealPlanSelect")
    .addEventListener("change", loadSelectedMealPlan);

  document
    .getElementById("updatePlanBtn")
    .addEventListener("click", updatePlan);

  document
    .getElementById("deletePlanBtn")
    .addEventListener("click", deletePlan);
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

      renderSlotContent(cell, meal, day);
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
 * Fills a single slot cell with buttons to add, change, or remove a recipe.
 */
function renderSlotContent(cell, meal, day) {
  const key = `${meal}-${day}`;
  const recipeId = planState[key];
  const recipe = getRecipeById(recipeId);

  cell.innerHTML = "";

  if (recipe) {
    const chooseBtn = document.createElement("button");
    chooseBtn.type = "button";
    chooseBtn.className = "slot-choose-btn";
    chooseBtn.textContent = recipe.name;
    chooseBtn.setAttribute(
      "aria-label",
      `Change recipe for ${meal} on ${day}`
    );
    chooseBtn.addEventListener("click", () => openSlotPicker(meal, day));

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "slot-remove-btn";
    removeBtn.setAttribute("aria-label", "Remove recipe");
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => removeSlot(meal, day));

    cell.appendChild(chooseBtn);
    cell.appendChild(removeBtn);
  } else {
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "slot-add-btn";
    addBtn.textContent = "···";
    addBtn.setAttribute("aria-label", `Add recipe for ${meal} on ${day}`);
    addBtn.addEventListener("click", () => openSlotPicker(meal, day));
    cell.appendChild(addBtn);
  }
}

// ── Slot Picker Modal ──────────────────────────────────────────────────────

/**
 * Opens a modal that lets the user select an existing recipe from MongoDB.
 * The planner stores the recipe ID, not the recipe name.
 */
function openSlotPicker(meal, day) {
  pickerFilterState = {
    cuisines: new Set(),
    mealTypes: new Set(),
    dietary: new Set(),
    maxTime: null,
  };

  const modal = document.createElement("div");
  modal.className = "slot-picker-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  modal.innerHTML = `
    <div class="slot-picker-box">
      <button type="button" class="slot-picker-close" aria-label="Close">&times;</button>
      <h3>Add Recipe — ${meal} / ${day}</h3>

      <div id="pickerFilterPanel">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <strong>Filter recipes</strong>
          <button type="button" class="filter-clear-btn" id="pickerFilterClearBtn">Clear</button>
        </div>

        <div class="filter-group">
          <label class="filter-group-label">Cuisine</label>
          <div class="filter-options" id="pickerCuisineOptions"></div>
        </div>

        <div class="filter-group">
          <label class="filter-group-label">Meal Type</label>
          <div class="filter-options" id="pickerMealOptions"></div>
        </div>

        <div class="filter-group">
          <label class="filter-group-label">Diet</label>
          <div class="filter-options" id="pickerDietOptions"></div>
        </div>

        <div class="filter-group">
          <label class="filter-group-label" for="pickerFilterMaxTime">Max prep + cook time (min)</label>
          <input type="number" id="pickerFilterMaxTime" class="filter-select" min="0" placeholder="Any time" />
        </div>
      </div>

      <select id="slotRecipeSelect" class="form-select mt-3"></select>
      <p class="small text-muted mt-2" id="pickerFilterSummary"></p>
      <button class="btn-savery-green mt-2" id="slotConfirmBtn">Add to Plan</button>
    </div>
  `;

  document.body.appendChild(modal);

  initializePickerFilterPanel(modal);
  syncPickerFilterState(modal);
  renderPickerRecipeOptions(modal);
  setupPickerFilterControls(modal);

  const select = modal.querySelector("#slotRecipeSelect");
  select.focus();

  modal.querySelector("#slotConfirmBtn").addEventListener("click", () => {
    const recipeId = Number(select.value);

    if (recipeId) {
      assignSlot(meal, day, recipeId);
    }

    closeModal(modal);
  });

  modal.querySelector(".slot-picker-close").addEventListener("click", () => {
    closeModal(modal);
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
}

/** Removes the modal from the DOM */
function closeModal(modal) {
  modal.remove();
}

// ── State Mutations ────────────────────────────────────────────────────────

/** Assigns a recipe ID to a slot and re-renders that cell */
function assignSlot(meal, day, recipeId) {
  planState[`${meal}-${day}`] = recipeId;
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
  }
}

// ── Cost Estimation ────────────────────────────────────────────────────────

/**
 * Updates the estimated weekly cost using the real recipe costs.
 * Each filled slot stores a recipe ID, so we look up each recipe
 * and add its cost per serving.
 */
function updateCostBanner() {
  const recipeIds = Object.values(planState);

  const estimatedCost = recipeIds.reduce((total, recipeId) => {
    const recipe = getRecipeById(recipeId);

    if (!recipe) {
      return total;
    }

    const cost =
      recipe.cost_per_serving ??
      recipe.cost ??
      0;

    return total + Number(cost);
  }, 0);

  document.getElementById("totalCost").textContent =
    `$${estimatedCost.toFixed(2)}`;
}

// ── MEAL PLAN CRUD ─────────────────────────────────────────────

/**
 * Saves the current planner grid as a new meal plan in MongoDB.
 * This always creates a new plan, even if another plan is selected.
 */
async function savePlan() {
  const titleInput = document.getElementById("mealPlanTitle");
  const title = titleInput.value.trim();

  if (!title) {
    alert("Please enter a meal plan name.");
    return;
  }

  try {
    const response = await fetch("/api/planner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        meals: planState,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save meal plan");
    }

    const data = await response.json();
    const newPlan = data.mealPlan;

    currentMealPlanId = newPlan._id;

    await loadMealPlans();

    document.getElementById("mealPlanSelect").value = currentMealPlanId;

    alert("Meal plan saved!");
  } catch (error) {
    console.error("Error saving meal plan", error);
    alert("Could not save meal plan. Please try again.");
  }
}

/**
 * Updates the currently selected meal plan in MongoDB.
 */
async function updatePlan() {
  if (!currentMealPlanId) {
    alert("Please select a meal plan to update.");
    return;
  }

  const title = document.getElementById("mealPlanTitle").value.trim();

  try {
    const response = await fetch(`/api/planner/${currentMealPlanId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        meals: planState,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update meal plan");
    }

    await loadMealPlans();
    document.getElementById("mealPlanSelect").value = currentMealPlanId;

    alert("Meal plan updated!");
  } catch (error) {
    console.error("Error updating meal plan", error);
    alert("Could not update meal plan.");
  }
}

/**
 * Deletes the currently selected meal plan from MongoDB.
 */
async function deletePlan() {
  if (!currentMealPlanId) {
    alert("Please select a meal plan to delete.");
    return;
  }

  const confirmed = confirm(
    "Are you sure you want to delete this meal plan?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/planner/${currentMealPlanId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete meal plan");
    }

    // Reset the planner to a blank state
    currentMealPlanId = null;
    planState = {};

    document.getElementById("mealPlanTitle").value = "";
    document.getElementById("mealPlanSelect").value = "";

    renderGrid();
    updateCostBanner();

    // Refresh the dropdown
    await loadMealPlans();

    alert("Meal plan deleted.");
  } catch (error) {
    console.error("Error deleting meal plan", error);
    alert("Could not delete meal plan.");
  }
}


/** Clears the current planner grid without deleting any saved meal plans. */
function clearPlan() {
  if (!confirm("Clear the entire meal plan?")) return;
  planState = {};
  renderGrid();
  updateCostBanner();
}