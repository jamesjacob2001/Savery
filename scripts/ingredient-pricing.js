/**
 * Package-based grocery pricing for college recipes.
 * Cost = packagePrice × (amountUsed / packageSize)
 */

const PANTRY_PATTERN =
  /^(salt and pepper|salt|pepper|black pepper|to taste|for garnish|optional|water)$/i;

/** { keywords, price, size, unit, label } — size is in `unit`. */
const GROCERY_PACKAGES = [
  { keywords: ["olive oil"], price: 8.99, size: 750, unit: "ml", label: "750ml bottle" },
  { keywords: ["vegetable oil", "canola oil"], price: 4.99, size: 946, unit: "ml", label: "32 oz bottle" },
  { keywords: [" oil"], price: 4.99, size: 946, unit: "ml", label: "32 oz bottle" },
  { keywords: ["soy sauce"], price: 3.49, size: 296, unit: "ml", label: "10 oz bottle" },
  { keywords: ["mayonnaise", "mayo"], price: 4.29, size: 414, unit: "ml", label: "14 oz jar" },
  { keywords: ["teriyaki"], price: 3.99, size: 296, unit: "ml", label: "10 oz bottle" },
  { keywords: ["hot sauce", "sriracha", "buffalo sauce"], price: 3.49, size: 148, unit: "ml", label: "5 oz bottle" },
  { keywords: ["vinegar", "balsamic"], price: 3.29, size: 473, unit: "ml", label: "16 oz bottle" },
  { keywords: ["maple syrup"], price: 6.99, size: 355, unit: "ml", label: "12 oz bottle" },
  { keywords: ["honey"], price: 5.99, size: 340, unit: "g", label: "12 oz jar" },
  { keywords: ["peanut butter"], price: 3.49, size: 510, unit: "g", label: "18 oz jar" },
  { keywords: ["peanut sauce"], price: 3.49, size: 340, unit: "g", label: "12 oz jar" },
  { keywords: ["bbq sauce", "barbecue sauce"], price: 3.29, size: 510, unit: "g", label: "18 oz bottle" },
  { keywords: ["milk"], price: 3.79, size: 3785, unit: "ml", label: "1 gallon" },
  { keywords: ["coconut milk"], price: 1.79, size: 1, unit: "can", label: "13.5 oz can" },
  {
    keywords: ["chicken broth", "chicken stock", "vegetable broth", "vegetable stock", "broth", "stock"],
    price: 2.49,
    size: 946,
    unit: "ml",
    label: "32 oz carton",
  },
  { keywords: ["marinara", "tomato sauce", "pizza sauce", "crushed tomatoes", "diced tomatoes"], price: 1.49, size: 411, unit: "g", label: "14.5 oz can" },
  { keywords: ["cream"], price: 2.99, size: 473, unit: "ml", label: "16 oz carton" },
  { keywords: ["yogurt", "greek yogurt"], price: 4.99, size: 907, unit: "g", label: "32 oz tub" },
  { keywords: ["butter"], price: 4.49, size: 454, unit: "g", label: "1 lb box" },
  { keywords: ["cheese", "cheddar", "mozzarella", "parmesan", "feta", "provolone", "ricotta", "queso"], price: 3.99, size: 226, unit: "g", label: "8 oz block" },
  { keywords: ["goat cheese"], price: 4.49, size: 113, unit: "g", label: "4 oz log" },
  { keywords: ["can tuna", "tuna in water", "tuna, drained"], price: 1.29, size: 1, unit: "can", label: "5 oz can" },
  { keywords: ["tuna"], price: 1.29, size: 1, unit: "can", label: "5 oz can" },
  { keywords: ["chickpeas", "black beans", "kidney beans", "white beans", "pinto beans", "refried beans"], price: 1.09, size: 1, unit: "can", label: "15 oz can" },
  { keywords: ["chicken sausage"], price: 4.99, size: 12, unit: "oz", label: "12 oz pack" },
  { keywords: ["chicken"], price: 8.99, size: 1, unit: "lb", label: "per lb" },
  { keywords: ["ground beef", "ground turkey"], price: 6.99, size: 1, unit: "lb", label: "per lb" },
  { keywords: ["beef", "steak", "sirloin"], price: 9.99, size: 1, unit: "lb", label: "per lb" },
  { keywords: ["pork", "chorizo"], price: 5.99, size: 1, unit: "lb", label: "per lb" },
  { keywords: ["sausage"], price: 4.99, size: 12, unit: "oz", label: "12 oz pack" },
  { keywords: ["bacon"], price: 5.99, size: 16, unit: "oz", label: "16 oz pack" },
  { keywords: ["salmon", "salmon fillet"], price: 10.99, size: 1, unit: "lb", label: "per lb" },
  { keywords: ["tilapia"], price: 7.99, size: 1, unit: "lb", label: "per lb" },
  { keywords: ["shrimp"], price: 8.99, size: 12, unit: "oz", label: "12 oz bag" },
  { keywords: ["turkey"], price: 7.99, size: 1, unit: "lb", label: "per lb" },
  { keywords: ["tofu", "tempeh"], price: 2.99, size: 14, unit: "oz", label: "14 oz block" },
  { keywords: ["ham", "roast beef"], price: 4.99, size: 8, unit: "oz", label: "8 oz pack" },
  { keywords: ["egg", "eggs"], price: 3.59, size: 12, unit: "egg", label: "dozen" },
  { keywords: ["bread"], price: 3.49, size: 20, unit: "slice", label: "loaf (20 slices)" },
  { keywords: ["tortilla", "wrap", "pita"], price: 3.29, size: 10, unit: "each", label: "10 pack" },
  { keywords: ["rice", "long-grain rice", "brown rice"], price: 2.99, size: 907, unit: "g", label: "2 lb bag" },
  { keywords: ["pasta", "orzo", "noodles", "spaghetti", "penne", "linguine", "macaroni"], price: 1.49, size: 454, unit: "g", label: "16 oz box" },
  { keywords: ["ramen"], price: 0.35, size: 1, unit: "each", label: "single pack" },
  { keywords: ["oats", "rolled oats"], price: 3.99, size: 907, unit: "g", label: "2.5 lb container" },
  { keywords: ["flour"], price: 2.99, size: 2268, unit: "g", label: "5 lb bag" },
  { keywords: ["banana"], price: 0.25, size: 1, unit: "each", label: "each" },
  { keywords: ["apple"], price: 0.75, size: 1, unit: "each", label: "each" },
  { keywords: ["avocado"], price: 1.25, size: 1, unit: "each", label: "each" },
  { keywords: ["lemon", "lime"], price: 0.5, size: 1, unit: "each", label: "each" },
  { keywords: ["onion"], price: 1.29, size: 1, unit: "each", label: "each" },
  { keywords: ["green onion", "scallion"], price: 0.99, size: 5, unit: "stalk", label: "bunch (~5 stalks)" },
  { keywords: ["garlic"], price: 0.99, size: 10, unit: "clove", label: "head (~10 cloves)" },
  { keywords: ["potato", "sweet potato"], price: 4.99, size: 5, unit: "lb", label: "5 lb bag" },
  { keywords: ["broccoli", "spinach", "kale"], price: 2.49, size: 12, unit: "oz", label: "12 oz bag" },
  { keywords: ["bell pepper"], price: 1.49, size: 1, unit: "each", label: "each" },
  { keywords: ["tomato"], price: 0.89, size: 1, unit: "each", label: "each" },
  { keywords: ["carrot", "celery"], price: 1.99, size: 1, unit: "lb", label: "per lb" },
  { keywords: ["mushroom"], price: 2.99, size: 8, unit: "oz", label: "8 oz pack" },
  { keywords: ["lettuce", "romaine"], price: 2.99, size: 8, unit: "cup", label: "head (~8 cups)" },
  { keywords: ["cucumber"], price: 0.99, size: 1, unit: "each", label: "each" },
  { keywords: ["popcorn"], price: 2.49, size: 12, unit: "cup", label: "popped batch (~12 cups)" },
  { keywords: ["pretzel"], price: 3.29, size: 16, unit: "oz", label: "16 oz bag" },
  { keywords: ["stir-fry", "stir fry", "mixed vegetables", "frozen vegetables"], price: 2.99, size: 16, unit: "oz", label: "16 oz frozen bag" },
  { keywords: ["cornstarch"], price: 2.29, size: 454, unit: "g", label: "16 oz box" },
  { keywords: ["kernel corn", "corn, drained", "can corn", " cup corn", "cups corn"], price: 0.89, size: 1, unit: "can", label: "15 oz can" },
  { keywords: ["peas", "edamame"], price: 1.29, size: 1, unit: "can", label: "15 oz can" },
  { keywords: ["hummus"], price: 3.99, size: 283, unit: "g", label: "10 oz tub" },
  { keywords: ["pesto"], price: 4.49, size: 187, unit: "g", label: "6.5 oz jar" },
  { keywords: ["salsa", "pico de gallo"], price: 2.99, size: 453, unit: "g", label: "16 oz jar" },
  { keywords: ["ranch", "caesar dressing", "dressing", "vinaigrette"], price: 3.49, size: 473, unit: "ml", label: "16 oz bottle" },
  { keywords: ["curry powder", "cumin", "paprika", "cinnamon", "nutmeg", "italian seasoning", "everything seasoning", "cayenne", "vanilla", "baking soda"], price: 2.49, size: 48, unit: "g", label: "1.7 oz jar" },
  { keywords: ["miso paste", "miso"], price: 4.99, size: 454, unit: "g", label: "16 oz tub" },
  { keywords: ["sesame seeds", "chia seeds"], price: 2.99, size: 85, unit: "g", label: "3 oz bag" },
  { keywords: ["raisins", "dried cranberr"], price: 2.99, size: 283, unit: "g", label: "10 oz box" },
  { keywords: ["bean sprout"], price: 1.99, size: 8, unit: "oz", label: "8 oz pack" },
  { keywords: ["nori"], price: 2.49, size: 10, unit: "sheet", label: "10 sheet pack" },
  { keywords: ["kimchi"], price: 5.99, size: 454, unit: "g", label: "16 oz jar" },
  { keywords: ["chocolate", "cocoa"], price: 3.99, size: 283, unit: "g", label: "10 oz bag" },
  { keywords: ["granola"], price: 4.49, size: 340, unit: "g", label: "12 oz bag" },
  { keywords: ["walnuts", "almonds"], price: 5.99, size: 226, unit: "g", label: "8 oz bag" },
  { keywords: ["strawberr", "blueberr", "raspberr", "blackberr", "berries"], price: 3.99, size: 454, unit: "g", label: "16 oz clamshell" },
  { keywords: ["lentils"], price: 1.99, size: 454, unit: "g", label: "1 lb bag" },
  { keywords: ["tahini"], price: 5.99, size: 454, unit: "g", label: "16 oz jar" },
  { keywords: ["pickles"], price: 2.99, size: 473, unit: "ml", label: "16 oz jar" },
  { keywords: ["guacamole"], price: 3.99, size: 227, unit: "g", label: "8 oz tub" },
  { keywords: ["croutons"], price: 2.49, size: 142, unit: "g", label: "5 oz bag" },
  { keywords: ["mustard", "horseradish"], price: 2.29, size: 226, unit: "g", label: "8 oz jar" },
  { keywords: ["fish", "tilapia fillet", "white fish"], price: 7.99, size: 1, unit: "lb", label: "per lb" },
  { keywords: ["falafel"], price: 4.99, size: 12, unit: "oz", label: "12 oz pack" },
  { keywords: ["meatball"], price: 5.99, size: 14, unit: "oz", label: "14 oz pack" },
  { keywords: ["waffles"], price: 3.49, size: 10, unit: "each", label: "10 pack" },
  { keywords: ["crackers"], price: 3.29, size: 16, unit: "oz", label: "16 oz box" },
  { keywords: ["capers"], price: 2.99, size: 99, unit: "ml", label: "3.5 oz jar" },
  { keywords: ["basil", "cilantro", "parsley"], price: 2.49, size: 0.75, unit: "oz", label: "fresh bunch" },
  { keywords: ["coleslaw"], price: 2.49, size: 14, unit: "oz", label: "14 oz bag" },
  { keywords: ["squash", "zucchini"], price: 1.49, size: 1, unit: "each", label: "each" },
  { keywords: ["cabbage"], price: 2.49, size: 1, unit: "each", label: "head" },
  { keywords: ["mango", "pineapple"], price: 1.99, size: 1, unit: "each", label: "each" },
  { keywords: ["portobello"], price: 3.99, size: 1, unit: "each", label: "cap" },
  { keywords: ["couscous", "quinoa", "farro"], price: 3.99, size: 454, unit: "g", label: "16 oz box" },
  { keywords: ["sugar", "brown sugar"], price: 2.49, size: 907, unit: "g", label: "2 lb bag" },
  { keywords: ["chipotle"], price: 3.49, size: 198, unit: "g", label: "7 oz can" },
  { keywords: ["olives"], price: 2.99, size: 99, unit: "g", label: "3.5 oz jar" },
];

