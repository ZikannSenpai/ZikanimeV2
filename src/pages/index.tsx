import { useEffect, useState } from "react";
import NavbarBottom from "../components/NavbarBottom";
import AnimeCard from "../components/AnimeCard";
import axios from "axios";

export default function Home() {
    const [latest, setLatest] = useState<any[]>([]);
    useEffect(() => {
        async function load() {
            try {
                const res = await axios.get("/api/sanka/anime");
                // sample: res.data.data or res.data.results depending on endpoint
                setLatest(res.data || []);
            } catch (e) {
                console.error(e);
            }
        }
        load();
    }, []);

    return (
        <div className="min-h-screen pb-32 px-4">
            <header className="flex items-center justify-between py-4">
                <div>
                    <h1 className="text-xl font-semibold">Zikanime</h1>
                    <p className="text-xs opacity-70">
                        Nonton anime terlengkap
                    </p>
                </div>
                <div className="text-sm">lvl 5 • Zikann</div>
            </header>

            <section className="mt-4">
                <h2 className="mb-2">Terbaru</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {latest.slice(0, 8).map((a: any, i: number) => (
                        <AnimeCard
                            key={i}
                            title={a.title || a.name}
                            poster={a.thumb || a.poster || ""}
                            onClick={() => {
                                /* open modal */
                            }}
                        />
                    ))}
                </div>
            </section>

            <NavbarBottom />
        </div>
    );
}
