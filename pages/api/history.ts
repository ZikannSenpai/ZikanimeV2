import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPA_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supa = createClient(SUPA_URL, SUPA_SERVICE);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("[api/history] method", req.method);
    if (req.method !== "POST") return res.status(405).end();
    const { animeId, title } = req.body || {};
    console.log("[api/history] body", { animeId, title });
    try {
        // NOTE: In a real app, get user id from auth cookie/session
        const userId = req.headers["x-user-id"] || "anonymous";
        const now = new Date().toISOString();
        const { data, error } = await supa
            .from("watch_history")
            .upsert(
                { user_id: userId, anime_id: animeId, title, updated_at: now },
                { onConflict: ["user_id"] }
            );
        console.log("[api/history] supa result", { data, error });
        if (error) throw error;
        res.status(200).json({ ok: true });
    } catch (err) {
        console.error("[api/history] error", err);
        res.status(500).json({ error: (err as any).message });
    }
}