const TBSP_ML = 15;
const TSP_ML = 5;
const CUP_ML = 240;
const CUP_G = 128;
const CUP_MEAT_OZ = 5;
const LB_OZ = 16;
const DEFAULT_PACKAGE = { price: 2.49, size: 1, unit: "each", label: "estimated item" };

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function parseQuantity(text) {
  const fractionMatch = text.match(/^(\d+)\/(\d+)/);
  if (fractionMatch) {
    return Number(fractionMatch[1]) / Number(fractionMatch[2]);
  }
  const numberMatch = text.match(/^(\d+(?:\.\d+)?)/);
  if (numberMatch) {
    return Number(numberMatch[1]);
  }
  return 1;
}

function isPantryItem(line) {
  const trimmed = line.trim();
  if (PANTRY_PATTERN.test(trimmed)) {
    return true;
  }
  const lower = trimmed.toLowerCase();
  if (/\bwater\b/.test(lower) && !/coconut/.test(lower)) {
    return true;
  }
  return false;
}

function matchPackage(line) {
  const lower = line.toLowerCase();
  let bestMatch = null;
  let bestKeyword = "";
  let bestLength = 0;

  for (const pkg of GROCERY_PACKAGES) {
    for (const keyword of pkg.keywords) {
      if (lower.includes(keyword) && keyword.length > bestLength) {
        bestMatch = pkg;
        bestKeyword = keyword;
        bestLength = keyword.length;
      }
    }
  }

  const pkg = bestMatch || DEFAULT_PACKAGE;
  const matchKey = bestKeyword || `item:${lower.trim()}`;

  return { pkg, matchKey };
}

