// pages/index.js
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("[home] mount, fetching anime list");
        loadList();
    }, []);

    async function loadList() {
        setLoading(true);
        try {
            console.log("[home.loadList] requesting /api/sankapi/");
            const res = await fetch("/api/sankapi/");
            const text = await res.text();
            console.log("[home.loadList] raw response length:", text.length);
            try {
                const json = JSON.parse(text);
                console.log("[home.loadList] parsed as json", json);
                setList(json.data?.slice?.(0, 40) || []);
            } catch (e) {
                console.warn(
                    "[home.loadList] response not json, attempting fallback"
                );
                setList([]);
            }
        } catch (err) {
            console.error("[home.loadList] error", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="app">
            <aside className="sidebar fade-in">
                <div className="brand">Zikanime | StreamNime</div>
                <nav>
                    <div>
                        <Link href="/">Home</Link>
                    </div>
                    <div>
                        <Link href="/profile">Profile</Link>
                    </div>
                    <div>
                        <a href="/login">Login</a>
                    </div>
                </nav>
            </aside>
            <main className="main">
                <h1 style={{ marginBottom: 12 }}>Trending Anime</h1>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill,minmax(220px,1fr))",
                        gap: 12
                    }}
                >
                    {loading && <div>Loading...</div>}
                    {list.map((a, i) => (
                        <Link
                            key={i}
                            href={`/anime/${encodeURIComponent(a.slug || a.id || "")}`}
                        >
                            <a
                                className="card fade-in"
                                style={{
                                    display: "block",
                                    textDecoration: "none",
                                    color: "inherit"
                                }}
                            >
                                <div
                                    style={{
                                        height: 120,
                                        background: "#071026",
                                        borderRadius: 8,
                                        marginBottom: 8
                                    }}
                                ></div>
                                <div style={{ fontWeight: 700 }}>
                                    {a.title || a.name}
                                </div>
                                <div
                                    style={{
                                        color: "var(--muted)",
                                        fontSize: 13
                                    }}
                                >
                                    {a.description?.slice?.(0, 120) || ""}
                                </div>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
