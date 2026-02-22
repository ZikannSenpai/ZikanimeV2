// pages/login.js
import { useState } from "react";
import Router from "next/router";

export default function Login() {
    const [emailOrUsername, setEU] = useState("");
    const [password, setP] = useState("");
    const [err, setErr] = useState(null);

    async function submit(e) {
        e.preventDefault();
        const r = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ emailOrUsername, password })
        });
        const j = await r.json();
        if (!r.ok) return setErr(j.error || "gagal");
        Router.replace("/");
    }

    return (
        <div style={{ padding: 40 }}>
            <h2>Login</h2>
            <form
                onSubmit={submit}
                style={{ display: "grid", gap: 8, maxWidth: 420 }}
            >
                <input
                    placeholder="Email atau Username"
                    value={emailOrUsername}
                    onChange={e => setEU(e.target.value)}
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => setP(e.target.value)}
                />
                <button className="watch-btn">Login</button>
                {err && <div style={{ color: "#ff6b6b" }}>{err}</div>}
            </form>
        </div>
    );
}
