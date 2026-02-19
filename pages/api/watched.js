// pages/api/watched.js
import { connectToDatabase } from "../../lib/mongodb";
import History from "../../models/History";
import User from "../../models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    console.log("[api/watched] called", req.method);
    try {
        await connectToDatabase();
        const token = req.cookies?.token;
        if (!token) {
            console.log("[api/watched] no token");
            return res.status(401).json({ error: "Not authenticated" });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log("[api/watched] payload:", payload);

        if (req.method === "POST") {
            const { animeId, title, episode } = req.body;
            console.log("[api/watched][POST] body:", {
                animeId,
                title,
                episode
            });
            const hist = new History({
                userId: payload.sub,
                animeId,
                title,
                episode
            });
            await hist.save();
            await User.findByIdAndUpdate(payload.sub, {
                lastWatched: { animeId, title, at: new Date() }
            });
            console.log("[api/watched][POST] saved history", hist._id);
            return res.json({ ok: true, historyId: hist._id });
        } else if (req.method === "GET") {
            const items = await History.find({ userId: payload.sub })
                .sort({ watchedAt: -1 })
                .limit(50);
            console.log("[api/watched][GET] found", items.length);
            return res.json({ items });
        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (err) {
        console.error("[api/watched] error", err);
        res.status(500).json({ error: "Server error" });
    }
}
