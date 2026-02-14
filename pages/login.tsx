import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Head from "next/head";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function signUp() {
        setLoading(true);
        console.log("[auth] signUp start", email);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });
            console.log("[auth] signUp result", { data, error });
            if (error) throw error;
            alert("Check your email for confirmation link (if required).");
        } catch (err) {
            console.error("[auth] signUp error", err);
            alert("Error: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    }

    async function signIn() {
        setLoading(true);
        console.log("[auth] signIn start", email);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            console.log("[auth] signIn result", { data, error });
            if (error) throw error;
            window.location.href = "/profile";
        } catch (err) {
            console.error("[auth] signIn error", err);
            alert("Error: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <Head>
                <title>Login - Zikanime</title>
            </Head>
            <h1 style={{ color: "var(--accent)" }}>Login</h1>
            <div style={{ maxWidth: 420 }}>
                <input
                    className="pixel-input"
                    placeholder="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    className="pixel-input"
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={signIn} disabled={loading}>
                        Sign in
                    </button>
                    <button onClick={signUp} disabled={loading}>
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}
