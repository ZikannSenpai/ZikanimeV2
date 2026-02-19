// pages/api/sankapi/[...proxy].js
import fetch from "node-fetch";

export default async function handler(req, res) {
    console.log("[api/sankapi] called", req.method, req.query.proxy);
    const pathParts = req.query.proxy || [];
    const targetPath = pathParts.join("/");
    const targetBase = "https://www.sankavollerei.com/anime/"; // endpoint base
    const targetUrl =
        targetBase +
        targetPath +
        (req.url.includes("?") ? req.url.split("?")[1] : "");
    console.log("[api/sankapi] proxying to:", targetUrl);
    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: { "User-Agent": "Zikanime-Proxy/1.0" },
            body: req.method === "GET" ? undefined : JSON.stringify(req.body)
        });
        const text = await response.text();
        console.log("[api/sankapi] status", response.status);
        // try to parse JSON; if fail, return text
        try {
            const json = JSON.parse(text);
            res.status(response.status).json(json);
        } catch (e) {
            console.log("[api/sankapi] response not json, sending as text");
            res.status(response.status).send(text);
        }
    } catch (err) {
        console.error("[api/sankapi] fetch error", err);
        res.status(500).json({ error: "Proxy fetch error" });
    }
}
