// components/Nav.js
import Link from "next/link";

export default function Nav({ username }) {
    return (
        <header>
            <div className="header-container">
                <div className="logo">
                    <i className="fas fa-play-circle" /> <span>Zik</span>Anime
                </div>
                <nav id="mainNav">
                    <ul>
                        <li>
                            <Link href="/">
                                <a className="active">Beranda</a>
                            </Link>
                        </li>
                        <li>
                            <a href="#">Ongoing</a>
                        </li>
                        <li>
                            <a href="#">Complete</a>
                        </li>
                        <li>
                            <a href="#">Jadwal</a>
                        </li>
                        <li>
                            <a href="/info">Information</a>
                        </li>
                    </ul>
                </nav>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {username ? (
                        <>
                            <span style={{ color: "#a0a0a0" }}>{username}</span>
                            <form method="POST" action="/api/auth/logout">
                                <button className="watch-btn">Logout</button>
                            </form>
                        </>
                    ) : (
                        <Link href="/login">
                            <a className="watch-btn">Login</a>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
