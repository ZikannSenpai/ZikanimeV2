import useSWR from "swr";
import Navbar from "../components/Navbar";
import AnimeCard from "../components/AnimeCard";

const fetcher = url =>
    fetch(url).then(async res => {
        console.log("[fetcher] url", url, "status", res.status);
        const d = await res.json().catch(e => {
            console.error("[fetcher] json error", e);
            return null;
        });
        return d;
    });

export default function Home() {
    const { data, error } = useSWR("/api/proxy/", fetcher, {
        revalidateOnFocus: false
    });

    if (error) {
        console.error("[Home] swr error", error);
    }

    const list = data?.data || [];

    return (
        <div className="docs-page">
            <Navbar />
            <main className="container">
                <h1 className="crt-text">Zikanime — Streaming</h1>
                <div className="grid">
                    {list.map(a => (
                        <AnimeCard key={a.id || a.slug || a.title} anime={a} />
                    ))}
                </div>
            </main>
        </div>
    );
}
