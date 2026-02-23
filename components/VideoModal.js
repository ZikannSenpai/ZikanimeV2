import React, { useState, useEffect } from "react";

export default function VideoModal({
    isOpen,
    onClose,
    anime,
    episode,
    onEpisodeSelect
}) {
    const [episodes, setEpisodes] = useState([]);
    const [currentEpisode, setCurrentEpisode] = useState(episode);
    const [loading, setLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");

    useEffect(() => {
        if (anime && isOpen) {
            fetchEpisodes();
        }
    }, [anime, isOpen]);

    useEffect(() => {
        if (currentEpisode) {
            fetchVideoUrl(currentEpisode);
        }
    }, [currentEpisode]);

    const fetchEpisodes = async () => {
        if (!anime?.href) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/anime/${anime.href}`);
            const data = await res.json();
            if (data.episode_list) {
                setEpisodes(data.episode_list);
            } else if (data.episodes) {
                setEpisodes(data.episodes);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchVideoUrl = async ep => {
        if (!ep?.href) return;
        try {
            const res = await fetch(`/api/anime/episode/${ep.href}`);
            const data = await res.json();
            if (data.video_url) {
                setVideoUrl(data.video_url);
            } else if (data.stream) {
                setVideoUrl(data.stream);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEpisodeClick = ep => {
        setCurrentEpisode(ep);
        onEpisodeSelect(ep);
    };

    if (!isOpen) return null;

    return (
        <div className="video-modal" style={{ display: "flex" }}>
            <div className="video-container">
                <div className="video-header">
                    <h3 id="videoTitle">{anime?.title || "Memuat..."}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="video-player" id="videoPlayer">
                    {videoUrl ? (
                        <iframe
                            src={videoUrl}
                            allowFullScreen
                            title="Video Player"
                        ></iframe>
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
                            <p>
                                {loading ? "Memuat video..." : "Pilih episode"}
                            </p>
                        </div>
                    )}
                </div>

                <div className="video-info">
                    <div id="videoDescription">
                        {currentEpisode
                            ? `Episode ${currentEpisode.episode}`
                            : "Pilih episode untuk mulai menonton"}
                    </div>
                    <div className="episode-selector" id="episodeSelector">
                        {episodes.map((ep, index) => (
                            <button
                                key={index}
                                className={`episode-btn ${currentEpisode === ep ? "active" : ""}`}
                                onClick={() => handleEpisodeClick(ep)}
                            >
                                {ep.episode ||
                                    ep.title ||
                                    `Episode ${index + 1}`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
