import { MongoClient } from "mongodb";

let client;
let db;

export async function getDb() {
  if (db) return db;

  const mongoUrl = process.env.MONGO_URL;
  const dbName = process.env.MONGO_DB || "orionsec";
  if (!mongoUrl) throw new Error("MONGO_URL is required");

  client = new MongoClient(mongoUrl);
  await client.connect();
  db = client.db(dbName);
  return db;
}

