// pages/register.js
import Head from "next/head";
import { useState } from "react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async e => {
        e.preventDefault();

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        if (res.ok) {
            alert("Register berhasil, silakan login");
            window.location.href = "/login";
        } else {
            alert("Register gagal");
        }
    };

    return (
        <>
            <Head>
                <title>Register | Zikanime</title>
            </Head>

            <div style={wrapper}>
                <form onSubmit={handleRegister} style={card}>
                    <h2>Register</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={input}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={input}
                    />
                    <button type="submit" style={button}>
                        Daftar
                    </button>
                    <p>
                        Sudah punya akun? <a href="/login">Login</a>
                    </p>
                </form>
            </div>
        </>
    );
}

const wrapper = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0a0a0f",
    color: "white"
};

const card = {
    background: "#171722",
    padding: "2rem",
    borderRadius: "8px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
};

const input = {
    padding: "0.6rem",
    borderRadius: "4px",
    border: "1px solid #333",
    background: "#12121a",
    color: "white"
};

const button = {
    padding: "0.6rem",
    border: "none",
    borderRadius: "4px",
    background: "#0d6efd",
    color: "white",
    cursor: "pointer"
};
