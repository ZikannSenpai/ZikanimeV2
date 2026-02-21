// pages/api/history.js
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const histFile = path.join(process.cwd(), "data", "history.json");
const userFile = path.join(process.cwd(), "data", "users.json");
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
            console.error("history token invalid", e);
            return res.status(401).json({ error: "invalid token" });
        }

        const rawHist = fs.existsSync(histFile)
            ? fs.readFileSync(histFile, "utf-8")
            : "[]";
        const hist = JSON.parse(rawHist);

        if (req.method === "GET") {
            const userHist = hist.filter(h => h.userId === payload.id);
            res.status(200).json({ history: userHist });
            return;
        }

        if (req.method === "POST") {
            const { animeId, title, episode } = req.body;
            if (!animeId)
                return res.status(400).json({ error: "missing animeId" });
            const entry = {
                id: Date.now().toString(),
                userId: payload.id,
                animeId,
                title,
                episode,
                watchedAt: new Date().toISOString()
            };
            hist.push(entry);
            fs.writeFileSync(histFile, JSON.stringify(hist, null, 2));
            res.status(201).json({ ok: true, entry });
            return;
        }

        res.status(405).json({ error: "method not allowed" });
    } catch (err) {
        console.error("history API error:", err);
        res.status(500).json({ error: "server error" });
    }
}
