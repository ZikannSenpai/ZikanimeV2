// pages/anime/[slug].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AnimePage() {
    const r = useRouter();
    const { slug } = r.query;
    const [anime, setAnime] = useState(null);

    useEffect(() => {
        if (!slug) return;
        load();
    }, [slug]);

    async function load() {
        try {
            console.log("[anime] loading:", slug);
            const res = await fetch(`/api/sankapi/${slug}`);
            const text = await res.text();
            console.log("[anime] raw response length", text.length);
            try {
                const json = JSON.parse(text);
                setAnime(json.data || json);
                console.log("[anime] parsed", json);
            } catch (e) {
                console.error("[anime] parse error", e);
            }
        } catch (err) {
            console.error("[anime] fetch error", err);
        }
    }

    async function markWatched() {
        try {
            console.log("[anime.markWatched] anime:", slug);
            const res = await fetch("/api/watched", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    animeId: slug,
                    title: anime?.title || anime?.name || slug,
                    episode: "1"
                })
            });
            const json = await res.json();
            console.log("[anime.markWatched] response", json);
            if (json.ok) alert("saved");
        } catch (err) {
            console.error("[anime.markWatched] err", err);
        }
    }

    return (
        <div className="app">
            <aside className="sidebar fade-in">
                <div className="brand">Zikanime | StreamNime</div>
            </aside>
            <main className="main">
                {!anime && <div>Loading...</div>}
                {anime && (
                    <div className="card fade-in">
                        <h2>{anime.title || anime.name}</h2>
                        <p style={{ color: "var(--muted)" }}>
                            {anime.description}
                        </p>
                        <div style={{ marginTop: 12 }}>
                            <button className="btn" onClick={markWatched}>
                                Mark watched
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
