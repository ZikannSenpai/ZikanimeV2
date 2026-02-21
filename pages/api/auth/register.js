// pages/api/auth/register.js
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ message: "missing" });

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "zikanime");
    const users = db.collection("users");
    const exists = await users.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ message: "User exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = { username, email, password: hash, createdAt: new Date() };
    const r = await users.insertOne(user);
    delete user.password;
    user._id = r.insertedId;
    res.status(201).json({ user });
}
