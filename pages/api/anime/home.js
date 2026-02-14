import axios from "axios";

const SANKA_BASE = process.env.SANKA_BASE || "https://www.sankavollerei.com";

export default async function handler(req, res) {
    console.log(
        "[API] /api/anime/home -> proxy to",
        `${SANKA_BASE}/anime/home`
    );
    try {
        const r = await axios.get(`${SANKA_BASE}/anime/home`);
        console.log("[API] sanka response status", r.status);
        res.status(200).json(r.data);
    } catch (err) {
        console.error("[API] error fetching sanka home", err.message);
        res.status(500).json({
            error: "failed to fetch upstream",
            detail: err.message
        });
    }
}
