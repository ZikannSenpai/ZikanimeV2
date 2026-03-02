import Link from "next/link";
import { useRouter } from "next/router";

export default function NavbarBottom() {
    const r = useRouter();
    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-zikaBlack/60 p-2 rounded-xl flex gap-4 shadow-lg">
            <Link href="/" className="px-4 py-2">
                Beranda
            </Link>
            <Link href="/explore" className="px-4 py-2">
                Explore
            </Link>
            <Link href="/event" className="px-4 py-2">
                Event
            </Link>
            <Link href="/profile" className="px-4 py-2">
                Profil
            </Link>
        </nav>
    );
}
