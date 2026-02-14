import axios from "axios";
const SANKA_BASE = process.env.SANKA_BASE || "https://www.sankavollerei.com";

export default async function handler(req, res) {
    const { serverId } = req.query;
    console.log("[API] /api/anime/server serverId=", serverId);
    try {
        const r = await axios.get(`${SANKA_BASE}/anime/server/${serverId}`);
        console.log("[API] server fetched", r.status);
        res.status(200).json(r.data);
    } catch (err) {
        console.error("[API] server error", err.message);
        res.status(500).json({ error: err.message });
    }
}
