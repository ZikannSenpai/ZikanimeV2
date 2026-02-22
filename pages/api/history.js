// pages/api/history/add.js
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../lib/mongodb";

function getTokenFromReq(req) {
    const cookie = req.headers.cookie || "";
    const match = cookie
        .split(";")
        .map(s => s.trim())
        .find(s => s.startsWith("zikanime_token="));
    if (!match) return null;
    return match.split("=")[1];
}

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ error: "unauth" });
    const { animeId, title } = req.body || {};
    if (!animeId || !title) return res.status(400).json({ error: "missing" });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const { db } = await connectToDatabase();
        await db
            .collection("users")
            .updateOne(
                { _id: new (require("mongodb").ObjectId)(payload.sub) },
                { $set: { lastWatched: { animeId, title, at: new Date() } } }
            );
        res.json({ success: true });
    } catch (err) {
        res.status(401).json({ error: "invalid" });
    }
}
