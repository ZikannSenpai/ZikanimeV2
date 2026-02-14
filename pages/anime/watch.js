import { useEffect, useState } from "react";
import axios from "axios";

export default function Watch({ query }) {
    const [episodeData, setEpisodeData] = useState(null);
    const [embedUrl, setEmbedUrl] = useState("");
    const [serverList, setServerList] = useState([]);

    useEffect(() => {
        const q = new URLSearchParams(window.location.search);
        const eps = q.get("episode");
        if (!eps) return;
        async function load() {
            try {
                console.log("[client] fetch /api/anime/episode", eps);
                const r = await axios.get(`/api/anime/episode?slug=${eps}`);
                console.log("[client] episode data", r.data);
                setEpisodeData(r.data);
                // assume episode data contains serverId list in r.data.server
                const servers = r.data.server || r.data.servers || [];
                setServerList(servers);
                if (servers.length > 0) {
                    const serverId = servers[0].id || servers[0];
                    const s = await axios.get(
                        `/api/anime/server?serverId=${serverId}`
                    );
                    console.log("[client] server embed", s.data);
                    setEmbedUrl(
                        s.data.embed || s.data.url || s.data.link || ""
                    );
                    // record watch history (simple)
                    try {
                        const token = localStorage.getItem("token");
                        await axios.post(
                            "/api/user/history",
                            { episode: eps, animeTitle: r.data.title },
                            { headers: { Authorization: "Bearer " + token } }
                        );
                        console.log("[client] history saved");
                    } catch (e) {
                        console.error("[client] history save err", e.message);
                    }
                }
            } catch (err) {
                console.error(
                    "[client] watch err",
                    err?.response?.data || err.message
                );
            }
        }
        load();
    }, []);

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-5xl mx-auto">
                <div className="card">
                    <h2 className="text-xl" style={{ color: "var(--accent)" }}>
                        {episodeData?.title || "Loading..."}
                    </h2>
                    <div className="mt-4">
                        {embedUrl ? (
                            <div
                                style={{
                                    position: "relative",
                                    paddingTop: "56.25%"
                                }}
                            >
                                <iframe
                                    src={embedUrl}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%"
                                    }}
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div>Loading player…</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
