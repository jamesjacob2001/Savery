/** Procedural generators for unique college-budget recipes. */

export const SAUCE_STYLES = [
  { label: "Teriyaki", sauce: "3 tbsp teriyaki sauce", cuisine: "Japanese", spice: "Mild" },
  { label: "Buffalo", sauce: "2 tbsp buffalo sauce", cuisine: "American", spice: "Hot" },
  { label: "Garlic Herb", sauce: "2 tbsp garlic herb dressing", cuisine: "American", spice: "Mild" },
  { label: "Lemon Dill", sauce: "1 tbsp lemon juice and 1 tsp dill", cuisine: "Mediterranean", spice: "Mild" },
  { label: "Peanut", sauce: "2 tbsp peanut sauce", cuisine: "Thai", spice: "Medium" },
  { label: "Coconut Curry", sauce: "1/4 cup coconut milk and 1 tsp curry powder", cuisine: "Indian", spice: "Medium" },
  { label: "Honey Mustard", sauce: "2 tbsp honey mustard", cuisine: "American", spice: "Mild" },
  { label: "Sriracha Lime", sauce: "1 tbsp sriracha and 1 tsp lime juice", cuisine: "Asian", spice: "Hot" },
  { label: "BBQ", sauce: "3 tbsp BBQ sauce", cuisine: "American", spice: "Mild" },
  { label: "Sesame Ginger", sauce: "2 tbsp sesame ginger sauce", cuisine: "Asian", spice: "Medium" },
  { label: "Chipotle Lime", sauce: "1 tbsp chipotle sauce and 1 tsp lime juice", cuisine: "Mexican", spice: "Hot" },
  { label: "Miso Maple", sauce: "1 tbsp miso paste and 1 tsp maple syrup", cuisine: "Japanese", spice: "Mild" },
];

export const PROTEINS = [
  { label: "Chicken", amount: "6 oz chicken breast, sliced", diet: "None" },
  { label: "Turkey", amount: "6 oz turkey breast, sliced", diet: "None" },
  { label: "Tofu", amount: "8 oz firm tofu, cubed", diet: "Vegan" },
  { label: "Shrimp", amount: "5 oz shrimp, peeled", diet: "Pescatarian" },
  { label: "Salmon", amount: "5 oz salmon fillet", diet: "Pescatarian" },
  { label: "Tilapia", amount: "5 oz tilapia fillet", diet: "Pescatarian" },
  { label: "Ground Beef", amount: "5 oz lean ground beef", diet: "None" },
  { label: "Ground Turkey", amount: "5 oz ground turkey", diet: "None" },
  { label: "Chickpeas", amount: "1 cup cooked chickpeas", diet: "Vegan" },
  { label: "Black Beans", amount: "1 cup black beans, drained", diet: "Vegan" },
  { label: "Lentils", amount: "1 cup cooked lentils", diet: "Vegan" },
  { label: "Tuna", amount: "1 can tuna, drained", diet: "Pescatarian" },
  { label: "Tempeh", amount: "4 oz tempeh, sliced", diet: "Vegan" },
  { label: "Pork", amount: "5 oz pork tenderloin, sliced", diet: "None" },
  { label: "Sausage", amount: "2 chicken sausages, sliced", diet: "None" },
];

export const GRAINS = [
  { label: "Rice", amount: "1 cup cooked rice" },
  { label: "Quinoa", amount: "1 cup cooked quinoa" },
  { label: "Couscous", amount: "1 cup cooked couscous" },
  { label: "Brown Rice", amount: "1 cup cooked brown rice" },
  { label: "Noodles", amount: "4 oz cooked noodles" },
  { label: "Farro", amount: "1 cup cooked farro" },
];

export const VEGETABLES = [
  "1 cup broccoli florets",
  "1 cup bell pepper strips",
  "1 cup spinach",
  "1 cup sliced mushrooms",
  "1 cup zucchini slices",
  "1 cup shredded carrots",
  "1 cup snap peas",
  "1 cup kale, chopped",
  "1 cup corn kernels",
  "1 cup diced tomatoes",
  "1 cup shredded cabbage",
  "1/2 cup edamame",
];

