function inferPackageUsageFraction(line) {
  if (!line.package_key || line.package_price == null || line.package_price <= 0) {
    return null;
  }

  let fraction = Number(line.cost) / Number(line.package_price);
  const lower = String(line.item).toLowerCase();

  const canMatch = lower.match(/(\d+(?:\.\d+)?)\s*cans?\b/);
  if (canMatch) {
    fraction = Math.max(fraction, Number(canMatch[1]));
  }

  if (/\b1\s+onion\b|\b1\s+avocado\b|\b1\s+cucumber\b|\b1\s+tomato\b|\b1\s+bell pepper\b/.test(lower)) {
    fraction = Math.max(fraction, 1);
  }

  return Math.min(fraction, 1);
}

export function getOwnedPackages(sourceRecipe) {
  const packages = [];

  for (const line of sourceRecipe.ingredient_costs || []) {
    if (line.package_key && !packages.includes(line.package_key)) {
      packages.push(line.package_key);
    }
  }

  return packages;
}

export function getRemainingPackages(sourceRecipe) {
  const usageByKey = new Map();

  for (const line of sourceRecipe.ingredient_costs || []) {
    const fraction = inferPackageUsageFraction(line);
    if (fraction == null) {
      continue;
    }

    const prev = usageByKey.get(line.package_key) || 0;
    usageByKey.set(line.package_key, Math.max(prev, fraction));
  }

  const remaining = [];
  for (const [key, fraction] of usageByKey) {
    if (fraction < 0.85) {
      remaining.push(key);
    }
  }

  return remaining;
}

export function getRemainingValue(recipe) {
  if (recipe.remaining_value != null) {
    return Number(recipe.remaining_value);
  }
  const shopping = Number(recipe.shopping_cost) || 0;
  const used = Number(recipe.cost_total ?? recipe.cost) || 0;
  return Math.max(shopping - used, 0);
}

function getPackageMap(recipe) {
  const packages = new Map();

  for (const line of recipe.ingredient_costs || []) {
    if (line.package_key && line.package_price != null) {
      packages.set(line.package_key, Number(line.package_price));
    }
  }

  return packages;
}

export function usesOnlyOwnedPackages(sourceRecipe, candidateRecipe) {
  const ownedKeys = new Set(getPackageMap(sourceRecipe).keys());
  const needed = getPackageMap(candidateRecipe);

  if (needed.size === 0) {
    return false;
  }

  for (const key of needed.keys()) {
    if (!ownedKeys.has(key)) {
      return false;
    }
  }

  return true;
}

function getExtraPackageKeys(sourceRecipe, candidateRecipe) {
  const ownedKeys = new Set(getPackageMap(sourceRecipe).keys());
  const needed = getPackageMap(candidateRecipe);
  const extraKeys = [];

  for (const key of needed.keys()) {
    if (!ownedKeys.has(key)) {
      extraKeys.push(key);
    }
  }

  return extraKeys;
}

function getSharedPackageKeys(sourceRecipe, candidateRecipe) {
  const ownedKeys = new Set(getPackageMap(sourceRecipe).keys());
  const needed = getPackageMap(candidateRecipe);
  const sharedKeys = [];

  for (const key of needed.keys()) {
    if (ownedKeys.has(key)) {
      sharedKeys.push(key);
    }
  }

  return sharedKeys;
}

export function getLeftoverRecommendations(sourceRecipe, allRecipes, limit = 3) {
  const results = [];

  for (const recipe of allRecipes) {
    if (recipe.id === sourceRecipe.id) {
      continue;
    }

    if (getPackageMap(recipe).size === 0) {
      continue;
    }

    const sharedKeys = getSharedPackageKeys(sourceRecipe, recipe);
    if (sharedKeys.length < 2) {
      continue;
    }

    const extraKeys = getExtraPackageKeys(sourceRecipe, recipe);

    results.push({
      recipe,
      sharedCount: sharedKeys.length,
      sharedKeys,
      extraKeys,
    });
  }

  results.sort((a, b) => {
    if (a.extraKeys.length !== b.extraKeys.length) {
      return a.extraKeys.length - b.extraKeys.length;
    }
    if (b.sharedCount !== a.sharedCount) {
      return b.sharedCount - a.sharedCount;
    }
    return (a.recipe.cost_per_serving || 0) - (b.recipe.cost_per_serving || 0);
  });

  return results.slice(0, limit);
}
