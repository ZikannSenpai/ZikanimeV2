import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AnimeDetail() {
    const router = useRouter();
    const { id } = router.query;

    const [loading, setLoading] = useState(true);
    const [anime, setAnime] = useState(null);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            try {
                const res = await fetch(`/api/anime/${id}`);
                const data = await res.json();

                setAnime(data.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        };

        load();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!anime) return <div>Anime not found</div>;

    return (
        <div className="container">
            <h1>{anime.title}</h1>
            <img src={anime.poster} alt={anime.title} />
            <p>{anime.description}</p>
        </div>
    );
}
