// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI not set in env");

let cached = global._mongo;

if (!cached) cached = global._mongo = { conn: null, promise: null };

export async function connectToDatabase() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        const client = new MongoClient(uri);
        cached.promise = client.connect().then(client => ({
            client,
            db: client.db() // use default database in connection string
        }));
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
