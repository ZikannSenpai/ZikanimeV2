import { useEffect, useRef } from "react";

interface AnimeCardProps {
    title: string;
    poster: string;
    type?: string;
    rating?: string;
    slug: string;
    onClick: () => void;
}

export default function AnimeCard({
    title,
    poster,
    type,
    rating,
    onClick
}: AnimeCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Efek fade-in setelah mount
        const timer = setTimeout(() => {
            if (cardRef.current) {
                cardRef.current.classList.add("fade-in");
            }
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="anime-card" ref={cardRef} onClick={onClick}>
            <img src={poster} alt={title} className="anime-poster" />
            <div className="anime-info">
                <h3 className="anime-title">{title}</h3>
                <div className="anime-meta">
                    {type && <span className="anime-type">{type}</span>}
                    {rating && (
                        <span className="anime-rating">
                            <i className="fas fa-star"></i> {rating}
                        </span>
                    )}
                </div>
                <button className="watch-btn">Watch Now</button>
            </div>
        </div>
    );
}
