// proxy to sankavollerei to avoid CORS and hide direct origin
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const SANKA = "https://www.sankavollerei.com";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const parts = req.query.proxy as string[];
        const path = parts.join("/");
        const url = `${SANKA}/${path}`;
        const method = req.method || "GET";
        const headers: any = {
            "User-Agent": req.headers["user-agent"] || "Zikanime-App"
        };

        const result = await axios.request({
            url,
            method,
            headers,
            params: req.query,
            data: req.body,
            responseType: "json"
        });
        res.status(result.status).json(result.data);
    } catch (err: any) {
        res.status(err.response?.status || 500).json({
            error: "proxy_error",
            message: err.message
        });
    }
}