export const BREAKFAST_TEMPLATES = [
  {
    name: "Apple Cinnamon Oatmeal",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["1/2 cup rolled oats", "1 cup milk", "1/2 diced apple", "1 tsp cinnamon", "1 tbsp honey"],
    instructions: ["Simmer oats and milk 5 minutes.", "Stir in apple and cinnamon.", "Sweeten with honey and serve."],
  },
  {
    name: "Berry Yogurt Smoothie Bowl",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["1 cup frozen mixed berries", "1/2 cup Greek yogurt", "1/2 banana", "2 tbsp granola", "1 tsp honey"],
    instructions: ["Blend berries, yogurt, and banana until thick.", "Pour into a bowl.", "Top with granola and honey."],
  },
  {
    name: "Spinach and Feta Egg Scramble",
    cuisine: "Mediterranean",
    meal_type: "Breakfast",
    ingredients: ["3 eggs", "1 cup spinach", "2 tbsp crumbled feta", "1 tbsp olive oil", "Salt and pepper"],
    instructions: ["Sauté spinach in olive oil.", "Whisk eggs and pour into pan.", "Scramble gently and fold in feta."],
  },
  {
    name: "Peanut Butter Toast with Strawberries",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["2 slices whole wheat bread", "2 tbsp peanut butter", "1/2 cup sliced strawberries", "1 tsp chia seeds"],
    instructions: ["Toast bread.", "Spread peanut butter on each slice.", "Top with strawberries and chia seeds."],
  },
  {
    name: "Ham and Cheese Breakfast Melt",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["2 slices bread", "2 slices ham", "1 slice cheddar cheese", "1 egg", "1 tsp butter"],
    instructions: ["Butter bread and layer ham and cheese.", "Fry egg and place on sandwich.", "Toast in pan until cheese melts."],
  },
  {
    name: "Cottage Cheese Fruit Bowl",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["1 cup cottage cheese", "1/2 cup pineapple chunks", "1/4 cup blueberries", "1 tbsp honey", "2 tbsp walnuts"],
    instructions: ["Add cottage cheese to a bowl.", "Top with fruit and walnuts.", "Drizzle with honey."],
  },
  {
    name: "Sweet Potato Hash with Egg",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["1 small sweet potato, diced", "1/2 onion, diced", "2 eggs", "1 tbsp olive oil", "1 tsp paprika"],
    instructions: ["Sauté sweet potato and onion until tender.", "Season with paprika.", "Fry eggs and serve over hash."],
  },
  {
    name: "Banana Pancake Mug Cake",
    cuisine: "American",
    meal_type: "Breakfast",
    ingredients: ["1/2 mashed banana", "1/4 cup flour", "1 egg", "2 tbsp milk", "1 tsp maple syrup"],
    instructions: ["Mix all ingredients in a mug.", "Microwave 90 seconds.", "Serve warm with extra syrup if desired."],
  },
];

export const SOUP_TEMPLATES = [
  {
    prefix: "Tomato Basil",
    broth: "2 cups vegetable broth",
    extras: ["1 can diced tomatoes", "1/2 cup fresh basil", "2 cloves garlic", "1 tbsp olive oil"],
    cuisine: "Italian",
    spice: "Mild",
  },
  {
    prefix: "Minestrone",
    broth: "3 cups vegetable broth",
    extras: ["1/2 cup kidney beans", "1/2 cup diced carrots", "1/2 cup pasta shells", "1/2 cup spinach"],
    cuisine: "Italian",
    spice: "Mild",
  },
  {
    prefix: "Chicken Noodle",
    broth: "3 cups chicken broth",
    extras: ["1/2 cup shredded chicken", "1/2 cup egg noodles", "1/2 cup diced carrots", "1 celery stalk"],
    cuisine: "American",
    spice: "Mild",
  },
  {
    prefix: "Butternut Squash",
    broth: "2 cups vegetable broth",
    extras: ["1 cup roasted butternut squash", "1/2 cup coconut milk", "1 tsp nutmeg", "1 tbsp olive oil"],
    cuisine: "American",
    spice: "Mild",
  },
  {
    prefix: "White Bean Kale",
    broth: "3 cups vegetable broth",
    extras: ["1 can white beans", "1 cup kale", "1/2 onion, diced", "2 cloves garlic"],
    cuisine: "Mediterranean",
    spice: "Mild",
  },
];

export const PASTA_NAMES = [
  "Creamy Mushroom Pasta",
  "Sun-Dried Tomato Pasta",
  "Spinach Alfredo Pasta",
  "Arrabbiata Pasta",
  "Lemon Caper Pasta",
  "Roasted Red Pepper Pasta",
  "Broccoli Cheddar Pasta",
  "Tomato Basil Penne",
  "Garlic Butter Linguine",
  "Vegetable Primavera Pasta",
  "Pesto Zucchini Pasta",
  "One-Pan Sausage Pasta",
  "Tuna Olive Pasta",
  "Bacon Pea Pasta",
  "Four-Cheese Baked Pasta",
];

