// pages/anime/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AnimeDetail() {
    const r = useRouter();
    const { id } = r.query;
    const [data, setData] = useState(null);
    useEffect(() => {
        if (!id) return;
        fetch(`/api/anime/detail/${id}`)
            .then(res => res.json())
            .then(setData)
            .catch(() => null);
    }, [id]);
    if (!data) return <div style={{ padding: 40 }}>Loading</div>;
    return (
        <div style={{ padding: 20 }}>
            <h1>{data.title || data.name}</h1>
            <p>{data.synopsis}</p>
            <div className="episodes-grid">
                {(data.episodes || []).map((ep, i) => (
                    <div
                        className="episode-card"
                        key={i}
                        onClick={async () => {
                            // tambahin history
                            await fetch("/api/history/add", {
                                method: "POST",
                                headers: { "content-type": "application/json" },
                                body: JSON.stringify({
                                    animeId: id,
                                    title: data.title || data.name
                                })
                            });
                            const url =
                                ep.serverUrl || ep.url || ep.embed || ep.link;
                            window.open(url, "_blank");
                        }}
                    >
                        {ep.title || `Episode ${i + 1}`}
                    </div>
                ))}
            </div>
        </div>
    );
}
