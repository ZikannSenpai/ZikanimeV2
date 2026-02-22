// pages/api/auth/login.js
import { connectToDatabase } from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const { emailOrUsername, password } = req.body || {};
    if (!emailOrUsername || !password)
        return res.status(400).json({ error: "missing" });

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
    if (!user) return res.status(401).json({ error: "invalid" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "invalid" });

    const token = jwt.sign(
        { sub: String(user._id), username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.setHeader(
        "Set-Cookie",
        serialize("zikanime_token", token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax"
        })
    );

    res.json({ success: true });
}