export const SANDWICH_NAMES = [
  "Turkey Avocado Club",
  "Roast Beef and Horseradish Sandwich",
  "Egg Salad Sandwich",
  "BLT Sandwich",
  "Veggie Hummus Pita",
  "Chicken Pesto Panini",
  "Meatball Sub",
  "Philly Cheesesteak Slider",
  "Tuna Melt",
  "Grilled Portobello Sandwich",
  "Ham and Swiss on Rye",
  "Caprese Panini",
  "Buffalo Chicken Wrap",
  "Falafel Wrap with Tahini",
  "Southwest Black Bean Wrap",
];

export const SNACK_NAMES = [
  "Roasted Almonds and Dried Cranberries",
  "Apple Slices with Almond Butter",
  "Celery with Peanut Butter",
  "Cheese and Crackers Plate",
  "Veggie Sticks with Ranch",
  "Yogurt with Granola",
  "Dark Chocolate Covered Banana Bites",
  "Rice Cakes with Hummus",
  "Hard-Boiled Eggs with Everything Seasoning",
  "Frozen Grape Snack Cup",
];

export const DESSERT_NAMES = [
  "Microwave Chocolate Mug Cake",
  "Strawberry Banana Nice Cream",
  "Peanut Butter Cookie Bites",
  "Baked Cinnamon Apples",
  "Yogurt Parfait with Honey",
  "No-Bake Oreo Truffles",
  "Rice Pudding with Cinnamon",
  "Grilled Peaches with Yogurt",
  "Chocolate Dipped Strawberries",
  "Frozen Yogurt Bark",
];

export function buildBowlRecipe(sauce, protein, grain, vegetable) {
  return {
    name: `${sauce.label} ${protein.label} ${grain.label} Bowl`,
    cuisine: sauce.cuisine,
    meal_type: "Dinner",
    spice_level: sauce.spice,
    dietary_restrictions: protein.diet,
    ingredients: [
      protein.amount,
      grain.amount,
      vegetable,
      sauce.sauce,
      "1 tbsp olive oil",
      "Salt and pepper",
    ],
    instructions: [
      `Cook ${grain.label.toLowerCase()} according to package directions.`,
      `Cook ${protein.label.toLowerCase()} in olive oil with salt and pepper.`,
      `Steam or sauté vegetables until tender.`,
      `Combine in a bowl and toss with ${sauce.label.toLowerCase()} sauce.`,
    ],
  };
}

export function buildSoupRecipe(template, suffix) {
  const isStew = suffix === "Stew";
  const ingredients = isStew
    ? [template.broth.replace("2 cups", "1.5 cups").replace("3 cups", "2 cups"), ...template.extras, "1 small potato, diced", "Salt and pepper"]
    : [template.broth, ...template.extras, "Salt and pepper"];

  return {
    name: `${template.prefix} ${suffix}`,
    cuisine: template.cuisine,
    meal_type: "Lunch",
    spice_level: template.spice,
    dietary_restrictions: suffix.includes("Chicken") ? "None" : "Vegetarian",
    ingredients,
    instructions: isStew
      ? [
          "Sauté aromatics in a pot with olive oil if needed.",
          "Add broth, potato, and remaining ingredients.",
          "Simmer 30 minutes until thick and vegetables are tender.",
        ]
      : [
          "Sauté aromatics in a pot with olive oil if needed.",
          "Add broth and remaining ingredients.",
          "Simmer 20 minutes until flavors meld and vegetables are tender.",
        ],
  };
}

