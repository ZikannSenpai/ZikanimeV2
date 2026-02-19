// pages/api/auth/register.js
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    console.log("[api/register] called", req.method);
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    try {
        const { username, email, password } = req.body;
        console.log("[api/register] payload:", { username, email });
        await connectToDatabase();

        const exists = await User.findOne({ username });
        if (exists) {
            console.log("[api/register] username exists:", username);
            return res.status(400).json({ error: "Username already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            passwordHash,
            profile: { displayName: username }
        });
        await user.save();
        console.log("[api/register] user saved:", user._id);
        res.status(201).json({ ok: true, userId: user._id });
    } catch (err) {
        console.error("[api/register] error", err);
        res.status(500).json({ error: "Server error" });
    }
}
