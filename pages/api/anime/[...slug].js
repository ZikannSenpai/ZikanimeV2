export default async function handler(req, res) {
    try {
        const { slug = [], ...query } = req.query;
        const path = Array.isArray(slug) ? slug.join("/") : slug || "";

        const queryString = new URLSearchParams(query).toString();
        const target = `https://www.sankavollerei.com/anime/${path}${
            queryString ? `?${queryString}` : ""
        }`;
        console.log("PROXY TARGET:", target);

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

        // Filter khusus untuk menghilangkan data non-otakudesu jika diperlukan
        if (path.startsWith("episode/")) {
            res.setHeader("content-type", "application/json");
            res.status(r.status || 200).json(json);
            return;
        }

        const hasOtakudesu = obj => {
            if (!obj) return false;
            if (typeof obj === "string")
                return obj.toLowerCase().includes("otakudesu");
            if (typeof obj === "number" || typeof obj === "boolean")
                return false;
            if (Array.isArray(obj)) return obj.some(hasOtakudesu);
            if (typeof obj === "object") {
                for (const k in obj) {
                    if (hasOtakudesu(obj[k])) return true;
                }
            }
            return false;
        };

        const filterData = node => {
            if (Array.isArray(node)) {
                const maybeObj = node.find(i => typeof i === "object");
                if (maybeObj) return node.filter(item => hasOtakudesu(item));
                return node;
            }
            if (node && typeof node === "object") {
                const out = Array.isArray(node) ? [] : {};
                for (const k in node) {
                    out[k] = filterData(node[k]);
                }
                return out;
            }
            return node;
        };

        let transformed = json;
        try {
            if (json && typeof json === "object") {
                if (Array.isArray(json.data)) {
                    transformed = {
                        ...json,
                        data: json.data.filter(item => hasOtakudesu(item))
                    };
                } else if (json.data && typeof json.data === "object") {
                    transformed = { ...json, data: filterData(json.data) };
                } else {
                    transformed = filterData(json);
                }
            }
        } catch (err) {
            transformed = json;
        }

        res.setHeader("content-type", "application/json");
        res.status(r.status || 200).json(transformed);
    } catch (err) {
        console.error("Proxy error:", err);
        res.status(500).json({
            success: false,
            message: "Proxy error",
            error: String(err)
        });
    }
}
