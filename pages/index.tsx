import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";
import VideoModal from "@/components/VideoModal";

export default function Home() {
    const { user, loading: authLoading } = useAuth();
    const [activeSection, setActiveSection] = useState("home");
    const [animeData, setAnimeData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAnime, setSelectedAnime] = useState<any>(null);
    const [selectedEpisode, setSelectedEpisode] = useState("");

    useEffect(() => {
        if (activeSection === "ongoing") {
            setLoading(true);
            fetch("/api/anime/ongoing")
                .then(res => res.json())
                .then(data => {
                    setAnimeData(data);
                    setLoading(false);
                });
        } else if (activeSection === "complete") {
            setLoading(true);
            fetch("/api/anime/complete")
                .then(res => res.json())
                .then(data => {
                    setAnimeData(data);
                    setLoading(false);
                });
        } else if (activeSection === "schedule") {
            setLoading(true);
            fetch("/api/anime/schedule")
                .then(res => res.json())
                .then(data => {
                    setAnimeData(data);
                    setLoading(false);
                });
        } else if (activeSection === "genres") {
            setLoading(true);
            fetch("/api/anime/genres")
                .then(res => res.json())
                .then(data => {
                    setAnimeData(data);
                    setLoading(false);
                });
        } else if (activeSection === "search" && searchQuery) {
            setLoading(true);
            fetch(`/api/anime/search?q=${encodeURIComponent(searchQuery)}`)
                .then(res => res.json())
                .then(data => {
                    setSearchResults(data);
                    setLoading(false);
                });
        }
    }, [activeSection, searchQuery]);

    const handleCardClick = (anime: any) => {
        fetch(`/api/anime/detail/${anime.slug}`)
            .then(res => res.json())
            .then(detail => {
                setSelectedAnime(detail);
                if (detail.episodes?.length) {
                    setSelectedEpisode(detail.episodes[0].slug);
                }
                setModalOpen(true);
            });
    };

    const handleEpisodeSelect = (ep: any) => {
        setSelectedEpisode(ep.slug);
        // Simpan riwayat
        if (user) {
            fetch("/api/user/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    animeId: selectedAnime.slug,
                    animeTitle: selectedAnime.title,
                    episode: ep.slug,
                    episodeTitle: ep.title,
                    image: selectedAnime.poster
                })
            });
        }
    };

    if (authLoading)
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );

    return (
        <>
            <Navbar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                setSearchQuery={setSearchQuery}
            />
            <main className="container">
                <section style={{ display: "block" }}>
                    <div className="section-title">
                        <h2>{getSectionTitle(activeSection)}</h2>
                    </div>
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="anime-grid">
                            {(activeSection === "search"
                                ? searchResults?.data
                                : animeData?.data
                            )?.map((item: any) => (
                                <AnimeCard
                                    key={item.slug}
                                    title={item.title}
                                    poster={item.poster}
                                    type={item.type}
                                    rating={item.rating}
                                    slug={item.slug}
                                    onClick={() => handleCardClick(item)}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <VideoModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                anime={selectedAnime}
                episodeSlug={selectedEpisode}
                onEpisodeSelect={handleEpisodeSelect}
            />
        </>
    );
}

function getSectionTitle(section: string) {
    const titles: Record<string, string> = {
        home: "Beranda",
        ongoing: "Anime Sedang Tayang",
        complete: "Anime Complete",
        schedule: "Jadwal Rilis",
        genres: "Genre Anime",
        search: "Hasil Pencarian",
        hentai: "Hentai Page"
    };
    return titles[section] || "ZikAnime";
}
