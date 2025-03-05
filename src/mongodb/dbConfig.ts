import { MongoClient, Db } from "mongodb";

const MONGODB_URL = process.env.MONGODB_URL!;
const DB_NAME = "nimsfiles"; // Change to your database

if (!MONGODB_URL)
	throw new Error("🚨 MONGODB_URL is not defined in .env.local");

let cachedMongo: Promise<MongoClient> | null = null;

export async function connectToMongoDB(): Promise<{
	client: MongoClient;
	db: Db;
}> {
	if (!cachedMongo) {
		console.log("🚀 Connecting to MongoDB...");
		const client = new MongoClient(MONGODB_URL, {
			serverSelectionTimeoutMS: 10000, // Prevents connection hanging
		});
		cachedMongo = client.connect();
	}

	const client = await cachedMongo;
	console.log("✅ MongoDB Connected Successfully!");
	return { client, db: client.db(DB_NAME) };
}