export function buildPastaRecipe(name) {
  const hasMeat = /sausage|bacon|tuna|meatball|chicken|beef/i.test(name);
  const ingredients = [
    "8 oz pasta",
    "2 tbsp olive oil",
    "2 cloves garlic, minced",
    "Salt and pepper",
  ];

  if (/mushroom/i.test(name)) {
    ingredients.push("1 cup sliced mushrooms", "1/4 cup cream", "1/2 cup grated Parmesan");
  } else if (/sun-dried/i.test(name)) {
    ingredients.push("1/3 cup sun-dried tomatoes", "2 tbsp basil", "1/2 cup grated Parmesan");
  } else if (/arrabbiata/i.test(name)) {
    ingredients.push("1 cup crushed tomatoes", "1 tsp red pepper flakes", "2 tbsp Parmesan");
  } else if (/tomato basil penne/i.test(name)) {
    ingredients.push("1 cup marinara sauce", "1/4 cup fresh basil", "2 tbsp Parmesan");
  } else if (/lemon caper/i.test(name)) {
    ingredients.push("1 lemon, zested", "2 tbsp capers", "2 tbsp Parmesan");
  } else if (/red pepper/i.test(name)) {
    ingredients.push("1/2 cup roasted red peppers", "1/4 cup ricotta", "1 tbsp balsamic vinegar");
  } else if (/broccoli cheddar/i.test(name)) {
    ingredients.push("1 cup broccoli florets", "1/2 cup cheddar cheese", "1/4 cup milk");
  } else if (/garlic butter/i.test(name)) {
    ingredients.push("3 tbsp butter", "1 tbsp parsley", "1/2 cup Parmesan");
  } else if (/primavera/i.test(name)) {
    ingredients.push("1 cup mixed vegetables", "1/2 cup tomato sauce", "2 tbsp Parmesan");
  } else if (/pesto zucchini/i.test(name)) {
    ingredients.push("1 cup zucchini ribbons", "3 tbsp pesto", "2 tbsp Parmesan");
  } else if (/sausage/i.test(name)) {
    ingredients.push("2 sliced chicken sausages", "1 cup tomato sauce", "1/2 cup Parmesan");
  } else if (/tuna/i.test(name)) {
    ingredients.push("1 can tuna, drained", "1/4 cup olives", "1 tbsp lemon juice");
  } else if (/bacon/i.test(name)) {
    ingredients.push("3 slices cooked bacon", "1 cup peas", "1/2 cup Parmesan");
  } else if (/alfredo|four-cheese/i.test(name)) {
    if (/four-cheese/i.test(name)) {
      ingredients.push("1/4 cup cream", "1/4 cup mozzarella", "2 tbsp Parmesan", "2 tbsp ricotta", "1 tbsp fontina");
    } else {
      ingredients.push("1 cup spinach", "1/4 cup cream", "1/2 cup Parmesan");
    }
  } else if (/spinach/i.test(name)) {
    ingredients.push("1 cup spinach", "1/4 cup cream", "1/2 cup Parmesan");
  } else {
    ingredients.push("1 cup tomato sauce", "2 tbsp Parmesan");
  }

  return {
    name,
    cuisine: "Italian",
    meal_type: "Dinner",
    spice_level: /arrabbiata/i.test(name) ? "Medium" : "Mild",
    dietary_restrictions: hasMeat ? "None" : "Vegetarian",
    ingredients,
    instructions: [
      "Boil pasta until al dente; reserve 1/4 cup pasta water.",
      "Sauté garlic (and protein/vegetables if using) in olive oil.",
      "Toss pasta with sauce ingredients and pasta water.",
      "Finish with cheese or herbs, salt, and pepper.",
    ],
  };
}

