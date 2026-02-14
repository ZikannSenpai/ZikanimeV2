import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { getAnimeDetail } from "../../lib/sanka";

export default function Watch() {
    const r = useRouter();
    const { id } = r.query;
    const [detail, setDetail] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        async function load() {
            console.log("[watch] load", id);
            try {
                const d = await getAnimeDetail(String(id));
                console.log("[watch] got detail", d);
                setDetail(d);
                // save history to server
                try {
                    const res = await fetch("/api/history", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ animeId: id, title: d.title })
                    });
                    console.log("[watch] history save response", res);
                } catch (err) {
                    console.error("[watch] history save failed", err);
                }
            } catch (err) {
                console.error("[watch] load failed", err);
            }
        }
        load();
    }, [id]);

    return (
        <div className="container">
            <Head>
                <title>Watch</title>
            </Head>
            <h1 style={{ color: "var(--accent)" }}>
                {detail?.title || "Loading..."}
            </h1>
            <div style={{ background: "#000", padding: 12, borderRadius: 8 }}>
                {/* If the API supplies a streaming url, embed it here; otherwise embed an iframe */}
                <div
                    style={{
                        width: "100%",
                        height: 420,
                        background: "#021226",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <div style={{ color: "#7fbfff" }}>
                        Player placeholder (embed the streaming src from Sanka
                        API)
                    </div>
                </div>
            </div>
        </div>
    );
}
