import Link from "next/link";
export default function AnimeCard({ anime }) {
    return (
        <div className="anime-card fade-in cursor-pointer">
            <img
                src={anime.thumb || anime.image}
                alt={anime.title}
                className="anime-poster"
            />
            <div className="anime-info">
                <h3 className="anime-title">{anime.title}</h3>
                <div className="anime-meta">
                    <span className="anime-type">{anime.type || "TV"}</span>
                    <span className="anime-rating">{anime.rating || "—"}</span>
                </div>
                <Link
                    href={`/anime/${anime.endpoint || anime.slug || anime.id}`}
                >
                    <button className="watch-btn">Tonton</button>
                </Link>
            </div>
        </div>
    );
}
