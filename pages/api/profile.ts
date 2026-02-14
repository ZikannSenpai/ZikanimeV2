import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPA_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supa = createClient(SUPA_URL, SUPA_SERVICE);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("[api/profile] method", req.method);
    try {
        const userId = req.headers["x-user-id"] || "anonymous";
        if (req.method === "GET") {
            const { data, error } = await supa
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();
            console.log("[api/profile] get", { data, error });
            if (error) return res.status(500).json({ error: error.message });
            return res.json(data);
        }
        if (req.method === "POST") {
            const payload = req.body;
            const { data, error } = await supa
                .from("profiles")
                .upsert({ id: userId, ...payload });
            console.log("[api/profile] upsert", { data, error });
            if (error) return res.status(500).json({ error: error.message });
            return res.json({ ok: true });
        }
        res.status(405).end();
    } catch (err) {
        console.error("[api/profile] error", err);
        res.status(500).json({ error: (err as any).message });
    }
}
