import React, { useEffect, useState } from "react";
import Head from "next/head";
import { fetchHome } from "../lib/sanka";
import AnimeCard from "../components/AnimeCard";

export default function Home() {
    const [items, setItems] = useState<any[]>([]);
    useEffect(() => {
        async function load() {
            console.log("[home] load start");
            try {
                const res = await fetchHome();
                console.log("[home] load got", res);
                if (Array.isArray(res)) setItems(res);
                else if (res?.data) setItems(res.data);
            } catch (err) {
                console.error("[home] load error", err);
            }
        }
        load();
    }, []);

    return (
        <div>
            <Head>
                <title>Zikanime</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container">
                <header className="header">
                    <div className="logo">Zikanime</div>
                    <nav style={{ marginLeft: "auto" }}>
                        <a href="/login" style={{ color: "var(--accent)" }}>
                            Login
                        </a>
                    </nav>
                </header>

                <main>
                    <h2 style={{ color: "var(--accent)" }}>
                        Ongoing / Popular
                    </h2>
                    <section className="grid">
                        {items.length === 0 ? (
                            <div>Loading...</div>
                        ) : (
                            {Array.isArray(items) && items.map((it) => (
                                <AnimeCard
                                    key={it.id || it.slug || it.title}
                                    data={it}
                                    onClick={() => {
                                        console.log("[home] clicked", it);
                                        window.location.href = `/watch/${it.slug || it.id}`;
                                    }}
                                />
                            ))
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}
