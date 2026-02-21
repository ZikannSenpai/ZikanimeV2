import { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";

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
        <>
            <Head>
                <title>ZikAnime | Streaming Anime</title>

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta
                    name="description"
                    content="ZikAnime adalah platform streaming anime gratis dengan kualitas tinggi."
                />

                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/style.css" />

                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />

                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* tempel BODY HTML lu di sini, hapus tag html, head, body */}
            <div id="root">
                {/* HEADER */}
                <header>
                    <div className="header-container">
                        <div className="logo">
                            <i className="fas fa-play-circle"></i>
                            <span>Zik</span>Anime
                        </div>
                    </div>
                </header>

                <main className="container">
                    <section id="homeSection">
                        <div className="loading" id="homeLoading">
                            <div className="spinner"></div>
                        </div>
                        <div id="homeContent" style={{ display: "none" }}></div>
                    </section>
                </main>

                <footer>
                    <div className="footer-content">
                        <div className="footer-logo">
                            <span>Zik</span>Anime
                        </div>
                    </div>
                </footer>
            </div>

            <Script src="/script.js" strategy="afterInteractive" />
        </>
    );
}