function findPackage(line) {
  return matchPackage(line).pkg;
}

function isMeatIngredient(lower) {
  return /chicken|beef|pork|turkey|ham|shrimp|fish|salmon|tilapia|sausage|chorizo|ground|steak|bacon|tofu|tempeh/.test(
    lower
  );
}

function isDryCupIngredient(lower) {
  return /popcorn|pretzel|cereal|granola|oat|walnut|almond|cranberr|raisin|chocolate chip|cracker|breadcrumb|flour|rice|pasta|sugar|bean|lentil|quinoa|couscous|farro|berry|berries|chip/.test(
    lower
  );
}

function isProduceCupIngredient(lower) {
  return /carrot|celery|cucumber|bell pepper|broccoli|spinach|kale|mushroom|onion|tomato|zucchini|squash|cabbage|lettuce|mixed|stir-fry|stir fry|vegetable|veggie|peas|edamame|coleslaw/.test(
    lower
  );
}

function parseUsedAmount(line) {
  const lower = line.toLowerCase();
  const qty = parseQuantity(lower);

  if (/\btbsp\b/.test(lower)) {
    if (/juice/.test(lower) && /lime|lemon/.test(lower)) {
      return {
        amount: qty * 0.25,
        unit: "each",
        label: `${qty} tbsp juice (~${qty * 0.25} fruit)`,
      };
    }
    if (/cornstarch|flour|sugar|spice|powder|seasoning|baking|miso/.test(lower)) {
      return { amount: qty * 8, unit: "g", label: `${qty} tbsp (~${qty * 8}g)` };
    }
    if (/peanut butter|mayo|mayonnaise|hummus|peanut sauce|bbq sauce|barbecue sauce/.test(lower)) {
      return { amount: qty * 15, unit: "g", label: `${qty} tbsp (~${qty * 15}g)` };
    }
    if (/basil|cilantro|parsley|mint|dill|thyme|oregano/.test(lower)) {
      return { amount: qty * 2, unit: "g", label: `${qty} tbsp (~${qty * 2}g)` };
    }
    if (/diced/.test(lower) && /bell pepper|onion|tomato|celery|carrot/.test(lower)) {
      return {
        amount: qty * 0.05,
        unit: "each",
        label: `${qty} tbsp diced (~${(qty * 0.05).toFixed(2)} item)`,
      };
    }
    return { amount: qty * TBSP_ML, unit: "ml", label: `${qty} tbsp (${qty * TBSP_ML}ml)` };
  }
  if (/\btsp\b/.test(lower)) {
    if (/seasoning|spice|powder|salt|pepper|oregano|basil|thyme|paprika|cumin|garlic powder|onion powder/.test(lower)) {
      return { amount: qty * 3, unit: "g", label: `${qty} tsp (~${qty * 3}g)` };
    }
    return { amount: qty * TSP_ML, unit: "ml", label: `${qty} tsp (${qty * TSP_ML}ml)` };
  }
  if (/\bcups?\b/.test(lower)) {
    if (isMeatIngredient(lower)) {
      return {
        amount: qty * CUP_MEAT_OZ,
        unit: "oz",
        label: `${qty} cup (~${qty * CUP_MEAT_OZ} oz)`,
      };
    }
    if (/popcorn/.test(lower)) {
      return { amount: qty, unit: "cup", label: `${qty} cup(s) popped` };
    }
    if (/\b(drained|cooked)\b/.test(lower) && /\bbeans\b|\bchickpeas\b|\bcorn\b/.test(lower)) {
      return {
        amount: qty * 0.55,
        unit: "can",
        label: `${qty} cup (~${(qty * 0.55).toFixed(1)} can)`,
      };
    }
    if (/bell pepper/.test(lower)) {
      return { amount: qty, unit: "each", label: `${qty} cup (~${qty} pepper)` };
    }
    if (/cucumber|tomato|onion|avocado/.test(lower)) {
      return {
        amount: qty * 0.5,
        unit: "each",
        label: `${qty} cup (~${qty * 0.5} item)`,
      };
    }
    if (isProduceCupIngredient(lower)) {
      return {
        amount: qty * 4,
        unit: "oz",
        label: `${qty} cup (~${qty * 4} oz)`,
      };
    }
    if (/oil|milk|broth|stock|cream|water|vinegar|yogurt/.test(lower)) {
      return { amount: qty * CUP_ML, unit: "ml", label: `${qty} cup (${qty * CUP_ML}ml)` };
    }
    if (/sauce|salsa|pesto|guacamole|hummus|mayo|mayonnaise|peanut butter/.test(lower)) {
      return { amount: qty * CUP_G, unit: "g", label: `${qty} cup (~${qty * CUP_G}g)` };
    }
    if (isDryCupIngredient(lower)) {
      return { amount: qty * CUP_G, unit: "g", label: `${qty} cup (~${qty * CUP_G}g)` };
    }
    if (/cheese/.test(lower)) {
      return { amount: qty * CUP_G, unit: "g", label: `${qty} cup (~${qty * CUP_G}g)` };
    }
    return { amount: qty * 4, unit: "oz", label: `${qty} cup (~${qty * 4} oz)` };
  }
  if (/\bml\b/.test(lower)) {
    return { amount: qty, unit: "ml", label: `${qty}ml` };
  }
  if (/\b(lb|lbs|pound)\b/.test(lower)) {
    return { amount: qty, unit: "lb", label: `${qty} lb` };
  }
  if (/\b(oz|ounce)\b/.test(lower)) {
    return { amount: qty, unit: "oz", label: `${qty} oz` };
  }
  if (/\bcans?\b/.test(lower)) {
    const canMatch = lower.match(/(\d+(?:\.\d+)?)\s*cans?/);
    const count = canMatch ? Number(canMatch[1]) : qty;
    return { amount: count, unit: "can", label: `${count} can(s)` };
  }
  if (/\bslices?\b/.test(lower)) {
    return { amount: qty, unit: "slice", label: `${qty} slice(s)` };
  }
  if (/\beggs?\b/.test(lower)) {
    return { amount: qty, unit: "egg", label: `${qty} egg(s)` };
  }
  if (/\bcloves?\b/.test(lower)) {
    return { amount: qty, unit: "clove", label: `${qty} clove(s)` };
  }
  if (/\bstalks?\b/.test(lower)) {
    return { amount: qty, unit: "stalk", label: `${qty} stalk(s)` };
  }
  if (/\bblock\b/.test(lower)) {
    return { amount: qty, unit: "block", label: `${qty} block(s)` };
  }
  if (/\bsheets?\b/.test(lower)) {
    return { amount: qty, unit: "sheet", label: `${qty} sheet(s)` };
  }
  if (/\bsausages?\b/.test(lower) && !/\bground\b/.test(lower)) {
    return {
      amount: qty * 3,
      unit: "oz",
      label: `${qty} sausage(s) (~${qty * 3} oz)`,
    };
  }
  if (/\b8 oz\b/.test(lower)) {
    return { amount: 8, unit: "oz", label: "8 oz" };
  }
  if (/\b5 oz\b/.test(lower)) {
    return { amount: 5, unit: "oz", label: "5 oz" };
  }
  if (/\b6 oz\b/.test(lower)) {
    return { amount: 6, unit: "oz", label: "6 oz" };
  }
  if (/\b4 oz\b/.test(lower)) {
    return { amount: 4, unit: "oz", label: "4 oz" };
  }

  if (/green onion|scallion/.test(lower) && !/\bstalk/.test(lower)) {
    return { amount: qty, unit: "stalk", label: `${qty} stalk(s)` };
  }

  return { amount: qty, unit: "each", label: `${qty} serving(s)` };
}

