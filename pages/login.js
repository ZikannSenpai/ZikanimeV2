import { useState } from "react";
import { useRouter } from "next/router";
export default function Login({ user, setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const router = useRouter();
    if (typeof window !== "undefined" && localStorage.getItem("token"))
        router.replace("/");
    async function submit(e) {
        e.preventDefault();
        setErr("");
        const r = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const j = await r.json();
        if (!r.ok) {
            setErr(j.message || "Login gagal");
            return;
        }
        localStorage.setItem("token", j.token);
        setUser && setUser(j.user);
        router.push("/");
    }
    return (
        <main className="container mx-auto p-6">
            <h1 className="text-3xl mb-4">Login</h1>
            <form onSubmit={submit} className="max-w-md">
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="username"
                    className="w-full mb-3 p-3 rounded bg-card-bg"
                />
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    placeholder="password"
                    className="w-full mb-3 p-3 rounded bg-card-bg"
                />
                <button className="px-4 py-2 bg-accent rounded text-white">
                    Login
                </button>
                {err && <p className="text-red-400 mt-3">{err}</p>}
            </form>
        </main>
    );
}
