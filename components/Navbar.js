import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link href="/">
                    <a className="logo">Zikanime</a>
                </Link>
            </div>
            <div className="nav-right">
                <Link href="/login">
                    <a>Login</a>
                </Link>
                <Link href="/profile">
                    <a>Profile</a>
                </Link>
            </div>
        </nav>
    );
}