function convertAmount(amount, fromUnit, toUnit) {
  if (fromUnit === toUnit) {
    return amount;
  }
  if (fromUnit === "oz" && toUnit === "lb") {
    return amount / LB_OZ;
  }
  if (fromUnit === "lb" && toUnit === "oz") {
    return amount * LB_OZ;
  }
  if (fromUnit === "stalk" && toUnit === "lb") {
    return amount * 0.15;
  }
  if (fromUnit === "cup" && toUnit === "ml") {
    return amount * CUP_ML;
  }
  if (fromUnit === "g" && toUnit === "oz") {
    return amount / 28.35;
  }
  if (fromUnit === "oz" && toUnit === "g") {
    return amount * 28.35;
  }
  if (fromUnit === "g" && toUnit === "ml") {
    return amount;
  }
  if (fromUnit === "ml" && toUnit === "g") {
    return amount;
  }
  if (fromUnit === "each" && toUnit === "slice") {
    return amount;
  }
  if (fromUnit === "block" && toUnit === "oz") {
    return amount * 14;
  }
  if (fromUnit === "oz" && toUnit === "block") {
    return amount / 14;
  }
  return null;
}

function calculateIngredientCost(line) {
  if (isPantryItem(line)) {
    return { item: line, cost: 0, note: "Pantry staple (on hand)" };
  }

  const { pkg, matchKey } = matchPackage(line);
  const used = parseUsedAmount(line);
  let usedAmount = convertAmount(used.amount, used.unit, pkg.unit);

  if (usedAmount == null) {
    usedAmount = Math.min(used.amount, pkg.size);
  }

  let fraction = usedAmount / pkg.size;
  if (!Number.isFinite(fraction) || fraction < 0) {
    fraction = 0;
  }
  fraction = Math.min(fraction, 1);

  const cost = pkg.price * fraction;
  const note = `$${pkg.price.toFixed(2)} ${pkg.label} × ${used.label} used`;

  return {
    item: line,
    cost: roundMoney(cost),
    package_key: matchKey,
    package_price: pkg.price,
    note,
  };
}

