"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            router.push("/");
        } else {
            const data = await res.json();
            setError(data.error || "Login gagal");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-darker p-8 rounded-lg border border-primary/30">
            <h1 className="text-2xl font-bold text-primary mb-6 text-center">
                Login
            </h1>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-dark border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-dark border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary py-2 rounded-lg hover:bg-primary/80 transition"
                >
                    Masuk
                </button>
            </form>
            <p className="mt-4 text-center text-gray-400">
                Belum punya akun?{" "}
                <Link href="/register" className="text-primary hover:underline">
                    Daftar
                </Link>
            </p>
        </div>
    );
}
