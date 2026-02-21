import { useEffect, useState } from "react";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [anime, setAnime] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const auth = await fetch("/api/auth/me");
                console.log("auth status:", auth.status);

                if (!auth.ok) {
                    window.location.href = "/login";
                    return;
                }

                const res = await fetch("/api/anime/home");
                console.log("anime status:", res.status);

                const data = await res.json();
                console.log("anime data:", data);

                setAnime(data);
                setLoading(false);
            } catch (err) {
                console.log("error:", err);
            }
        };

        load();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {anime.map(item => (
                <div key={item._id}>
                    <h3>{item.title}</h3>
                </div>
            ))}
        </div>
    );
}