export function buildIngredientCostBreakdown(recipe) {
  return recipe.ingredients.map((item) => calculateIngredientCost(item));
}

export function totalFromBreakdown(ingredientCosts) {
  return roundMoney(ingredientCosts.reduce((sum, line) => sum + line.cost, 0));
}

function clampServings(value) {
  return Math.min(Math.max(Math.round(value), 1), 6);
}

function extractLeadingQuantity(line) {
  const lower = line.toLowerCase();
  const fractionMatch = lower.match(/^(\d+)\/(\d+)/);
  if (fractionMatch) {
    return Number(fractionMatch[1]) / Number(fractionMatch[2]);
  }
  const numberMatch = lower.match(/^(\d+(?:\.\d+)?)/);
  if (numberMatch) {
    return Number(numberMatch[1]);
  }
  return 1;
}

function extractOunces(line) {
  const lower = line.toLowerCase();
  const ozMatch = lower.match(/(\d+(?:\.\d+)?)\s*oz/);
  if (ozMatch) {
    return Number(ozMatch[1]);
  }
  return null;
}

function extractCups(line) {
  const lower = line.toLowerCase();
  const cupMatch = lower.match(/(\d+(?:\.\d+)?)\s*cups?/);
  if (cupMatch) {
    return Number(cupMatch[1]);
  }
  return null;
}

