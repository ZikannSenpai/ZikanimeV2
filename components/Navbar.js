import Link from "next/link";
export default function Navbar({ user, onLogout }) {
    return (
        <header className="bg-secondary sticky top-0 z-50 shadow">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
                <div className="flex items-center gap-3 text-2xl font-bold text-white">
                    <i className="fas fa-play-circle text-accent"></i>
                    <span>Zik</span>Anime
                </div>
                <nav className="hidden md:flex gap-4 items-center">
                    <Link href="/">
                        <a className="text-sm">Beranda</a>
                    </Link>
                    <Link href="/">
                        <a className="text-sm">Ongoing</a>
                    </Link>
                    <Link href="/">
                        <a className="text-sm">Complete</a>
                    </Link>
                    <Link href="/info">
                        <a className="text-sm">Information</a>
                    </Link>
                </nav>
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <span className="text-sm text-gray-300">
                                {user.username}
                            </span>
                            <button
                                onClick={onLogout}
                                className="px-3 py-1 rounded bg-accent text-white"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login">
                            <a className="px-3 py-1 rounded bg-accent text-white">
                                Login
                            </a>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
