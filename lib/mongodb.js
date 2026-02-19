// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error("MONGODB_URI not set!");
    throw new Error("Please set MONGODB_URI in env");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    console.log("[db] connectToDatabase called");
    if (cached.conn) {
        console.log("[db] using cached connection");
        return cached.conn;
    }
    if (!cached.promise) {
        console.log("[db] creating new connection promise");
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(mongoose => {
                console.log("[db] connected");
                return mongoose;
            })
            .catch(err => {
                console.error("[db] connection error", err);
                throw err;
            });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
