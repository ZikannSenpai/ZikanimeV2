// pages/api/auth/register.js
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const file = "/tmp/users.json";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST")
            return res.status(405).json({ error: "method not allowed" });
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ error: "missing" });
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, "[]");
        }
        const raw = fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : "[]";
        const users = JSON.parse(raw);

        if (users.find(u => u.username === username))
            return res.status(409).json({ error: "exists" });

        const hash = await bcrypt.hash(password, 10);
        const user = {
            id: Date.now().toString(),
            username,
            password: hash,
            profile: { displayName: username },
            createdAt: new Date().toISOString()
        };
        users.push(user);
        fs.writeFileSync(file, JSON.stringify(users, null, 2));
        res.status(201).json({
            ok: true,
            user: {
                id: user.id,
                username: user.username,
                profile: user.profile
            }
        });
    } catch (err) {
        console.error("register error:", err);
        res.status(500).json({ error: "server error" });
    }
}
