import { useState } from "react";
import { useRouter } from "next/router";
export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const router = useRouter();
    async function submit(e) {
        e.preventDefault();
        const r = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        if (!r.ok) {
            const j = await r.json();
            alert(j.message || "gagal");
            return;
        }
        alert("created");
        router.push("/login");
    }
    return (
        <main className="container mx-auto p-6">
            <h1 className="text-3xl mb-4">Register</h1>
            <form onSubmit={submit} className="max-w-md">
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="username"
                    className="w-full mb-3 p-3 rounded bg-card-bg"
                />
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email (optional)"
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
                    Register
                </button>
            </form>
        </main>
    );
}