export function buildSandwichRecipe(name) {
  const isWrap = /wrap|pita/i.test(name);
  const base = isWrap ? "1 large tortilla or pita" : "2 slices bread";
  const ingredients = [base, "Salt and pepper"];

  if (/turkey avocado club/i.test(name)) {
    ingredients.push("4 oz sliced turkey", "1/4 avocado", "2 tbsp mayo", "Lettuce");
  } else if (/roast beef/i.test(name)) {
    ingredients.push("4 oz roast beef", "1 tbsp horseradish sauce", "1 slice onion", "Lettuce");
  } else if (/egg salad/i.test(name)) {
    ingredients.push("2 hard-boiled eggs, chopped", "2 tbsp mayo", "1 tsp mustard", "1 celery stalk, diced");
  } else if (/blt/i.test(name)) {
    ingredients.push("3 slices bacon", "1 tomato, sliced", "2 tbsp mayo", "Lettuce");
  } else if (/veggie hummus pita/i.test(name)) {
    ingredients.push("1/3 cup hummus", "1/2 cup sliced cucumber", "1/4 cup shredded carrot", "1/4 cup spinach");
  } else if (/chicken pesto panini/i.test(name)) {
    ingredients.push("4 oz grilled chicken", "2 tbsp pesto", "2 oz mozzarella", "1 tomato slice");
  } else if (/meatball sub/i.test(name)) {
    ingredients.push("4 meatballs", "1/2 cup marinara", "1/4 cup mozzarella", "1 tbsp Parmesan");
  } else if (/philly/i.test(name)) {
    ingredients.push("4 oz sliced steak", "1/4 cup sautéed peppers and onions", "1 slice provolone");
  } else if (/tuna melt/i.test(name)) {
    ingredients.push("1 can tuna", "2 tbsp mayo", "1 slice cheddar", "1 celery stalk, diced");
  } else if (/portobello/i.test(name)) {
    ingredients.push("1 grilled portobello cap", "1/4 cup roasted peppers", "2 tbsp goat cheese");
  } else if (/ham and swiss/i.test(name)) {
    ingredients.push("3 oz ham", "1 slice Swiss cheese", "1 tsp mustard", "Lettuce");
  } else if (/caprese panini/i.test(name)) {
    ingredients.push("2 oz mozzarella", "2 tomato slices", "2 tbsp pesto", "1 tbsp balsamic glaze");
  } else if (/buffalo chicken wrap/i.test(name)) {
    ingredients.push("4 oz shredded chicken", "2 tbsp buffalo sauce", "1/4 cup lettuce", "2 tbsp ranch");
  } else if (/falafel wrap/i.test(name)) {
    ingredients.push("3 falafel patties", "2 tbsp tahini", "1/2 cup shredded cabbage", "2 tbsp pickles");
  } else if (/southwest black bean wrap/i.test(name)) {
    ingredients.push("1/2 cup black beans", "1/4 cup corn", "2 tbsp salsa", "1/4 cup shredded cheese");
  } else {
    ingredients.push("2 tbsp spread", "3 oz protein or cheese", "Lettuce");
  }

  return {
    name,
    cuisine: /falafel|hummus/i.test(name) ? "Middle Eastern" : /southwest|black bean/i.test(name) ? "Mexican" : "American",
    meal_type: "Lunch",
    spice_level: /buffalo|southwest/i.test(name) ? "Hot" : "Mild",
    dietary_restrictions: /veggie|hummus|falafel|black bean|portobello/i.test(name) ? "Vegetarian" : "None",
    ingredients,
    instructions: [
      "Prepare fillings and season with salt and pepper.",
      "Layer ingredients on bread or wrap.",
      "Toast or grill if desired, then serve.",
    ],
  };
}

export function buildSnackRecipe(name) {
  return {
    name,
    cuisine: "American",
    meal_type: "Snack",
    spice_level: "Mild",
    dietary_restrictions: /yogurt|fruit|veggie|apple|celery|grape/i.test(name) ? "Vegetarian" : "None",
    ingredients: name.includes("Almonds")
      ? ["1/4 cup roasted almonds", "2 tbsp dried cranberries"]
      : name.includes("Apple")
        ? ["1 apple, sliced", "2 tbsp almond butter"]
        : name.includes("Celery")
          ? ["2 celery stalks", "2 tbsp peanut butter"]
          : name.includes("Cheese")
            ? ["4 crackers", "2 oz cheddar cheese"]
            : name.includes("Veggie")
              ? ["1 cup carrot and cucumber sticks", "2 tbsp ranch dressing"]
              : name.includes("Yogurt")
                ? ["1 cup yogurt", "1/4 cup granola"]
                : name.includes("Chocolate")
                  ? ["1/2 banana", "2 tbsp melted dark chocolate"]
                  : name.includes("Rice Cakes")
                    ? ["2 rice cakes", "3 tbsp hummus"]
                    : name.includes("Hard-Boiled")
                      ? ["2 hard-boiled eggs", "1 tsp everything seasoning"]
                      : ["1 cup frozen grapes"],
    instructions: [
      "Portion ingredients into a bowl or container.",
      "Serve immediately or pack for later.",
    ],
  };
}

