import React from "react";

export default function AnimeCard({ anime, onClick }) {
    return (
        <div className="anime-card" onClick={() => onClick(anime)}>
            <img
                src={anime.poster || "/placeholder.jpg"}
                alt={anime.title}
                className="anime-poster"
                onError={e => {
                    e.target.src = "/placeholder.jpg";
                }}
            />
            <div className="anime-info">
                <h3 className="anime-title">{anime.title}</h3>
                <div className="anime-meta">
                    <span>{anime.episodes || "?"} eps</span>
                    <span className="anime-rating">
                        <i className="fas fa-star"></i> {anime.rating || "N/A"}
                    </span>
                </div>
                <div className="anime-type">{anime.type || "Anime"}</div>
                <button className="watch-btn">Tonton</button>
            </div>
        </div>
    );
}
