// pages/api/auth/login.js
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const file = path.join(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST")
            return res.status(405).json({ error: "method not allowed" });
        const { username, password } = req.body;
        const raw = fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : "[]";
        const users = JSON.parse(raw);
        const user = users.find(u => u.username === username);
        if (!user) return res.status(401).json({ error: "invalid" });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ error: "invalid" });

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
        // return token to client; client will store in localStorage
        res.status(200).json({
            ok: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                profile: user.profile
            }
        });
    } catch (err) {
        console.error("login error:", err);
        res.status(500).json({ error: "server error" });
    }
}
