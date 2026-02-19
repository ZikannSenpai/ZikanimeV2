// pages/api/auth/login.js
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    console.log("[api/login] called", req.method);
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });
    try {
        const { username, password } = req.body;
        console.log("[api/login] payload:", { username });
        await connectToDatabase();
        const user = await User.findOne({ username });
        if (!user) {
            console.log("[api/login] user not found:", username);
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            console.log("[api/login] password mismatch for:", username);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { sub: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.setHeader(
            "Set-Cookie",
            `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`
        );
        console.log("[api/login] login success for:", username);
        res.json({ ok: true });
    } catch (err) {
        console.error("[api/login] error", err);
        res.status(500).json({ error: "Server error" });
    }
}
