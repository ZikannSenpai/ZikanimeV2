import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    async function login() {
        console.log("[LOGIN] start");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pass
        });

        if (error) {
            console.error("[LOGIN] error:", error);
            alert(error.message);
        } else {
            console.log("[LOGIN] success");
            location.href = "/";
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-[#0b0f17]">
            <div className="bg-black p-6 rounded w-80 fade-in">
                <input
                    className="input-animated w-full p-2 mb-3 bg-gray-900 text-white"
                    placeholder="Email"
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="input-animated w-full p-2 mb-3 bg-gray-900 text-white"
                    placeholder="Password"
                    onChange={e => setPass(e.target.value)}
                />
                <button
                    onClick={login}
                    className="w-full bg-blue-500 p-2 rounded"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
