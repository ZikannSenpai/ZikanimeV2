// pages/api/anime.js
import fetch from "node-fetch";

export default async function handler(req, res) {
    try {
        const q = req.query.q || "";
        // forward path if provided: ?path=/anime/home or ?path=/anime/detail/slug
        const path = req.query.path || "/anime";
        const url = `https://www.sankavollerei.com${path}${q ? `?q=${encodeURIComponent(q)}` : ""}`;
        const r = await fetch(url);
        const data = await r.json();
        res.status(200).json(data);
    } catch (err) {
        console.error("API /anime error:", err);
        res.status(500).json({
            error: "failed to fetch from remote",
            detail: String(err)
        });
    }
}
