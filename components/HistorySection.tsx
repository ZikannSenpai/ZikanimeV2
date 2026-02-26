"use client";

import { useEffect, useState } from "react";
import AnimeCard from "./AnimeCard";

interface HistoryItem {
    animeId: string;
    animeTitle: string;
    episode: number;
    image: string;
}

export default function HistorySection() {
    const [histories, setHistories] = useState<HistoryItem[]>([]);

    useEffect(() => {
        fetch("/api/history")
            .then(res => res.json())
            .then(data => setHistories(data.histories || []))
            .catch(console.error);
    }, []);

    if (histories.length === 0) return null;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-3">Terakhir Ditonton</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {histories.map(item => (
                    <AnimeCard
                        key={`${item.animeId}-${item.episode}`}
                        id={item.animeId}
                        title={item.animeTitle}
                        image={item.image}
                        episode={item.episode}
                    />
                ))}
            </div>
        </div>
    );
}
