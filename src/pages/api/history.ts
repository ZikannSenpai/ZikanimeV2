import { supabase } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("[HISTORY] method:", req.method);

    try {
        if (req.method === "POST") {
            const { user_id, slug, title } = req.body;

            const { data, error } = await supabase
                .from("watch_history")
                .insert([{ user_id, slug, title }]);

            if (error) throw error;

            console.log("[HISTORY] saved:", data);
            return res.json(data);
        }

        if (req.method === "GET") {
            const { user_id } = req.query;

            const { data, error } = await supabase
                .from("watch_history")
                .select("*")
                .eq("user_id", user_id);

            if (error) throw error;

            console.log("[HISTORY] fetched:", data?.length);
            return res.json(data);
        }
    } catch (err) {
        console.error("[HISTORY] error:", err);
        res.status(500).json({ error: "db error" });
    }
}