function isBatchDish(name) {
  return /soup|stew|chili|curry|tacos|burrito|mac and cheese|mac & cheese|sheet pan|one-pot|one pot|fried rice|spaghetti|aglio e olio|pasta(?! salad)|pizza(?! on)|casserole|lasagna|stir-fry|stir fry|roasted chickpeas|minestrone/.test(
    name
  );
}

function isSinglePortionDish(name) {
  if (isBatchDish(name)) {
    return false;
  }

  return /sandwich|salad|toast|tartine|smoothie|parfait|mug|omelette|overnight oats|wrap|rice bowl|quinoa bowl|couscous bowl|farro bowl|noodles bowl|brown rice bowl|tilapia bowl|salmon bowl|tofu bowl|sausage bowl|lentils bowl|chickpeas bowl|black beans bowl|veggie bowl|pilaf|crudit|snack|bites| plate|melt|quesadilla|pizza on tortilla|porridge|oatmeal|yogurt|hummus|caprese|lettuce cups|fried rice|broth sip|garlic bread|peanut butter|skillet|open-faced|steamed broccoli|garden tomato|tomato basil|rustic tomato|grilled tomato|sunny eggs|mediterranean|teriyaki glazed|olive oil rice|broccoli rice|light tuna|tea room|creamy tea|crispy celery|honey morning|creamy stovetop|strawberry yogurt|honey greek|cucumber hummus|mini caprese|cheesy black bean|crispy cheese|weeknight chicken|easy egg/.test(
    name
  );
}