export function buildDessertRecipe(name) {
  return {
    name,
    cuisine: "American",
    meal_type: "Dessert",
    spice_level: "Mild",
    dietary_restrictions: "Vegetarian",
    ingredients: name.includes("Mug Cake")
      ? ["3 tbsp flour", "2 tbsp cocoa powder", "2 tbsp sugar", "3 tbsp milk", "1 tbsp oil"]
      : name.includes("Nice Cream")
        ? ["2 frozen bananas", "1/2 cup strawberries", "2 tbsp milk"]
        : name.includes("Cookie")
          ? ["1/2 cup oats", "3 tbsp peanut butter", "2 tbsp honey", "2 tbsp mini chocolate chips"]
          : name.includes("Cinnamon Apples")
            ? ["2 apples, sliced", "1 tbsp butter", "1 tsp cinnamon", "1 tbsp brown sugar"]
            : name.includes("Parfait")
              ? ["1 cup yogurt", "1/2 cup berries", "1 tbsp honey", "2 tbsp granola"]
              : name.includes("Truffles")
                ? ["8 crushed cookies", "3 tbsp cream cheese", "1/4 cup chocolate chips"]
                : name.includes("Rice Pudding")
                  ? ["1/2 cup cooked rice", "1 cup milk", "2 tbsp sugar", "1 tsp cinnamon"]
                  : name.includes("Peaches")
                    ? ["2 peach halves", "1/2 cup yogurt", "1 tbsp honey"]
                    : name.includes("Strawberries")
                      ? ["1 cup strawberries", "1/2 cup melted chocolate"]
                      : ["1 cup yogurt", "1/4 cup berries", "2 tbsp honey, frozen flat"],
    instructions: name.includes("Mug Cake")
      ? ["Mix ingredients in a mug.", "Microwave 90 seconds.", "Cool slightly and eat."]
      : name.includes("Nice Cream")
        ? ["Blend frozen fruit with milk until creamy.", "Serve immediately."]
        : name.includes("Cookie")
          ? ["Mix ingredients, roll into balls.", "Chill 30 minutes before serving."]
          : name.includes("Cinnamon Apples")
            ? ["Simmer apples with butter, cinnamon, and sugar 10 minutes.", "Serve warm."]
            : name.includes("Parfait")
              ? ["Layer yogurt, berries, and granola in a glass.", "Drizzle with honey."]
              : name.includes("Truffles")
                ? ["Mix cookie crumbs and cream cheese.", "Roll into balls and dip in melted chocolate.", "Chill until set."]
                : name.includes("Rice Pudding")
                  ? ["Simmer rice and milk with sugar until creamy.", "Top with cinnamon."]
                  : name.includes("Peaches")
                    ? ["Grill peaches 2 minutes per side.", "Serve with yogurt and honey."]
                    : name.includes("Strawberries")
                      ? ["Dip strawberries in chocolate.", "Chill until chocolate sets."]
                      : ["Spread yogurt and berries on parchment.", "Freeze 2 hours and break into pieces."],
  };
}

export function buildTacoRecipe(index) {
  const styles = [
    { name: "Fish Tacos with Slaw", protein: "5 oz white fish fillets", cuisine: "Mexican", extra: ["1 cup shredded cabbage", "2 tbsp lime crema"] },
    { name: "Carnitas Style Pork Tacos", protein: "5 oz pulled pork", cuisine: "Mexican", extra: ["1/4 cup diced onion", "2 tbsp salsa verde"] },
    { name: "Grilled Vegetable Tacos", protein: "1 cup grilled mixed vegetables", cuisine: "Mexican", extra: ["1/4 cup black beans", "2 tbsp guacamole"], diet: "Vegetarian" },
    { name: "Breakfast Egg and Potato Tacos", protein: "2 scrambled eggs", cuisine: "Mexican", extra: ["1/2 cup diced potatoes", "1/4 cup shredded cheese"], meal: "Breakfast" },
    { name: "Chipotle Chicken Tacos", protein: "5 oz shredded chicken", cuisine: "Mexican", extra: ["2 tbsp chipotle sauce", "1/4 cup lettuce"] },
    { name: "Mushroom and Bean Tacos", protein: "1 cup sautéed mushrooms", cuisine: "Mexican", extra: ["1/2 cup pinto beans", "2 tbsp pico de gallo"], diet: "Vegan" },
    { name: "Steak and Pepper Tacos", protein: "5 oz sliced steak", cuisine: "Mexican", extra: ["1/2 cup bell peppers", "2 tbsp queso fresco"] },
    { name: "Shrimp Lime Tacos", protein: "5 oz cooked shrimp", cuisine: "Mexican", extra: ["2 tbsp lime juice", "1/4 cup cilantro"] },
  ];
  const style = styles[index % styles.length];
  const variant = index >= styles.length ? ` ${Math.floor(index / styles.length) + 1}` : "";
  return {
    name: `${style.name}${variant}`.trim(),
    cuisine: style.cuisine,
    meal_type: style.meal || "Dinner",
    spice_level: /chipotle|steak/i.test(style.name) ? "Medium" : "Mild",
    dietary_restrictions: style.diet || "None",
    ingredients: [
      "4 small corn or flour tortillas",
      style.protein,
      ...style.extra,
      "1 tbsp olive oil",
      "Salt and pepper",
    ],
    instructions: [
      "Warm tortillas in a dry pan.",
      "Cook protein with oil, salt, and pepper.",
      "Fill tortillas with protein and toppings.",
    ],
  };
}

