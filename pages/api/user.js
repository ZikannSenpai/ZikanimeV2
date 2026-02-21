// pages/api/user.js
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const file = path.join(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export default async function handler(req, res) {
    try {
        const auth = req.headers.authorization || "";
        const token = auth.replace("Bearer ", "");
        if (!token) return res.status(401).json({ error: "no token" });

        let payload;
        try {
            payload = jwt.verify(token, JWT_SECRET);
        } catch (e) {
            console.error("token verify failed", e);
            return res.status(401).json({ error: "invalid token" });
        }

        const raw = fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : "[]";
        const users = JSON.parse(raw);
        const user = users.find(u => u.id === payload.id);
        if (!user) return res.status(404).json({ error: "not found" });

        if (req.method === "GET") {
            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    profile: user.profile
                }
            });
            return;
        }

        if (req.method === "PUT") {
            const body = req.body || {};
            user.profile = { ...user.profile, ...body.profile };
            fs.writeFileSync(file, JSON.stringify(users, null, 2));
            res.status(200).json({
                ok: true,
                user: {
                    id: user.id,
                    username: user.username,
                    profile: user.profile
                }
            });
            return;
        }

        res.status(405).json({ error: "method not allowed" });
    } catch (err) {
        console.error("user API error:", err);
        res.status(500).json({ error: "server error" });
    }
}
