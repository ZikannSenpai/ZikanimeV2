import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    setSearchQuery: (query: string) => void;
}

export default function Navbar({
    activeSection,
    setActiveSection,
    setSearchQuery
}: NavbarProps) {
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setActiveSection("search");
            setSearchQuery(searchInput);
        }
    };

    return (
        <header>
            <div className="header-container">
                <div className="logo">
                    <i className="fas fa-play-circle"></i>
                    <span>Zik</span>Anime
                </div>
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <i className="fas fa-bars"></i>
                </button>
                <nav className={mobileOpen ? "active" : ""}>
                    <ul>
                        <li>
                            <a
                                href="#"
                                className={
                                    activeSection === "home" ? "active" : ""
                                }
                                onClick={() => setActiveSection("home")}
                            >
                                <i className="fas fa-home"></i> Beranda
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={
                                    activeSection === "ongoing" ? "active" : ""
                                }
                                onClick={() => setActiveSection("ongoing")}
                            >
                                <i className="fas fa-tv"></i> Ongoing
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={
                                    activeSection === "complete" ? "active" : ""
                                }
                                onClick={() => setActiveSection("complete")}
                            >
                                <i className="fas fa-check-circle"></i> Complete
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={
                                    activeSection === "schedule" ? "active" : ""
                                }
                                onClick={() => setActiveSection("schedule")}
                            >
                                <i className="fas fa-calendar-alt"></i> Jadwal
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={
                                    activeSection === "genres" ? "active" : ""
                                }
                                onClick={() => setActiveSection("genres")}
                            >
                                <i className="fas fa-tags"></i> Genre
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={
                                    activeSection === "hentai" ? "active" : ""
                                }
                                onClick={() => setActiveSection("hentai")}
                            >
                                <i className="fas fa-warning"></i> Hentai Page
                            </a>
                        </li>
                        <li>
                            <a
                                href="/info"
                                className={
                                    activeSection === "info" ? "active" : ""
                                }
                            >
                                <i className="fas fa-info"></i> Information
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="search-container">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="search-box"
                            placeholder="Cari anime..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                        <button type="submit" className="search-btn">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                </div>
                <div className="user-menu">
                    <span>{user?.username}</span>
                    <button onClick={logout}>
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </header>
    );
}
