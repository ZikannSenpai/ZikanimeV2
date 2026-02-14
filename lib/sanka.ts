// lib/sanka.ts
export const SANKA_BASE =
    process.env.NEXT_PUBLIC_SANKA_API || "https://www.sankavollerei.com/anime";

export async function fetchHome() {
    console.log("[sanka] fetchHome: starting");
    try {
        const res = await fetch(`${SANKA_BASE}`);
        console.log("[sanka] fetchHome: raw response", res);
        const text = await res.text();
        console.log("[sanka] fetchHome: text length", text.length);
        // The Sanka site returns HTML docs; depending on endpoint you might use their JSON endpoints
        // Try the /api endpoints (if available) - we will attempt JSON first
        try {
            const jsonRes = await fetch(`${SANKA_BASE}/home`);
            console.log("[sanka] fetchHome: /home response", jsonRes);
            const json = await jsonRes.json();
            console.log(
                "[sanka] fetchHome: parsed json",
                json?.slice?.(0, 3) || json
            );
            return json;
        } catch (err) {
            console.error("[sanka] fetchHome: /home json parse failed", err);
            return { html: text };
        }
    } catch (err) {
        console.error("[sanka] fetchHome: error", err);
        throw err;
    }
}

export async function searchAnime(q: string) {
    console.log("[sanka] searchAnime:", q);
    try {
        const url = `${SANKA_BASE}/search?q=${encodeURIComponent(q)}`;
        console.log("[sanka] searchAnime: url", url);
        const res = await fetch(url);
        const json = await res.json();
        console.log("[sanka] searchAnime: result", json?.length ?? "no-length");
        return json;
    } catch (err) {
        console.error("[sanka] searchAnime: error", err);
        return [];
    }
}

export async function getAnimeDetail(id: string) {
    console.log("[sanka] getAnimeDetail:", id);
    try {
        const url = `${SANKA_BASE}/anime/${encodeURIComponent(id)}`;
        console.log("[sanka] getAnimeDetail: url", url);
        const res = await fetch(url);
        const json = await res.json();
        console.log("[sanka] getAnimeDetail: got", json?.title || "no title");
        return json;
    } catch (err) {
        console.error("[sanka] getAnimeDetail: error", err);
        throw err;
    }
}
