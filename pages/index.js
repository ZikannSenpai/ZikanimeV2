// pages/index.js
import Head from "next/head";
import { useEffect } from "react";
import "../styles/style.css";

export default function Home() {
    useEffect(() => {
        fetch("/api/auth/me")
            .then(res => {
                if (!res.ok) {
                    window.location.href = "/login";
                }
            })
            .catch(() => {
                window.location.href = "/login";
            });
    }, []);

    return (
        <>
            <Head>
                <title>Zikanime | StreamNime</title>
                <meta
                    name="description"
                    content="Zikanime adalah platform streaming anime gratis kualitas tinggi."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

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

                {/* MAIN */}
                <main className="container">
                    <section id="homeSection">
                        <div className="loading" id="homeLoading">
                            <div className="spinner"></div>
                        </div>
                        <div id="homeContent" style={{ display: "none" }}></div>
                    </section>
                </main>

                {/* FOOTER */}
                <footer>
                    <div className="footer-content">
                        <div className="footer-logo">
                            <span>Zik</span>Anime
                        </div>
                        <p className="footer-description">
                            Streaming anime gratis kualitas tinggi.
                        </p>
                        <p className="copyright">
                            © Zikanime All Copyright Reverse.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
