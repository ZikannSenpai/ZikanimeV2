import React, { useState, useEffect } from "react";
import AnimeCard from "./AnimeCard";
import VideoModal from "./VideoModal";
import { useAuth } from "../context/AuthContext";

export default function HomePage({ user }) {
    const [activeSection, setActiveSection] = useState("home");
    const [homeData, setHomeData] = useState(null);
    const [ongoingData, setOngoingData] = useState(null);
    const [completeData, setCompleteData] = useState(null);
    const [scheduleData, setScheduleData] = useState(null);
    const [genresData, setGenresData] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState({
        home: true,
        ongoing: false,
        complete: false,
        schedule: false,
        genres: false,
        search: false
    });
    const [pagination, setPagination] = useState({
        ongoing: { current: 1, total: 1 },
        complete: { current: 1, total: 1 }
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAnime, setSelectedAnime] = useState(null);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const { logout } = useAuth();

    useEffect(() => {
        if (activeSection === "home") {
            fetchHome();
        }
    }, [activeSection]);

    const fetchHome = async () => {
        setLoading(prev => ({ ...prev, home: true }));
        try {
            const res = await fetch("/api/anime/");
            const data = await res.json();
            setHomeData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, home: false }));
        }
    };

    const fetchOngoing = async (page = 1) => {
        setLoading(prev => ({ ...prev, ongoing: true }));
        try {
            const res = await fetch(`/api/anime/ongoing?page=${page}`);
            const data = await res.json();
            setOngoingData(data);
            setPagination(prev => ({
                ...prev,
                ongoing: { current: page, total: data.totalPages || 1 }
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, ongoing: false }));
        }
    };

    const fetchComplete = async (page = 1) => {
        setLoading(prev => ({ ...prev, complete: true }));
        try {
            const res = await fetch(`/api/anime/complete?page=${page}`);
            const data = await res.json();
            setCompleteData(data);
            setPagination(prev => ({
                ...prev,
                complete: { current: page, total: data.totalPages || 1 }
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, complete: false }));
        }
    };

    const fetchSchedule = async () => {
        setLoading(prev => ({ ...prev, schedule: true }));
        try {
            const res = await fetch("/api/anime/jadwal");
            const data = await res.json();
            setScheduleData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, schedule: false }));
        }
    };

    const fetchGenres = async () => {
        setLoading(prev => ({ ...prev, genres: true }));
        try {
            const res = await fetch("/api/anime/genres");
            const data = await res.json();
            setGenresData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, genres: false }));
        }
    };

    const handleSearch = async e => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setActiveSection("search");
        setLoading(prev => ({ ...prev, search: true }));
        try {
            const res = await fetch(
                `/api/anime/search?q=${encodeURIComponent(searchQuery)}`
            );
            const data = await res.json();
            setSearchResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, search: false }));
        }
    };

    const handleSectionChange = section => {
        setActiveSection(section);
        if (section === "ongoing" && !ongoingData) {
            fetchOngoing();
        } else if (section === "complete" && !completeData) {
            fetchComplete();
        } else if (section === "schedule" && !scheduleData) {
            fetchSchedule();
        } else if (section === "genres" && !genresData) {
            fetchGenres();
        }
    };

    const handleAnimeClick = anime => {
        setSelectedAnime(anime);
        setModalOpen(true);
        setSelectedEpisode(null);
    };

    const handleEpisodeSelect = async episode => {
        setSelectedEpisode(episode);
        try {
            await fetch("/api/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    animeId: selectedAnime.id || selectedAnime.href,
                    animeTitle: selectedAnime.title,
                    episode: episode.episode || episode.title,
                    poster: selectedAnime.poster
                })
            });
        } catch (error) {
            console.error(error);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedAnime(null);
        setSelectedEpisode(null);
    };

    const renderContent = () => {
        if (activeSection === "home") {
            if (loading.home)
                return (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                );
            return (
                <div id="homeContent">
                    <div className="anime-grid">
                        {homeData?.data?.map((anime, idx) => (
                            <AnimeCard
                                key={idx}
                                anime={anime}
                                onClick={handleAnimeClick}
                            />
                        ))}
                    </div>
                </div>
            );
        }

        if (activeSection === "ongoing") {
            return (
                <>
                    <div className="section-title">
                        <h2>Anime Sedang Tayang</h2>
                    </div>
                    {loading.ongoing && (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    )}
                    {!loading.ongoing && ongoingData && (
                        <>
                            <div className="anime-grid">
                                {ongoingData.data?.map((anime, idx) => (
                                    <AnimeCard
                                        key={idx}
                                        anime={anime}
                                        onClick={handleAnimeClick}
                                    />
                                ))}
                            </div>
                            <div className="pagination">
                                <button
                                    className="page-btn"
                                    disabled={pagination.ongoing.current === 1}
                                    onClick={() =>
                                        fetchOngoing(
                                            pagination.ongoing.current - 1
                                        )
                                    }
                                >
                                    Previous
                                </button>
                                <span className="page-btn active">
                                    {pagination.ongoing.current}
                                </span>
                                <button
                                    className="page-btn"
                                    disabled={
                                        pagination.ongoing.current ===
                                        pagination.ongoing.total
                                    }
                                    onClick={() =>
                                        fetchOngoing(
                                            pagination.ongoing.current + 1
                                        )
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </>
            );
        }

        if (activeSection === "complete") {
            return (
                <>
                    <div className="section-title">
                        <h2>Anime Complete</h2>
                    </div>
                    {loading.complete && (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    )}
                    {!loading.complete && completeData && (
                        <>
                            <div className="anime-grid">
                                {completeData.data?.map((anime, idx) => (
                                    <AnimeCard
                                        key={idx}
                                        anime={anime}
                                        onClick={handleAnimeClick}
                                    />
                                ))}
                            </div>
                            <div className="pagination">
                                <button
                                    className="page-btn"
                                    disabled={pagination.complete.current === 1}
                                    onClick={() =>
                                        fetchComplete(
                                            pagination.complete.current - 1
                                        )
                                    }
                                >
                                    Previous
                                </button>
                                <span className="page-btn active">
                                    {pagination.complete.current}
                                </span>
                                <button
                                    className="page-btn"
                                    disabled={
                                        pagination.complete.current ===
                                        pagination.complete.total
                                    }
                                    onClick={() =>
                                        fetchComplete(
                                            pagination.complete.current + 1
                                        )
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </>
            );
        }

        if (activeSection === "schedule") {
            return (
                <>
                    <div className="section-title">
                        <h2>Jadwal Rilis Anime</h2>
                    </div>
                    {loading.schedule && (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    )}
                    {!loading.schedule && scheduleData && (
                        <div id="scheduleContent">
                            <pre>{JSON.stringify(scheduleData, null, 2)}</pre>
                        </div>
                    )}
                </>
            );
        }

        if (activeSection === "genres") {
            return (
                <>
                    <div className="section-title">
                        <h2>Genre Anime</h2>
                    </div>
                    {loading.genres && (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    )}
                    {!loading.genres && genresData && (
                        <div id="genresContent">
                            <pre>{JSON.stringify(genresData, null, 2)}</pre>
                        </div>
                    )}
                </>
            );
        }

        if (activeSection === "search") {
            return (
                <>
                    <div className="section-title">
                        <h2>Hasil Pencarian: {searchQuery}</h2>
                        <a
                            href="#"
                            className="view-all"
                            onClick={() => setActiveSection("home")}
                        >
                            Kembali ke Beranda
                        </a>
                    </div>
                    {loading.search && (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    )}
                    {!loading.search && searchResults && (
                        <div className="anime-grid">
                            {searchResults.data?.map((anime, idx) => (
                                <AnimeCard
                                    key={idx}
                                    anime={anime}
                                    onClick={handleAnimeClick}
                                />
                            ))}
                        </div>
                    )}
                </>
            );
        }
    };

    return (
        <>
            <header>
                <div className="header-container">
                    <div className="logo">
                        <i className="fas fa-play-circle"></i>
                        <span>Zik</span>Anime
                    </div>

                    <button className="mobile-menu-btn" id="mobileMenuBtn">
                        <i className="fas fa-bars"></i>
                    </button>

                    <nav id="mainNav">
                        <ul>
                            <li>
                                <a
                                    href="#"
                                    className={
                                        activeSection === "home" ? "active" : ""
                                    }
                                    onClick={() => handleSectionChange("home")}
                                >
                                    <i className="fas fa-home"></i> Beranda
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className={
                                        activeSection === "ongoing"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        handleSectionChange("ongoing")
                                    }
                                >
                                    <i className="fas fa-tv"></i> Ongoing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className={
                                        activeSection === "complete"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        handleSectionChange("complete")
                                    }
                                >
                                    <i className="fas fa-check-circle"></i>{" "}
                                    Complete
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className={
                                        activeSection === "schedule"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        handleSectionChange("schedule")
                                    }
                                >
                                    <i className="fas fa-calendar-alt"></i>{" "}
                                    Jadwal
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className={
                                        activeSection === "genres"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        handleSectionChange("genres")
                                    }
                                >
                                    <i className="fas fa-tags"></i> Genre
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className={
                                        activeSection === "hentai"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        handleSectionChange("hentai")
                                    }
                                >
                                    <i className="fas fa-warning"></i> Hentai
                                    Page
                                </a>
                            </li>
                            <li>
                                <a href="/info/" id="infoBtn">
                                    <i className="fas fa-info"></i> Information
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div className="search-container" id="searchContainer">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                className="search-box"
                                id="searchBox"
                                placeholder="Cari anime..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="search-btn"
                                id="searchBtn"
                            >
                                <i className="fas fa-search"></i>
                            </button>
                        </form>
                    </div>

                    <div className="user-menu flex items-center">
                        <span className="text-white mr-2">
                            Halo, {user.username}
                        </span>
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="container">
                <section
                    id="homeSection"
                    style={{
                        display: activeSection === "home" ? "block" : "none"
                    }}
                >
                    {renderContent()}
                </section>
                <section
                    id="ongoingSection"
                    style={{
                        display: activeSection === "ongoing" ? "block" : "none"
                    }}
                >
                    {renderContent()}
                </section>
                <section
                    id="completeSection"
                    style={{
                        display: activeSection === "complete" ? "block" : "none"
                    }}
                >
                    {renderContent()}
                </section>
                <section
                    id="scheduleSection"
                    style={{
                        display: activeSection === "schedule" ? "block" : "none"
                    }}
                >
                    {renderContent()}
                </section>
                <section
                    id="genresSection"
                    style={{
                        display: activeSection === "genres" ? "block" : "none"
                    }}
                >
                    {renderContent()}
                </section>
                <section
                    id="searchResultsSection"
                    style={{
                        display: activeSection === "search" ? "block" : "none"
                    }}
                >
                    {renderContent()}
                </section>
            </main>

            <footer>
                <div className="footer-content">
                    <div className="footer-logo">
                        <span>Zik</span>Anime
                    </div>
                    <p className="footer-description">
                        ZikAnime adalah platform streaming anime gratis dengan
                        kualitas tinggi. Satu Anime Untuk Semua.
                    </p>
                    <p className="copyright">
                        &copy; ZikkAnime All Copyright Reverse.
                    </p>
                </div>
            </footer>

            <VideoModal
                isOpen={modalOpen}
                onClose={closeModal}
                anime={selectedAnime}
                episode={selectedEpisode}
                onEpisodeSelect={handleEpisodeSelect}
            />
        </>
    );
}