export function buildStirFryRecipe(index) {
  const bases = ["Rice", "Noodles"];
  const proteins = ["Chicken", "Beef", "Tofu", "Shrimp", "Pork"];
  const veggies = ["Broccoli", "Bell Pepper", "Snap Pea", "Mushroom", "Carrot"];
  const base = bases[index % bases.length];
  const protein = proteins[Math.floor(index / bases.length) % proteins.length];
  const veg = veggies[Math.floor(index / (bases.length * proteins.length)) % veggies.length];
  const num = Math.floor(index / (bases.length * proteins.length * veggies.length)) + 1;
  const name = num > 1
    ? `${protein} and ${veg} Stir-Fry ${num}`
    : `${protein} and ${veg} Stir-Fry`;

  const proteinIng =
    protein === "Chicken" ? "6 oz chicken breast, sliced" :
    protein === "Beef" ? "5 oz sirloin, sliced" :
    protein === "Tofu" ? "8 oz firm tofu, cubed" :
    protein === "Shrimp" ? "5 oz shrimp" :
    "5 oz pork, sliced";

  return {
    name,
    cuisine: "Asian",
    meal_type: "Dinner",
    spice_level: "Medium",
    dietary_restrictions: protein === "Tofu" ? "Vegan" : "None",
    ingredients: [
      proteinIng,
      base === "Rice" ? "1 cup cooked rice" : "4 oz cooked noodles",
      `1 cup ${veg.toLowerCase()}s`,
      "3 tbsp soy sauce",
      "1 tbsp cornstarch",
      "2 cloves garlic, minced",
      "1 tbsp vegetable oil",
    ],
    instructions: [
      "Mix soy sauce and cornstarch for sauce.",
      "Stir-fry protein in oil until cooked; set aside.",
      "Stir-fry vegetables and garlic until crisp-tender.",
      "Return protein, add sauce, and serve over rice or noodles.",
    ],
  };
}

export function buildOnePotRecipe(index) {
  const dishes = [
    { name: "One-Pot Creamy Tomato Pasta", ing: ["8 oz pasta", "1 can crushed tomatoes", "2 cups vegetable broth", "1/2 cup cream", "2 cloves garlic"], cuisine: "Italian" },
    { name: "One-Pot Spanish Rice with Chorizo", ing: ["1 cup rice", "2 cups chicken broth", "3 oz chorizo, sliced", "1/2 cup peas", "1 tsp paprika"], cuisine: "Spanish" },
    { name: "One-Pot Lentil Vegetable Stew", ing: ["1 cup lentils", "3 cups vegetable broth", "1 cup diced potatoes", "1 cup carrots", "1 tsp cumin"], cuisine: "Mediterranean", diet: "Vegan" },
    { name: "One-Pot Chicken Orzo", ing: ["6 oz chicken thighs", "1 cup orzo", "2 cups chicken broth", "1 cup spinach", "1 lemon wedge"], cuisine: "Mediterranean" },
    { name: "One-Pot Beef and Potato Skillet", ing: ["5 oz ground beef", "2 cups diced potatoes", "1/2 onion", "1 cup beef broth", "1 tsp Worcestershire sauce"], cuisine: "American" },
    { name: "One-Pot Coconut Chickpea Stew", ing: ["2 cans chickpeas", "1 can coconut milk", "1 cup diced tomatoes", "1 cup spinach", "1 tbsp curry powder"], cuisine: "Indian", diet: "Vegan" },
    { name: "One-Pot Sausage and Peppers Rice", ing: ["2 chicken sausages", "1 cup rice", "2 cups chicken broth", "1 bell pepper", "1 tsp Italian seasoning"], cuisine: "Italian" },
    { name: "One-Pot Turkey Chili", ing: ["5 oz ground turkey", "1 can kidney beans", "1 can diced tomatoes", "1 cup corn", "2 tbsp chili powder"], cuisine: "American" },
  ];
  const dish = dishes[index % dishes.length];
  const suffix = index >= dishes.length ? ` ${Math.floor(index / dishes.length) + 1}` : "";
  return {
    name: `${dish.name}${suffix}`.trim(),
    cuisine: dish.cuisine,
    meal_type: "Dinner",
    spice_level: /chili|chorizo|curry/i.test(dish.name) ? "Medium" : "Mild",
    dietary_restrictions: dish.diet || "None",
    ingredients: [...dish.ing, "1 tbsp olive oil", "Salt and pepper"],
    instructions: [
      "Brown meat or aromatics in olive oil if needed.",
      "Add remaining ingredients to one pot.",
      "Simmer covered until grains or proteins are fully cooked.",
    ],
  };
}

