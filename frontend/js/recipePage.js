import {
  getLeftoverRecommendations,
  getRemainingPackages,
  getRemainingValue,
} from "./recommendations.js";

let allRecipes = [];
let selectedRecipeId = null;

const filterState = {
  cuisines: new Set(),
  mealTypes: new Set(),
  dietary: new Set(),
  maxTime: null,
};

function getUniqueValues(recipes, field) {
  return [...new Set(recipes.map((recipe) => recipe[field]).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b)
  );
}

function buildFilterOptions(containerId, field, groupName) {
  const container = document.getElementById(containerId);
  const values = getUniqueValues(allRecipes, field);

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

function initializeFilterPanel() {
  buildFilterOptions("filterCuisineOptions", "cuisine", "cuisine");
  buildFilterOptions("filterMealOptions", "meal_type", "meal");
  buildFilterOptions("filterDietOptions", "dietary_restrictions", "diet");
}

function readCheckedValues(name) {
  return new Set(
    [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(
      (input) => input.value
    )
  );
}

function syncFilterStateFromPanel() {
  filterState.cuisines = readCheckedValues("cuisine");
  filterState.mealTypes = readCheckedValues("meal");
  filterState.dietary = readCheckedValues("diet");

  const maxTimeValue = document.getElementById("filterMaxTime").value;
  filterState.maxTime = maxTimeValue ? Number(maxTimeValue) : null;
}

function hasActiveFilters() {
  return (
    filterState.cuisines.size > 0 ||
    filterState.mealTypes.size > 0 ||
    filterState.dietary.size > 0 ||
    filterState.maxTime != null
  );
}

function updateFilterIndicator() {
  const dot = document.getElementById("filterActiveDot");
  dot.classList.toggle("hidden", !hasActiveFilters());
}

function clearFilters() {
  filterState.cuisines.clear();
  filterState.mealTypes.clear();
  filterState.dietary.clear();
  filterState.maxTime = null;

  document
    .querySelectorAll("#filterPanel input[type='checkbox']")
    .forEach((input) => {
      input.checked = false;
    });
  document.getElementById("filterMaxTime").value = "";
  updateFilterIndicator();
  applyFilters();
}

function setFilterPanelOpen(isOpen) {
  const panel = document.getElementById("filterPanel");
  const toggleBtn = document.getElementById("filterToggleBtn");

  panel.classList.toggle("hidden", !isOpen);
  toggleBtn.setAttribute("aria-expanded", String(isOpen));
}

function toggleFilterPanel() {
  const panel = document.getElementById("filterPanel");
  setFilterPanelOpen(panel.classList.contains("hidden"));
}

function recipeMatchesFilters(recipe) {
  if (
    filterState.cuisines.size > 0 &&
    !filterState.cuisines.has(recipe.cuisine)
  ) {
    return false;
  }

  if (
    filterState.mealTypes.size > 0 &&
    !filterState.mealTypes.has(recipe.meal_type)
  ) {
    return false;
  }

  if (
    filterState.dietary.size > 0 &&
    !filterState.dietary.has(recipe.dietary_restrictions)
  ) {
    return false;
  }

  if (filterState.maxTime != null) {
    const totalTime = getTotalTime(recipe);
    if (totalTime == null || totalTime > filterState.maxTime) {
      return false;
    }
  }

  return true;
}

function handleFilterChange() {
  syncFilterStateFromPanel();
  updateFilterIndicator();
  applyFilters();
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getServingSize(recipe) {
  const servings = Number(recipe.serving_size);
  return servings > 0 ? servings : 1;
}

function getRecipeCost(recipe) {
  if (recipe.cost_total != null) {
    return Number(recipe.cost_total);
  }
  return recipe.cost != null ? Number(recipe.cost) : null;
}

function getPerServingCost(recipe) {
  if (recipe.cost_per_serving != null) {
    return Number(recipe.cost_per_serving);
  }
  const recipeCost = getRecipeCost(recipe);
  const servings = getServingSize(recipe);
  if (recipeCost != null && servings > 0) {
    return recipeCost / servings;
  }
  return recipeCost;
}

function formatShoppingCost(recipe) {
  const low = recipe.shopping_cost_low;
  const high = recipe.shopping_cost_high;

  if (low != null && high != null && low !== high) {
    return `$${low}–$${high}`;
  }

  if (recipe.shopping_cost != null && recipe.shopping_cost > 0) {
    return `$${Number(recipe.shopping_cost).toFixed(2)}`;
  }

  return "—";
}

function buildCostMetaHtml(recipe) {
  const perServing = getPerServingCost(recipe);

  if (perServing == null) {
    return "Cost per serving: —";
  }

  const perServingLine = `<span class="card-cost-row"><span class="card-cost-label">Cost per serving</span> <span class="card-cost-primary">$${perServing.toFixed(2)}</span></span>`;
  const shoppingLine = `<span class="card-cost-row"><span class="card-cost-label">Grocery run</span> <span class="card-cost-secondary">${formatShoppingCost(recipe)}</span></span>`;

  return `${perServingLine}<br />${shoppingLine}`;
}

function buildCostBreakdownHtml(recipe) {
  const lines =
    recipe.ingredient_costs ||
    (recipe.ingredients || []).map((item) => ({ item, cost: 0 }));

  if (lines.length === 0) {
    return "";
  }

  const rows = lines
    .map(({ item, cost, note }) => {
      const value =
        cost === 0
          ? '<span class="cost-item-value cost-item-value--pantry">$0.00 (pantry)</span>'
          : `<span class="cost-item-value">$${Number(cost).toFixed(2)}</span>`;
      const noteHtml = note
        ? `<span class="cost-item-note">${escapeHtml(note)}</span>`
        : "";
      return `<li class="cost-breakdown-row"><div class="cost-item-details"><span class="cost-item-name">${escapeHtml(item)}</span>${noteHtml}</div>${value}</li>`;
    })
    .join("");

  return `
    <details class="card-cost-breakdown">
      <summary>Cost breakdown</summary>
      <ul class="cost-breakdown-list">${rows}</ul>
    </details>
  `;
}

function getTotalTime(recipe) {
  if (recipe.total_time != null) {
    return recipe.total_time;
  }
  const prep = recipe.preparation_time ?? 0;
  const cook = recipe.cook_time ?? 0;
  return prep + cook || null;
}

function formatPackageLabel(key) {
  return key.replace(/^item:/, "").replace(/^\w/, (c) => c.toUpperCase());
}

function parsePackageDescription(note) {
  if (!note) {
    return "";
  }
  const match = note.match(/^\$[\d.]+ (.+?) ×/);
  return match ? match[1] : "";
}

function getShoppingListItems(recipe) {
  const items = new Map();

  for (const line of recipe.ingredient_costs || []) {
    if (!line.package_key || line.package_price == null) {
      continue;
    }

    if (line.note === "Pantry staple (on hand)") {
      continue;
    }

    if (items.has(line.package_key)) {
      continue;
    }

    items.set(line.package_key, {
      name: formatPackageLabel(line.package_key),
      description: parsePackageDescription(line.note),
      price: Number(line.package_price),
    });
  }

  return [...items.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function buildShoppingListHtml(recipe) {
  const items = getShoppingListItems(recipe);
  const total = formatShoppingCost(recipe);

  if (items.length === 0) {
    return `
      <section class="recipe-detail-section">
        <h4 class="recipe-detail-heading">Shopping list</h4>
        <p class="recipe-detail-lead">Everything you need to buy at the store.</p>
        <p class="recipe-detail-empty">No packaged groceries needed.</p>
      </section>
    `;
  }

  const rows = items
    .map(({ name, description, price }) => {
      const detail = description ? ` (${description})` : "";
      return `<li class="shopping-list-row"><span class="shopping-list-item">${escapeHtml(name)}${escapeHtml(detail)}</span><span class="shopping-list-price">$${price.toFixed(2)}</span></li>`;
    })
    .join("");

  return `
    <section class="recipe-detail-section">
      <h4 class="recipe-detail-heading">Shopping list</h4>
      <p class="recipe-detail-lead">Full packages to buy at the store${total !== "—" ? ` — ${total}` : ""}.</p>
      <ul class="shopping-list">${rows}</ul>
    </section>
  `;
}

function buildListHtml(items, ordered = false) {
  if (!items || items.length === 0) {
    return '<p class="recipe-detail-empty">—</p>';
  }

  const tag = ordered ? "ol" : "ul";
  const rows = items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `<${tag} class="recipe-detail-list">${rows}</${tag}>`;
}

function buildLeftoverSectionHtml(sourceRecipe) {
  const remaining = getRemainingValue(sourceRecipe);
  const remainingPackages = getRemainingPackages(sourceRecipe);
  const recommendations = getLeftoverRecommendations(
    sourceRecipe,
    allRecipes,
    3
  );

  const ownedText = remainingPackages.map(formatPackageLabel).join(", ");
  let listHtml = "";

  if (recommendations.length === 0) {
    listHtml = "<li>No similar recipes use what you have left.</li>";
  } else {
    listHtml = recommendations
      .map(
        ({ recipe }) =>
          `<li><button type="button" class="leftover-rec-btn" data-id="${recipe.id}">${escapeHtml(recipe.name)}</button></li>`
      )
      .join("");
  }

  return `
    <section class="recipe-detail-section recipe-detail-section--leftovers">
      <h4 class="recipe-detail-heading">Use your leftovers</h4>
      <p class="recipe-detail-summary">~$${remaining.toFixed(2)} left from your shop</p>
      <p class="recipe-detail-owned">Still have: ${escapeHtml(ownedText || "—")}</p>
      <p class="recipe-detail-subheading">Similar recipes using what you bought:</p>
      <ul class="leftover-rec-list">${listHtml}</ul>
    </section>
  `;
}

function buildRecipeDetailPanel(recipe) {
  const panel = document.createElement("div");
  panel.className = "recipe-detail-panel";

  const prep = recipe.preparation_time;
  const cook = recipe.cook_time;
  const timeParts = [];

  if (prep != null) {
    timeParts.push(`Prep: ${prep} min`);
  }
  if (cook != null) {
    timeParts.push(`Cook: ${cook} min`);
  }

  const timeHtml =
    timeParts.length > 0
      ? `<p class="recipe-detail-time">${timeParts.join(" · ")}</p>`
      : "";

  panel.innerHTML = `
    ${timeHtml}
    ${buildShoppingListHtml(recipe)}
    <section class="recipe-detail-section">
      <h4 class="recipe-detail-heading">Ingredients</h4>
      <p class="recipe-detail-lead">Amounts to use when you cook this recipe.</p>
      ${buildListHtml(recipe.ingredients)}
    </section>
    <section class="recipe-detail-section">
      <h4 class="recipe-detail-heading">Instructions</h4>
      ${buildListHtml(recipe.instructions, true)}
    </section>
    ${buildLeftoverSectionHtml(recipe)}
  `;

  panel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  panel.querySelectorAll(".leftover-rec-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectRecipe(Number(button.dataset.id), true);
    });
  });

  return panel;
}

function updateSelectionUI() {
  document.querySelectorAll(".recipe-card").forEach((card) => {
    card.classList.remove("recipe-card--selected");
    card.querySelectorAll(".recipe-detail-panel").forEach((panel) => {
      panel.remove();
    });
  });

  if (selectedRecipeId == null) {
    return;
  }

  const recipe = allRecipes.find((item) => item.id === selectedRecipeId);
  const card = document.querySelector(
    `.recipe-card[data-id="${selectedRecipeId}"]`
  );

  if (!recipe || !card) {
    selectedRecipeId = null;
    return;
  }

  card.classList.add("recipe-card--selected");
  card.appendChild(buildRecipeDetailPanel(recipe));
  card.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function selectRecipe(recipeId, forceOpen = false) {
  if (!forceOpen && selectedRecipeId === recipeId) {
    selectedRecipeId = null;
  } else {
    selectedRecipeId = recipeId;
  }
  updateSelectionUI();
}

function showError(message) {
  const errorState = document.getElementById("errorState");
  errorState.textContent = message;
  errorState.classList.remove("hidden");
}

function buildCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";
  card.dataset.id = recipe.id;

  const imgSrc =
    recipe.image_url || "https://placehold.co/300x150?text=No+Image";

  card.innerHTML = `
    <button class="card-heart-btn" type="button" aria-label="Save to favorites">&#9829;</button>
    <img class="card-img" src="${imgSrc}" alt="${recipe.name}" />
    <div class="card-body">
      <h3 class="card-title">${recipe.name}</h3>
      <p class="card-meta">
        Cuisine: ${recipe.cuisine || "—"}<br />
        ${buildCostMetaHtml(recipe)}<br />
        Serves ${getServingSize(recipe)}<br />
        Protein: ${recipe.protein ?? "—"}g<br />
        Total Time: ${getTotalTime(recipe) ?? "—"} min
      </p>
      ${buildCostBreakdownHtml(recipe)}
    </div>
  `;

  card.addEventListener("click", () => {
    selectRecipe(recipe.id);
  });

  card.querySelector(".card-heart-btn").addEventListener("click", (event) => {
    event.stopPropagation();
  });

  const breakdown = card.querySelector(".card-cost-breakdown");
  if (breakdown) {
    breakdown.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  return card;
}

function renderCards(list = allRecipes) {
  const grid = document.getElementById("recipesGrid");
  const emptyState = document.getElementById("emptyState");

  grid.innerHTML = "";

  if (list.length === 0) {
    selectedRecipeId = null;
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  list.forEach((recipe) => {
    grid.appendChild(buildCard(recipe));
  });

  updateSelectionUI();
}

function formatCostAmount(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

function getCostBounds(recipes) {
  let min = Infinity;
  let max = -Infinity;

  for (const recipe of recipes) {
    const cost = getPerServingCost(recipe);
    if (cost == null || !Number.isFinite(cost)) {
      continue;
    }
    min = Math.min(min, cost);
    max = Math.max(max, cost);
  }

  if (!Number.isFinite(min)) {
    return { min: 0, max: 30 };
  }

  return { min, max };
}

function getSliderMaxCost() {
  return Number(document.getElementById("costScaleInput").value) / 100;
}

function initializeCostScale(recipes) {
  const { min, max } = getCostBounds(recipes);
  const slider = document.getElementById("costScaleInput");
  let minCents = Math.floor(min * 100);
  let maxCents = Math.ceil(max * 100);

  if (maxCents <= minCents) {
    maxCents = minCents + 1;
  }

  slider.min = String(minCents);
  slider.max = String(maxCents);
  slider.step = "1";
  slider.value = String(maxCents);
  slider.setAttribute("aria-valuemin", minCents);
  slider.setAttribute("aria-valuemax", maxCents);
  slider.setAttribute("aria-valuenow", maxCents);

  const ticksEl = document.getElementById("costScaleTicks");
  const tickCount = 4;
  const tickLabels = [];

  for (let i = 0; i < tickCount; i += 1) {
    const amount = min + ((max - min) * i) / (tickCount - 1);
    tickLabels.push(formatCostAmount(amount));
  }

  ticksEl.innerHTML = tickLabels
    .map((label) => `<span>${label}</span>`)
    .join("");
}

function getFilteredRecipes() {
  const query = document
    .getElementById("recipeSearchInput")
    .value.trim()
    .toLowerCase();
  const maxCost = getSliderMaxCost();

  return allRecipes.filter((recipe) => {
    const matchesSearch =
      !query ||
      recipe.name.toLowerCase().includes(query) ||
      (recipe.cuisine && recipe.cuisine.toLowerCase().includes(query));

    const perServing = getPerServingCost(recipe);
    const matchesCost =
      perServing == null || perServing <= maxCost;

    return matchesSearch && matchesCost && recipeMatchesFilters(recipe);
  });
}

function updateCostDisplay(maxCost) {
  document.getElementById("costScaleValue").textContent =
    `${formatCostAmount(maxCost)}/serving`;
  document.getElementById("discoveryHeading").textContent =
    `Under ${formatCostAmount(maxCost)} per serving`;
  document.getElementById("costScaleInput").setAttribute(
    "aria-valuenow",
    Math.round(maxCost * 100)
  );
}

function applyFilters() {
  const maxCost = getSliderMaxCost();
  updateCostDisplay(maxCost);
  renderCards(getFilteredRecipes());
}

function handleSearch() {
  applyFilters();
}

function handleCostChange(event) {
  applyFilters();
}

async function loadRecipes() {
  const response = await fetch("/api/recipes");
  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = await response.json();
  allRecipes = data.recipes;
  initializeFilterPanel();
  initializeCostScale(allRecipes);
  applyFilters();
}

function setupFilterControls() {
  const toggleBtn = document.getElementById("filterToggleBtn");
  const panel = document.getElementById("filterPanel");
  const clearBtn = document.getElementById("filterClearBtn");

  toggleBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFilterPanel();
  });

  clearBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    clearFilters();
  });

  panel.addEventListener("change", (event) => {
    event.stopPropagation();
    handleFilterChange();
  });

  panel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    setFilterPanelOpen(false);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("recipeSearchInput")
    .addEventListener("input", handleSearch);

  document
    .getElementById("costScaleInput")
    .addEventListener("input", handleCostChange);

  setupFilterControls();

  loadRecipes().catch(() => {
    showError("Failed to load recipes. Please try again later.");
  });
});
