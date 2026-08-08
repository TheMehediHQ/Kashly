import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let cachedClient: MongoClient | null = null;

export async function connectDB(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export function getDb() {
  if (!cachedClient) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return cachedClient.db("My_Finance");
}

export function getUsersCollection() {
  return getDb().collection("usersData");
}

export function getTransactionsCollection() {
  return getDb().collection("transactions");
}

export function getBudgetsCollection() {
  return getDb().collection("budgets");
}

export { client };