export function inferServingSize(recipe) {
  const name = recipe.name.toLowerCase();
  const ingredients = recipe.ingredients || [];
  const estimates = [];

  if (/trail mix|energy bite|popcorn|snack mix|snack plate/.test(name)) {
    estimates.push(2);
  }

  if (/meal prep|batch|casserole|lasagna/.test(name)) {
    estimates.push(4);
  }

  for (const line of ingredients) {
    const lower = line.toLowerCase();
    const qty = extractLeadingQuantity(line);
    const cups = extractCups(line);
    const ounces = extractOunces(line);

    if (/\bcan\b/.test(lower) && /tomato|marinara|crushed|diced/.test(lower) && /soup|stew/.test(name)) {
      estimates.push(2);
    }

    if (cups != null && /broth|stock/.test(lower)) {
      estimates.push(cups);
    }

    if (ounces != null && /(pasta|spaghetti|macaroni|penne|linguine|orzo|elbow|noodle)/.test(lower)) {
      estimates.push(ounces / 2);
    }

    if (cups != null && /\brice\b/.test(lower)) {
      if (/cooked/.test(lower)) {
        estimates.push(cups);
      } else {
        estimates.push(cups * 3);
      }
    }

    if (/\blb\b/.test(lower) && /ground (beef|turkey|pork|chicken)/.test(lower)) {
      estimates.push(qty * 4);
    }

    if (/\blb\b/.test(lower) && /(chicken|pork|beef|turkey|sausage)/.test(lower) && !/ground/.test(lower)) {
      estimates.push(qty * 3);
    }

    if (/tortilla/.test(lower) && /taco/.test(name)) {
      estimates.push(Math.max(1, qty / 2));
    }

    if (/tortilla/.test(lower) && /quesadilla/.test(name)) {
      estimates.push(Math.max(1, qty));
    }

    if (/tortilla/.test(lower) && /burrito/.test(name)) {
      estimates.push(Math.max(1, qty));
    }

    if (/\d+\s*cans?\b/.test(lower) && /(beans|chickpeas|kidney|black bean|white bean|pinto)/.test(lower)) {
      const canMatch = lower.match(/(\d+(?:\.\d+)?)\s*cans?/);
      const cans = canMatch ? Number(canMatch[1]) : qty;
      if (/soup|stew|curry|chili|minestrone/.test(name)) {
        estimates.push(cans * 2);
      }
    }

    if (/\beggs?\b/.test(lower) && !/plant|eggplant|egg fried noodles/.test(lower)) {
      estimates.push(Math.max(1, qty / 2));
    }

    if (/sausage/.test(lower) && !/ground/.test(lower)) {
      const countMatch = lower.match(/^(\d+(?:\.\d+)?)/);
      const count = countMatch ? Number(countMatch[1]) : qty;
      estimates.push(count);
    }

    if (/slices?\s+(?:of\s+)?bread|bread.*slices?/.test(lower)) {
      estimates.push(Math.max(1, qty / 2));
    }

    if (ounces != null && /(chicken breast|salmon|tilapia|tofu|tempeh|shrimp)/.test(lower)) {
      if (ounces <= 8) {
        estimates.push(1);
      } else {
        estimates.push(ounces / 6);
      }
    }

    if (cups != null && /milk/.test(lower) && /mac and cheese|mac & cheese|baked mac/.test(name)) {
      estimates.push(cups * 2);
    }

    if (cups != null && /cheese/.test(lower) && /mac and cheese|mac & cheese|baked mac/.test(name)) {
      estimates.push(cups);
    }

    if (cups != null && /potato/.test(lower) && /sheet pan|roast/.test(name)) {
      estimates.push(Math.max(2, cups));
    }
  }

  if (/soup|stew|chili|curry|minestrone/.test(name) && estimates.length === 0) {
    estimates.push(4);
  }

  if (/soup|stew/.test(name) && estimates.length > 0) {
    estimates.push(2);
  }

  if (/mac and cheese|mac & cheese|spaghetti|aglio|pasta(?! salad)/.test(name) && estimates.length === 0) {
    estimates.push(4);
  }

  if (isSinglePortionDish(name)) {
    const batchEstimate = estimates.length > 0 ? Math.max(...estimates) : 1;
    if (batchEstimate <= 1.5) {
      return 1;
    }
  }

  if (estimates.length === 0) {
    return clampServings(recipe.serving_size || 1);
  }

  const sorted = [...estimates].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const peak = sorted[sorted.length - 1];

  const batchDish = isBatchDish(name);

  if (batchDish) {
    return clampServings(Math.max(median, peak * 0.85));
  }

  return clampServings(median);
}

