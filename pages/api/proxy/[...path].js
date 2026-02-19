import { sankaFetch } from "../../../lib/sankaApi";

export default async function handler(req, res) {
    const { path = [] } = req.query;
    const joined = Array.isArray(path) ? path.join("/") : path;
    console.log("[api/proxy] proxying", joined);

    const result = await sankaFetch(joined + (req.url.includes("?") ? "" : ""));

    if (result.error) {
        console.error("[api/proxy] error", result.error);
        return res.status(500).json({ error: result.error });
    }

    res.status(result.status || 200).json(result.data || {});
}
