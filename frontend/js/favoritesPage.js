// favoritesPage.js
// Handles all UI logic for the Saved Recipes (Favorites) page
// Loads saved recipes from localStorage, renders cards, supports unsaving

// ── Constants ──────────────────────────────────────────────────────────────

// localStorage key shared with the recipe discovery page (Melissa's side)
// When Melissa adds a save button on recipePage.js she will write to this key
const FAVORITES_KEY = "savery_favorites";

// ── State ──────────────────────────────────────────────────────────────────

// Array of saved recipe objects: { id, name, cuisine, cost, protein, prepTime, image }
let favorites = [];

// ── On Page Load ───────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  loadFavorites();   // pull saved recipes from localStorage
  renderCards();     // display them as cards

  // Live search — filter cards as user types
  document
    .getElementById("favSearchInput")
    .addEventListener("input", handleSearch);
});

// ── Load & Save ────────────────────────────────────────────────────────────

/** Reads the favorites array from localStorage */
function loadFavorites() {
  const stored = localStorage.getItem(FAVORITES_KEY);
  if (stored) {
    try {
      favorites = JSON.parse(stored);
    } catch {
      favorites = [];
    }
  }
}

/** Persists the current favorites array back to localStorage */
function persistFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// ── Render ─────────────────────────────────────────────────────────────────

/**
 * Renders all favorite recipe cards into #favoritesGrid.
 * Accepts an optional filtered array — defaults to all favorites.
 */
function renderCards(list = favorites) {
  const grid = document.getElementById("favoritesGrid");
  const emptyState = document.getElementById("emptyState");

  grid.innerHTML = ""; // clear before re-render

  if (list.length === 0) {
    // Show empty state message if there are no favorites to display
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  list.forEach((recipe) => {
    const card = buildCard(recipe);
    grid.appendChild(card);
  });
}

/**
 * Builds a single recipe card DOM element.
 * Matches the card style described in style.css (.recipe-card)
 */
function buildCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";
  card.dataset.id = recipe.id;

  // Use a placeholder image if no image URL is available
  const imgSrc = recipe.image || "https://placehold.co/300x150?text=No+Image";

  card.innerHTML = `
    <!-- Filled heart button — clicking removes from favorites -->
    <button class="card-heart-btn" aria-label="Remove from favorites">&#9829;</button>

    <!-- Recipe image -->
    <img class="card-img" src="${imgSrc}" alt="${recipe.name}" />

    <!-- Recipe details -->
    <div class="card-body">
      <h3 class="card-title">${recipe.name}</h3>
      <p class="card-meta">
        Cuisine: ${recipe.cuisine || "—"}<br />
        Cost: $${recipe.cost || "0.00"}<br />
        Serves ${recipe.serving_size || recipe.servingSize || 1}<br />
        Protein: ${recipe.protein || "—"}g<br />
        Total Time: ${recipe.total_time ?? recipe.totalTime ?? recipe.preparation_time ?? recipe.prepTime ?? "—"} min
      </p>
    </div>
  `;

  // Heart button click → unsave this recipe
  card.querySelector(".card-heart-btn").addEventListener("click", () => {
    unsaveRecipe(recipe.id);
  });

  return card;
}

// ── Unsave ─────────────────────────────────────────────────────────────────

/**
 * Removes a recipe from favorites by its id.
 * Updates localStorage and re-renders the grid.
 */
function unsaveRecipe(id) {
  favorites = favorites.filter((r) => r.id !== id);
  persistFavorites();
  renderCards();
}

// ── Search ─────────────────────────────────────────────────────────────────

/**
 * Filters displayed cards based on the search input value.
 * Searches against recipe name and cuisine — case insensitive.
 */
function handleSearch(e) {
  const query = e.target.value.trim().toLowerCase();

  if (!query) {
    // Empty query — show all favorites
    renderCards();
    return;
  }

  const filtered = favorites.filter(
    (r) =>
      r.name.toLowerCase().includes(query) ||
      (r.cuisine && r.cuisine.toLowerCase().includes(query))
  );

  renderCards(filtered);
}