export function computeShoppingCost(recipe) {
  const packages = new Map();

  for (const line of recipe.ingredients) {
    if (isPantryItem(line)) {
      continue;
    }

    const { pkg, matchKey } = matchPackage(line);
    packages.set(matchKey, pkg.price);
  }

  const shopping_cost = roundMoney(
    [...packages.values()].reduce((sum, price) => sum + price, 0)
  );

  if (shopping_cost <= 0) {
    return {
      shopping_cost: 0,
      shopping_cost_low: 0,
      shopping_cost_high: 0,
    };
  }

  const shopping_cost_low = Math.floor(shopping_cost);
  const shopping_cost_high = Math.max(
    shopping_cost_low + 1,
    Math.ceil(shopping_cost * 1.12)
  );

  return {
    shopping_cost,
    shopping_cost_low,
    shopping_cost_high,
  };
}

export function computeRecipeCosts(recipe) {
  const ingredient_costs = buildIngredientCostBreakdown(recipe);
  const cost_total = totalFromBreakdown(ingredient_costs);
  const serving_size = inferServingSize(recipe);
  const cost_per_serving = roundMoney(cost_total / serving_size);
  const shopping = computeShoppingCost(recipe);

  return {
    ingredient_costs,
    cost: cost_total,
    cost_total,
    cost_per_serving,
    serving_size,
    remaining_value: roundMoney(Math.max(shopping.shopping_cost - cost_total, 0)),
    ...shopping,
  };
}
