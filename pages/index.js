import { useEffect, useState } from "react";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [anime, setAnime] = useState([]);

    useEffect(() => {
        const load = async () => {
            const auth = await fetch("/api/auth/me");
            if (!auth.ok) {
                window.location.href = "/login";
                return;
            }

            const res = await fetch("/api/anime/home");
            const data = await res.json();
            setAnime(data);
            setLoading(false);
        };

        load();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="grid">
            {anime.map(item => (
                <div key={item._id} className="card">
                    <img src={item.image} width="150" />
                    <h3>{item.title}</h3>
                </div>
            ))}
        </div>
    );
}
