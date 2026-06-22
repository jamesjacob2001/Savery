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
      const recipes = await collection.find(query).toArray();
      console.log("Recipes fetched successfully", recipes);
      return recipes;
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

  return me;
}
