// pages/api/auth/me.js
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    console.log("[api/me] called");
    try {
        await connectToDatabase();
        const token = req.cookies?.token;
        console.log("[api/me] token present:", !!token);
        if (!token) return res.status(401).json({ error: "Not authenticated" });

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log("[api/me] token payload:", payload);
        const user = await User.findById(payload.sub).select("-passwordHash");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ user });
    } catch (err) {
        console.error("[api/me] error", err);
        res.status(401).json({ error: "Invalid token" });
    }
}
