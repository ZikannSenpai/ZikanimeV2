// pages/api/anime/[...slug].js
export default async function handler(req, res) {
    try {
        const { slug = [], ...query } = req.query;
        const path = Array.isArray(slug) ? slug.join("/") : slug || "";

        const queryString = new URLSearchParams(query).toString();
        const target = `https://www.sankavollerei.com/anime/${path}${queryString ? `?${queryString}` : ""}`;

        const options = { method: req.method || "GET" };
        if (req.method !== "GET" && req.method !== "HEAD") {
            options.body = JSON.stringify(req.body);
            options.headers = { "content-type": "application/json" };
        }

        const r = await fetch(target, options);
        const contentType = r.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            const buffer = await r.arrayBuffer();
            res.setHeader("content-type", contentType);
            res.status(r.status).send(Buffer.from(buffer));
            return;
        }
        const json = await r.json();
        res.setHeader("content-type", "application/json");
        res.status(r.status || 200).json(json);
    } catch (err) {
        console.error("Proxy error:", err);
        res.status(500).json({
            success: false,
            message: "Proxy error",
            error: String(err)
        });
    }
}
