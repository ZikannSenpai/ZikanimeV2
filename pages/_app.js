import "../styles/globals.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
export default function App({ Component, pageProps }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(d => {
                if (d.user) setUser(d.user);
                else {
                    localStorage.removeItem("token");
                }
            })
            .catch(() => localStorage.removeItem("token"));
    }, []);
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        location.href = "/login";
    };
    return (
        <>
            <Navbar user={user} onLogout={logout} />
            <Component {...pageProps} user={user} setUser={setUser} />
        </>
    );
}
