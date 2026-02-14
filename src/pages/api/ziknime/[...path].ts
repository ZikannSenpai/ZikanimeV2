import type { NextApiRequest, NextApiResponse } from "next";

const BASE = "https://www.sankavollerei.com";
const cache = new Map<string, any>();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const path = (req.query.path as string[]).join("/");
    const query = req.url?.split("?")[1];
    const url = `${BASE}/${path}${query ? "?" + query : ""}`;

    console.log("[ZIKANIME API] request:", url);

    try {
        if (cache.has(url)) {
            console.log("[ZIKANIME API] cache hit");
            return res.json(cache.get(url));
        }

        const r = await fetch(url);
        const data = await r.json();

        cache.set(url, data);

        console.log("[ZIKANIME API] success:", r.status);
        res.status(200).json(data);
    } catch (err) {
        console.error("[ZIKANIME API] error:", err);
        res.status(500).json({ error: "proxy failed" });
    }
}
