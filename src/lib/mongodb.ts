import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

/**
 * Re-use one client across hot reloads in development
 * (otherwise every reload would open a new connection).
 */
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

export const mongoClient = globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") globalForMongo.mongoClient = mongoClient;

export const db = mongoClient.db(process.env.MONGODB_DB || "bazardor");