export function buildBreakfastVariation(index) {
  const bases = ["Oats", "Smoothie", "Toast", "Eggs", "Parfait", "Burrito", "Quesadilla", "Waffle"];
  const flavors = ["Banana", "Berry", "Apple", "Mango", "Peach", "Almond", "Cinnamon", "Maple", "Honey", "Coconut"];
  const base = bases[index % bases.length];
  const flavor = flavors[Math.floor(index / bases.length) % flavors.length];
  const num = Math.floor(index / (bases.length * flavors.length)) + 1;
  const name = num > 1 ? `${flavor} ${base} Breakfast ${num}` : `${flavor} ${base} Breakfast`;

  if (base === "Oats") {
    return {
      name,
      cuisine: "American",
      meal_type: "Breakfast",
      spice_level: "Mild",
      dietary_restrictions: "Vegetarian",
      ingredients: ["1/2 cup rolled oats", "1 cup milk", `1/2 cup ${flavor.toLowerCase()}`, "1 tbsp honey", "Pinch of cinnamon"],
      instructions: ["Combine oats and milk in a pot.", "Simmer 5 minutes.", "Stir in fruit and honey."],
    };
  }
  if (base === "Smoothie") {
    return {
      name,
      cuisine: "American",
      meal_type: "Breakfast",
      spice_level: "Mild",
      dietary_restrictions: "Vegetarian",
      ingredients: [`1/2 cup ${flavor.toLowerCase()}`, "1 banana", "1 cup milk", "1 tbsp peanut butter", "1 tsp honey"],
      instructions: ["Blend all ingredients until smooth.", "Serve immediately over ice if desired."],
    };
  }
  if (base === "Toast") {
    return {
      name,
      cuisine: "American",
      meal_type: "Breakfast",
      spice_level: "Mild",
      dietary_restrictions: "Vegetarian",
      ingredients: ["2 slices bread", "1 tbsp butter", `1/2 cup ${flavor.toLowerCase()}`, "1 tsp honey", "Pinch of salt"],
      instructions: ["Toast bread.", "Top with butter and fruit.", "Drizzle with honey."],
    };
  }
  if (base === "Eggs") {
    return {
      name,
      cuisine: "American",
      meal_type: "Breakfast",
      spice_level: "Mild",
      dietary_restrictions: "Vegetarian",
      ingredients: ["3 eggs", `1/4 cup diced ${flavor.toLowerCase()}`, "1 tbsp butter", "2 tbsp shredded cheese", "Salt and pepper"],
      instructions: ["Whisk eggs with salt and pepper.", "Scramble in butter with fruit and cheese."],
    };
  }
  if (base === "Parfait") {
    return {
      name,
      cuisine: "American",
      meal_type: "Breakfast",
      spice_level: "Mild",
      dietary_restrictions: "Vegetarian",
      ingredients: ["1 cup yogurt", `1/2 cup ${flavor.toLowerCase()}`, "1/4 cup granola", "1 tbsp honey", "1 tbsp chia seeds"],
      instructions: ["Layer yogurt, fruit, and granola in a glass.", "Top with honey and chia seeds."],
    };
  }
  if (base === "Burrito") {
    return {
      name,
      cuisine: "Mexican",
      meal_type: "Breakfast",
      spice_level: "Mild",
      dietary_restrictions: "Vegetarian",
      ingredients: ["1 large tortilla", "2 scrambled eggs", `1/4 cup ${flavor.toLowerCase()}`, "1/4 cup shredded cheese", "2 tbsp salsa"],
      instructions: ["Scramble eggs.", "Fill tortilla with eggs, fruit, cheese, and salsa.", "Roll and toast seam-side down."],
    };
  }
  if (base === "Quesadilla") {
    return {
      name,
      cuisine: "Mexican",
      meal_type: "Breakfast",
      spice_level: "Mild",
      dietary_restrictions: "Vegetarian",
      ingredients: ["2 tortillas", "2 eggs", `1/4 cup ${flavor.toLowerCase()}`, "1/2 cup cheese", "1 tbsp butter"],
      instructions: ["Scramble eggs with fruit.", "Sandwich filling between tortillas with cheese.", "Cook in butter until golden."],
    };
  }
  return {
    name,
    cuisine: "American",
    meal_type: "Breakfast",
    spice_level: "Mild",
    dietary_restrictions: "Vegetarian",
    ingredients: ["2 frozen waffles", `1/2 cup ${flavor.toLowerCase()}`, "1 tbsp maple syrup", "1 tbsp butter", "1 tsp cinnamon"],
    instructions: ["Toast waffles.", "Top with fruit, butter, syrup, and cinnamon."],
  };
}
