import { fetchAnimeList } from "@/lib/api";
import AnimeCard from "@/components/AnimeCard";
import HistorySection from "@/components/HistorySection"; // akan kita buat nanti

export default async function Home() {
    const animeList = await fetchAnimeList(); // asumsikan response array

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-primary">Lanjut Nonton</h1>
            <HistorySection />

            <h1 className="text-3xl font-bold text-primary mt-8">
                Semua Anime
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {animeList.map((anime: any) => (
                    <AnimeCard
                        key={anime.id}
                        id={anime.id}
                        title={anime.title}
                        image={anime.thumbnail || "/placeholder.jpg"}
                    />
                ))}
            </div>
        </div>
    );
}
