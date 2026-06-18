console.log("Recipe Page JavaScript file loaded");
console.log("Hello from the frontend JavaScript file");

function Recipes() {
  const me = {};

  me.showError = ({ message, type = "danger" } = {}) => {
    const main = document.querySelector("main");
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<p>${message}</p>`;
    main.prepend(alert);
  };

  me.refreshRecipes = async () => {
    const response = await fetch("/api/recipes");
    if (!response.ok) {
      console.error(
        "Failed to fetch recipes",
        response.status,
        response.statusText
      );
      me.showError({
        message: "Failed to fetch recipes",
        type: "danger",
      });
      return;
    }

    const data = await response.json();
    console.log("Recipes fetched successfully", data);

    const recipesList = document.querySelector("#recipes");
    recipesList.innerHTML = "";

    data.recipes.forEach((recipe) => {
      const ingredients = recipe.ingredients
        .map((item) => `<li>${item}</li>`)
        .join("");
      const instructions = recipe.instructions
        .map((item) => `<li>${item}</li>`)
        .join("");

      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `
        <h5 class="mb-1">${recipe.name}</h5>
        <p class="mb-2">${recipe.description}</p>
        <h6 class="mb-1">Ingredients</h6>
        <ul class="mb-2">${ingredients}</ul>
        <h6 class="mb-1">Instructions</h6>
        <ol class="mb-0">${instructions}</ol>
      `;
      recipesList.appendChild(li);
    });
  };

  return me;
}

const myRecipes = Recipes();

myRecipes.refreshRecipes();
