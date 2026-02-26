import { useEffect, useState } from "react";
import AnimeCard from "../components/AnimeCard";

export default function Home({ user, setUser }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const r = await fetch("/api/anime/list"); // sanka proxy endpoint: /api/anime/list
                const j = await r.json();
                // sanka format may have data.data or data.list — try common shapes
                const list = j.data || j.results || j.list || j;
                setData(Array.isArray(list) ? list : list.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);
    return (
        <main className="container max-w-6xl mx-auto p-6">
            <section id="homeSection">
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="anime-grid">
                        {data.map((a, i) => (
                            <AnimeCard
                                key={i}
                                anime={{
                                    title: a.title || a.name,
                                    thumb: a.thumb || a.image || a.cover,
                                    endpoint: a.endpoint || a.slug || a.id,
                                    type: a.type
                                }}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
