import { useEffect, useState } from "react";

export default function Home() {
    const [anime, setAnime] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            console.log("[HOME] fetching anime...");
            try {
                const r = await fetch("/api/ziknime/anime/home");
                const j = await r.json();
                setAnime(j);
                console.log("[HOME] success");
            } catch (e) {
                console.error("[HOME] error:", e);
            }
        }

        load();
    }, []);

    return (
        <main className="min-h-screen bg-[#0b0f17] text-white p-4 fade-in">
            <h1 className="text-2xl font-bold mb-4 text-blue-400">Zikanime</h1>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {anime.map((a: any) => (
                    <div key={a.slug} className="bg-black/40 p-2 rounded">
                        <img src={a.thumbnail} className="rounded" />
                        <p className="text-sm mt-2">{a.title}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
