import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [homeData, setHomeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [videoOpen, setVideoOpen] = useState(false);
    const [videoSrc, setVideoSrc] = useState("");
    const [episodeList, setEpisodeList] = useState([]);

    useEffect(() => {
        const t = localStorage.getItem("token");
        if (!t) {
            router.push("/login");
            return;
        }
        setToken(t);
        loadHome(t);
    }, []);

    async function loadHome(t) {
        setLoading(true);
        try {
            const r = await fetch("/api/anime?path=/anime/home");
            const j = await r.json();
            setHomeData(j);
        } catch (err) {
            console.error("loadHome error", err);
        } finally {
            setLoading(false);
        }
    }

    function openPlayer(streamUrl, title, epList = []) {
        setVideoSrc(streamUrl);
        setEpisodeList(epList);
        setVideoOpen(true);
        // simpan history
        saveHistory({ animeId: title, title, episode: epList[0] || "1" });
    }

    async function saveHistory(payload) {
        try {
            await fetch("/api/history", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    authorization: "Bearer " + token
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            console.error("saveHistory err", err);
        }
    }

    return (
        <>
            <header>
                <div className="header-container">
                    <div className="logo">
                        <i className="fas fa-play-circle" /> <span>Zik</span>
                        Anime
                    </div>
                    <nav id="mainNav">
                        <ul>
                            <li>
                                <a className="active">
                                    <i className="fas fa-home" /> Beranda
                                </a>
                            </li>
                            <li>
                                <a>
                                    <i className="fas fa-tv" /> Ongoing
                                </a>
                            </li>
                            <li>
                                <a>
                                    <i className="fas fa-tags" /> Genre
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div style={{ marginLeft: "auto" }}>
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                router.push("/login");
                            }}
                            style={{
                                background: "transparent",
                                color: "#9aa4c0",
                                border: "none"
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="container">
                <section id="homeSection">
                    {loading ? (
                        <div className="loading" id="homeLoading">
                            <div className="spinner">Loading...</div>
                        </div>
                    ) : (
                        <div id="homeContent">
                            <h2>Trending</h2>
                            <div className="grid">
                                {Array.isArray(homeData?.data) ? (
                                    homeData.data.map(a => (
                                        <div
                                            className="card"
                                            key={a.id}
                                            onClick={() =>
                                                openPlayer(
                                                    a.stream || "",
                                                    a.title,
                                                    a.episodes || []
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <img
                                                src={
                                                    a.cover ||
                                                    "/favicon-32x32.png"
                                                }
                                                alt={a.title}
                                            />
                                            <div className="meta">
                                                <strong>{a.title}</strong>
                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        color: "#9aa4c0"
                                                    }}
                                                >
                                                    {a.genre?.join?.(", ")}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No data</div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </main>

            <div
                className="video-modal"
                id="videoModal"
                style={{ display: videoOpen ? "flex" : "none" }}
            >
                <div className="video-container">
                    <div
                        className="video-header"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: 12,
                            alignItems: "center"
                        }}
                    >
                        <h3 id="videoTitle">
                            {videoSrc ? "Now Playing" : "Memuat..."}
                        </h3>
                        <button
                            className="close-btn"
                            id="closeVideoBtn"
                            onClick={() => setVideoOpen(false)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "#fff"
                            }}
                        >
                            ✕
                        </button>
                    </div>
                    <div className="video-player" id="videoPlayer">
                        {videoSrc ? (
                            <video
                                src={videoSrc}
                                controls
                                style={{ width: "100%", height: "100%" }}
                            />
                        ) : (
                            <p>no stream</p>
                        )}
                    </div>
                    <div className="video-info" style={{ padding: 12 }}>
                        <div id="videoDescription">Pilih episode</div>
                        <div className="episode-selector">
                            {episodeList.map((e, i) => (
                                <button key={i} style={{ margin: 6 }}>
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
