import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0a0a0f",
                color: "#e0e0e0"
            }}
        >
            <div
                style={{
                    background: "#12121a",
                    padding: "2rem",
                    borderRadius: "8px",
                    width: "100%",
                    maxWidth: "400px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 700 }}>
                        <i
                            className="fas fa-play-circle"
                            style={{ color: "#0d6efd" }}
                        ></i>{" "}
                        <span style={{ color: "#0d6efd" }}>Zik</span>Anime
                    </div>
                    <h2 style={{ marginTop: "1rem" }}>Login to Continue</h2>
                </div>
                {error && (
                    <div
                        style={{
                            background: "rgba(255,0,0,0.1)",
                            color: "#ff6b6b",
                            padding: "0.75rem",
                            borderRadius: "4px",
                            marginBottom: "1rem"
                        }}
                    >
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label
                            htmlFor="username"
                            style={{ display: "block", marginBottom: "0.5rem" }}
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                background: "#0a0a0f",
                                border: "1px solid #333",
                                borderRadius: "4px",
                                color: "#e0e0e0"
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label
                            htmlFor="password"
                            style={{ display: "block", marginBottom: "0.5rem" }}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                background: "#0a0a0f",
                                border: "1px solid #333",
                                borderRadius: "4px",
                                color: "#e0e0e0"
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            background: "#0d6efd",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "1rem",
                            cursor: "pointer"
                        }}
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>
                <p style={{ marginTop: "1rem", textAlign: "center" }}>
                    Don't have an account?{" "}
                    <Link href="/register" style={{ color: "#0d6efd" }}>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
