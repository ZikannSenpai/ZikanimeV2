import { useRouter } from "next/router";
import useSWR from "swr";
import Navbar from "../../components/Navbar";
import VideoPlayer from "../../components/VideoPlayer";

const fetcher = u => fetch(u).then(r => r.json());

export default function AnimeDetail() {
    const router = useRouter();
    const { slug = [] } = router.query;
    const path = Array.isArray(slug) ? slug.join("/") : slug;

    const { data, error } = useSWR(path ? `/api/proxy/${path}` : null, fetcher);

    if (error) console.error("[AnimeDetail] swr error", error);

    const anime = data?.data || data;
    const videoSrc =
        anime?.stream ||
        anime?.video ||
        (anime?.episodes && anime.episodes[0]?.file);

    async function addHistory() {
        try {
            console.log("[AnimeDetail] addHistory", {
                slug: path,
                title: anime?.title
            });
            await fetch("/api/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ animeSlug: path, title: anime?.title })
            });
        } catch (err) {
            console.error("[AnimeDetail] history error", err);
        }
    }

    return (
        <div className="docs-page">
            <Navbar />
            <main className="container">
                <h1>{anime?.title || "Memuat..."}</h1>
                <button className="btn" onClick={addHistory}>
                    Mark as watched
                </button>
                <VideoPlayer src={videoSrc} />
                <pre>{JSON.stringify(anime, null, 2)}</pre>
            </main>
        </div>
    );
}
