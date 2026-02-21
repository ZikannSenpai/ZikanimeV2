import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
    const [u, setU] = useState("");
    const [p, setP] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username: u, password: p })
            });
            const data = await res.json();
            if (!res.ok) {
                console.error("login err", data);
                alert("Login gagal: " + (data.error || "unknown"));
                setLoading(false);
                return;
            }
            localStorage.setItem("token", data.token);
            router.push("/");
        } catch (err) {
            console.error("login fetch error", err);
            alert("network error");
        } finally {
            setLoading(false);
        }
    }

    async function goRegister() {
        const username = prompt("username");
        const pass = prompt("password");
        if (!username || !pass) return;
        try {
            const r = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username, password: pass })
            });
            const j = await r.json();
            if (!r.ok) {
                console.error("register err", j);
                alert("reg failed: " + (j.error || ""));
                return;
            }
            alert("registered. now login with credentials");
        } catch (e) {
            console.error("register fetch err", e);
            alert("err");
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(180deg,#05060a,#071025)"
            }}
        >
            <form
                onSubmit={submit}
                style={{
                    width: 420,
                    background: "#071023",
                    padding: 28,
                    borderRadius: 10
                }}
            >
                <h2 style={{ margin: 0, marginBottom: 8 }}>ZikAnime — Login</h2>
                <input
                    placeholder="username"
                    value={u}
                    onChange={e => setU(e.target.value)}
                    style={{
                        width: "100%",
                        padding: 12,
                        marginBottom: 10,
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.04)",
                        background: "#061026",
                        color: "#e6eefc"
                    }}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={p}
                    onChange={e => setP(e.target.value)}
                    style={{
                        width: "100%",
                        padding: 12,
                        marginBottom: 10,
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.04)",
                        background: "#061026",
                        color: "#e6eefc"
                    }}
                />
                <button
                    style={{
                        width: "100%",
                        padding: 12,
                        borderRadius: 8,
                        background: "#0b63ff",
                        color: "#fff",
                        border: "none"
                    }}
                    disabled={loading}
                >
                    {loading ? "..." : "Login"}
                </button>
                <div
                    style={{
                        marginTop: 12,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <small style={{ color: "#9aa4c0" }}>
                        Belum punya akun?
                    </small>
                    <button
                        type="button"
                        onClick={goRegister}
                        style={{
                            background: "transparent",
                            color: "#0b63ff",
                            border: "none"
                        }}
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}
