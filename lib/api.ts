const EXTERNAL_API = process.env.EXTERNAL_API_BASE!;

export async function fetchAnimeList() {
    const res = await fetch(`${EXTERNAL_API}/`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch anime list");
    return res.json();
}

export async function fetchAnimeDetail(id: string) {
    const res = await fetch(`${EXTERNAL_API}/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch anime detail");
    return res.json();
}
