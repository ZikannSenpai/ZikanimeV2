"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string } | null>(null);

    useEffect(() => {
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(data => setUser(data.user || null))
            .catch(() => setUser(null));
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/login");
    };

    return (
        <nav className="bg-darker border-b border-primary/30 px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
                Zikanime
            </Link>
            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        <span className="text-gray-300">
                            Halo, {user.username}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-primary px-4 py-2 rounded-lg hover:bg-primary/80 transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="hover:text-primary">
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="bg-primary px-4 py-2 rounded-lg hover:bg-primary/80 transition"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
