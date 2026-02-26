import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AnimeDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!slug) return;
        (async () => {
            setLoading(true);
            const r = await fetch(`/api/anime/${slug}`);
            const j = await r.json();
            // Sanka endpoint detail shape may vary
            setAnime(j.data || j || null);
            setLoading(false);
        })();
    }, [slug]);
    if (loading)
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    if (!anime)
        return <div className="error-message">Anime tidak ditemukan</div>;
    // anime.episodes expected array
    return (
        <main className="container max-w-6xl mx-auto p-6">
            <div className="anime-detail-container">
                <img
                    src={anime.thumb || anime.cover}
                    className="anime-detail-poster"
                />
                <div className="anime-detail-info">
                    <h1 className="anime-detail-title">
                        {anime.title || anime.name}
                    </h1>
                    <div className="anime-detail-synopsis">
                        {anime.synopsis}
                    </div>
                    <div className="genre-list">
                        {(anime.genres || []).map((g, i) => (
                            <span key={i} className="genre-tag">
                                {g}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="episodes-section">
                <h3>Episode</h3>
                <div className="episodes-grid">
                    {(anime.episodes || []).map((ep, i) => (
                        <div
                            key={i}
                            className="episode-card"
                            onClick={() => {
                                // buka modal player, atau redirect ke player page
                                const url = ep.url || ep.link;
                                window.open(url, "_blank");
                            }}
                        >
                            <div>EP {ep.number || i + 1}</div>
                            <div className="text-sm text-gray-400">
                                {ep.title || "Episode"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
