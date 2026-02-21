// pages/api/auth/login.js
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import { sign } from "../../../lib/jwt";
import cookie from "cookie";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "missing" });

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "zikanime");
    const users = db.collection("users");
    const user = await users.findOne({ email });
    if (!user) return res.status(401).json({ message: "invalid" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "invalid" });

    const token = sign({
        sub: user._id.toString(),
        username: user.username,
        email: user.email
    });
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("zktoken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        })
    );
    res.json({
        user: { _id: user._id, username: user.username, email: user.email }
    });
}
