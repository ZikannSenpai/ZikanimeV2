import axios from "axios";
const SANKA_BASE = process.env.SANKA_BASE || "https://www.sankavollerei.com";

export default async function handler(req, res) {
    const { slug } = req.query;
    console.log("[API] /api/anime/episode slug=", slug);
    try {
        const r = await axios.get(`${SANKA_BASE}/anime/episode/${slug}`);
        console.log("[API] episode ok", r.status);
        res.status(200).json(r.data);
    } catch (err) {
        console.error("[API] episode err", err.message);
        res.status(500).json({ error: err.message });
    }
}
