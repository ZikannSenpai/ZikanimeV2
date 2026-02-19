import { useState } from "react";
import Router from "next/router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [mode, setMode] = useState("login");

    async function submit(e) {
        e.preventDefault();
        try {
            const url =
                mode === "login" ? "/api/auth/login" : "/api/auth/register";
            console.log("[login] submit to", url, { email, name });
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name })
            });
            console.log("[login] response", res.status);
            const j = await res.json();
            console.log("[login] json", j);
            if (res.ok) Router.push("/");
            else alert(j.error || "Login failed");
        } catch (err) {
            console.error("[login] error", err);
        }
    }

    return (
        <div className="landing-page login-page">
            <form className="auth-box" onSubmit={submit}>
                <h2>{mode === "login" ? "Login" : "Register"}</h2>

                {mode === "register" && (
                    <input
                        className="input-field"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Name"
                    />
                )}

                <input
                    className="input-field"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    className="input-field"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                />

                <button className="btn" type="submit">
                    {mode === "login" ? "Login" : "Register"}
                </button>
                <div style={{ marginTop: 12 }}>
                    <button
                        type="button"
                        className="link"
                        onClick={() =>
                            setMode(mode === "login" ? "register" : "login")
                        }
                    >
                        {mode === "login"
                            ? "Create an account"
                            : "Have account? Login"}
                    </button>
                </div>
            </form>
        </div>
    );
}
