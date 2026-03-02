import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";

export default function Login() {
    const r = useRouter();
    const [u, setU] = useState("");
    const [p, setP] = useState("");
    async function submit(e: any) {
        e.preventDefault();
        try {
            const res = await axios.post("/api/auth", {
                username: u,
                password: p
            });
            // set cookie token
            r.push("/");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={submit} className="card p-6 w-full max-w-md">
                <h2 className="text-lg mb-4">Login</h2>
                <input
                    className="w-full mb-3 p-2 rounded"
                    placeholder="username"
                    value={u}
                    onChange={e => setU(e.target.value)}
                />
                <input
                    className="w-full mb-3 p-2 rounded"
                    placeholder="password"
                    type="password"
                    value={p}
                    onChange={e => setP(e.target.value)}
                />
                <button className="w-full p-2 card">Masuk</button>
            </form>
        </div>
    );
}
