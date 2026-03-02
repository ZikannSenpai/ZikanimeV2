import NavbarBottom from "../components/NavbarBottom";
import AnimeCard from "../components/AnimeCard";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then(r => r.data);

export default function Explore() {
    const { data } = useSWR("/api/sanka/anime/genre", fetcher);
    const genres = data?.genres || [];

    return (
        <div className="min-h-screen pb-32 px-4">
            <h1 className="text-lg">Explore</h1>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {genres.map((g: any) => (
                    <div key={g} className="card p-3">
                        {g}
                    </div>
                ))}
            </div>
            <NavbarBottom />
        </div>
    );
}
