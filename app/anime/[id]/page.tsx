import { fetchAnimeDetail } from "@/lib/api";
import Player from "@/components/Player";
import HistoryTracker from "@/components/HistoryTracker";

interface PageProps {
    params: { id: string };
}

export default async function AnimeDetailPage({ params }: PageProps) {
    const anime = await fetchAnimeDetail(params.id);
    // Asumsikan anime memiliki episodes array dengan field videoUrl
    const firstEpisode = anime.episodes?.[0];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary">{anime.title}</h1>

            {firstEpisode && (
                <>
                    <Player url={firstEpisode.videoUrl} />
                    <HistoryTracker
                        animeId={anime.id}
                        animeTitle={anime.title}
                        episode={firstEpisode.number}
                        image={anime.thumbnail}
                    />
                </>
            )}

            <div className="bg-darker p-6 rounded-lg border border-primary/20">
                <h2 className="text-xl font-semibold mb-2">Sinopsis</h2>
                <p className="text-gray-300">
                    {anime.synopsis || "Tidak ada sinopsis."}
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">Daftar Episode</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {anime.episodes?.map((ep: any) => (
                        <div
                            key={ep.number}
                            className="bg-darker p-2 rounded border border-primary/20 text-center"
                        >
                            Episode {ep.number}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
