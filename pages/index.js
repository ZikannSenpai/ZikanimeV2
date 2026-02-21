import { useEffect, useState } from "react";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [anime, setAnime] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const auth = await fetch("/api/auth/me");
                console.log("auth status:", auth.status);

                if (!auth.ok) {
                    window.location.href = "/login";
                    return;
                }

                const res = await fetch("/api/anime/home");
                console.log("anime status:", res.status);

                const data = await res.json();
                console.log("anime data:", data.data.ongoing);

                setAnime(data.data.ongoing.animeList);
                setLoading(false);
            } catch (err) {
                console.log("error:", err);
            }
        };

        load();
    }, []);

    if (loading)
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );

    return (
        <div className="container">
            <div className="anime-grid">
                {anime.map(item => (
                    <div key={item.animeId} className="anime-card fade-in">
                        <img
                            src={item.poster}
                            alt={item.title}
                            className="anime-poster"
                        />
                        <div className="anime-info">
                            <h3 className="anime-title">{item.title}</h3>
                            <div className="anime-meta">
                                <span>{item.episode}</span>
                                <span className="anime-type">{item.type}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
