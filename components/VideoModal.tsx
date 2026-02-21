import { useEffect, useState } from "react";

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    anime: any;
    episodeSlug?: string;
    onEpisodeSelect: (episode: any) => void;
}

export default function VideoModal({
    isOpen,
    onClose,
    anime,
    episodeSlug,
    onEpisodeSelect
}: VideoModalProps) {
    const [episodes, setEpisodes] = useState([]);
    const [currentEpisode, setCurrentEpisode] = useState<any>(null);
    const [videoUrl, setVideoUrl] = useState("");

    useEffect(() => {
        if (anime?.episodes) setEpisodes(anime.episodes);
    }, [anime]);

    useEffect(() => {
        if (episodeSlug) {
            fetch(`/api/anime/episode/${episodeSlug}`)
                .then(res => res.json())
                .then(data => {
                    setCurrentEpisode(data);
                    if (data.servers?.length) setVideoUrl(data.servers[0].url);
                });
        }
    }, [episodeSlug]);

    if (!isOpen) return null;

    return (
        <div className="video-modal" style={{ display: "flex" }}>
            <div className="video-container">
                <div className="video-header">
                    <h3>
                        {anime?.title} - {currentEpisode?.title || "Memuat..."}
                    </h3>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="video-player">
                    {videoUrl ? (
                        <iframe src={videoUrl} allowFullScreen></iframe>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                color: "white"
                            }}
                        >
                            Memuat video...
                        </div>
                    )}
                </div>
                <div className="video-info">
                    <div className="episode-selector">
                        {episodes.map((ep: any) => (
                            <button
                                key={ep.slug}
                                className={`episode-btn ${ep.slug === episodeSlug ? "active" : ""}`}
                                onClick={() => onEpisodeSelect(ep)}
                            >
                                {ep.episode || ep.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
