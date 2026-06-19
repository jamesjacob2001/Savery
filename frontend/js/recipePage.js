let allRecipes = [];

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
        Cost: $${recipe.cost ?? "—"}<br />
        Protein: ${recipe.protein ?? "—"}g<br />
        Prep Time: ${recipe.preparation_time ?? "—"} min
      </p>
    </div>
  `;

  return card;
}

function renderCards(list = allRecipes) {
  const grid = document.getElementById("recipesGrid");
  const emptyState = document.getElementById("emptyState");

  grid.innerHTML = "";

  if (list.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  list.forEach((recipe) => {
    grid.appendChild(buildCard(recipe));
  });
}

function getFilteredRecipes() {
  const query = document
    .getElementById("recipeSearchInput")
    .value.trim()
    .toLowerCase();
  const maxCost = Number(document.getElementById("costScaleInput").value);

  return allRecipes.filter((recipe) => {
    const matchesSearch =
      !query ||
      recipe.name.toLowerCase().includes(query) ||
      (recipe.cuisine && recipe.cuisine.toLowerCase().includes(query));

    const matchesCost =
      recipe.cost == null || recipe.cost <= maxCost;

    return matchesSearch && matchesCost;
  });
}

function updateCostDisplay(maxCost) {
  document.getElementById("costScaleValue").textContent = `$${maxCost}`;
  document.getElementById("discoveryHeading").textContent = `Under $${maxCost}`;
  document.getElementById("costScaleInput").setAttribute("aria-valuenow", maxCost);
}

function applyFilters() {
  const maxCost = Number(document.getElementById("costScaleInput").value);
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
  applyFilters();
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("recipeSearchInput")
    .addEventListener("input", handleSearch);

  document
    .getElementById("costScaleInput")
    .addEventListener("input", handleCostChange);

  loadRecipes().catch(() => {
    showError("Failed to load recipes. Please try again later.");
  });
});
