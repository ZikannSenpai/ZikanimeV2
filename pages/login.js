// pages/login.js
import { useState } from "react";
import Router from "next/router";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            console.log("[login.submit] attempting login", username);
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const json = await res.json();
            console.log("[login.submit] response", json);
            if (json.ok) {
                Router.push("/");
            } else {
                alert(json.error || "Login failed");
            }
        } catch (err) {
            console.error("[login.submit] error", err);
            alert("Login error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <div
                style={{ width: 320, margin: "auto" }}
                className="card fade-in"
            >
                <h2>Login</h2>
                <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
                    <input
                        className="input"
                        placeholder="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        className="input"
                        placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    <button className="btn" disabled={loading}>
                        {loading ? "..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
