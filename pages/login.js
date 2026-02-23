import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user]);

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        const res = await login(email, password);
        if (res.message && !res.user) {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
            <div className="bg-[#12121a] p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    <span className="text-[#0d6efd]">Zik</span>Anime Login
                </h1>
                {error && (
                    <div className="bg-red-500 text-white p-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-[#0a0a0f] text-white border border-gray-700 focus:outline-none focus:border-[#0d6efd]"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-3 rounded bg-[#0a0a0f] text-white border border-gray-700 focus:outline-none focus:border-[#0d6efd]"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#0d6efd] text-white p-3 rounded hover:bg-[#0b5ed7] transition"
                    >
                        Login
                    </button>
                </form>
                <p className="text-gray-400 mt-4 text-center">
                    Belum punya akun?{" "}
                    <Link
                        href="/register"
                        className="text-[#0d6efd] hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
