// pages/register.js
import { useState } from "react";
import Router from "next/router";

export default function Register() {
    const [u, setU] = useState("");
    const [e, setE] = useState("");
    const [p, setP] = useState("");
    const [err, setErr] = useState(null);
    async function sub(ev) {
        ev.preventDefault();
        const r = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ username: u, email: e, password: p })
        });
        const j = await r.json();
        if (!r.ok) return setErr(j.error || "gagal");
        Router.replace("/login");
    }
    return (
        <div style={{ padding: 40 }}>
            <h2>Register</h2>
            <form
                onSubmit={sub}
                style={{ display: "grid", gap: 8, maxWidth: 420 }}
            >
                <input
                    placeholder="Username"
                    value={u}
                    onChange={e => setU(e.target.value)}
                />
                <input
                    placeholder="Email"
                    value={e}
                    onChange={ev => setE(ev.target.value)}
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={p}
                    onChange={ev => setP(ev.target.value)}
                />
                <button className="watch-btn">Register</button>
                {err && <div style={{ color: "#ff6b6b" }}>{err}</div>}
            </form>
        </div>
    );
}
