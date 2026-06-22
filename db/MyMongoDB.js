import { MongoClient } from "mongodb";

export default function SaveryMongoDB({
  DB_NAME = "Savery",
  collectionName = "Recipes",
  defaultUri = "mongodb://localhost:27017",
} = {}) {
  const me = {};
  const URI = process.env.MONGODB_URI || defaultUri;

  const connect = async () => {
    const client = new MongoClient(URI);
    await client.connect();
    const collection = client.db(DB_NAME).collection(collectionName);

    return { client, collection };
  };

  me.getRecipes = async ({ query = {} } = {}) => {
    const { client, collection } = await connect();
    try {
      return await collection.find(query).toArray();
    } catch (error) {
      console.error("Error getting recipes", error);
      throw error;
    } finally {
      await client.close();
    }
  };

  me.getNextRecipeId = async () => {
    const { client, collection } = await connect();
    try {
      const top = await collection
        .find({})
        .sort({ id: -1 })
        .limit(1)
        .toArray();
      return top.length ? Number(top[0].id) + 1 : 1;
    } catch (error) {
      console.error("Error getting next recipe id", error);
      throw error;
    } finally {
      await client.close();
    }
  };

  me.createRecipe = async (recipeDoc) => {
    const { client, collection } = await connect();
    try {
      const result = await collection.insertOne(recipeDoc);
      return { ...recipeDoc, _id: result.insertedId };
    } catch (error) {
      console.error("Error creating recipe", error);
      throw error;
    } finally {
      await client.close();
    }
  };

  me.getFavorites = async (userId) => {
  const { client } = await connect();

  try {
    const db = client.db(DB_NAME);
    const favoritesCollection = db.collection("Favorites");
    const recipesCollection = db.collection("Recipes");

    const favorites = await favoritesCollection
      .find({ userId })
      .sort({ savedAt: -1 })
      .toArray();

    const recipeIds = favorites.map((favorite) => favorite.recipeId);

    const recipes = await recipesCollection
      .find({ id: { $in: recipeIds } })
      .toArray();

    return recipes;
  } finally {
    await client.close();
  }
};

me.createFavorite = async (userId, recipeId) => {
  const { client } = await connect();

  try {
    const db = client.db(DB_NAME);
    const favoritesCollection = db.collection("Favorites");

    const favoriteDoc = {
      userId,
      recipeId,
      savedAt: new Date(),
    };

    await favoritesCollection.updateOne(
      { userId, recipeId },
      { $setOnInsert: favoriteDoc },
      { upsert: true }
    );

    return favoriteDoc;
  } finally {
    await client.close();
  }
};

me.deleteFavorite = async (userId, recipeId) => {
  const { client } = await connect();

  try {
    const db = client.db(DB_NAME);
    const favoritesCollection = db.collection("Favorites");

    await favoritesCollection.deleteOne({ userId, recipeId });

    return true;
  } finally {
    await client.close();
  }
};


/**
 * Retrieves all saved meal plans for a user.
 * Meal plans are sorted so the most recently updated appears first.
 */
me.getMealPlans = async (userId) => {
  const { client } = await connect();

  try {
    const db = client.db(DB_NAME);
    const mealPlansCollection = db.collection("MealPlans");

    return await mealPlansCollection
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();
  } finally {
    await client.close();
  }
};

/**
 * Creates a new meal plan document in MongoDB.
 * Each meal plan belongs to a single user and stores recipe IDs
 * for each meal/day slot.
 *
 * Duplicate meal plan names are blocked for the same user.
 */
me.createMealPlan = async (userId, planData) => {
  const { client } = await connect();

  try {
    const db = client.db(DB_NAME);
    const mealPlansCollection = db.collection("MealPlans");

    const title = planData.title?.trim() || "Untitled Meal Plan";

    const existingPlan = await mealPlansCollection.findOne({
      userId,
      title,
    });

    if (existingPlan) {
      throw new Error("A meal plan with this name already exists.");
    }

    const mealPlanDoc = {
      userId,
      title,
      meals: planData.meals || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await mealPlansCollection.insertOne(mealPlanDoc);

    return {
      ...mealPlanDoc,
      _id: result.insertedId,
    };
  } catch (error) {
    console.error("Error creating meal plan", error);
    throw error;
  } finally {
    await client.close();
  }
};

/**
 * Updates an existing meal plan with a new title and/or meal selections.
 * The updatedAt timestamp is refreshed each time the plan is edited.
 */
me.updateMealPlan = async (userId, id, planData) => {
  const { client } = await connect();

  try {
    const db = client.db(DB_NAME);
    const mealPlansCollection = db.collection("MealPlans");

    const { ObjectId } = await import("mongodb");

    const updatedFields = {
      title: planData.title || "Untitled Meal Plan",
      meals: planData.meals || {},
      updatedAt: new Date(),
    };

    await mealPlansCollection.updateOne(
      {
        _id: new ObjectId(id),
        userId,
      },
      {
        $set: updatedFields,
      }
    );

    return await mealPlansCollection.findOne({
      _id: new ObjectId(id),
      userId,
    });
  } catch (error) {
    console.error("Error updating meal plan", error);
    throw error;
  } finally {
    await client.close();
  }
};

/**
 * Deletes one meal plan belonging to the current user.
 */
me.deleteMealPlan = async (userId, id) => {
  const { client } = await connect();

  try {
    const db = client.db(DB_NAME);
    const mealPlansCollection = db.collection("MealPlans");

    const { ObjectId } = await import("mongodb");

    await mealPlansCollection.deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    return true;
  } catch (error) {
    console.error("Error deleting meal plan", error);
    throw error;
  } finally {
    await client.close();
  }
};



  return me;
}
