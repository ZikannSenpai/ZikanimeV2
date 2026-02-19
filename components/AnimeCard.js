import Link from "next/link";

export default function AnimeCard({ anime }) {
    return (
        <Link
            href={`/anime/${encodeURIComponent(anime.slug || anime.id || anime.title)}`}
        >
            <a
                className="anime-card"
                onClick={() => console.log("[AnimeCard] click", anime)}
            >
                <img
                    src={anime.thumbnail || anime.image || anime.thumb}
                    alt={anime.title}
                />
                <div className="anime-info">
                    <h3>{anime.title}</h3>
                </div>
            </a>
        </Link>
    );
}
