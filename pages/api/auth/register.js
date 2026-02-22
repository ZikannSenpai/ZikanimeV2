// pages/api/auth/register.js
import { connectToDatabase } from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const { username, email, password } = req.body || {};
    if (!username || !email || !password)
        return res.status(400).json({ error: "missing_fields" });

    const { db } = await connectToDatabase();
    const existing = await db
        .collection("users")
        .findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ error: "user_exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = {
        username,
        email,
        passwordHash: hash,
        profile: { displayName: username },
        lastWatched: null,
        createdAt: new Date()
    };
    const r = await db.collection("users").insertOne(user);
    return res.status(201).json({ success: true, id: r.insertedId });
}
