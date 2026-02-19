import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
let client;
let clientPromise;

if (!uri) {
    console.error("MONGODB_URI is not set in environment variables.");
}

if (process.env.NODE_ENV === "development") {
    // In development, use a global to maintain a cached connection across HMR reloads
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;
