// favoritesPage.js
// Handles all UI logic for the Saved Recipes (Favorites) page
// Loads saved recipes from localStorage, renders cards, supports unsaving

// ── Constants ──────────────────────────────────────────────────────────────

// localStorage key shared with the recipe discovery page (Melissa's side)
// When Melissa adds a save button on recipePage.js she will write to this key

// ── State ──────────────────────────────────────────────────────────────────

// Array of saved recipe objects: { id, name, cuisine, cost, protein, prepTime, image }
let favorites = [];

// ── On Page Load ───────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("favSearchInput")
    .addEventListener("input", handleSearch);

  loadFavorites();
});

// ── Load & Save ────────────────────────────────────────────────────────────

/** Reads the favorites array from MongoDB */
async function loadFavorites() {
  try {
    const response = await fetch("/api/favorites");

    if (!response.ok) {
      throw new Error("Failed to load favorites");
    }

    const data = await response.json();
    favorites = data.favorites || [];
    renderCards();
  } catch (error) {
    console.error("Error loading favorites", error);
    favorites = [];
    renderCards();
  }
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
 * Matches the card style in recipe-card.css (.recipe-card)
 */
function buildCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";
  card.dataset.id = recipe.id;


  const imgSrc =
    recipe.image_url || recipe.image || "https://placehold.co/300x150?text=No+Image";

  card.innerHTML = `
    <!-- Filled heart button — clicking removes from favorites -->
    <button class="card-heart-btn card-heart-btn--saved" aria-label="Remove from favorites">&#9829;</button>

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
 */
async function unsaveRecipe(id) {
  try {
    const response = await fetch(`/api/favorites/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to remove favorite");
    }

    favorites = favorites.filter((recipe) => recipe.id !== id);
    renderCards();
  } catch (error) {
    console.error("Error removing favorite", error);
  }
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