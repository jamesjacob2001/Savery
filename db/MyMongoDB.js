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

  return me;
}
