// pages/login.js
import { useState } from "react";
import axios from "axios";
import Router from "next/router";

export default function Login() {
    const [email, setEmail] = useState(""),
        [pw, setPw] = useState(""),
        [name, setName] = useState("");
    const [mode, setMode] = useState("login"); // or register
    async function submit(e) {
        e.preventDefault();
        try {
            const route =
                mode === "login" ? "/api/auth/login" : "/api/auth/register";
            console.log("[client] submitting to", route, email);
            const r = await axios.post(route, { email, password: pw, name });
            console.log("[client] auth ok", r.data);
            // store token in localStorage (simple). For prod: use httpOnly cookie.
            localStorage.setItem("token", r.data.token);
            Router.push("/");
        } catch (err) {
            console.error(
                "[client] auth err",
                err?.response?.data || err.message
            );
            alert(
                "Auth failed: " + (err?.response?.data?.error || err.message)
            );
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <form onSubmit={submit} className="card w-full max-w-md fade-in">
                <h1
                    className="text-2xl font-semibold mb-4"
                    style={{ color: "var(--accent)" }}
                >
                    Zikanime — {mode}
                </h1>
                {mode === "register" && (
                    <input
                        className="w-full mb-3 p-2 input-focus"
                        placeholder="Nama"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                )}
                <input
                    className="w-full mb-3 p-2 input-focus"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    className="w-full mb-3 p-2 input-focus"
                    placeholder="Password"
                    type="password"
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                />
                <button
                    className="w-full p-2 mt-2 card zoom-hover"
                    style={{ background: "var(--accent)", color: "#001" }}
                >
                    {mode === "login" ? "Login" : "Register"}
                </button>
                <div className="mt-3 text-xs text--muted">
                    <button
                        type="button"
                        className="text-sm underline"
                        onClick={() =>
                            setMode(mode === "login" ? "register" : "login")
                        }
                    >
                        {mode === "login"
                            ? "Buat akun baru"
                            : "Punya akun? Login"}
                    </button>
                </div>
            </form>
        </div>
    );
}
